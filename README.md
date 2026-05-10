# Trackify 🚀

A full-stack project management dashboard (Mini CRM) built for teams to manage projects and tasks efficiently with role-based access control.

## Live Demo

- **Frontend:** https://trackify-jet-eight.vercel.app
- **Backend API:** https://trackify-backend-0kbu.onrender.com

### Test Credentials

**Admin Account:**
- Email: `svdchjdgkcbkdbk@gmail.com`
- Password: `dgvbcgbdfugbciuiud`

**User Account:**
- Email: `Vikramsingh9475889367@gmail.com`
- Password: `vikramsingh`

## Tech Stack

**Frontend**
- React (Vite) + JavaScript
- Tailwind CSS
- Zustand (state management)
- React Query (server state)
- Axios + React Router DOM

**Backend**
- Node.js + Express.js
- PostgreSQL (Supabase) + Sequelize ORM
- JWT Authentication + Bcryptjs
- Express Validator

**Infrastructure**
- Frontend → Vercel
- Backend → Render
- Database → Supabase (PostgreSQL)
- CI/CD → GitHub Actions

## Features

### Admin
- 📊 Analytics dashboard (total projects, tasks, completion rate, overdue)
- 📈 Overall progress chart with team leaderboard
- 📋 Full project & task management (CRUD)
- 👥 Assign tasks to users with priority & due date
- 🔍 Search & filter tasks by status/priority
- 📄 Pagination for large datasets

### User
- 👀 View assigned projects and tasks
- ✅ Update task status (Todo → In Progress → Done)
- 🔍 Search & filter own tasks

## Architecture
Frontend (React/Vite) → REST API (Express) → PostgreSQL (Supabase)
↓                      ↓
Vercel               Render (Node.js)

## Setup Instructions

### Prerequisites
- Node.js v18+
- Supabase account (PostgreSQL)

### Backend Setup

```bash
cd Trackify/Backend
npm install
```

Create `.env`:
```env
PORT=5000
DB_HOST=your_supabase_host
DB_PORT=5432
DB_NAME=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd Trackify/Frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project (Admin) |
| GET | /api/projects/:id | Get single project |
| PUT | /api/projects/:id | Update project (Admin) |
| DELETE | /api/projects/:id | Delete project (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task (Admin) |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task (Admin) |

## CI/CD

GitHub Actions pipeline runs on every push to `main`:
- Backend: dependency install + syntax check
- Frontend: dependency install + build check

## Author

**Vikram Singh Gangwar**
- GitHub: [@vikram-codes-hub](https://github.com/vikram-codes-hub)
- Portfolio: [vikram-portfolio-blush.vercel.app](https://vikram-portfolio-blush.vercel.app)