# 📋 TaskFlow — Smart Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) task management application with priority-based organization, calendar visualization, kanban board, and analytics dashboard.

![TaskFlow Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Core (P0)
- **User Authentication** — Sign up / login with email & password, JWT sessions, bcrypt hashing
- **Task CRUD** — Create, read, update, delete tasks with instant UI updates
- **Task Attributes** — Priority (High/Medium/Low), categories, due dates with validation
- **Data Isolation** — 100% multi-user data separation

### Advanced (P1)
- **Search & Filter** — Debounced search (300ms), filter by priority/category/status, combined filters
- **Calendar View** — Monthly calendar with task dots, click-to-view, create task from date
- **Dark/Light Mode** — Theme toggle with localStorage persistence
- **Responsive Design** — Mobile, tablet, and desktop layouts

### Premium (P2)
- **Kanban Board** — Drag & drop tasks between To Do, In Progress, and Done columns
- **Analytics Dashboard** — Completion ring chart, priority bars, category breakdown, recent activity

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, React Router, Framer Motion, Axios, date-fns |
| **Backend** | Node.js + Express, JWT, bcryptjs, express-validator |
| **Database** | MongoDB + Mongoose |
| **Security** | Helmet.js, express-rate-limit, CORS |
| **UI** | Custom CSS design system, glassmorphism, Inter font |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fsd

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-task-manager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### Running

```bash
# Terminal 1: Start backend (port 5000)
cd server
npm run dev      # with nodemon (auto-restart)
# or
node server.js   # without nodemon

# Terminal 2: Start frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
fsd/
├── prd.md                          # Product Requirements Document
├── .gitignore
│
├── server/                         # Express Backend
│   ├── server.js                   # Entry point
│   ├── .env                        # Environment variables
│   ├── config/db.js                # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validate.js             # Request validation
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt)
│   │   └── Task.js                 # Task schema (indexed)
│   ├── controllers/
│   │   ├── authController.js       # Register, login, getMe
│   │   └── taskController.js       # CRUD, search, filter, stats
│   └── routes/
│       ├── auth.js                 # Auth routes
│       └── tasks.js                # Task routes
│
└── client/                         # React Frontend (Vite)
    ├── index.html
    ├── vite.config.js              # Vite + proxy config
    └── src/
        ├── main.jsx                # Entry point
        ├── App.jsx                 # Routing & providers
        ├── index.css               # Design system (CSS vars)
        ├── api/axios.js            # Axios with JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx     # Auth state
        │   └── ThemeContext.jsx    # Dark/light mode
        ├── hooks/
        │   ├── useTasks.js         # Task CRUD & filters
        │   └── useDebounce.js      # Debounced values
        ├── pages/
        │   ├── Login.jsx           # Login page
        │   ├── Register.jsx        # Registration page
        │   ├── Dashboard.jsx       # Main task view
        │   ├── Calendar.jsx        # Calendar view
        │   ├── Kanban.jsx          # Kanban board
        │   └── Analytics.jsx       # Dashboard analytics
        ├── components/
        │   ├── Layout/             # Navbar, Sidebar, ProtectedRoute
        │   ├── Tasks/              # TaskCard, TaskList, TaskForm, Filters, Search
        │   └── UI/                 # Modal, Loader, EmptyState
        └── utils/
            ├── constants.js        # Priorities, categories, sort options
            └── helpers.js          # Date formatting, error parsing
```

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create account | No |
| POST | `/login` | Login & get token | No |
| GET | `/me` | Get current user | Yes |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List tasks (search/filter/sort/page) | Yes |
| POST | `/` | Create task | Yes |
| PUT | `/:id` | Update task | Yes |
| DELETE | `/:id` | Delete task | Yes |
| PATCH | `/:id/toggle` | Toggle completion | Yes |
| GET | `/categories` | Get user categories | Yes |
| GET | `/stats` | Get task statistics | Yes |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## 🎨 Design System

- **Primary:** `#6C5CE7` (Indigo)
- **Accent:** `#00D2D3` (Teal)
- **Priority:** 🔴 High `#FF6B6B` · 🟡 Medium `#FECA57` · 🟢 Low `#48C774`
- **Font:** Inter (Google Fonts)
- **Effects:** Glassmorphism, gradient backgrounds, Framer Motion animations

---

## 📄 License

MIT
