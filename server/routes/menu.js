const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.get('/recommendations/:category', menuController.getRecommendations);

// Admin routes
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
