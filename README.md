# Ticketing System - Laravel API + React Frontend

Sistem ticketing dengan arsitektur terpisah antara Backend (Laravel API) dan Frontend (React.js).

## 🚀 Quick Start

### Tim Backend
```bash
git clone https://github.com/Raihan3011/Ticketing-Pengajuan.git
cd Ticketing-Pengajuan
./backend-setup.bat
php artisan serve
```

### Tim Frontend
```bash
git clone https://github.com/Raihan3011/Ticketing-Pengajuan.git
cd Ticketing-Pengajuan
./frontend-setup.bat
cd frontend && npm start
```

## 📁 Struktur Project

```
Ticketing-Pengajuan/
├── Backend (Laravel API)
│   ├── app/Http/Controllers/Api/
│   ├── app/Models/
│   ├── routes/api.php
│   └── database/migrations/
├── Frontend (React.js)
│   ├── frontend/src/components/
│   ├── frontend/src/pages/
│   └── frontend/src/services/
└── Setup Scripts
    ├── backend-setup.bat
    ├── frontend-setup.bat
    └── postman_collection.json
```

## 🔧 Development

### Backend Team
- Fokus: `app/`, `routes/`, `database/`, `config/`
- API: `http://localhost:8000/api`
- Testing: Import `postman_collection.json`

### Frontend Team  
- Fokus: `frontend/src/`
- Dev Server: `http://localhost:3000`
- API Integration: Axios dengan JWT auth

## 📋 API Endpoints

```
POST /api/login
GET  /api/tickets
POST /api/tickets
GET  /api/categories
GET  /api/priorities
```

## 🛠 Tech Stack

- **Backend**: Laravel 12, Sanctum Auth, SQLite/MySQL
- **Frontend**: React 18, Axios, React Router
- **Styling**: Modern CSS, Responsive Design