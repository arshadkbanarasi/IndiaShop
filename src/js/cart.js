// Cart management
let cart = JSON.parse(localStorage.getItem('indiaShopCart')) || [];

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please login to add items to cart', 'warning');
        showView('auth');
        return;
    }
    
    // Check stock
    if (product.stock === 0) {
        showToast('Product is out of stock!', 'error');
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            showToast(`Only ${product.stock} items available in stock!`, 'warning');
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        if (quantity > product.stock) {
            showToast(`Only ${product.stock} items available in stock!`, 'warning');
            return;
        }
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartCount();
    displayCart();
    showToast('Item removed from cart', 'success');
}

// Update item quantity in cart
function updateCartQuantity(productId, newQuantity) {
    const product = getProductById(productId);
    if (!product) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showToast(`Only ${product.stock} items available in stock!`, 'warning');
        return;
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        displayCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('indiaShopCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('indiaShopCart')) || [];
    updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummaryContainer = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button class="btn primary" onclick="showView('products')">Continue Shopping</button>
            </div>
        `;
        cartSummaryContainer.innerHTML = '';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${product.name}</h4>
                    <p class="cart-item-price">₹${product.price.toLocaleString('en-IN')} each</p>
                    <p style="color: #666; font-size: 0.9rem;">Total: ₹${itemTotal.toLocaleString('en-IN')}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="${product.stock}" 
                               onchange="updateCartQuantity('${item.productId}', parseInt(this.value))" class="quantity-input">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn secondary small" onclick="removeFromCart('${item.productId}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Calculate totals
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + deliveryCharge + gst;
    
    cartSummaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Items (${totalItems}):</span>
            <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
            <span>Delivery Charges:</span>
            <span>${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}</span>
        </div>
        <div class="summary-row">
            <span>GST (18%):</span>
            <span>₹${gst.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row total">
            <span>Total Amount:</span>
            <span>₹${total.toLocaleString('en-IN')}</span>
        </div>
        <div style="margin-top: 20px;">
            <button class="btn primary" onclick="proceedToCheckout()" style="width: 100%; margin-bottom: 10px;">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
            <button class="btn secondary" onclick="showView('products')" style="width: 100%;">
                <i class="fas fa-arrow-left"></i> Continue Shopping
            </button>
        </div>
        ${subtotal < 500 ? '<p style="color: #666; font-size: 0.9rem; margin-top: 10px; text-align: center;">Add ₹' + (500 - subtotal) + ' more for free delivery!</p>' : ''}
    `;
}

// Proceed to checkout
function proceedToCheckout() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please login to continue', 'warning');
        showView('auth');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Check stock availability before checkout
    let stockIssues = [];
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product || product.stock < item.quantity) {
            stockIssues.push(product ? product.name : 'Unknown product');
        }
    });
    
    if (stockIssues.length > 0) {
        showToast(`Stock not available for: ${stockIssues.join(', ')}`, 'error');
        displayCart(); // Refresh cart display
        return;
    }
    
    showCheckoutModal();
}

// Show checkout modal
function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const currentUser = getCurrentUser();
    
    // Pre-fill user data if available
    if (currentUser) {
        document.getElementById('customerName').value = currentUser.name || '';
        document.getElementById('customerEmail').value = currentUser.email || '';
        document.getElementById('customerPhone').value = currentUser.phone || '';
    }
    
    // Calculate total
    updateOrderTotal();
    
    modal.classList.add('active');
}

// Update order total in checkout
function updateOrderTotal() {
    const subtotal = cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + deliveryCharge + gst;
    
    document.getElementById('orderTotal').textContent = total.toLocaleString('en-IN');
}

// Handle payment method change
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentDetailsDiv = document.getElementById('paymentDetails');
    
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            const method = this.value;
            let detailsHTML = '';
            
            switch (method) {
                case 'upi':
                    detailsHTML = `
                        <div class="form-group">
                            <label>UPI ID</label>
                            <input type="text" id="upiId" placeholder="yourname@paytm" required>
                        </div>
                    `;
                    break;
                case 'card':
                    detailsHTML = `
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                        </div>
                        <div style="display: flex; gap: 15px;">
                            <div class="form-group" style="flex: 1;">
                                <label>Expiry Date</label>
                                <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" required>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>CVV</label>
                                <input type="text" id="cvv" placeholder="123" maxlength="3" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cardholder Name</label>
                            <input type="text" id="cardholderName" required>
                        </div>
                    `;
                    break;
                case 'netbanking':
                    detailsHTML = `
                        <div class="form-group">
                            <label>Select Bank</label>
                            <select id="bankName" required>
                                <option value="">Choose your bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="pnb">Punjab National Bank</option>
                                <option value="bob">Bank of Baroda</option>
                                <option value="canara">Canara Bank</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    `;
                    break;
                case 'cod':
                    detailsHTML = `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p><i class="fas fa-info-circle"></i> You will pay ₹<span id="codAmount">${document.getElementById('orderTotal').textContent}</span> in cash when your order is delivered.</p>
                            <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">Please keep exact change ready for a smooth delivery experience.</p>
                        </div>
                    `;
                    break;
            }
            
            paymentDetailsDiv.innerHTML = detailsHTML;
            
            // Add input formatting for card details
            if (method === 'card') {
                formatCardInputs();
            }
        });
    }
});

// Format card input fields
function formatCardInputs() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
            this.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
}

// Get cart summary
function getCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + deliveryCharge + gst;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    return {
        subtotal,
        deliveryCharge,
        gst,
        total,
        totalItems,
        items: cart.map(item => {
            const product = getProductById(item.productId);
            return {
                ...item,
                product,
                itemTotal: product ? product.price * item.quantity : 0
            };
        })
    };
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});