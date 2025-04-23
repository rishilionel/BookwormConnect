# DiwaliDelights - E-commerce Platform

A modern e-commerce web application for selling Diwali items, built with React, Express, and PostgreSQL.

![DiwaliDelights](https://images.unsplash.com/photo-1604422230737-a31c4523ea68?ixlib=rb-4.0.3&w=1200&h=400&fit=crop&crop=center)

## 🎆 Features

- **Product Catalog**: Browse a wide range of Diwali products organized by categories
- **Shopping Cart**: Add items to cart, update quantities, and manage your shopping cart
- **Checkout Process**: Complete user-friendly checkout process
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Search Functionality**: Find products quickly with the search feature
- **Featured & Trending Products**: Discover popular and featured items
- **Persistent Storage**: All data is stored in a PostgreSQL database

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling and responsive design
- **shadcn/ui** - UI component library
- **Zustand** - State management
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Wouter** - Routing
- **React Icons** - Icon library

### Backend
- **Express** - Web server framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation

## 📦 Project Structure

```
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Backend code
│   ├── db.ts              # Database connection
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── vite.ts            # Vite configuration for server
├── shared/                # Shared code between client and server
│   └── schema.ts          # Database schema definitions
├── components.json        # UI components configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json           # Project dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 📋 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/category/:slug` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/featured-products` - Get featured products
- `GET /api/trending-products` - Get trending products

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/session/:sessionId` - Clear cart

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd diwali-delights
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/diwali_delights
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at:
   ```
   http://localhost:5000
   ```

## 💾 Database Schema

### Users
- `id` - Primary key
- `username` - User's username
- `email` - User's email address
- `password_hash` - Hashed password
- `created_at` - Timestamp

### Categories
- `id` - Primary key
- `name` - Category name
- `slug` - URL-friendly name
- `description` - Category description
- `image_url` - Category image

### Products
- `id` - Primary key
- `name` - Product name
- `slug` - URL-friendly name
- `description` - Product description
- `price` - Product price
- `compare_at_price` - Original price (for discounts)
- `image_url` - Product image
- `category_id` - Foreign key to categories
- `stock` - Available stock
- `is_featured` - Featured product flag
- `is_trending` - Trending product flag
- `badge` - Product badge (e.g., "Sale", "New")
- `rating` - Product rating
- `review_count` - Number of reviews

### Cart Items
- `id` - Primary key
- `session_id` - Session identifier
- `product_id` - Foreign key to products
- `quantity` - Item quantity
- `created_at` - Timestamp

## 📱 Screenshots

### Home Page
![Home Page](https://images.unsplash.com/photo-1604422230737-a31c4523ea68?ixlib=rb-4.0.3&w=600&h=400&fit=crop&crop=center)

### Product Listing
![Product Listing](https://images.unsplash.com/photo-1605696005660-83852c140bde?ixlib=rb-4.0.3&w=600&h=400&fit=crop&crop=center)

### Product Detail
![Product Detail](https://images.unsplash.com/photo-1604422744102-3b0c4e44b873?ixlib=rb-4.0.3&w=600&h=400&fit=crop&crop=center)

### Shopping Cart
![Shopping Cart](https://images.unsplash.com/photo-1601286794092-d7e3215ba03d?ixlib=rb-4.0.3&w=600&h=400&fit=crop&crop=center)

## 🔄 Future Enhancements

- User authentication and registration
- User profiles and order history
- Payment gateway integration
- Admin dashboard for inventory management
- Wish list functionality
- Product reviews and ratings
- Email notifications for orders
- Related products suggestions

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

📅 Created: April 2023