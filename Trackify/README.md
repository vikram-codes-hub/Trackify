# Trackify (Mini CRM)

Trackify is a full-stack Customer Relationship Management (CRM) and Task Management application. It is built with a modern web stack featuring a React frontend and a Node.js/Express backend.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query) & Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Formatting**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

- `/Frontend` - React client application
- `/Backend` - Node.js/Express server and REST API

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB account (Atlas) or local MongoDB instance

### Environment Variables

**Backend (`/Backend/.env`)**
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (`/Frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Trackify
   ```

2. **Start the Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   *The server will start on `http://localhost:5000`*

3. **Start the Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   *The client will start on `http://localhost:5173`*

## 📜 License
MIT License
