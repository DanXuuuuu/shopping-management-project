# shopping-management-project
Full-stack e-commerce platform built with MERN stack (MongoDB, Express.js, React, Node.js), Redux, and Redux Thunk. Features user authentication, product management, shopping cart, and checkout functionality.


# E-Commerce Platform

A full-featured e-commerce web application with complete user authentication, product browsing, and checkout system.

## Features

### User Management
- User registration and login
- Password change functionality
- User profile management

### Product Features
- Product catalog with detailed product pages
- Product search and filtering
- Product images and descriptions
- Shopping cart functionality

### Shopping & Checkout
- Add/remove items from cart
- Checkout process
- Order management

## Tech Stack

**Frontend:**
- React
- Redux (State Management)
- Redux Thunk (Async Actions)

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)

## Team Members
- Chunren Lian  
- Dan Xu 
- Xinrui Shi 

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm

### Setup

1. Clone the repository
```bash
git clone https://github.com/DanXuuuuu/repository-name.git
cd repository-name
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create .env file in backend folder
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. Run the application

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

The application will run on `http://localhost:3000`

## Project Structure
```
project-root/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── redux/
    │   └── App.js
    └── package.json
```

## Contributing
1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Create a Pull Request
 
