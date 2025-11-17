# Expert Raah - Consultancy Marketplace Platform

A full-stack web application connecting clients with professional consultants across various domains including Education, Legal, Business, and more.

## 🌟 Features

- **Multi-Role Authentication:** Register as Client/Buyer, Consultant, or Admin
- **Professional Profiles:** Consultants can showcase their expertise, skills, and rates
- **Job Posting:** Clients can post detailed project requirements
- **Smart Bidding:** Consultants submit proposals with pricing and timelines
- **Real-Time Messaging:** Integrated chat system for seamless communication
- **Order Management:** Track project progress with milestones and payments
- **Verification System:** Document-based consultant verification
- **Responsive Design:** Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Winston Logger
- Jest Testing

### Frontend
- React 19
- TypeScript
- Vite
- React Router v6
- TanStack Query
- Axios
- CSS Modules

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB 7.x or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FYP
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expertraah
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
LOG_LEVEL=info
EOF

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/healthz

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 📁 Project Structure

```
FYP/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/
│   │   │   ├── consultant/
│   │   │   ├── job/
│   │   │   ├── messaging/
│   │   │   ├── order/
│   │   │   ├── proposal/
│   │   │   └── user/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business services
│   │   ├── utils/          # Utility functions
│   │   └── __tests__/      # Test suites
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # HTTP client
│   │   ├── components/     # React components
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── docker-compose.yml
```

## 🔑 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expertraah
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
LOG_LEVEL=info
```

### Frontend (optional)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "accountType": "consultant"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Jobs
```bash
# Create Job
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Legal",
  "title": "Legal Consultant Required",
  "description": "Need help with property documentation",
  "budget": { "min": 5000, "max": 10000 },
  "timeline": "2 weeks",
  "location": "Karachi, Pakistan",
  "skills": ["Contract Law", "Property Law"]
}

# Get All Jobs
GET /api/jobs?category=Legal&status=open&page=1&limit=10
Authorization: Bearer <token>
```

### Proposals
```bash
# Submit Proposal
POST /api/proposals
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "65abc123...",
  "bidAmount": 8000,
  "deliveryTime": "10 days",
  "coverLetter": "I have 5 years of experience..."
}

# Accept Proposal
PATCH /api/proposals/:id/accept
Authorization: Bearer <token>
```

### Messaging
```bash
# Send Message
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "65abc123...",
  "content": "Hello, I'm interested in your project"
}

# Get Conversations
GET /api/messages/conversations
Authorization: Bearer <token>

# Get Messages with User
GET /api/messages/:otherUserId?page=1&limit=50
Authorization: Bearer <token>
```

For complete API documentation, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 🧪 Testing

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:functional

# Watch mode
npm run test:watch
```

## 🏗️ Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Environment variable validation
- Rate limiting (configurable)

## 📊 Database Schema

### User
- Basic authentication and profile information
- Roles: buyer, consultant, admin
- Email uniqueness enforced

### Consultant
- Extended profile for consultants
- Professional details, skills, rates
- Verification documents
- Earnings and project stats

### Job
- Project postings by clients
- Budget, timeline, requirements
- Status tracking

### Proposal
- Bids submitted by consultants
- One proposal per consultant per job
- Acceptance/rejection workflow

### Order
- Active projects
- Milestone tracking
- Payment management

### Message & Conversation
- Real-time messaging
- Conversation threading
- Unread count tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Type:** Final Year Project (FYP)
- **Domain:** Consultancy Marketplace Platform
- **Year:** 2025

## 📞 Support

For support, email [support@expertraah.com](mailto:support@expertraah.com) or open an issue in the repository.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by freelancing platforms like Upwork and Fiverr
- Built with modern web technologies

---

**Note:** This is an educational project developed as part of a Final Year Project (FYP). It demonstrates full-stack development skills including REST API design, database modeling, authentication, real-time features, and responsive UI development.
