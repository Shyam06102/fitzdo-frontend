# FITZDO E-Commerce Frontend

## Overview
The frontend of the FITZDO E-Commerce Platform is built with React.js and provides the user interface for browsing products, user authentication, and managing the shopping cart.

# Live App: https://fitzdo-frontend.vercel.app/

<img width="1816" height="793" alt="image" src="https://github.com/user-attachments/assets/680427ff-4a37-4499-9520-203faeecf3b5" />
<img width="1826" height="821" alt="image" src="https://github.com/user-attachments/assets/ca701ddb-c945-48ba-94b8-e982a1a161dd" />
<img width="1805" height="814" alt="image" src="https://github.com/user-attachments/assets/0a23eb6a-bb67-49ac-a438-de7198bc61ca" />
<img width="1815" height="818" alt="image" src="https://github.com/user-attachments/assets/8c3d1da3-0243-4336-9282-5fdffa3631b7" />

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Components](#components)
- [Routes](#routes)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features
- User authentication (Login/Register)
- Product listing with pagination and search
- Detailed product view
- Shopping cart functionality (localStorage)
- Responsive design with Tailwind CSS
- Protected routes
- Loading and error states
- Sort functionality

## Tech Stack
- React.js 18.x
- React Router v6
- Tailwind CSS
- Axios/Fetch API
- React Icons
- Custom Hooks and Context API

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

1. Clone the repository:
```bash
git clone <repository-url>
cd fitzdo-frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory if needed (though typically not required for basic frontend):

```env
REACT_APP_API_URL=http://localhost:5000 # Backend API URL
```

## Running the Application

### Development Mode
```bash
npm start
```
The application will run on `http://localhost:3000`

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

## Project Structure
```
fitzdo-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Header.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── FullProductListPage.js
│   │   └── ProductDetailPage.js
│   ├── utils/
│   │   └── auth.js
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
```

## Components

### Core Components
- `Header.js`: Reusable header component with search, user profile, and logout functionality
- `AuthContext.js`: Context provider for authentication state management

### Screen Components
- `LoginScreen.js`: Handles user login with email/password
- `RegisterScreen.js`: Handles user registration
- `FullProductListPage.js`: Displays paginated product listings with search and sort
- `ProductDetailPage.js`: Shows detailed product information

## Routes
- `/login` - User login page
- `/register` - User registration page
- `/products` - Product listing page
- `/products/:id` - Individual product detail page
- `/` - Home page (redirects to product listing)

## Authentication
- Uses `AuthContext` for centralized authentication state
- Stores JWT token in localStorage
- Provides `useAuth` hook for accessing authentication state
- Implements Protected Routes to restrict access to authenticated users only
- Includes automatic logout and token expiration handling

## Deployment
### Vercel
1. Push code to GitHub
2. Create account on Vercel
3. Import project from GitHub
4. Configure build settings
5. Deploy

### Netlify
1. Push code to GitHub
2. Create account on Netlify
3. Import project from GitHub
4. Configure build settings (`Build command`: `npm run build`, `Publish directory`: `build`)
5. Deploy

### Static Hosting
The built application in the `build` folder can be hosted on any static hosting service.

## Troubleshooting

### Common Issues
1. **API Calls Failing**
   - Verify backend server is running on `http://localhost:5000`
   - Check CORS settings in backend

2. **Images Not Loading**
   - Ensure placeholder image URLs (like `i.pravatar.cc`) are accessible
   - Check network connectivity

3. **Authentication Not Persisting**
   - Verify that localStorage is enabled in the browser
   - Check that the token is correctly stored after login
