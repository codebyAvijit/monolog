# Logistics Management Dashboard (React + Vite)

A modern, high-performance logistics management web application built using **React + Vite**.
It provides features like **driver tracking**, **store pickups scheduling**, **role-based settings**, and **Google Maps integration** for real-time visibility.

---

## Overview

This dashboard is designed to streamline logistics operations for administrators and drivers.
It enables scheduling, assigning, and tracking of pickups, driver route monitoring, store management, and more — all through a clean, responsive interface.

---

## Tech Stack

- **React 18** — Component-based frontend framework
- **Vite** — Ultra-fast development & build tool
- **React Router v6** — Client-side routing
- **Redux Toolkit** — Scalable state management
- **MUI (Material UI)** — UI library for responsive layouts
- **Google Maps JavaScript API** — Driver location and store visualization
- **Day.js** — Lightweight date and time manipulation
- **ESLint** — Code quality and consistency enforcement

---

## Environment Setup

Before running the project, configure your environment variables.

### Step 1: Create a `.env` file

Copy the example file provided in the repository:

```bash
cp .env.example .env
```

> On Windows PowerShell:
>
> ```bash
> copy .env.example .env
> ```

### Step 2: Add your credentials

Open `.env` and replace placeholder values with your actual configuration:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_MODE=development
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

> **Important:**
>
> - Do **not** commit your `.env` file — it’s ignored via `.gitignore`.
> - The `.env.example` file is **safe to commit** and serves as a template for contributors.

---

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm install`     | Install all dependencies             |
| `npm run dev`     | Start local development server       |
| `npm run build`   | Build the project for production     |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint checks for code quality   |

---

## Folder Structure

```
project-root/
├── src/
│   ├── assets/                # Icons, images, and static files
│   ├── components/            # Reusable UI components
│   │   └── reusableComps/     # Shared widgets like Buttons, Dialogs, Maps
│   ├── config/                # App configuration files (Google Maps, API, etc.)
│   ├── layouts/               # Layout components for structured views
│   ├── pages/                 # Page-level views (Dashboard, Pickups, Settings, etc.)
│   ├── redux/                 # Redux slices and store configuration
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── public/                    # Static public assets
├── .env.example               # Template for environment variables
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Google Maps Integration

The project integrates the **Google Maps JavaScript API** to display real-time driver and pickup locations.

- Uses `AdvancedMarkerElement` for modern, high-performance map markers.
- The API key is stored in `.env` as `VITE_GOOGLE_MAPS_API_KEY`.
- Ensure the API key is **restricted** to your domain or environment in the [Google Cloud Console](https://console.cloud.google.com/).

---

## Security Notes

- Never expose API keys publicly in your codebase.
- Always use environment variables (`.env`) for sensitive credentials.
- Review your Google Maps API restrictions (HTTP referrers, IPs, etc.) before deployment.

---

## Deployment

For production deployment:

1. Build the app:

   ```bash
   npm run build
   ```

2. Serve the `/dist` folder on any static host (e.g., **Netlify**, **Vercel**, **Nginx**, or **AWS S3**).
3. Make sure your production environment includes the same variables as in `.env`:

   - `VITE_API_BASE_URL`
   - `VITE_APP_MODE=production`
   - `VITE_GOOGLE_MAPS_API_KEY`

> If deploying on Netlify or Vercel, add these under **Environment Variables** in your project settings.

---

## License

This project is private and intended for internal or client use.
