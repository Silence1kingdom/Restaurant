# koshari101 - Egyptian Street Food in Italy

A full-stack web application for koshari101, an authentic Egyptian street food restaurant located in Porta Venezia, Milan, Italy.

![koshari101](https://img.shields.io/badge/koshari101-Egyptian%20Street%20Food-amber)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb)

## Features

### Frontend
- **Modern React + TypeScript** with Vite for fast development
- **Responsive Design** with Tailwind CSS and shadcn/ui components
- **Dark/Light Mode** support with system preference detection
- **Bilingual Support** (English & Arabic) with RTL layout
- **Smooth Animations** with Framer Motion
- **Shopping Cart** with local storage persistence
- **Online Ordering** with Stripe payment integration

### Backend
- **RESTful API** with Express.js
- **JWT Authentication** with role-based access control
- **MongoDB Database** with Mongoose ODM
- **Stripe Payment** integration
- **Email Notifications** with Nodemailer
- **Security** with Helmet, CORS, and Rate Limiting

### Admin Dashboard
- **Menu Management** - Add, edit, delete menu items
- **Order Management** - Track and update order status
- **Customer Management** - View customer data
- **Review Management** - Approve and manage reviews
- **Analytics** - View sales statistics

## Tech Stack

### Frontend
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Zustand (State Management)
- i18next (Internationalization)
- Framer Motion (Animations)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Stripe (Payments)
- Nodemailer (Emails)
- Cloudinary (Image Upload)

## Project Structure

```
koshari101/
├── app/                    # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Cart, Theme, I18n)
│   │   ├── i18n/          # Translation files (en, ar)
│   │   ├── layouts/        # Page layouts
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin dashboard pages
│   │   └── App.tsx        # Main application
│   └── package.json
│
├── backend/               # Backend Node.js Application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Main server file
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Stripe account (for payments)
- SMTP credentials (for emails)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/koshari101.git
cd koshari101
```

2. **Install Frontend Dependencies**
```bash
cd app
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Environment Variables**

Create `.env` file in the backend directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/koshari101

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `.env` file in the app directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

5. **Seed Database (Optional)**
```bash
cd backend
npm run seed
```

6. **Run the Application**

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd app
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `GET /api/menu/popular` - Get popular items
- `GET /api/menu/categories` - Get categories
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats` - Get order statistics (Admin)

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review (Admin)
- `PUT /api/reviews/:id/approve` - Approve review (Admin)
- `PUT /api/reviews/:id/reply` - Reply to review (Admin)

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/webhook` - Stripe webhook
- `GET /api/payment/status/:id` - Get payment status
- `POST /api/payment/refund` - Process refund (Admin)

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Heroku)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update MONGODB_URI in environment variables

## Business Information

**koshari101**
- Address: Via Panfilo Castaldi 23, Porta Venezia, Milan, Italy
- Phone: +39 392 475 6960
- Email: info@koshari101.com

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspired by authentic Egyptian street food culture
- Icons by Lucide
- UI Components by shadcn/ui
- Images from Unsplash

---

Made with ❤️ for koshari101 - Bringing Egypt to Italy
