// Authentication management
let currentUser = JSON.parse(localStorage.getItem('indiaShopUser')) || null;

// Initialize auth
function initAuth() {
    updateAuthButton();
    setupAuthForms();
}

// Update auth button based on login status
function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    
    if (currentUser) {
        authBtn.innerHTML = `
            <i class="fas fa-user"></i> ${currentUser.name}
            <i class="fas fa-chevron-down" style="margin-left: 5px; font-size: 0.8rem;"></i>
        `;
        authBtn.onclick = toggleUserMenu;
    } else {
        authBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        authBtn.onclick = () => showView('auth');
    }
}

// Toggle user menu
function toggleUserMenu() {
    // Remove existing menu if present
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create user menu
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        padding: 10px 0;
        min-width: 200px;
        z-index: 1001;
    `;
    
    menu.innerHTML = `
        <div style="padding: 10px 20px; border-bottom: 1px solid #e0e0e0; margin-bottom: 5px;">
            <strong>${currentUser.name}</strong><br>
            <small style="color: #666;">${currentUser.email}</small>
        </div>
        <a href="#" onclick="showView('orders')" style="display: block; padding: 10px 20px; text-decoration: none; color: #333; transition: background 0.3s;">
            <i class="fas fa-box" style="margin-right: 10px;"></i> My Orders
        </a>
        <a href="#" onclick="showView('cart')" style="display: block; padding: 10px 20px; text-decoration: none; color: #333; transition: background 0.3s;">
            <i class="fas fa-shopping-cart" style="margin-right: 10px;"></i> My Cart
        </a>
        <hr style="margin: 5px 0; border: none; border-top: 1px solid #e0e0e0;">
        <a href="#" onclick="logout()" style="display: block; padding: 10px 20px; text-decoration: none; color: #dc3545; transition: background 0.3s;">
            <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Logout
        </a>
    `;
    
    // Add hover effects
    const menuItems = menu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f8f9fa';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
        });
    });
    
    // Position menu
    const authBtn = document.getElementById('authBtn');
    authBtn.style.position = 'relative';
    authBtn.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!authBtn.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

// Setup auth form handlers
function setupAuthForms() {
    setupAuthTabs();
    setupLoginForm();
    setupRegisterForm();
}

// Setup auth tabs
function setupAuthTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === targetTab + 'Form') {
                    form.classList.add('active');
                }
            });
        });
    });
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.querySelector('#loginForm form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user exists in localStorage (simulated database)
            const users = JSON.parse(localStorage.getItem('indiaShopUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login successful
                currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('indiaShopUser', JSON.stringify(currentUser));
                updateAuthButton();
                showToast(`Welcome back, ${user.name}!`, 'success');
                showView('products');
                
                // Load user's cart if exists
                loadCart();
            } else {
                showToast('Invalid email or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Setup register form
function setupRegisterForm() {
    const registerForm = document.querySelector('#registerForm form');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!name || !email || !phone || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showToast('Please enter a valid Indian phone number', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('indiaShopUsers')) || [];
            
            if (users.find(u => u.email === email)) {
                showToast('An account with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                password: password, // In real app, this would be hashed
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('indiaShopUsers', JSON.stringify(users));
            
            // Auto login the new user
            currentUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('indiaShopUser', JSON.stringify(currentUser));
            updateAuthButton();
            showToast(`Welcome to IndiaShop, ${newUser.name}!`, 'success');
            showView('products');
            
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('indiaShopUser');
    updateAuthButton();
    clearCart(); // Clear cart on logout
    showToast('Logged out successfully', 'success');
    showView('products');
    
    // Remove user menu if open
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Indian phone number validation
function isValidPhone(phone) {
    // Indian phone number: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Demo login function (for testing)
function demoLogin() {
    currentUser = {
        id: 'demo123',
        name: 'Demo User',
        email: 'demo@indianshop.com',
        phone: '9876543210',
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('indiaShopUser', JSON.stringify(currentUser));
    updateAuthButton();
    showToast('Demo login successful!', 'success');
    showView('products');
}

// Initialize auth when page loads
document.addEventListener('DOMContentLoaded', initAuth);