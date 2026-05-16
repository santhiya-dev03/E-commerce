# 🛒 E-Commerce Store

A full-stack, production-ready e-commerce platform built with Node.js, Express, and Supabase. This application provides a seamless shopping experience with real-time database integration and secure authentication.

## 🚀 Overview

This project is a modern e-commerce solution that handles everything from product discovery to order fulfillment. It features a clean, responsive frontend and a robust backend architecture designed for scalability and security.

### Key Features
- **User Authentication**: Secure signup and login powered by Supabase and JWT (JSON Web Tokens).
- **Product Management**: Dynamic product catalog with detailed views.
- **Shopping Cart**: Real-time cart management (Add/Remove/Update items).
- **Order Processing**: Complete checkout flow and order history tracking.
- **Secure Backend**: Password hashing with `bcryptjs` and middleware-protected routes.

## 🛠️ Tech Stack

### Frontend
- **HTML5 & CSS3**: Semantic structure and custom styling for a premium UI.
- **Vanilla JavaScript**: Lightweight and fast client-side logic without heavy frameworks.

### Backend
- **Node.js**: Scalable server-side runtime.
- **Express.js**: Minimalist web framework for routing and middleware.
- **Supabase**: Backend-as-a-Service (BaaS) for PostgreSQL database and real-time features.

### Security & Utilities
- **JWT**: Secure authentication tokens.
- **Bcrypt.js**: High-performance password hashing.
- **Dotenv**: Environment variable management.
- **Cookie-Parser**: Handling client-side cookies for session management.

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/santhiya-dev03/E-commerce.git
   cd E-commerce
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Database Setup**
   Use the provided `schema.sql` file to set up your Supabase/PostgreSQL database tables.

5. **Run the Application**
   ```bash
   node server.js
   ```
   The server will be running on the dynamically assigned port.

## 📂 Project Structure
- `/controllers`: Backend logic for handling API requests.
- `/routes`: Express route definitions for Auth, Products, Cart, and Orders.
- `/middleware`: Authentication and authorization filters.
- `/public`: Static frontend assets (HTML, CSS, JS).
- `/schema.sql`: Database schema definitions.

## 📄 License
This project is licensed under the ISC License.
