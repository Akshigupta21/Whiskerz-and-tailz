# 🐾 Wiskers & Tails - Complete Pet Care Platform

A comprehensive e-commerce platform designed specifically for pet lovers in India, offering everything from pet products and food to services and adoption facilities.

## 🌟 Features

### 🛒 **E-Commerce Store**
- **Pet Products**: Toys, accessories, grooming supplies, bedding, and travel gear
- **Pet Food**: Premium food and treats for dogs, cats, birds, fish, and small pets
- **Smart Search**: Filter by pet type, category, brand, and price range
- **Shopping Cart**: Add to cart, quantity management, and secure checkout
- **Product Reviews**: Customer ratings and detailed product reviews

### 🐕 **Pet Services**
- **Grooming Services**: Professional pet grooming and spa treatments
- **Veterinary Care**: 24/7 veterinary consultation and emergency care
- **Training Services**: Basic and advanced pet training programs
- **Boarding & Daycare**: Safe pet boarding and daycare facilities
- **Pet Taxi**: Safe transportation for your furry friends

### 🏠 **Pet Adoption**
- **Adoption Centers**: Connect with local adoption agencies
- **Pet Profiles**: Browse available pets with detailed information
- **Adoption Process**: Streamlined adoption workflow
- **Agency Directory**: Find reputable adoption centers across India

### 📝 **Pet Care Blog**
- **Care Tips**: Expert advice on pet care in Indian climate
- **Health Articles**: Nutrition, wellness, and medical guidance
- **Training Guides**: Behavioral tips and training techniques
- **Pet Stories**: Heartwarming stories from the pet community

### 💳 **Payment Integration**
- **Razorpay Integration**: Secure payment processing
- **Multiple Payment Methods**: Cards, UPI, net banking, and wallets
- **Donation System**: Support pet welfare causes

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wiskers-and-tails.git
   cd wiskers-and-tails
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
   ```

   Create `.env` file in the `Backend` directory:
   ```env
   PORT=3001
   DATABASE_URI=mongodb://localhost:27017/wiskerzandtail
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Seed the database with sample data**
   ```bash
   cd Backend
   npm run seed:indian
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: `http://localhost:3002`
   - Backend API: `http://localhost:3001`

## 📁 Project Structure

```
wiskers-and-tails/
├── src/                          # React frontend
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   ├── Home/                    # Homepage components
│   ├── Product/                 # Product-related components
│   ├── Food/                    # Pet food components
│   ├── PetServices/             # Services components
│   ├── Header_Footer_Content/   # Layout components
│   ├── utils/                   # Utility functions
│   └── config/                  # Configuration files
├── Backend/                     # Express.js backend
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API route handlers
│   ├── controllers/             # Business logic
│   ├── services/                # Service layer
│   ├── middleware/              # Custom middleware
│   ├── scripts/                 # Database scripts
│   ├── config/                  # Backend configuration
│   └── docs/                    # API documentation
└── public/                      # Static assets
```

## 🔧 Backend Structure

```
Backend/
├── app.js                       # Main application entry point
├── package.json                 # Backend dependencies and scripts
├── jest.config.json            # Testing configuration
├── .env                        # Environment variables (not in repo)
├── config/
│   └── index.js                # Database and app configuration
├── controllers/                # Request handlers and business logic
│   ├── userController.js       # User management
│   ├── productController.js    # Product operations
│   ├── orderController.js      # Order processing
│   └── authController.js       # Authentication logic
├── middleware/                 # Custom middleware functions
│   ├── auth.js                 # JWT authentication middleware
│   ├── validation.js           # Request validation
│   ├── errorHandler.js         # Global error handling
│   └── security.js             # Security headers and CORS
├── models/                     # MongoDB/Mongoose schemas
│   ├── user.js                 # User schema
│   ├── product.js              # Product schema
│   ├── food.js                 # Pet food schema
│   ├── pet.js                  # Pet profile schema
│   ├── orders.js               # Order schema
│   ├── cart.js                 # Shopping cart schema
│   ├── service.js              # Services schema
│   ├── blogPost.js             # Blog content schema
│   ├── testimonial.js          # Customer reviews
│   ├── donation.js             # Donation records
│   └── adoptionAgency.js       # Adoption center schema
├── routes/                     # API route definitions
│   ├── authRoutes.js           # Authentication endpoints
│   ├── userRoutes.js           # User management routes
│   ├── productRoutes.js        # Product CRUD operations
│   ├── foodRoutes.js           # Pet food routes
│   ├── petRoutes.js            # Pet profile routes
│   ├── orderRoutes.js          # Order management
│   ├── cartRoutes.js           # Shopping cart operations
│   ├── serviceRoutes.js        # Pet services booking
│   ├── blogRoutes.js           # Blog content routes
│   ├── paymentRoutes.js        # Razorpay integration
│   ├── donationRoutes.js       # Donation processing
│   └── adoptionAgencyRoutes.js # Adoption center routes
├── services/                   # Business logic layer
│   ├── authService.js          # Authentication business logic
│   ├── userService.js          # User operations
│   ├── productService.js       # Product management
│   ├── orderService.js         # Order processing logic
│   ├── paymentService.js       # Payment processing
│   ├── emailService.js         # Email notifications
│   └── fileUploadService.js    # File handling
├── utils/                      # Utility functions
│   ├── logger.js               # Logging configuration
│   ├── validation.js           # Data validation helpers
│   ├── encryption.js           # Encryption utilities
│   └── apiResponse.js          # Standardized API responses
├── scripts/                    # Database and utility scripts
│   ├── seed.js                 # Basic data seeding
│   ├── seedAll.js              # Complete database seeding
│   ├── seedIndianWiskerzData.js # Indian market specific data
│   ├── seedFoods.js            # Pet food data seeding
│   ├── seedPetShops.js         # Pet shop data
│   └── migrate.js              # Database migrations
├── tests/                      # Test files
│   ├── api.test.js             # API endpoint tests
│   ├── setup.js                # Test environment setup
│   ├── auth.test.js            # Authentication tests
│   └── models.test.js          # Model validation tests
├── docs/                       # API documentation
│   ├── API_REFERENCE.md        # Complete API documentation
│   ├── AUTHENTICATION_GUIDE.md # Auth implementation guide
│   └── DONATION_PAYMENT_API.md # Payment integration docs
└── database/
    └── connect.js              # MongoDB connection setup
```

## 🛠️ Available Scripts

### Frontend Scripts
```bash
npm start          # Start development server (port 3002)
npm run build      # Build for production
npm test           # Run tests
npm run dev        # Start both frontend and backend
```

### Backend Scripts
```bash
npm run dev        # Start backend with nodemon
npm run start      # Start backend in production
npm run test       # Run backend tests
npm run seed       # Seed database with sample data
npm run lint       # Run ESLint
```

### Combined Scripts
```bash
npm run install-all  # Install all dependencies
npm run build-all    # Build both frontend and backend
npm run dev         # Start both frontend and backend
```

## 🗄️ Database Models

### Core Models
- **User**: Customer and business user profiles
- **Product**: Pet products and accessories
- **Food**: Pet food items with nutritional information
- **Pet**: Pet profiles for adoption
- **Order**: E-commerce orders and transactions
- **Service**: Pet services and bookings
- **Blog**: Articles and pet care content

### Supporting Models
- **Brand**: Product brands and manufacturers
- **Category**: Product and service categories
- **AdoptionAgency**: Pet adoption centers
- **Testimonial**: Customer reviews and testimonials
- **Cart**: Shopping cart management

## 🔐 Authentication & Security

- **JWT-based Authentication**: Secure user sessions
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin resource sharing security
- **Rate Limiting**: API request rate limiting
- **Security Headers**: Helmet.js for security headers

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products & Food
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/food` - Get pet food items
- `POST /api/cart` - Add to cart

### Services
- `GET /api/services` - Get all services
- `POST /api/bookings` - Book a service
- `GET /api/bookings/:userId` - Get user bookings

### Adoption
- `GET /api/pets` - Get pets for adoption
- `GET /api/adoption-agencies` - Get adoption centers
- `POST /api/adoption/apply` - Submit adoption application

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/donations` - Process donations

## 🎨 UI Components

- **Modern Design**: Clean, responsive interface
- **Lucide Icons**: Beautiful icon library
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 compliant components
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd Backend && npm test

# Test coverage
cd Backend && npm run test:coverage
```

## 📈 Performance

- **Image Optimization**: Optimized pet product images
- **API Caching**: Redis caching for frequently accessed data
- **Code Splitting**: React lazy loading for better performance
- **Bundle Optimization**: Webpack optimization for production builds

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'build' folder
```

### Backend (Railway/Heroku)
```bash
cd Backend
npm start
# Configure environment variables on your hosting platform
```

### Database (MongoDB Atlas)
- Set `DATABASE_URI` to your MongoDB Atlas connection string
- Configure network access and database users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@wiskersandtails.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/wiskers-and-tails/issues)
- 📖 Documentation: [API Docs](./Backend/docs/)

## 🎯 Roadmap

- [ ] Mobile App (React Native)
- [ ] AI-powered pet care recommendations
- [ ] Advanced booking system with calendar integration
- [ ] Multi-language support
- [ ] Real-time chat support
- [ ] Pet health tracking
- [ ] Social features for pet owners

---

**Made with ❤️ for pet lovers in India** 🇮🇳

*Wiskers & Tails - Where every tail has a story*
