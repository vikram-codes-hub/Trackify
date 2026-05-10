<div align="center">
  <img src="Frontend/public/vite.svg" alt="Logo" width="80" height="80">
  <h1 align="center">Trackify ⚡</h1>
  <p align="center">
    <strong>A Premium, Full-Stack Project & Task Management Mini-CRM</strong>
  </p>
</div>

---

## 📖 Overview

**Trackify** is a sleek, high-performance Mini-CRM and Project Management application built to help teams organize their work effortlessly. It acts as a simplified Jira or Trello, allowing Administrators to create projects, invite members, and assign tasks, while Users can track their responsibilities and update task statuses in real-time.

Recently overhauled from MongoDB to a robust relational architecture using **PostgreSQL**, Trackify features a stunning, custom-built dark-mode UI with glassmorphism, subtle animations, and high-performance state management.

---

## ✨ Key Features

### 🛡️ Role-Based Access Control (RBAC)
- **Admins**: Full control. Can create projects, manage project members, create tasks, and assign tasks to any user in the system.
- **Users**: Focused view. Can only see projects they are members of (or have tasks assigned in). Can view tasks and update the status of tasks assigned to them, but cannot delete or reassign them.

### 📊 Project & Task Management
- **Projects**: Group tasks logically. Projects have titles, descriptions, creators, and assigned members.
- **Tasks**: Units of work with Status (`Todo`, `In Progress`, `Done`), Priority (`Low`, `Medium`, `High`), Due Dates, and Assignees.
- **Real-time Analytics**: Visual progress bars and statistical counters for project completion rates.

### 🎨 Premium User Interface
- **Design System**: Fully bespoke CSS-variable architecture with a gorgeous dark theme (`#080B14` and `#0D1117`).
- **Glassmorphism**: Beautiful blurred backdrops and card hover effects (`backdrop-filter: blur(20px)`).
- **Micro-Animations**: Staggered fade-up entry animations, dynamic hover states, and glowing accents.
- **Responsiveness**: Mobile-first design that seamlessly scales to desktop monitors.

---

## 🛠️ Tech Stack

### 🖥️ Frontend (Client)
- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/) for lightning-fast HMR.
- **Styling**: Vanilla CSS variable-based Design System (migrated away from heavy Tailwind utility classes for better maintainability and performance).
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Global Auth state).
- **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query/latest) + Axios.
- **Routing**: React Router DOM v6.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Notifications**: React Hot Toast.

### ⚙️ Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Hosted on Supabase).
- **ORM**: Sequelize (with rigorous association mapping and cascade deletes).
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for secure password hashing.
- **Validation**: `express-validator` for strict payload checking.

---

## 🗄️ Database Schema (PostgreSQL)

Trackify uses a deeply relational database model:

1. **Users Table**: Stores authentication credentials, names, and roles (`admin` | `user`).
2. **Projects Table**: Stores project metadata and links to the `User` who created it (`createdById`).
3. **Tasks Table**: Stores task details, linking to the parent `Project` (`projectId`) and the assigned `User` (`assignedToId`).
4. **ProjectMembers Table**: A junction/through table managing the many-to-many relationship between `Projects` and `Users` (who has access to what).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL Database** (Local instance, or a cloud provider like Supabase/Neon).

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Trackify.git
cd Trackify
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd Backend
npm install
```

Create a `.env` file in the `/Backend` directory:
```env
PORT=5000

# PostgreSQL Connection settings (Example for Supabase)
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.your_project_ref
DB_PASSWORD=your_secure_password

# Authentication Secrets
JWT_SECRET=super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
# The server will output: "Database connected." & "Server running on port 5000"
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and configure the API url.

```bash
cd Frontend
npm install
```

Create a `.env` file in the `/Frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# The application will be available at http://localhost:5173
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| **POST** | `/api/auth/register` | Register a new account | No | Any |
| **POST** | `/api/auth/login` | Authenticate & get JWT | No | Any |
| **GET** | `/api/auth/me` | Get current user profile | Yes | Any |
| **GET** | `/api/users` | Get all users (for dropdowns) | Yes | Admin |
| **GET** | `/api/projects` | List projects (filtered by access)| Yes | Any |
| **POST** | `/api/projects` | Create a new project | Yes | Admin |
| **GET** | `/api/projects/:id`| Get project details & tasks | Yes | Any |
| **GET** | `/api/tasks` | Get paginated & filtered tasks | Yes | Any |
| **POST** | `/api/tasks` | Create a task in a project | Yes | Admin |
| **PUT** | `/api/tasks/:id` | Update a task (status/details) | Yes | Any/Admin*|
| **DELETE**| `/api/tasks/:id` | Delete a task | Yes | Admin |

*\* Note: Users can only update tasks assigned to them, and can only update specific fields (like `status`). Admins can update all fields.*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

## 📄 License
This project is licensed under the MIT License.
