// Main application controller

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🇮🇳 IndiaShop E-commerce Application Initialized');
    
    // Initialize all modules
    initializeApp();
    setupEventListeners();
    setupModalHandlers();
    showView('products'); // Default view
});

// Initialize application
function initializeApp() {
    // Load saved data
    loadCart();
    
    // Update UI
    updateCartCount();
    updateAuthButton();
    
    // Setup navigation
    setupNavigation();
    
    // Display default content
    displayProducts(INDIAN_PRODUCTS);
    
    console.log('✅ Application initialized successfully');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = btn.dataset.view;
            if (view) {
                showView(view);
                updateActiveNavButton(btn);
            }
        });
    });
    
    // Search functionality
    setupSearchListeners();
    
    // Window events
    window.addEventListener('beforeunload', () => {
        // Save cart before page unload
        saveCart();
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
        showToast('🌐 Connection restored!', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('📵 You are offline. Some features may not work.', 'warning');
    });
}

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetView = this.dataset.view;
            
            // Special handling for auth button
            if (targetView === 'auth' && getCurrentUser()) {
                // User is logged in, show user menu instead
                return;
            }
            
            showView(targetView);
            updateActiveNavButton(this);
        });
    });
}

// Show specific view
function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    // Show target view
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.add('active');
        
        // Load view-specific content
        switch (viewName) {
            case 'products':
                displayProducts(INDIAN_PRODUCTS);
                break;
            case 'cart':
                displayCart();
                break;
            case 'orders':
                displayOrders();
                break;
            case 'auth':
                // Auth form is static, no need to load content
                break;
        }
        
        // Update URL without page reload (for better UX)
        updateURL(viewName);
    }
}

// Update active navigation button
function updateActiveNavButton(activeBtn) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Setup modal handlers
function setupModalHandlers() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Close modal when clicking close button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
}

// Setup search listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search with debounce
        searchInput.addEventListener('input', debounce(performSearch, 500));
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    let results = [];
    
    if (query === '') {
        results = [...INDIAN_PRODUCTS];
    } else {
        results = INDIAN_PRODUCTS.filter(product => {
            return product.name.toLowerCase().includes(query) ||
                   product.description.toLowerCase().includes(query) ||
                   product.category.toLowerCase().includes(query) ||
                   Object.values(product.specifications).some(spec => 
                       spec.toLowerCase().includes(query)
                   ) ||
                   product.features.some(feature => 
                       feature.toLowerCase().includes(query)
                   );
        });
    }
    
    displayProducts(results);
    
    // Show search results message
    if (query && results.length === 0) {
        showToast(`No products found for "${query}"`, 'warning');
    } else if (query && results.length > 0) {
        showToast(`Found ${results.length} product(s) for "${query}"`, 'success');
    }
    
    // Make sure we're on products view
    showView('products');
}

// Update URL for better navigation
function updateURL(viewName) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewName);
    window.history.replaceState({ view: viewName }, '', url);
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view') || 'products';
    showView(view);
});

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    
    // Remove existing classes
    toast.className = 'toast';
    
    // Add type class
    if (type !== 'info') {
        toast.classList.add(type);
    }
    
    // Set message
    toast.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency for Indian locale
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date for Indian locale
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get status text with emoji
function getStatusText(status) {
    const statusMap = {
        'pending_payment': '⏳ Pending Payment',
        'confirmed': '✅ Confirmed',
        'processing': '📦 Processing',
        'shipped': '🚚 Shipped',
        'delivered': '🏠 Delivered',
        'cancelled': '❌ Cancelled'
    };
    return statusMap[status] || status;
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if user is on mobile device
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Handle responsive design
function handleResize() {
    const isMobile = isMobileDevice();
    
    // Adjust layout for mobile
    if (isMobile) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// Setup responsive design
window.addEventListener('resize', debounce(handleResize, 250));
window.addEventListener('load', handleResize);

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and tracking (simulation)
function trackEvent(eventName, data) {
    console.log('📊 Event tracked:', eventName, data);
    
    // In a real application, send to analytics service
    const event = {
        name: eventName,
        data: data,
        timestamp: new Date().toISOString(),
        sessionId: generateId()
    };
    
    // Store locally for demo
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push(event);
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
    
    // Track error
    trackEvent('error', {
        message: e.error.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('A network error occurred. Please check your connection.', 'error');
    
    // Track error
    trackEvent('promise_rejection', {
        reason: e.reason
    });
});

// Performance monitoring
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            trackEvent('page_load', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                ttfb: perfData.responseStart - perfData.requestStart
            });
        }
    }, 0);
});

// Development helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add development tools
    window.IndiaShop = {
        cart,
        orders,
        currentUser,
        products: INDIAN_PRODUCTS,
        clearAll: () => {
            localStorage.clear();
            location.reload();
        },
        demoLogin: () => {
            demoLogin();
        },
        addSampleOrders: () => {
            // Add sample orders for testing
            const sampleOrder = {
                id: 'DEMO' + Date.now(),
                userId: getCurrentUser()?.id || 'demo',
                items: [
                    {
                        productId: '1',
                        name: 'Samsung Galaxy M34 5G',
                        price: 18499,
                        quantity: 1,
                        total: 18499
                    }
                ],
                pricing: {
                    subtotal: 18499,
                    deliveryCharge: 0,
                    gst: 3330,
                    total: 21829
                },
                status: 'delivered',
                createdAt: new Date().toISOString(),
                estimatedDelivery: new Date().toISOString(),
                customerInfo: {
                    name: 'Demo User',
                    email: 'demo@example.com',
                    phone: '9876543210'
                },
                shippingAddress: 'Demo Address, Mumbai, Maharashtra, 400001',
                paymentMethod: 'upi'
            };
            
            orders.push(sampleOrder);
            localStorage.setItem('indiaShopOrders', JSON.stringify(orders));
            showToast('Sample order added!', 'success');
        }
    };
    
    console.log('🔧 Development mode: Use window.IndiaShop for debugging');
}

console.log('🚀 IndiaShop Main Application Ready!');