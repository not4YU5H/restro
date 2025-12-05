# Restro - Restaurant Ordering & Menu System

A full-stack restaurant ordering and menu management system built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **Customer Interface**
  - Browse menu items by category (Appetizers, Main Course, Desserts, Beverages)
  - AI-powered recommendations based on selected category
  - Shopping cart with add/remove functionality
  - Order placement with customer details
  - Responsive design for mobile and desktop

- **Admin Dashboard**
  - Menu management (Create, Read, Update, Delete menu items)
  - Order history and tracking
  - Order status management (Pending, Confirmed, Preparing, Ready, Delivered, Cancelled)
  - Real-time order filtering

- **Backend API**
  - RESTful API endpoints for menu and orders
  - MongoDB database for data persistence
  - Proper error handling and validation
  - CORS enabled for cross-origin requests

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Tools**: Nodemon for development

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restro
```

2. Install dependencies:
```bash
npm install
```

3. **Choose your setup mode:**

### Option A: Demo Mode (No MongoDB Required)
Perfect for quick testing and demonstrations.

```bash
# Start the demo server with in-memory data
npm run demo

# Or with auto-reload
npm run dev:demo
```

### Option B: Full Setup with MongoDB

1. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your MongoDB connection:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restro
NODE_ENV=development
```

2. Start MongoDB (if running locally):
```bash
mongod
```

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

4. Access the application:
- Customer Interface: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items (query param: `category`)
- `GET /api/menu/:id` - Get a specific menu item
- `GET /api/menu/recommendations/:category` - Get AI recommendations for a category
- `POST /api/menu` - Create a new menu item (admin)
- `PUT /api/menu/:id` - Update a menu item (admin)
- `DELETE /api/menu/:id` - Delete a menu item (admin)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders (admin, query param: `status`)
- `GET /api/orders/:id` - Get a specific order
- `PATCH /api/orders/:id/status` - Update order status (admin)

## Project Structure

```
restro/
├── server/
│   ├── models/
│   │   ├── MenuItem.js      # Menu item schema
│   │   └── Order.js         # Order schema
│   ├── controllers/
│   │   ├── menuController.js
│   │   └── orderController.js
│   └── routes/
│       ├── menu.js
│       └── orders.js
├── public/
│   ├── css/
│   │   └── style.css        # Styles for all pages
│   ├── js/
│   │   ├── main.js          # Customer interface logic
│   │   └── admin.js         # Admin dashboard logic
│   ├── index.html           # Customer interface
│   └── admin.html           # Admin dashboard
├── server.js                # Main server file
├── seed.js                  # Database seeding script
├── package.json
└── README.md
```

## Usage

### Customer Interface

1. Browse the menu by clicking on category filters
2. View AI recommendations when selecting a category
3. Add items to cart using the "Add to Cart" button
4. Adjust quantities in the cart using +/- buttons
5. Click "Checkout" to place an order
6. Fill in your details and submit the order

### Admin Dashboard

1. Navigate to `/admin`
2. **Menu Management Tab**:
   - Add new menu items using the "+ Add New Item" button
   - Edit existing items by clicking the "Edit" button
   - Delete items by clicking the "Delete" button
3. **Order History Tab**:
   - View all orders with customer details
   - Filter orders by status
   - Update order status using the dropdown
   - View detailed order information by clicking "View"

## AI Recommendations

The AI recommendation system suggests popular items based on the selected category. Currently, it returns the top items from each category. This can be enhanced with:
- Machine learning models for personalized recommendations
- Customer preference tracking
- Popular item analytics
- Collaborative filtering

## Error Handling

The application includes comprehensive error handling:
- Input validation on both client and server (email format, quantity limits, XSS prevention)
- Database connection error handling
- API error responses with appropriate status codes
- User-friendly error messages
- Sanitized inputs to prevent injection attacks

## Security Considerations

**⚠️ IMPORTANT: This is a demonstration application. Before deploying to production:**

Current security implementations:
- ✅ Input validation (email format, length limits)
- ✅ XSS prevention (HTML tag filtering in inputs)
- ✅ Quantity validation (1-99 limit)
- ✅ Notes length limiting (500 characters)
- ✅ Email sanitization (trimming, lowercase)

**Required for production:**
- ❌ **Authentication and authorization** - Admin routes are currently unprotected
- ❌ **JWT tokens or session management** - No user authentication implemented
- ❌ **Rate limiting** - API endpoints can be abused without limits
- ❌ **HTTPS/SSL certificates** - Deploy with secure connections
- ❌ **CORS configuration** - Currently allows all origins
- ❌ **Database access controls** - Secure MongoDB with authentication
- ❌ **Environment variable protection** - Use proper secrets management
- ❌ **Input sanitization library** - Consider using libraries like DOMPurify or validator.js
- ❌ **SQL/NoSQL injection prevention** - While using Mongoose helps, add additional validation
- ❌ **CSRF protection** - Add CSRF tokens for state-changing operations

## Future Enhancements

- User authentication and profiles
- Order tracking for customers
- Email notifications for orders
- Payment gateway integration
- Advanced search and filters
- Image upload for menu items
- Reviews and ratings
- Multi-language support
- Analytics dashboard

## License

ISC

## Author

Your Restaurant Team
