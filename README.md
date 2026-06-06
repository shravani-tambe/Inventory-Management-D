# 📦 Smart Inventory & Warehouse Management System

A professional full-stack inventory management system built with React, Flask, and PostgreSQL.
Designed as a multi-module, multi-developer enterprise project.

![Dashboard Preview](docs/dashboard-preview.png)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios, React Bootstrap |
| Backend | Python, Flask, SQLAlchemy, Flask-Migrate |
| Database | PostgreSQL 15 |
| Styling | Bootstrap 5, Custom CSS |
| Notifications | React Hot Toast |
| Icons | React Icons (Feather) |

---

## 📁 Project Structure

```
smart-inventory-system/
├── backend/                  → Flask REST API
│   ├── app/
│   │   ├── api/v1/           → Route blueprints (products, categories, suppliers)
│   │   ├── models/           → SQLAlchemy database models
│   │   ├── services/         → Business logic layer
│   │   ├── utils/            → Response helpers, error handlers
│   │   └── config/           → App settings and DB config
│   ├── migrations/           → Flask-Migrate schema versions
│   ├── run.py                → Flask entry point
│   ├── requirements.txt      → Python dependencies
│   └── .env.example          → Environment variable template
│
├── frontend/                 → React Application
│   ├── public/
│   │   └── index.html        → App shell with embedded CSS design system
│   └── src/
│       ├── components/       → Reusable UI components
│       ├── pages/            → Dashboard, Products, Categories, Suppliers
│       ├── services/         → Axios API service layer
│       └── App.jsx           → Route definitions
│
└── docs/                     → Architecture diagrams and notes
```

---

## 🚀 Getting Started

Follow the setup guide for your operating system.

---

## 🍎 macOS Setup

### Prerequisites

Install Homebrew if not already installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

For Apple Silicon (M1/M2), add Homebrew to PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Install required software:

```bash
brew install node python@3.11 postgresql@15
brew services start postgresql@15
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Verify installations:

```bash
node --version        # v20+
python3 --version     # 3.11+
psql --version        # 15+
```

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-inventory-system.git
cd smart-inventory-system
```

### 2. Database Setup

```bash
psql postgres
```

```sql
CREATE DATABASE inventory_management_db;
CREATE USER inventory_user WITH PASSWORD 'inventory_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE inventory_management_db TO inventory_user;
\q
```

### 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
```

Open `.env` and fill in your values:

```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://inventory_user:inventory_pass_2024@localhost:5432/inventory_management_db
FRONTEND_URL=http://localhost:3000
```

Run database migrations:

```bash
flask db upgrade
```

Start the backend server:

```bash
flask run
```

Backend runs at `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal tab:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```bash
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

Start the frontend:

```bash
npm start
```

Frontend opens at `http://localhost:3000`

---

## 🪟 Windows Setup

### Prerequisites

**Install Node.js:**
- Download from https://nodejs.org (LTS version)
- Run the installer — check "Add to PATH" during setup
- Verify: open Command Prompt → `node --version`

**Install Python:**
- Download from https://www.python.org/downloads
- During installation check **"Add Python to PATH"**
- Verify: `python --version`

**Install PostgreSQL:**
- Download from https://www.postgresql.org/download/windows
- Run the installer
- During setup remember the password you set for the `postgres` user
- Default port: `5432` — leave as is
- After installation, add PostgreSQL to PATH:
  - Search "Environment Variables" in Start Menu
  - Under System Variables → find `Path` → click Edit
  - Add: `C:\Program Files\PostgreSQL\15\bin`
  - Click OK → restart Command Prompt
- Verify: `psql --version`

**Install Git:**
- Download from https://git-scm.com/download/windows
- Use all default options during install

> **Tip for Windows users:** Use **Git Bash** (installed with Git) instead of Command Prompt for all commands below. It behaves like a Mac/Linux terminal.

---

### 1. Clone the Repository

Open Git Bash:

```bash
git clone https://github.com/YOUR_USERNAME/smart-inventory-system.git
cd smart-inventory-system
```

### 2. Database Setup

Open **pgAdmin** (installed with PostgreSQL) or use psql in Git Bash:

```bash
psql -U postgres
```

Enter the password you set during PostgreSQL installation, then run:

```sql
CREATE DATABASE inventory_management_db;
CREATE USER inventory_user WITH PASSWORD 'inventory_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE inventory_management_db TO inventory_user;
\q
```

### 3. Backend Setup

In Git Bash:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
```

> **Note:** On Windows the activate script is at `venv/Scripts/activate` not `venv/bin/activate`

You should see `(venv)` in your prompt. Now install dependencies:

```bash
pip install -r requirements.txt
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` in VS Code and fill in:

```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://inventory_user:inventory_pass_2024@localhost:5432/inventory_management_db
FRONTEND_URL=http://localhost:3000
```

Run database migrations:

```bash
flask db upgrade
```

Start the backend:

```bash
flask run
```

Backend runs at `http://localhost:5000`

### 4. Frontend Setup

Open a **second Git Bash window**:

```bash
cd frontend
npm install
```

Create the environment file:

```bash
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

Start the frontend:

```bash
npm start
```

Frontend opens at `http://localhost:3000`

---

## ✅ Verify Everything is Working

With both servers running, open your browser:

| URL | Expected Result |
|---|---|
| `http://localhost:5000/api/health` | `{"status": "healthy"}` |
| `http://localhost:5000/api/v1/categories/` | JSON list of categories |
| `http://localhost:3000` | Dashboard UI loads |

---

## 🔌 API Endpoints

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/categories/` | List all categories |
| POST | `/api/v1/categories/` | Create category |
| GET | `/api/v1/categories/<id>` | Get category by ID |
| PUT | `/api/v1/categories/<id>` | Update category |
| DELETE | `/api/v1/categories/<id>` | Delete category |

### Suppliers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/suppliers/` | List all suppliers |
| POST | `/api/v1/suppliers/` | Create supplier |
| GET | `/api/v1/suppliers/<id>` | Get supplier by ID |
| PUT | `/api/v1/suppliers/<id>` | Update supplier |
| DELETE | `/api/v1/suppliers/<id>` | Delete supplier |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products/` | List all products |
| GET | `/api/v1/products/?search=keyboard` | Search products |
| GET | `/api/v1/products/?category_id=1` | Filter by category |
| POST | `/api/v1/products/` | Create product |
| GET | `/api/v1/products/<id>` | Get product by ID |
| PUT | `/api/v1/products/<id>` | Update product |
| DELETE | `/api/v1/products/<id>` | Delete product |
| GET | `/api/v1/products/dashboard/stats` | Dashboard summary |

---

## 🛠️ Daily Development Workflow

Every time you open the project to work on it:

**macOS:**
```bash
# Terminal 1 — Backend
cd smart-inventory-system/backend
source venv/bin/activate
flask run

# Terminal 2 — Frontend
cd smart-inventory-system/frontend
npm start
```

**Windows (Git Bash):**
```bash
# Terminal 1 — Backend
cd smart-inventory-system/backend
source venv/Scripts/activate
flask run

# Terminal 2 — Frontend
cd smart-inventory-system/frontend
npm start
```

---

## 👥 Team Module Structure

| Module | Responsibility | Developer |
|---|---|---|
| Module 1 | Products, Categories, Suppliers | Member 1 |
| Module 2 | Inventory & Warehouse Management | Member 2 |
| Module 3 | Purchase Orders & Sales Orders | Member 3 |
| Module 4 | Auth, Analytics, Alerts, Docker | Member 4 |

---

## 🗄️ Database Schema

```
categories          suppliers
----------          ---------
id (PK)             id (PK)
name                name
description         contact_person
created_at          email
updated_at          phone
                    address
                    created_at
                    updated_at
        \               /
         \             /
          \           /
           products
           --------
           id (PK)
           category_id (FK → categories)
           supplier_id (FK → suppliers)
           name
           sku
           price
           description
           reorder_level
           created_at
           updated_at
```

---

## ⚠️ Common Issues & Fixes

**`flask: command not found`**
→ Virtual environment is not activated. Run `source venv/bin/activate` (Mac) or `source venv/Scripts/activate` (Windows)

**`psycopg2 error` on Windows**
→ Run: `pip install psycopg2-binary --force-reinstall`

**`CORS error` in browser console**
→ Confirm `FRONTEND_URL=http://localhost:3000` is in `backend/.env` and restart Flask

**`Module not found` errors in React**
→ Run `npm install` inside the `frontend/` folder

**`relation does not exist` PostgreSQL error**
→ Migrations haven't run. Run: `flask db upgrade`

**Port 5000 already in use (macOS)**
→ macOS AirPlay uses port 5000. Disable it: System Preferences → Sharing → uncheck AirPlay Receiver. Or change Flask port: `flask run --port 5001` and update `REACT_APP_API_URL` in `frontend/.env`

---

## 📄 License

This project is for educational and portfolio purposes.