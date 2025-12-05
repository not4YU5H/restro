// API Base URL
const API_URL = '/api';

// State
let menuItems = [];
let orders = [];
let currentEditItem = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadMenuItems();
    loadOrders();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', () => {
        currentEditItem = null;
        document.getElementById('menu-modal-title').textContent = 'Add Menu Item';
        document.getElementById('menu-item-form').reset();
        document.getElementById('item-id').value = '';
        document.getElementById('menu-item-modal').style.display = 'block';
    });
    
    // Menu item form
    document.getElementById('menu-item-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveMenuItem();
    });
    
    // Order status filter
    document.getElementById('order-status-filter').addEventListener('change', (e) => {
        loadOrders(e.target.value);
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

// Switch tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Load data for the tab
    if (tabId === 'orders') {
        loadOrders();
    }
}

// Load menu items
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) throw new Error('Failed to load menu items');
        
        menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('admin-menu-items').innerHTML = 
            '<p class="error">Failed to load menu items.</p>';
    }
}

// Display menu items in admin table
function displayMenuItems(items) {
    const container = document.getElementById('admin-menu-items');
    
    if (items.length === 0) {
        container.innerHTML = '<p class="empty-cart">No menu items found. Add your first item!</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>
                            <strong>${item.name}</strong><br>
                            <small>${item.description}</small>
                        </td>
                        <td><span class="category-badge">${item.category}</span></td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>
                            ${item.available 
                                ? '<span class="status-badge status-ready">Available</span>' 
                                : '<span class="status-badge status-cancelled">Unavailable</span>'}
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn btn-primary" onclick="editMenuItem('${item._id}')">
                                    Edit
                                </button>
                                <button class="action-btn btn-danger" onclick="deleteMenuItem('${item._id}')">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Edit menu item
function editMenuItem(itemId) {
    const item = menuItems.find(m => m._id === itemId);
    if (!item) return;
    
    currentEditItem = item;
    document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
    document.getElementById('item-id').value = item._id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-image').value = item.imageUrl || '';
    document.getElementById('item-available').checked = item.available;
    
    document.getElementById('menu-item-modal').style.display = 'block';
}

// Save menu item
async function saveMenuItem() {
    try {
        const itemId = document.getElementById('item-id').value;
        const itemData = {
            name: document.getElementById('item-name').value,
            description: document.getElementById('item-description').value,
            price: parseFloat(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            imageUrl: document.getElementById('item-image').value,
            available: document.getElementById('item-available').checked
        };
        
        const url = itemId ? `${API_URL}/menu/${itemId}` : `${API_URL}/menu`;
        const method = itemId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save menu item');
        }
        
        document.getElementById('menu-item-modal').style.display = 'none';
        await loadMenuItems();
        
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Failed to save menu item: ' + error.message);
    }
}

// Delete menu item
async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
        const response = await fetch(`${API_URL}/menu/${itemId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete menu item');
        
        await loadMenuItems();
        
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item: ' + error.message);
    }
}

// Load orders
async function loadOrders(status = '') {
    try {
        const url = status ? `${API_URL}/orders?status=${status}` : `${API_URL}/orders`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to load orders');
        
        orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('admin-orders').innerHTML = 
            '<p class="error">Failed to load orders.</p>';
    }
}

// Display orders in admin table
function displayOrders(orderList) {
    const container = document.getElementById('admin-orders');
    
    if (orderList.length === 0) {
        container.innerHTML = '<p class="empty-cart">No orders found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orderList.map(order => `
                    <tr>
                        <td><code>${order._id.slice(-8)}</code></td>
                        <td>
                            <strong>${order.customerName}</strong><br>
                            <small>${order.customerEmail}</small>
                        </td>
                        <td>${order.items.length} item(s)</td>
                        <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
                        <td>
                            <select onchange="updateOrderStatus('${order._id}', this.value)" class="status-select">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                                <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>${new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                            <button class="action-btn btn-primary" onclick="viewOrderDetails('${order._id}')">
                                View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) throw new Error('Failed to update order status');
        
        // Update the local orders array
        const orderIndex = orders.findIndex(o => o._id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
        }
        
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + error.message);
        await loadOrders(); // Reload to restore previous state
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    
    const detailsHtml = `
        <div class="order-details">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            
            <h3>Order Items:</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.menuItem ? item.menuItem.name : 'Unknown Item'}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" align="right"><strong>Total:</strong></td>
                        <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    document.getElementById('order-details-content').innerHTML = detailsHtml;
    document.getElementById('order-details-modal').style.display = 'block';
}
