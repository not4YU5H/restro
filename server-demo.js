require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use mock controllers (no MongoDB required)
const menuController = require('./server/controllers/menuControllerMock');
const orderController = require('./server/controllers/orderControllerMock');

// API Routes - Menu
app.get('/api/menu', menuController.getAllMenuItems);
app.get('/api/menu/recommendations/:category', menuController.getRecommendations);
app.get('/api/menu/:id', menuController.getMenuItemById);
app.post('/api/menu', menuController.createMenuItem);
app.put('/api/menu/:id', menuController.updateMenuItem);
app.delete('/api/menu/:id', menuController.deleteMenuItem);

// API Routes - Orders
app.post('/api/orders', orderController.createOrder);
app.get('/api/orders', orderController.getAllOrders);
app.get('/api/orders/:id', orderController.getOrderById);
app.patch('/api/orders/:id/status', orderController.updateOrderStatus);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📱 Customer interface: http://localhost:${PORT}`);
  console.log(`⚙️  Admin dashboard: http://localhost:${PORT}/admin`);
  console.log('\n💡 Using in-memory data store (no MongoDB required for demo)');
});
