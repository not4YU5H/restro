const mockData = require('../mockData');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    let items = mockData.menuItems;
    
    if (category) {
      items = items.filter(item => item.category === category && item.available);
    } else {
      items = items.filter(item => item.available);
    }
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items', message: error.message });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = mockData.menuItems.find(item => item._id === req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item', message: error.message });
  }
};

// Create menu item (admin)
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = {
      _id: mockData.getNextMenuId(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockData.menuItems.push(menuItem);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create menu item', message: error.message });
  }
};

// Update menu item (admin)
exports.updateMenuItem = async (req, res) => {
  try {
    const index = mockData.menuItems.findIndex(item => item._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    mockData.menuItems[index] = {
      ...mockData.menuItems[index],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json(mockData.menuItems[index]);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update menu item', message: error.message });
  }
};

// Delete menu item (admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    const index = mockData.menuItems.findIndex(item => item._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    mockData.menuItems.splice(index, 1);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item', message: error.message });
  }
};

// Get AI recommendations based on category
exports.getRecommendations = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    const validCategories = ['appetizer', 'main', 'dessert', 'beverage'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Get top rated items from the category (simulated AI recommendation)
    const recommendations = mockData.menuItems
      .filter(item => item.category === category && item.available)
      .slice(0, 3);

    res.json({
      category,
      recommendations,
      reason: `Popular ${category} items based on customer preferences`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations', message: error.message });
  }
};
