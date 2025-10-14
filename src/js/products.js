// Indian Products Data with detailed specifications
const INDIAN_PRODUCTS = [
    {
        id: '1',
        name: 'Samsung Galaxy M34 5G',
        description: 'Latest Samsung smartphone with powerful performance and long-lasting battery',
        price: 18499,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        category: 'Electronics',
        stock: 45,
        specifications: {
            'Display': '6.5" Super AMOLED',
            'Processor': 'Exynos 1280',
            'RAM': '6GB',
            'Storage': '128GB',
            'Camera': '50MP Triple Camera',
            'Battery': '6000mAh',
            'OS': 'Android 13',
            'Warranty': '1 Year'
        },
        features: ['5G Ready', 'Fast Charging', 'Water Resistant', 'Dual SIM']
    },
    {
        id: '2',
        name: 'boAt Airdopes 141',
        description: 'True wireless earbuds with premium sound quality and comfortable fit',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics',
        stock: 120,
        specifications: {
            'Driver Size': '8mm',
            'Bluetooth': 'v5.0',
            'Battery Life': '42 Hours',
            'Charging Time': '1.5 Hours',
            'Water Resistance': 'IPX4',
            'Warranty': '1 Year',
            'Type': 'In-Ear',
            'Controls': 'Touch'
        },
        features: ['Active Noise Cancellation', 'Low Latency', 'Voice Assistant', 'Fast Charging']
    },
    {
        id: '3',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes perfect for daily workouts and casual wear',
        price: 7995,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Fashion',
        stock: 80,
        specifications: {
            'Material': 'Mesh & Synthetic',
            'Sole': 'Rubber',
            'Closure': 'Lace-up',
            'Heel Height': '3.2 cm',
            'Weight': '310g (Size 8)',
            'Sizes Available': '6-12 UK',
            'Color Options': '5 Colors',
            'Care': 'Wipe Clean'
        },
        features: ['Air Max Technology', 'Breathable Mesh', 'Durable Sole', 'Lightweight']
    },
    {
        id: '4',
        name: 'Prestige Induction Cooktop',
        description: 'Energy-efficient induction cooktop with multiple cooking presets',
        price: 3450,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        category: 'Home',
        stock: 35,
        specifications: {
            'Power': '2000 Watts',
            'Voltage': '230V',
            'Preset Menus': '10 Indian Menus',
            'Timer': '3 Hours',
            'Temperature Range': '60°C to 240°C',
            'Display': 'LED',
            'Material': 'Crystal Glass Top',
            'Warranty': '2 Years'
        },
        features: ['Auto Shut-off', 'Child Lock', 'Overheat Protection', 'Energy Saving']
    },
    {
        id: '5',
        name: 'Levis Men\'s Regular Fit Jeans',
        description: 'Classic denim jeans with comfortable fit and premium quality',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        category: 'Fashion',
        stock: 65,
        specifications: {
            'Material': '100% Cotton Denim',
            'Fit': 'Regular',
            'Rise': 'Mid-Rise',
            'Closure': 'Button & Zip',
            'Pockets': '5 Pocket Design',
            'Wash': 'Medium Blue',
            'Sizes': '28-38 Waist',
            'Length': '32", 34", 36"'
        },
        features: ['Fade Resistant', 'Pre-washed', 'Comfort Fit', 'Durable Stitching']
    },
    {
        id: '6',
        name: 'Philips Air Fryer HD9252',
        description: 'Healthy cooking air fryer with rapid air technology for crispy results',
        price: 8995,
        image: 'https://images.unsplash.com/photo-1585515656875-0a9c8e00eefc?w=500',
        category: 'Home',
        stock: 25,
        specifications: {
            'Capacity': '4.1 Liters',
            'Power': '1400 Watts',
            'Technology': 'Rapid Air',
            'Temperature Range': '80°C - 200°C',
            'Timer': '60 Minutes',
            'Material': 'Non-stick Coating',
            'Dimensions': '31.5 x 28.7 x 38.4 cm',
            'Warranty': '2 Years'
        },
        features: ['90% Less Fat', 'Dishwasher Safe', 'Auto Shut-off', 'Cool Touch Handle']
    },
    {
        id: '7',
        name: 'Amazon Echo Dot (4th Gen)',
        description: 'Smart speaker with Alexa - perfect for your smart home setup',
        price: 4499,
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500',
        category: 'Electronics',
        stock: 90,
        specifications: {
            'Speaker': '1.6" driver',
            'Connectivity': 'Wi-Fi, Bluetooth',
            'Voice Control': 'Alexa Built-in',
            'Music Services': 'Amazon Music, Spotify, JioSaavn',
            'Smart Home': 'Compatible with 1000+ devices',
            'Audio': '3.5mm Audio Output',
            'Power': 'AC Adapter',
            'Dimensions': '100 x 100 x 89 mm'
        },
        features: ['Voice Control', 'Smart Home Hub', 'Music Streaming', 'Multi-room Audio']
    },
    {
        id: '8',
        name: 'Himalaya Herbals Face Wash',
        description: 'Natural neem and turmeric face wash for clear and healthy skin',
        price: 145,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
        category: 'Beauty',
        stock: 200,
        specifications: {
            'Volume': '150ml',
            'Key Ingredients': 'Neem, Turmeric',
            'Skin Type': 'All Skin Types',
            'Benefits': 'Anti-bacterial, Oil Control',
            'pH Level': '5.5',
            'Paraben Free': 'Yes',
            'Cruelty Free': 'Yes',
            'Expiry': '3 Years from MFD'
        },
        features: ['Natural Ingredients', 'Dermatologically Tested', 'No Harmful Chemicals', 'Made in India']
    },
    {
        id: '9',
        name: 'Milton Thermosteel Water Bottle',
        description: 'Insulated stainless steel water bottle keeps drinks hot/cold for hours',
        price: 899,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
        category: 'Home',
        stock: 150,
        specifications: {
            'Capacity': '1000ml',
            'Material': 'Stainless Steel 304',
            'Insulation': 'Double Wall Vacuum',
            'Hot Retention': '8-10 Hours',
            'Cold Retention': '12-15 Hours',
            'Mouth': 'Wide Mouth',
            'Leak Proof': 'Yes',
            'BPA Free': 'Yes'
        },
        features: ['Temperature Retention', 'Leak Proof', 'Easy to Clean', 'Durable Build']
    },
    {
        id: '10',
        name: 'Patanjali Chyawanprash',
        description: 'Ayurvedic immunity booster made with traditional herbs and spices',
        price: 175,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        category: 'Health',
        stock: 300,
        specifications: {
            'Weight': '500g',
            'Main Ingredient': 'Amla',
            'Other Herbs': '40+ Ayurvedic Herbs',
            'Suitable For': 'All Ages (Above 3 years)',
            'Consumption': '1-2 tsp daily',
            'Shelf Life': '2 Years',
            'Type': 'Vegetarian',
            'Certification': 'FSSAI Approved'
        },
        features: ['Boosts Immunity', 'Natural Ingredients', 'No Artificial Colors', 'Ayurvedic Formula']
    },
    {
        id: '11',
        name: 'Woodland Men\'s Leather Shoes',
        description: 'Premium leather formal shoes perfect for office and special occasions',
        price: 3299,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        category: 'Fashion',
        stock: 40,
        specifications: {
            'Material': 'Genuine Leather',
            'Sole': 'Rubber',
            'Closure': 'Lace-up',
            'Heel Height': '2.5 cm',
            'Toe Shape': 'Round',
            'Sizes': '6-11 UK',
            'Color': 'Brown/Black',
            'Care': 'Polish Regularly'
        },
        features: ['Genuine Leather', 'Comfortable Sole', 'Durable Build', 'Professional Look']
    },
    {
        id: '12',
        name: 'Tata Tea Premium',
        description: 'Rich and aromatic tea blend perfect for your morning cup',
        price: 240,
        image: 'https://www.shutterstock.com/image-photo/ranipool-sikkim-india-december-17-2020-1878699445',
        category: 'Groceries',
        stock: 500,
        specifications: {
            'Weight': '1kg',
            'Type': 'Black Tea',
            'Origin': 'Assam & Darjeeling',
            'Grade': 'Premium',
            'Caffeine': 'High',
            'Flavor': 'Strong & Aromatic',
            'Shelf Life': '2 Years',
            'Packaging': 'Vacuum Packed'
        },
        features: ['Premium Quality', 'Rich Aroma', 'Perfect Blend', 'Trusted Brand']
    }
];

let filteredProducts = [...INDIAN_PRODUCTS];

// Initialize products display
function initializeProducts() {
    displayProducts(INDIAN_PRODUCTS);
    setupCategoryFilters();
    setupSearch();
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetails('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div style="margin-bottom: 15px;">
                    <span class="stock-status ${getStockStatus(product.stock)}">${getStockText(product.stock)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn primary" onclick="event.stopPropagation(); addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn secondary" onclick="event.stopPropagation(); showProductDetails('${product.id}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get stock status class
function getStockStatus(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
}

// Get stock text
function getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Only ${stock} left`;
    return 'In Stock';
}

// Setup category filters
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const category = btn.dataset.category;
            if (category === 'all') {
                filteredProducts = [...INDIAN_PRODUCTS];
            } else {
                filteredProducts = INDIAN_PRODUCTS.filter(product => product.category === category);
            }
            
            displayProducts(filteredProducts);
        });
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            filteredProducts = [...INDIAN_PRODUCTS];
        } else {
            filteredProducts = INDIAN_PRODUCTS.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                Object.values(product.specifications).some(spec => 
                    spec.toLowerCase().includes(query)
                ) ||
                product.features.some(feature => 
                    feature.toLowerCase().includes(query)
                )
            );
        }
        
        displayProducts(filteredProducts);
        
        // Reset category filter to 'all'
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search
    searchInput.addEventListener('input', debounce(performSearch, 300));
}

// Show product details modal
function showProductDetails(productId) {
    const product = INDIAN_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const detailsContainer = document.getElementById('productDetails');
    
    detailsContainer.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="product-detail-price">₹${product.price.toLocaleString('en-IN')}</div>
            <div style="margin: 15px 0;">
                <span class="stock-status ${getStockStatus(product.stock)}">${getStockText(product.stock)}</span>
            </div>
            
            <div class="product-specs">
                <h3>Specifications</h3>
                ${Object.entries(product.specifications).map(([key, value]) => `
                    <div class="spec-item">
                        <strong>${key}:</strong>
                        <span>${value}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="product-specs">
                <h3>Key Features</h3>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="quantity-selector">
                <label><strong>Quantity:</strong></label>
                <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                <input type="number" id="productQuantity" value="1" min="1" max="${product.stock}" class="quantity-input">
                <button class="quantity-btn" onclick="increaseQuantity(${product.stock})">+</button>
            </div>
            
            <div style="margin-top: 20px;">
                <button class="btn primary" onclick="addToCartWithQuantity('${product.id}')" style="margin-right: 10px;">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn success" onclick="buyNow('${product.id}')">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Quantity controls
function increaseQuantity(maxStock) {
    const input = document.getElementById('productQuantity');
    const current = parseInt(input.value);
    if (current < maxStock) {
        input.value = current + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('productQuantity');
    const current = parseInt(input.value);
    if (current > 1) {
        input.value = current - 1;
    }
}

// Add to cart with quantity
function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    addToCart(productId, quantity);
    document.getElementById('productModal').classList.remove('active');
}

// Buy now functionality
function buyNow(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    addToCart(productId, quantity);
    document.getElementById('productModal').classList.remove('active');
    showView('cart');
}

// Get product by ID
function getProductById(id) {
    return INDIAN_PRODUCTS.find(product => product.id === id);
}

// Debounce function for search
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

// Initialize products when script loads
document.addEventListener('DOMContentLoaded', initializeProducts);