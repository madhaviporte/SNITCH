# Snitch

Snitch is a full-stack MERN e-commerce application built to provide a smooth online shopping experience. Users can browse products, add them to the cart, make secure payments, and manage their orders. The application also includes a seller dashboard for managing products and inventory.

## Features

- User Authentication (JWT)
- Google Login
- Browse Products
- Product Details
- Category-wise Products
- Shopping Cart
- Buy Now
- Razorpay Payment Integration
- Order Management
- Seller Dashboard
- Product Management
- Responsive Design
- Secure REST APIs

## Tech Stack

### Frontend
- React.js
- Vite
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Passport Google OAuth
- Razorpay

## Project Structure

```
Frontend/
Backend/
```

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

Frontend

```bash
cd Frontend
npm install
```

Backend

```bash
cd Backend
npm install
```

### Environment Variables

Create a `.env` file inside the Backend folder and add:

```env
PORT=3000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

RAZORPAY_KEY_ID=YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

CLIENT_URL=http://localhost:5173
```

### Run the project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

## Screens

- Home
- Login
- Register
- Product Listing
- Product Details
- Cart
- Checkout
- Order Success
- Seller Dashboard
- Create Product

## Future Improvements

- Wishlist
- Order Tracking
- Product Reviews
- Coupon System
- Admin Dashboard
- Email Notifications

## Author

**Madhavi Porte**

---

If you found this project useful, feel free to ⭐ the repository.
