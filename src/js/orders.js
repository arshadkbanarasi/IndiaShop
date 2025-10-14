// Order management
let orders = JSON.parse(localStorage.getItem('indiaShopOrders')) || [];

// Place order
async function placeOrder(orderData) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please login to place order', 'error');
        return false;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return false;
    }
    
    try {
        const cartSummary = getCartSummary();
        
        // Generate order ID
        const orderId = 'IND' + Date.now().toString().slice(-8);
        
        // Create order object
        const order = {
            id: orderId,
            userId: currentUser.id,
            customerInfo: {
                name: orderData.customerName,
                email: orderData.customerEmail,
                phone: orderData.customerPhone
            },
            items: cartSummary.items.map(item => ({
                productId: item.productId,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                total: item.itemTotal
            })),
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            paymentDetails: orderData.paymentDetails || {},
            pricing: {
                subtotal: cartSummary.subtotal,
                deliveryCharge: cartSummary.deliveryCharge,
                gst: cartSummary.gst,
                total: cartSummary.total
            },
            status: orderData.paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
            createdAt: new Date().toISOString(),
            estimatedDelivery: getEstimatedDelivery()
        };
        
        // If not COD, process payment first
        if (orderData.paymentMethod !== 'cod') {
            const paymentSuccess = await processPayment(order);
            if (!paymentSuccess) {
                return false;
            }
            order.status = 'confirmed';
            order.paymentStatus = 'paid';
            order.paidAt = new Date().toISOString();
        } else {
            order.paymentStatus = 'pending';
        }
        
        // Save order
        orders.push(order);
        localStorage.setItem('indiaShopOrders', JSON.stringify(orders));
        
        // Update product stock (in real app, this would be handled by backend)
        updateProductStock(order.items);
        
        // Clear cart
        clearCart();
        
        // Generate and download receipt
        generatePDFReceipt(order);
        
        showToast('Order placed successfully!', 'success');
        
        // Close checkout modal
        document.getElementById('checkoutModal').classList.remove('active');
        
        // Show order confirmation
        showOrderConfirmation(order);
        
        return true;
        
    } catch (error) {
        console.error('Order placement error:', error);
        showToast('Failed to place order. Please try again.', 'error');
        return false;
    }
}

// Process payment
async function processPayment(order) {
    return new Promise((resolve) => {
        // Close checkout modal and show payment modal
        document.getElementById('checkoutModal').classList.remove('active');
        showPaymentGateway(order, resolve);
    });
}

// Show payment gateway
function showPaymentGateway(order, callback) {
    const modal = document.getElementById('paymentModal');
    const orderIdSpan = document.getElementById('paymentOrderId');
    const amountSpan = document.getElementById('paymentAmount');
    const paymentFormDiv = document.getElementById('paymentForm');
    
    orderIdSpan.textContent = order.id;
    amountSpan.textContent = order.pricing.total.toLocaleString('en-IN');
    
    // Generate payment form based on method
    let formHTML = '';
    switch (order.paymentMethod) {
        case 'upi':
            formHTML = `
                <div class="payment-form">
                    <h3>UPI Payment</h3>
                    <p>Pay using your UPI ID: <strong>${order.paymentDetails.upiId}</strong></p>
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block;">
                            <i class="fas fa-qrcode" style="font-size: 3rem; color: #666;"></i><br>
                            <small>Scan QR Code with any UPI app</small>
                        </div>
                    </div>
                    <p style="text-align: center; color: #666; font-size: 0.9rem;">
                        Or pay using UPI apps like PhonePe, Google Pay, Paytm, etc.
                    </p>
                </div>
            `;
            break;
            
        case 'card':
            formHTML = `
                <div class="payment-form">
                    <h3>Card Payment</h3>
                    <p>Card ending with ****${order.paymentDetails.cardNumber.slice(-4)}</p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                        <p><i class="fas fa-shield-alt" style="color: #28a745;"></i> Your payment is secured with 256-bit SSL encryption</p>
                    </div>
                    <div style="text-align: center;">
                        <div class="spinner"></div>
                        <p>Redirecting to bank's secure payment page...</p>
                    </div>
                </div>
            `;
            break;
            
        case 'netbanking':
            formHTML = `
                <div class="payment-form">
                    <h3>Net Banking</h3>
                    <p>Bank: <strong>${getBankName(order.paymentDetails.bankName)}</strong></p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                        <p><i class="fas fa-university" style="color: #007bff;"></i> You will be redirected to your bank's website</p>
                    </div>
                    <div style="text-align: center;">
                        <div class="spinner"></div>
                        <p>Connecting to ${getBankName(order.paymentDetails.bankName)}...</p>
                    </div>
                </div>
            `;
            break;
    }
    
    paymentFormDiv.innerHTML = formHTML;
    modal.classList.add('active');
    
    // Handle payment actions
    document.getElementById('payNowBtn').onclick = () => simulatePayment(callback);
    document.getElementById('cancelPaymentBtn').onclick = () => {
        modal.classList.remove('active');
        callback(false);
    };
}

// Simulate payment processing
function simulatePayment(callback) {
    const payNowBtn = document.getElementById('payNowBtn');
    const originalText = payNowBtn.innerHTML;
    
    payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payNowBtn.disabled = true;
    
    // Simulate payment processing time
    setTimeout(() => {
        // 90% success rate for demo
        const success = Math.random() > 0.1;
        
        document.getElementById('paymentModal').classList.remove('active');
        
        if (success) {
            showToast('Payment successful!', 'success');
        } else {
            showToast('Payment failed! Please try again.', 'error');
        }
        
        payNowBtn.innerHTML = originalText;
        payNowBtn.disabled = false;
        
        callback(success);
    }, 3000);
}

// Get bank name
function getBankName(bankCode) {
    const banks = {
        'sbi': 'State Bank of India',
        'hdfc': 'HDFC Bank',
        'icici': 'ICICI Bank',
        'axis': 'Axis Bank',
        'pnb': 'Punjab National Bank',
        'bob': 'Bank of Baroda',
        'canara': 'Canara Bank'
    };
    return banks[bankCode] || 'Selected Bank';
}

// Update product stock
function updateProductStock(orderItems) {
    // In a real application, this would be handled by the backend
    // For demo purposes, we'll update the local product data
    orderItems.forEach(item => {
        const product = INDIAN_PRODUCTS.find(p => p.id === item.productId);
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
        }
    });
}

// Get estimated delivery date
function getEstimatedDelivery() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3); // 3-7 days
    return deliveryDate.toISOString();
}

// Show order confirmation
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745; margin-bottom: 20px;"></i>
                <h2>Order Confirmed!</h2>
                <p>Your order <strong>#${order.id}</strong> has been placed successfully.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <h4>Order Details:</h4>
                    <p><strong>Total Amount:</strong> ₹${order.pricing.total.toLocaleString('en-IN')}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                    <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>
                </div>
                
                <div style="margin-top: 30px;">
                    <button class="btn primary" onclick="this.closest('.modal').remove(); showView('orders')">
                        View Orders
                    </button>
                    <button class="btn secondary" onclick="this.closest('.modal').remove(); showView('products')" style="margin-left: 10px;">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
}

// Display orders
function displayOrders() {
    const ordersContainer = document.getElementById('ordersList');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        ordersContainer.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-user-lock" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Please login to view orders</h3>
                <button class="btn primary" onclick="showView('auth')">Login</button>
            </div>
        `;
        return;
    }
    
    const userOrders = orders.filter(order => order.userId === currentUser.id)
                           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <button class="btn primary" onclick="showView('products')">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <small style="color: #666;">Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN')}</small>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div>
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px; float: left;">
                            <div>
                                <strong>${item.name}</strong><br>
                                <small>Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</small>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <strong>₹${item.total.toLocaleString('en-IN')}</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; margin-top: 15px; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Payment: ${order.paymentMethod.toUpperCase()}</strong><br>
                        <small>Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</small>
                    </div>
                    <div class="order-total">₹${order.pricing.total.toLocaleString('en-IN')}</div>
                </div>
            </div>
            
            <div style="margin-top: 15px; text-align: right;">
                <button class="btn secondary small" onclick="downloadOrderReceipt('${order.id}')">
                    <i class="fas fa-download"></i> Download Receipt
                </button>
                <button class="btn primary small" onclick="trackOrder('${order.id}')" style="margin-left: 10px;">
                    <i class="fas fa-truck"></i> Track Order
                </button>
            </div>
        </div>
    `).join('');
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending_payment': 'Pending Payment',
        'confirmed': 'Confirmed',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

// Track order
function trackOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Track Order #${orderId}</h2>
            
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <strong>Order Total:</strong> ₹${order.pricing.total.toLocaleString('en-IN')}
                    </div>
                    <div>
                        <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h4>Tracking Information</h4>
                    <div style="margin: 15px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-check-circle" style="color: #28a745; margin-right: 10px;"></i>
                            <span>Order Confirmed - ${new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-box" style="color: ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? '#28a745' : '#ccc'}; margin-right: 10px;"></i>
                            <span>Processing</span>
                        </div>
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-truck" style="color: ${order.status === 'shipped' || order.status === 'delivered' ? '#28a745' : '#ccc'}; margin-right: 10px;"></i>
                            <span>Shipped</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <i class="fas fa-home" style="color: ${order.status === 'delivered' ? '#28a745' : '#ccc'}; margin-right: 10px;"></i>
                            <span>Delivered (Expected: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')})</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>Shipping Address:</h4>
                    <p>${order.shippingAddress}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Download order receipt
function downloadOrderReceipt(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        generatePDFReceipt(order);
    }
}

// Setup order form handler
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderData = {
                customerName: document.getElementById('customerName').value,
                customerEmail: document.getElementById('customerEmail').value,
                customerPhone: document.getElementById('customerPhone').value,
                shippingAddress: document.getElementById('shippingAddress').value,
                paymentMethod: document.getElementById('paymentMethod').value
            };
            
            // Collect payment details based on method
            if (orderData.paymentMethod === 'upi') {
                orderData.paymentDetails = {
                    upiId: document.getElementById('upiId').value
                };
            } else if (orderData.paymentMethod === 'card') {
                orderData.paymentDetails = {
                    cardNumber: document.getElementById('cardNumber').value,
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    cardholderName: document.getElementById('cardholderName').value
                };
            } else if (orderData.paymentMethod === 'netbanking') {
                orderData.paymentDetails = {
                    bankName: document.getElementById('bankName').value
                };
            }
            
            await placeOrder(orderData);
        });
    }
});