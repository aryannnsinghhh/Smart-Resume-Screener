# SmartResume AI - Modern Frontend

A modern, responsive React frontend for the SmartResume AI Screening system, built with **Vite**, **TailwindCSS**, **Anime.js**, and **React Router**.

## Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Anime.js** - Smooth animations
- **React Router** - Client-side routing
- **HeadlessUI** - Unstyled, accessible components

## Project Structure

```
frontend/
├── src/
│   ├── animations/        # Reusable animation utilities
│   │   └── fadeIn.js
│   ├── components/        # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Navbar.jsx
│   │   └── UploadSection.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── utils/            # Helper functions & constants
│   │   └── constants.js
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles with Tailwind
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🛠️ Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Available Routes

- `/` - Home page with hero section and resume upload
- `/dashboard` - Admin dashboard showing all screened candidates
- `/login` - Admin authentication page

## 📡 API Integration

The frontend connects to the FastAPI backend at `http://127.0.0.1:8000`.

Key endpoints:
- `POST /screen/` - Upload and analyze resume
- `GET /api/stats/` - Get dashboard statistics
- `GET /api/screenings/` - Get all screening records
- `DELETE /api/candidates/{id}` - Delete a candidate

## Key Features

- Animated hero section with gradient background
- Drag & drop resume upload
- Real-time screening analysis
- Interactive dashboard with filtering
- Responsive design (mobile-first)
- Smooth Anime.js transitions

## 🎨 Design System

**Colors:**
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Deep Purple)  
- Accent: `#00ff41` (Neon Green)

**Components:** Built with Tailwind utility classes and modular design patterns

---

**Built with ❤️ using React, Vite, and TailwindCSS**

