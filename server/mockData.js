// In-memory data store (for demo without MongoDB)
let menuItems = [
    // Appetizers
    {
        _id: '1',
        name: 'Bruschetta',
        description: 'Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil',
        price: 8.99,
        category: 'appetizer',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '2',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 6.99,
        category: 'appetizer',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '3',
        name: 'Mozzarella Sticks',
        description: 'Crispy fried mozzarella with marinara sauce',
        price: 9.99,
        category: 'appetizer',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // Main courses
    {
        _id: '4',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        category: 'main',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '5',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce and vegetables',
        price: 22.99,
        category: 'main',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '6',
        name: 'Chicken Alfredo',
        description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken',
        price: 16.99,
        category: 'main',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '7',
        name: 'Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, cheese, and fries',
        price: 13.99,
        category: 'main',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // Desserts
    {
        _id: '8',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        category: 'dessert',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '9',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 8.99,
        category: 'dessert',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // Beverages
    {
        _id: '10',
        name: 'Fresh Lemonade',
        description: 'Homemade lemonade with fresh lemons and mint',
        price: 3.99,
        category: 'beverage',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '11',
        name: 'Coffee',
        description: 'Freshly brewed coffee',
        price: 2.99,
        category: 'beverage',
        imageUrl: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

let orders = [];
let nextOrderId = 1;
let nextMenuId = 12;

module.exports = {
    menuItems,
    orders,
    getNextOrderId: () => (nextOrderId++).toString(),
    getNextMenuId: () => (nextMenuId++).toString()
};
