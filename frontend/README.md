# Ticketing System Frontend

Frontend React.js untuk sistem ticketing yang berkomunikasi dengan Laravel API.

## Struktur Folder

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable components
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   └── TicketCard.js
│   ├── pages/              # Page components
│   │   ├── Dashboard.js
│   │   └── CreateTicket.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.js              # Main app component
│   ├── App.css
│   ├── index.js            # Entry point
│   └── index.css
├── package.json
└── .env
```

## Fitur

- **Authentication**: Login/logout dengan JWT token
- **Dashboard**: Menampilkan daftar tiket dengan filter
- **Create Ticket**: Form untuk membuat tiket baru
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: Komunikasi dengan Laravel backend

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
File `.env` sudah dikonfigurasi untuk:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm start
```
Frontend akan berjalan di `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Components

### Login Component
- Handle user authentication
- Form validation
- Error handling
- JWT token storage

### Dashboard Component  
- Display tickets in grid layout
- Filter by status, priority, category
- Pagination support
- Responsive design

### CreateTicket Component
- Form untuk membuat tiket baru
- Dynamic dropdown dari API
- Form validation
- Success/error feedback

### TicketCard Component
- Reusable card untuk menampilkan tiket
- Color-coded priority
- Click handler untuk detail

## API Integration

### Authentication
```javascript
// Login
const response = await authAPI.login({ email, password });
localStorage.setItem('token', response.data.token);

// Get current user
const user = await authAPI.me();
```

### Tickets
```javascript
// Get all tickets
const tickets = await ticketAPI.getAll();

// Create ticket
const newTicket = await ticketAPI.create({
  title: 'Bug Report',
  description: 'Description here',
  category_id: 1,
  priority_id: 2
});
```

## Styling

- Modern CSS dengan Flexbox/Grid
- Responsive design untuk mobile
- Color-coded priority system
- Hover effects dan transitions
- Professional UI/UX

## Production Build

```bash
npm run build
```

Build folder dapat di-deploy ke:
- Netlify
- Vercel  
- Apache/Nginx
- AWS S3 + CloudFront