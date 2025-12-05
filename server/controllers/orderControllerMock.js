const mockData = require('../mockData');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, customerEmail, notes } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!customerName || !customerEmail) {
      return res.status(400).json({ error: 'Customer name and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate customer name (prevent XSS)
    if (customerName.length > 100 || /<[^>]*>/.test(customerName)) {
      return res.status(400).json({ error: 'Invalid customer name' });
    }

    // Validate items quantities
    for (const item of items) {
      if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ error: 'Invalid quantity. Must be between 1 and 99' });
      }
    }

    // Create a Map for O(1) lookup of menu items
    const menuItemsMap = new Map(mockData.menuItems.map(item => [item._id, item]));

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = menuItemsMap.get(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ error: `Menu item ${item.menuItem} not found` });
      }
      if (!menuItem.available) {
        return res.status(400).json({ error: `${menuItem.name} is not available` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: { ...menuItem },
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order
    const order = {
      _id: mockData.getNextOrderId(),
      items: orderItems,
      totalAmount,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      notes: notes ? notes.substring(0, 500) : '', // Limit notes length
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockData.orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order', message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let orders = mockData.orders;
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    // Sort by most recent first
    orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = mockData.orders.find(o => o._id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const index = mockData.orders.findIndex(o => o._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    mockData.orders[index].status = status;
    mockData.orders[index].updatedAt = new Date();

    res.json(mockData.orders[index]);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status', message: error.message });
  }
};
