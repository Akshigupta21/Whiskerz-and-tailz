# Pet Lover Backend API

A comprehensive REST API for a pet store application built with Node.js, Express, and MongoDB. Features robust validation, security middleware, authentication, and authorization.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Comprehensive Validation**: Input validation using express-validator with custom validators
- **Security**: Helmet, rate limiting, data sanitization, CORS protection
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Structured logging with file output
- **File Uploads**: Secure file upload with validation
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Well-documented endpoints
- **Testing Ready**: Jest setup for unit and integration tests

## 📋 Prerequisites

- Node.js (>=16.0.0)
- npm (>=8.0.0)
- MongoDB (>=5.0)

## 🛠 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/pet-lover-backend.git
cd pet-lover-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Using MongoDB service
sudo service mongod start

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start

# Debug mode
npm run dev:debug
```

## 🔧 Environment Variables

### Required
```env
JWT_SECRET=your-super-secure-jwt-secret
DATABASE_URI=mongodb://localhost:27017/wiskerzandtail
```

### Optional (with defaults)
```env
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-session-secret
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

See `.env.example` for all available options.

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

### Protected Endpoints

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Admin Endpoints

Admin endpoints require the user to have an `admin` role:
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🏗 Project Structure

```
Backend/
├── config/              # Configuration files
│   └── index.js        # Main configuration
├── controllers/         # Route controllers
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   ├── errorHandler.js # Error handling
│   ├── security.js     # Security middleware
│   └── validation.js   # Validation rules
├── models/             # Mongoose models
│   ├── user.js
│   ├── pet.js
│   └── ...
├── routes/             # Express routes
│   ├── userRoutes.js
│   └── ...
├── services/           # Business logic
├── utils/              # Utility functions
│   ├── helpers.js
│   └── logger.js
├── logs/               # Log files
├── uploads/            # File uploads
├── .env.example        # Environment template
├── app.js             # Application entry point
└── package.json       # Dependencies and scripts
```

## 🔒 Security Features

### Authentication
- JWT tokens with secure signing
- Password hashing with bcrypt (12 rounds)
- Session management with MongoDB store
- Account lockout after failed attempts

### Input Validation
- Email format validation
- Strong password requirements
- Phone number validation
- File upload validation
- XSS protection
- NoSQL injection prevention

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Request size limits
- User-Agent validation

### Data Protection
- Password field exclusion in responses
- Sensitive data sanitization
- Secure cookie configuration
- Environment variable protection

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm run dev           # Start development server
npm run start         # Start production server
npm run test          # Run tests
npm run lint          # Lint code
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run logs          # View application logs
npm run security-check # Run security audit
```

## 🔄 Database Models

### User Model
- Authentication fields (email, password)
- Profile information (firstName, lastName, phone)
- Role-based access (user, admin)
- Addresses array
- Timestamps and activity tracking

### Pet Model
- Basic information (name, species, breed)
- Physical attributes (age, weight, gender)
- Adoption details (fee, availability)
- Images and description

### Product Model
- Product details (name, description, price)
- Inventory tracking (stock quantity)
- Category and brand associations
- Images and specifications

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔍 Monitoring

### Health Check
```http
GET /api/health
```

Returns server status and basic information.

### Logs
Application logs are stored in the `logs/` directory:
- `info.log` - General application logs
- `warn.log` - Warning messages
- `error.log` - Error messages
- `debug.log` - Debug information (development only)

## 🔧 Development

### Code Style
- ESLint for linting
- Prettier for formatting
- Consistent naming conventions
- Comprehensive error handling

### Git Hooks
- Pre-commit validation
- Lint and test before commit
- Automatic formatting

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure CORS origins
5. Set up process manager (PM2)

### Production Considerations
- Use environment variables for secrets
- Enable MongoDB replica set
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Enable log rotation
- Set up monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run `npm run validate`
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Issues

Report issues at: https://github.com/your-org/pet-lover-backend/issues

## 📞 Support

For support, email support@wiskerzandtail.com or join our Slack channel.
