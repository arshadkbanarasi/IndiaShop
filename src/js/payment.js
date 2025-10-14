// Payment gateway simulation for Indian market

// Indian payment methods
const PAYMENT_METHODS = {
    upi: {
        name: 'UPI Payment',
        icon: 'fas fa-mobile-alt',
        description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
        processingTime: 2000,
        successRate: 0.95
    },
    card: {
        name: 'Credit/Debit Card',
        icon: 'fas fa-credit-card',
        description: 'Visa, MasterCard, RuPay cards accepted',
        processingTime: 3000,
        successRate: 0.92
    },
    netbanking: {
        name: 'Net Banking',
        icon: 'fas fa-university',
        description: 'Pay directly from your bank account',
        processingTime: 4000,
        successRate: 0.90
    },
    cod: {
        name: 'Cash on Delivery',
        icon: 'fas fa-money-bill-wave',
        description: 'Pay when your order is delivered',
        processingTime: 0,
        successRate: 1.0
    }
};

// Popular Indian banks
const INDIAN_BANKS = {
    sbi: 'State Bank of India',
    hdfc: 'HDFC Bank',
    icici: 'ICICI Bank',
    axis: 'Axis Bank',
    pnb: 'Punjab National Bank',
    bob: 'Bank of Baroda',
    canara: 'Canara Bank',
    union: 'Union Bank of India',
    boi: 'Bank of India',
    indian: 'Indian Bank'
};

// Payment gateway configuration
const PAYMENT_GATEWAY = {
    name: 'IndiaShop Payments',
    merchantId: 'INDIASHOP001',
    apiVersion: '2.0',
    environment: 'sandbox' // sandbox or production
};

// Initialize payment gateway
function initializePaymentGateway() {
    console.log('Payment Gateway initialized:', PAYMENT_GATEWAY.name);
    setupPaymentMethods();
}

// Setup payment method selection
function setupPaymentMethods() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    
    if (paymentMethodSelect) {
        // Add Indian-specific payment methods
        paymentMethodSelect.innerHTML = `
            <option value="">Select Payment Method</option>
            <option value="upi">🔄 UPI Payment (PhonePe, GPay, Paytm)</option>
            <option value="card">💳 Credit/Debit Card</option>
            <option value="netbanking">🏦 Net Banking</option>
            <option value="cod">💰 Cash on Delivery</option>
        `;
    }
}

// Process UPI payment
async function processUPIPayment(paymentData) {
    return new Promise((resolve) => {
        const modal = createPaymentModal('UPI Payment', paymentData);
        
        modal.innerHTML += `
            <div class="payment-method-content">
                <div class="upi-payment">
                    <h3>Pay using UPI</h3>
                    <div class="upi-id">
                        <strong>UPI ID:</strong> ${paymentData.upiId}
                    </div>
                    
                    <div class="qr-code-section">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <p>Scan QR Code</p>
                        </div>
                        <p>Scan with any UPI app</p>
                    </div>
                    
                    <div class="upi-apps">
                        <h4>Popular UPI Apps:</h4>
                        <div class="app-icons">
                            <div class="app-icon">📱 PhonePe</div>
                            <div class="app-icon">💰 Google Pay</div>
                            <div class="app-icon">💳 Paytm</div>
                            <div class="app-icon">🏦 BHIM</div>
                        </div>
                    </div>
                    
                    <div class="payment-timer">
                        <p>Please complete payment within <span id="timer">5:00</span></p>
                    </div>
                </div>
            </div>
        `;
        
        startPaymentTimer(300); // 5 minutes
        
        // Simulate UPI payment verification
        setTimeout(() => {
            const success = Math.random() > (1 - PAYMENT_METHODS.upi.successRate);
            modal.remove();
            resolve(success);
        }, PAYMENT_METHODS.upi.processingTime);
    });
}

// Process card payment
async function processCardPayment(paymentData) {
    return new Promise((resolve) => {
        const modal = createPaymentModal('Card Payment', paymentData);
        
        modal.innerHTML += `
            <div class="payment-method-content">
                <div class="card-payment">
                    <h3>Card Payment</h3>
                    <div class="card-details">
                        <div class="card-number">
                            <i class="fas fa-credit-card"></i>
                            <span>**** **** **** ${paymentData.cardNumber.slice(-4)}</span>
                        </div>
                        <div class="card-holder">${paymentData.cardholderName}</div>
                    </div>
                    
                    <div class="security-info">
                        <i class="fas fa-shield-alt"></i>
                        <p>Your payment is secured with 256-bit SSL encryption</p>
                    </div>
                    
                    <div class="bank-redirect">
                        <div class="spinner"></div>
                        <p>Redirecting to your bank's secure payment page...</p>
                        <small>You will be redirected back after payment completion</small>
                    </div>
                </div>
            </div>
        `;
        
        // Simulate bank page redirect and payment
        setTimeout(() => {
            const success = Math.random() > (1 - PAYMENT_METHODS.card.successRate);
            modal.remove();
            resolve(success);
        }, PAYMENT_METHODS.card.processingTime);
    });
}

// Process net banking payment
async function processNetBankingPayment(paymentData) {
    return new Promise((resolve) => {
        const modal = createPaymentModal('Net Banking', paymentData);
        const bankName = INDIAN_BANKS[paymentData.bankName] || 'Selected Bank';
        
        modal.innerHTML += `
            <div class="payment-method-content">
                <div class="netbanking-payment">
                    <h3>Net Banking Payment</h3>
                    <div class="bank-info">
                        <i class="fas fa-university"></i>
                        <div>
                            <strong>${bankName}</strong>
                            <p>You will be redirected to your bank's website</p>
                        </div>
                    </div>
                    
                    <div class="bank-redirect">
                        <div class="spinner"></div>
                        <p>Connecting to ${bankName}...</p>
                        <small>Please have your net banking credentials ready</small>
                    </div>
                    
                    <div class="security-notice">
                        <i class="fas fa-info-circle"></i>
                        <p>Never share your banking credentials with anyone</p>
                    </div>
                </div>
            </div>
        `;
        
        // Simulate bank website redirect and payment
        setTimeout(() => {
            const success = Math.random() > (1 - PAYMENT_METHODS.netbanking.successRate);
            modal.remove();
            resolve(success);
        }, PAYMENT_METHODS.netbanking.processingTime);
    });
}

// Create payment modal
function createPaymentModal(title, paymentData) {
    const modal = document.createElement('div');
    modal.className = 'modal active payment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="payment-header">
                <h2>${title}</h2>
                <div class="payment-amount">
                    <strong>Amount: ₹${paymentData.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div class="order-id">Order ID: ${paymentData.orderId}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Start payment timer
function startPaymentTimer(seconds) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    const interval = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        if (seconds <= 0) {
            clearInterval(interval);
            timerElement.textContent = 'Expired';
        }
        
        seconds--;
    }, 1000);
}

// Validate payment data
function validatePaymentData(method, data) {
    switch (method) {
        case 'upi':
            return validateUPIData(data);
        case 'card':
            return validateCardData(data);
        case 'netbanking':
            return validateNetBankingData(data);
        case 'cod':
            return { valid: true };
        default:
            return { valid: false, message: 'Invalid payment method' };
    }
}

// Validate UPI data
function validateUPIData(data) {
    if (!data.upiId) {
        return { valid: false, message: 'UPI ID is required' };
    }
    
    // Basic UPI ID validation
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
    if (!upiRegex.test(data.upiId)) {
        return { valid: false, message: 'Invalid UPI ID format' };
    }
    
    return { valid: true };
}

// Validate card data
function validateCardData(data) {
    if (!data.cardNumber || !data.expiryDate || !data.cvv || !data.cardholderName) {
        return { valid: false, message: 'All card details are required' };
    }
    
    // Basic card number validation (remove spaces and check length)
    const cardNumber = data.cardNumber.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        return { valid: false, message: 'Invalid card number' };
    }
    
    // Expiry date validation
    const [month, year] = data.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
        return { valid: false, message: 'Invalid expiry month' };
    }
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        return { valid: false, message: 'Card has expired' };
    }
    
    // CVV validation
    if (data.cvv.length < 3 || data.cvv.length > 4) {
        return { valid: false, message: 'Invalid CVV' };
    }
    
    return { valid: true };
}

// Validate net banking data
function validateNetBankingData(data) {
    if (!data.bankName) {
        return { valid: false, message: 'Please select a bank' };
    }
    
    return { valid: true };
}

// Generate transaction reference
function generateTransactionRef() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `TXN${timestamp.slice(-8)}${random}`;
}

// Log payment attempt
function logPaymentAttempt(method, orderId, amount, success) {
    const log = {
        timestamp: new Date().toISOString(),
        method: method,
        orderId: orderId,
        amount: amount,
        success: success,
        transactionRef: generateTransactionRef(),
        gateway: PAYMENT_GATEWAY.name
    };
    
    console.log('Payment Log:', log);
    
    // In a real application, this would be sent to analytics
    const paymentLogs = JSON.parse(localStorage.getItem('paymentLogs') || '[]');
    paymentLogs.push(log);
    localStorage.setItem('paymentLogs', JSON.stringify(paymentLogs));
}

// Handle payment success
function handlePaymentSuccess(transactionData) {
    showToast('Payment successful! 🎉', 'success');
    
    // Log successful payment
    logPaymentAttempt(
        transactionData.method,
        transactionData.orderId,
        transactionData.amount,
        true
    );
    
    // In a real app, send confirmation to backend
    console.log('Payment Success:', transactionData);
}

// Handle payment failure
function handlePaymentFailure(transactionData, reason) {
    showToast(`Payment failed: ${reason}`, 'error');
    
    // Log failed payment
    logPaymentAttempt(
        transactionData.method,
        transactionData.orderId,
        transactionData.amount,
        false
    );
    
    console.log('Payment Failure:', transactionData, reason);
}

// Get payment statistics (for demo)
function getPaymentStats() {
    const logs = JSON.parse(localStorage.getItem('paymentLogs') || '[]');
    
    const stats = {
        total: logs.length,
        successful: logs.filter(log => log.success).length,
        failed: logs.filter(log => !log.success).length,
        byMethod: {}
    };
    
    Object.keys(PAYMENT_METHODS).forEach(method => {
        const methodLogs = logs.filter(log => log.method === method);
        stats.byMethod[method] = {
            total: methodLogs.length,
            successful: methodLogs.filter(log => log.success).length,
            successRate: methodLogs.length > 0 ? 
                (methodLogs.filter(log => log.success).length / methodLogs.length * 100).toFixed(1) + '%' : '0%'
        };
    });
    
    return stats;
}

// Initialize payment gateway when page loads
document.addEventListener('DOMContentLoaded', initializePaymentGateway);