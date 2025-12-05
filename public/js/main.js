// API Base URL
const API_URL = '/api';

// State
let menuItems = [];
let cart = [];
let currentCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    setupEventListeners();
});

// Load menu items from API
async function loadMenuItems(category = null) {
    try {
        const url = category ? `${API_URL}/menu?category=${category}` : `${API_URL}/menu`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to load menu items');
        
        menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menu-items').innerHTML = 
            '<p class="error">Failed to load menu. Please try again later.</p>';
    }
}

// Display menu items
function displayMenuItems(items) {
    const container = document.getElementById('menu-items');
    
    if (items.length === 0) {
        container.innerHTML = '<p class="empty-cart">No items found in this category.</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="menu-item">
            <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}">
            <div class="menu-item-content">
                <span class="category-badge">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">$${item.price.toFixed(2)}</div>
                <button class="add-to-cart" 
                        onclick="addToCart('${item._id}')"
                        ${!item.available ? 'disabled' : ''}>
                    ${item.available ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            currentCategory = category;
            
            if (category === 'all') {
                loadMenuItems();
                document.getElementById('recommendations').style.display = 'none';
            } else {
                loadMenuItems(category);
                loadRecommendations(category);
            }
        });
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) return;
        showCheckoutModal();
    });
    
    // Checkout form
    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await placeOrder();
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Load AI recommendations
async function loadRecommendations(category) {
    try {
        const response = await fetch(`${API_URL}/menu/recommendations/${category}`);
        
        if (!response.ok) throw new Error('Failed to load recommendations');
        
        const data = await response.json();
        displayRecommendations(data);
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Display recommendations
function displayRecommendations(data) {
    const container = document.getElementById('recommendations-content');
    const section = document.getElementById('recommendations');
    
    if (data.recommendations.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    container.innerHTML = data.recommendations.map(item => `
        <div class="menu-item">
            <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}">
            <div class="menu-item-content">
                <span class="category-badge">⭐ Recommended</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">$${item.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart('${item._id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(m => m._id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.menuItem === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            menuItem: itemId,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.menuItem !== itemId);
    updateCart();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.menuItem === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCart();
    }
}

// Update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity('${item.menuItem}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity('${item.menuItem}', 1)">+</button>
            </div>
        </div>
    `).join('');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    
    cartSummary.style.display = 'block';
}

// Show checkout modal
function showCheckoutModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-modal').style.display = 'block';
}

// Place order
async function placeOrder() {
    try {
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const notes = document.getElementById('order-notes').value;
        
        const orderData = {
            items: cart.map(item => ({
                menuItem: item.menuItem,
                quantity: item.quantity
            })),
            customerName,
            customerEmail,
            notes
        };
        
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to place order');
        }
        
        const order = await response.json();
        
        // Show success modal
        document.getElementById('order-id').textContent = order._id;
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('success-modal').style.display = 'block';
        
        // Clear cart
        cart = [];
        updateCart();
        
        // Reset form
        document.getElementById('checkout-form').reset();
        
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order: ' + error.message);
    }
}
