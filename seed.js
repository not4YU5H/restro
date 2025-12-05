require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./server/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restro';

const sampleMenuItems = [
    // Appetizers
    {
        name: 'Bruschetta',
        description: 'Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil',
        price: 8.99,
        category: 'appetizer',
        imageUrl: 'https://via.placeholder.com/300x200?text=Bruschetta',
        available: true
    },
    {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 6.99,
        category: 'appetizer',
        imageUrl: 'https://via.placeholder.com/300x200?text=Garlic+Bread',
        available: true
    },
    {
        name: 'Mozzarella Sticks',
        description: 'Crispy fried mozzarella with marinara sauce',
        price: 9.99,
        category: 'appetizer',
        imageUrl: 'https://via.placeholder.com/300x200?text=Mozzarella+Sticks',
        available: true
    },
    
    // Main courses
    {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        category: 'main',
        imageUrl: 'https://via.placeholder.com/300x200?text=Margherita+Pizza',
        available: true
    },
    {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce and vegetables',
        price: 22.99,
        category: 'main',
        imageUrl: 'https://via.placeholder.com/300x200?text=Grilled+Salmon',
        available: true
    },
    {
        name: 'Chicken Alfredo',
        description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken',
        price: 16.99,
        category: 'main',
        imageUrl: 'https://via.placeholder.com/300x200?text=Chicken+Alfredo',
        available: true
    },
    {
        name: 'Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, cheese, and fries',
        price: 13.99,
        category: 'main',
        imageUrl: 'https://via.placeholder.com/300x200?text=Beef+Burger',
        available: true
    },
    {
        name: 'Vegetable Stir Fry',
        description: 'Fresh vegetables stir-fried with soy sauce and served with rice',
        price: 12.99,
        category: 'main',
        imageUrl: 'https://via.placeholder.com/300x200?text=Vegetable+Stir+Fry',
        available: true
    },
    
    // Desserts
    {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        category: 'dessert',
        imageUrl: 'https://via.placeholder.com/300x200?text=Tiramisu',
        available: true
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 8.99,
        category: 'dessert',
        imageUrl: 'https://via.placeholder.com/300x200?text=Chocolate+Lava+Cake',
        available: true
    },
    {
        name: 'Cheesecake',
        description: 'Creamy New York-style cheesecake with berry compote',
        price: 7.99,
        category: 'dessert',
        imageUrl: 'https://via.placeholder.com/300x200?text=Cheesecake',
        available: true
    },
    
    // Beverages
    {
        name: 'Fresh Lemonade',
        description: 'Homemade lemonade with fresh lemons and mint',
        price: 3.99,
        category: 'beverage',
        imageUrl: 'https://via.placeholder.com/300x200?text=Fresh+Lemonade',
        available: true
    },
    {
        name: 'Coffee',
        description: 'Freshly brewed coffee',
        price: 2.99,
        category: 'beverage',
        imageUrl: 'https://via.placeholder.com/300x200?text=Coffee',
        available: true
    },
    {
        name: 'Iced Tea',
        description: 'Refreshing iced tea with lemon',
        price: 3.49,
        category: 'beverage',
        imageUrl: 'https://via.placeholder.com/300x200?text=Iced+Tea',
        available: true
    }
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Clear existing menu items
        console.log('Clearing existing menu items...');
        await MenuItem.deleteMany({});
        
        // Insert sample data
        console.log('Inserting sample menu items...');
        await MenuItem.insertMany(sampleMenuItems);
        
        console.log(`✅ Successfully seeded ${sampleMenuItems.length} menu items`);
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
