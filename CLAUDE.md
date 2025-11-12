# RETYRE Admin Interface - Development Guide for Claude

## Project Overview

**Project Name:** RETYRE Admin Interface
**Type:** React-based Admin Dashboard (Single Page Application)
**Tech Stack:** React 19 + Vite 7 + Redux Toolkit + Material-UI 7 + Tailwind CSS 4
**Lines of Code:** ~7,500 LOC
**Status:** Active Development (auth_integration branch)

This is a comprehensive admin dashboard for managing tire/tyre services including user management, driver tracking, pickup scheduling, store operations, subscription plans, and invoicing.

---

## Technology Stack

### Core Framework

- **React:** ^19.1.1 (Latest with React 19 features)
- **React DOM:** ^19.1.1
- **React Router DOM:** ^7.8.2 (Navigation/Routing)
- **Redux Toolkit:** ^2.9.0 (State Management)
- **React Redux:** ^9.2.0

### UI Frameworks

- **Material-UI (MUI):** ^7.3.2 (Primary UI components)
- **MUI X Date Pickers:** ^8.11.2 & Pro ^8.11.2
- **Tailwind CSS:** ^4.1.13 (Utility-first styling)
- **Emotion:** ^11.14.0-11.14.1 (CSS-in-JS)
- **RSuite:** ^5.83.3 (Additional components)

### Utilities

- **Axios:** ^1.12.2 (HTTP client)
- **DayJS:** ^1.11.18 (Date manipulation)
- **React OTP Input:** ^3.1.1
- **Dotenv:** ^17.2.3

### Build Tools

- **Vite:** ^7.1.2 (Build tool & dev server)
- **@vitejs/plugin-react:** ^5.0.0
- **@tailwindcss/vite:** ^4.1.13

### Development Tools

- **ESLint:** ^9.33.0
- **TypeScript types:** @types/react, @types/react-dom

---

## Project Structure

```
retyre-admin-interface/
├── public/                          # Static assets
│   ├── fonts/                       # ProximaNova font files
│   ├── logo.svg
│   └── retyreLogo.svg
│
├── src/
│   ├── api/                         # API layer
│   │   ├── axiosConfig.js          # Axios instance with interceptors
│   │   ├── apiHelpers.js           # GetData, PostData, PutData, DeleteData
│   │   ├── authApi.js              # Auth endpoints (placeholder)
│   │   └── userApi.js              # User endpoints (placeholder)
│   │
│   ├── assets/                      # Images and icons
│   │   ├── icons/                   # SVG icons
│   │   └── images/                  # Image assets
│   │
│   ├── components/
│   │   ├── authentication/          # Login, ForgotPassword, OTP, ResetPassword
│   │   └── reusableComps/          # Shared components
│   │       ├── FormFieldComp.jsx    # TextField wrapper
│   │       ├── DatePickerComp.jsx   # Date picker wrapper
│   │       ├── ButtonComp.jsx       # Button component
│   │       ├── SelectMenuComp.jsx   # Dropdown component
│   │       ├── SearchBarComp.jsx    # Search input
│   │       ├── SearchWithDropDown.jsx # Combo search
│   │       ├── TableDataComp.jsx    # Generic table
│   │       └── DriverTableDataComp.jsx # Driver table
│   │
│   ├── hooks/
│   │   └── useFormValidation.jsx    # Custom form validation hook
│   │
│   ├── layouts/                     # Layout components
│   │   ├── Nav.jsx                  # Navigation with sidebar
│   │   ├── LogoComp.jsx
│   │   ├── NoticationsPopUp.jsx
│   │   └── ViewAllNotifications.jsx
│   │
│   ├── pages/                       # Feature pages
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── pickups/                 # Pickup management
│   │   │   ├── Pickups.jsx
│   │   │   ├── SubPickups.jsx
│   │   │   ├── PickupsHistory.jsx
│   │   │   ├── ManageSchedulePickups.jsx
│   │   │   ├── ManageScheduleAssign.jsx
│   │   │   └── DriverTracking.jsx
│   │   ├── settings/                # Admin settings
│   │   │   ├── Settings.jsx
│   │   │   ├── User.jsx
│   │   │   ├── Driver.jsx
│   │   │   ├── Role.jsx
│   │   │   ├── SubscriptionPlan.jsx
│   │   │   └── PostCode.jsx
│   │   └── store/                   # Store management
│   │       ├── Store.jsx
│   │       ├── ManageStore.jsx
│   │       ├── Wtns.jsx
│   │       └── Invoices.jsx
│   │
│   ├── redux/                       # State management
│   │   ├── store.js                 # Redux store config
│   │   ├── userSlice.js             # User state (localStorage)
│   │   ├── driverSlice.js           # Driver state (localStorage)
│   │   ├── postCodeSlice.js         # PostCode state (API + async thunks)
│   │   └── subscriptionPlanSlice.js # Subscription state (API + async thunks)
│   │
│   ├── utils/                       # Utilities
│   │   ├── localStorage.js          # LocalStorage helpers
│   │   ├── validation.js            # Generic validation
│   │   ├── userValidationConfig.js  # User validation rules
│   │   ├── driverValidationConfig.js # Driver validation rules
│   │   ├── subPlanValidationConfig.js # Plan validation rules
│   │   └── postCodeConfig.js        # Postcode validation rules
│   │
│   ├── App.jsx                      # Main app with routes
│   ├── App.css                      # Global styles + fonts
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global stylesheet
│
├── .gitignore
├── eslint.config.js                 # ESLint v9 flat config
├── vite.config.js                   # Vite config with API proxy
├── package.json
├── package-lock.json
├── index.html
└── README.md
```

---

## Development Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5173 with HMR
```

### Production Build

```bash
npm run build
# Creates optimized bundle in /dist
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Environment Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://172.16.16.140:8000
```

The Vite config proxies `/api/*` requests to this backend:

- Frontend request: `/api/postcodes`
- Proxied to: `http://172.16.16.140:8000/admin/postcodes`

---

## API Layer

### Axios Configuration

**File:** [src/api/axiosConfig.js](src/api/axiosConfig.js)

- Base URL from `VITE_API_BASE_URL` environment variable
- 10-second timeout
- Request/Response interceptors for error handling
- Handles 401 (Unauthorized), 403 (Forbidden), 500 (Server Error)
- Token management ready (currently commented out)

### API Helper Functions

**File:** [src/api/apiHelpers.js](src/api/apiHelpers.js)

Four main functions:

```javascript
GetData(apiName, accessToken); // GET requests
PostData(apiName, data, accessToken); // POST requests
PutData(apiName, data, accessToken); // PUT requests
DeleteData(apiName, accessToken); // DELETE requests
```

### Active API Endpoints

- `/postcodes` - Postcode CRUD (with limit parameter)
- `/postcodes/{id}` - Individual postcode operations
- Other endpoints under development

---

## State Management (Redux Toolkit)

### Store Structure

**File:** [src/redux/store.js](src/redux/store.js)

```javascript
{
  auth: {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  user: {
    users: []  // CRUD operations + localStorage
  },
  driver: {
    drivers: []  // CRUD operations + localStorage
  },
  postCode: {
    postCodes: [],
    searchResults: [],
    defaultPostCodes: [],
    loading: false,
    error: null,
    originalPostCodes: []
  },
  subscriptionPlan: {
    plans: [],
    loading: false,
    error: null
  }
}
```

### Slices

#### Auth Slice ⭐ NEW

**File:** [src/redux/authSlice.js](src/redux/authSlice.js)

- Async thunks: `login`, `logout`
- Actions: `clearError`, `clearAuth`
- Manages authentication state and bearer token
- Persisted to localStorage (`access_token`, `user`)
- Auto-loads auth state on app initialization

#### User Slice

**File:** [src/redux/userSlice.js](src/redux/userSlice.js)

- Actions: `addUser`, `deleteUser`, `updateUser`
- Persisted to localStorage

#### Driver Slice

**File:** [src/redux/driverSlice.js](src/redux/driverSlice.js)

- Actions: `addDriver`, `deleteDriver`, `updateDriver`
- Includes license expiry date tracking
- Persisted to localStorage

#### PostCode Slice

**File:** [src/redux/postCodeSlice.js](src/redux/postCodeSlice.js)

- Async thunks: `fetchPostCodes`, `addPostCodeAsync`, `updatePostCodeAsync`, `deletePostCodeAsync`
- Search functionality with `searchPostCode` action
- API-integrated with backend

#### Subscription Plan Slice

**File:** [src/redux/subscriptionPlanSlice.js](src/redux/subscriptionPlanSlice.js)

- Async thunks: `fetchSubscriptionPlans`, `addSubscriptionPlanAsync`, `updateSubscriptionPlanAsync`, `deleteSubscriptionPlanAsync`
- API-integrated with backend

---

## Routing Structure

**File:** [src/App.jsx](src/App.jsx)

React Router v7 with nested routes:

### Public Routes

- `/` - LoginScreen
- `/forget` - ForgotPassword
- `/getotp` - GetOTP
- `/resetpassword` - ResetPassword
- `/viewallnotications` - ViewAllNotifications

### Protected Routes

- `/dashboard` - Dashboard

#### Settings (Nested)

- `/setting` - Settings parent
  - `/setting/subscription` - SubscriptionPlan
  - `/setting/driver` - Driver Management
  - `/setting/role` - Role Management
  - `/setting/user` - User Management
  - `/setting/postcode` - Postcode Management

#### Pickups (Nested)

- `/pickups` - Pickups parent
  - `/pickups/subPickups` - Sub-Pickups
  - `/pickups/manage` - ManageSchedulePickups
  - `/pickups/assign` - ManageScheduleAssign
  - `/pickups/drivertracking` - DriverTracking
  - `/pickups/pickupsHistory` - PickupsHistory

#### Store (Nested)

- `/store` - Store parent
  - `/store/manageStore` - Manage Store
  - `/store/wtns` - Witness Records
  - `/store/invoices` - Invoices

---

## Form Validation System

### Custom Hook

**File:** [src/hooks/useFormValidation.jsx](src/hooks/useFormValidation.jsx)

Pattern:

```javascript
const { formData, errors, handleChange, handleSubmit } = useFormValidation(
  initialData,
  validationConfig,
  onSubmitCallback
);
```

### Validation Configurations

- [src/utils/userValidationConfig.js](src/utils/userValidationConfig.js) - User fields
- [src/utils/driverValidationConfig.js](src/utils/driverValidationConfig.js) - Driver fields
- [src/utils/subPlanValidationConfig.js](src/utils/subPlanValidationConfig.js) - Subscription plans
- [src/utils/postCodeConfig.js](src/utils/postCodeConfig.js) - Postcodes

### Generic Validator

**File:** [src/utils/validation.js](src/utils/validation.js)

Core validation function used across all forms.

---

## Styling System

### Dual Approach

#### 1. Material-UI (MUI)

- Primary for form components, dialogs, buttons, icons
- Custom SX props for consistent styling
- Theme color: `#012622` (Green/Teal)
- ProximaNova font family applied globally

#### 2. Tailwind CSS

- Utility-first for layout, spacing, responsive design
- Used alongside MUI for flexibility

### Custom Font

**Location:** [public/fonts/proximanova/](public/fonts/proximanova/)

ProximaNova font family loaded via @font-face in [src/App.css](src/App.css):

- Weights: 300 (Light), 400 (Regular), 700 (Bold), 800 (ExtraBold), 900 (Black)
- Formats: woff2, woff

---

## Reusable Components

### Form Components

- **FormFieldComp** - MUI TextField wrapper with custom styling
- **DatePickerComp** - MUI Date picker wrapper
- **ButtonComp** - Reusable button component
- **SelectMenuComp** - Dropdown/select component

### Search Components

- **SearchBarComp** - Search input component
- **SearchWithDropDown** - Combo search + dropdown

### Table Components

- **TableDataComp** - Generic data table
- **DriverTableDataComp** - Driver-specific table with custom columns

All located in [src/components/reusableComps/](src/components/reusableComps/)

---

## Development Patterns & Best Practices

### Component Organization

- Separation of concerns (Reusable vs. Page components)
- Feature-based page organization
- Shared components in `reusableComps/`

### State Management

- Redux Toolkit for scalable state
- LocalStorage for offline persistence
- Async thunks for API-driven state
- Clear action creators and reducers

### Data Fetching

- Centralized axios instance
- Request/response interceptors
- Helper functions prevent code duplication
- Error handling at multiple layers

### Form Handling

- Custom hook pattern (useFormValidation)
- Config-driven validation
- Reusable form components
- Support for diverse input types

### Naming Conventions

- Components: PascalCase (UserComp.jsx)
- Files: snake_case for utilities (user_validation_config.js)
- Styling: camelCase (inputBoxSX)

---

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `dev` - Development baseline
- `auth_integration` - Current branch (authentication features)
- Feature branches: `US#XXXX`, `ST#XXXX`, `P#XXXX` (ticket-driven)

### Commit Message Pattern

Ticket-driven format:

- `US#5540postcode-api`
- `UT#5707WtnsApi`
- `ST#5304driver-tracking`

### Recent Development Focus

1. API Integration (PostCode, Driver, Store, Subscription Plan CRUD)
2. Driver tracking, pickup scheduling, invoice management
3. Bug fixes & refactoring

---

## API Integration Status

### Complete

- PostCode CRUD with search functionality
- SubscriptionPlan CRUD
- Driver management (partial)
- Store management (partial)

### In Progress

- Store inventory management
- Witness records
- Invoice management

### Pending

- Full authentication integration
- User API endpoints
- Role management API

---

## Authentication Flow

### Current Status - FULLY IMPLEMENTED

- **Login API Integration:** Complete with bearer token authentication
- **Protected Routes:** All authenticated routes are protected
- **Token Management:** Automatic token injection in API requests
- **Logout Functionality:** Fully functional with state cleanup

### Implementation Details

#### 1. Login API

**Endpoint:** `POST /admin/auth/login`

**Request:**

```json
{
  "email": "admin@nuagebiz.tech",
  "password": "ChangeThisSecurePassword123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user_id": "9c5b35f8-edca-4ee9-b994-5009fe5d3eac",
  "email": "admin@nuagebiz.tech",
  "full_name": "System Administrator"
}
```

#### 2. Authentication Files

**Auth API Layer** - [src/api/authApi.js](src/api/authApi.js)

- `loginUser(email, password)` - Handles login API call
- `logoutUser()` - Handles logout and localStorage cleanup

**Auth Redux Slice** - [src/redux/authSlice.js](src/redux/authSlice.js)

- State: `{ token, user, isAuthenticated, loading, error }`
- Actions: `login` (async thunk), `logout` (async thunk), `clearError`, `clearAuth`
- Persists token and user data to localStorage
- Auto-loads auth state on app initialization

**Protected Route Component** - [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)

- Wraps protected components
- Redirects to login if not authenticated
- Uses Redux auth state for validation

**Axios Interceptors** - [src/api/axiosConfig.js](src/api/axiosConfig.js)

- **Request Interceptor:** Automatically adds `Bearer ${token}` to all API calls
- **Response Interceptor:** Handles 401 errors by clearing auth and redirecting to login

#### 3. Login Component Integration

**File:** [src/components/authentication/LoginSrceen.jsx](src/components/authentication/LoginSrceen.jsx)

Features:

- Form validation with custom hook
- Redux integration for login action
- Loading state during API call
- Error display with Material-UI Alert
- Auto-redirect to dashboard on successful login
- Auto-redirect to dashboard if already authenticated

#### 4. Protected Routes Setup

**File:** [src/App.jsx](src/App.jsx)

All authenticated routes are wrapped with `<ProtectedRoute>`:

- `/dashboard` - Dashboard
- `/setting/*` - All settings pages
- `/pickups/*` - All pickup pages
- `/store/*` - All store pages
- `/viewallnotications` - Notifications

Public routes (no authentication required):

- `/` - Login page
- `/forget` - Forgot password
- `/getotp` - OTP verification
- `/resetpassword` - Reset password

#### 5. Logout Functionality

**File:** [src/layouts/Nav.jsx](src/layouts/Nav.jsx)

The navigation bar includes logout functionality:

- Dispatches Redux logout action
- Clears localStorage (token + user data)
- Navigates to login page
- Integrated with existing `handeLogout` function

#### 6. Token Storage & Management

**LocalStorage Keys:**

- `access_token` - Bearer token for API authentication
- `user` - JSON string with user data:
  ```json
  {
    "user_id": "...",
    "email": "...",
    "full_name": "...",
    "expires_in": 3600,
    "token_type": "bearer"
  }
  ```

**Token Lifecycle:**

1. Login → Token stored in localStorage + Redux state
2. All API calls → Token automatically added to Authorization header
3. 401 Response → Token cleared, user redirected to login
4. Logout → Token cleared from localStorage + Redux state

#### 7. Security Features

**Implemented:**

- Bearer token authentication
- Automatic token injection in API requests
- Protected route guards
- Automatic logout on 401 responses
- Token persistence across page refreshes
- Error handling and user feedback

⚠️ **Not Yet Implemented:**

- Token refresh mechanism (no refresh token provided by API)
- Token expiration checking (relies on backend 401 response)
- Remember me functionality
- Multi-device session management

### Testing the Login Flow

**Test Credentials:**

```
Email: admin@nuagebiz.tech
Password: ChangeThisSecurePassword123!
```

**Expected Flow:**

1. Navigate to `/` (login page)
2. Enter credentials
3. Click "Login" button
4. Loading state shows "Logging in..."
5. On success: Redirect to `/dashboard`
6. On error: Display error message in red alert
7. Token stored in localStorage
8. All subsequent API calls include Bearer token
9. Protected routes are accessible
10. Logout clears all auth data

---

## LocalStorage Management

**File:** [src/utils/localStorage.js](src/utils/localStorage.js)

### Functions

```javascript
loadFromLocalStorage(key); // Load data from localStorage
saveToLocalStorage(key, state); // Save data to localStorage
```

### Usage

Used by Redux slices to persist:

- User data
- Driver data
- PostCode data

Pattern:

```javascript
// On state change
saveToLocalStorage("users", state.users);

// On app initialization
const persistedUsers = loadFromLocalStorage("users");
```

---

## Testing

### Current Status

No testing framework currently implemented.

### Recommendations

Consider adding:

- **Vitest** (pairs well with Vite)
- **React Testing Library** (standard for React)
- Test coverage for:
  - Utility functions
  - Custom hooks
  - Redux slices
  - Critical page components

---

## Deployment

### Build Process

```bash
npm run build
```

Creates optimized production bundle in `/dist`:

- Tree-shaking enabled
- Code minification
- Asset optimization

### Hosting

- Static build can be served from any CDN/web server
- Nginx, Apache, Netlify, Vercel, etc.

### Backend Connection

- Update `VITE_API_BASE_URL` for production backend
- Ensure CORS is configured on backend
- Remove Vite proxy (only needed for development)

---

## Common Tasks

### Adding a New Page

1. Create page component in appropriate folder under `src/pages/`
2. Add route in [src/App.jsx](src/App.jsx)
3. Add navigation link in [src/layouts/Nav.jsx](src/layouts/Nav.jsx)

### Adding a New API Endpoint

1. Define endpoint in appropriate API file under `src/api/`
2. Use API helpers (GetData, PostData, etc.) from [src/api/apiHelpers.js](src/api/apiHelpers.js)
3. Create async thunk in Redux slice if needed
4. Handle loading/error states in component

### Adding a New Form

1. Define validation config in `src/utils/` (e.g., `newFeatureValidationConfig.js`)
2. Use `useFormValidation` hook in component
3. Use reusable form components (FormFieldComp, ButtonComp, etc.)
4. Handle form submission with Redux action or API call

### Adding a New Redux Slice

1. Create slice file in `src/redux/` (e.g., `featureSlice.js`)
2. Define initial state, reducers, and async thunks
3. Add to store configuration in [src/redux/store.js](src/redux/store.js)
4. Use `useSelector` and `useDispatch` in components

### Adding a New Reusable Component

1. Create component in [src/components/reusableComps/](src/components/reusableComps/)
2. Follow MUI + Tailwind styling pattern
3. Accept props for customization
4. Document usage with JSDoc comments

---

## Troubleshooting

### CORS Issues

- Ensure Vite proxy is configured in [vite.config.js](vite.config.js)
- Check backend CORS settings
- Verify `VITE_API_BASE_URL` is correct

### Build Failures

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for ESLint errors: `npm run lint`

### State Not Persisting

- Check localStorage in browser DevTools
- Verify `localStorage.js` helpers are imported correctly
- Ensure Redux actions are dispatched properly

### Styling Issues

- Check MUI theme conflicts with Tailwind
- Verify ProximaNova fonts are loaded (check Network tab)
- Use browser DevTools to inspect applied styles

---

## Important Files Reference

### Configuration

- [vite.config.js](vite.config.js) - Build config + API proxy
- [eslint.config.js](eslint.config.js) - Linting rules
- [package.json](package.json) - Dependencies & scripts

### Entry Points

- [index.html](index.html) - HTML entry
- [src/main.jsx](src/main.jsx) - React entry
- [src/App.jsx](src/App.jsx) - App component + routes

### State Management

- [src/redux/store.js](src/redux/store.js) - Redux store
- [src/redux/authSlice.js](src/redux/authSlice.js) - **Auth state (NEW)**
- [src/redux/userSlice.js](src/redux/userSlice.js)
- [src/redux/driverSlice.js](src/redux/driverSlice.js)
- [src/redux/postCodeSlice.js](src/redux/postCodeSlice.js)
- [src/redux/subscriptionPlanSlice.js](src/redux/subscriptionPlanSlice.js)

### API Layer

- [src/api/axiosConfig.js](src/api/axiosConfig.js) - Axios setup with bearer token
- [src/api/apiHelpers.js](src/api/apiHelpers.js) - API functions
- [src/api/authApi.js](src/api/authApi.js) - **Auth endpoints (NEW)**

### Components

- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) - **Route protection (NEW)**
- [src/components/authentication/LoginSrceen.jsx](src/components/authentication/LoginSrceen.jsx) - Login with API integration

### Utilities

- [src/utils/localStorage.js](src/utils/localStorage.js) - Storage helpers
- [src/utils/validation.js](src/utils/validation.js) - Validation logic

### Styles

- [src/App.css](src/App.css) - Global styles + fonts
- [src/index.css](src/index.css) - Base styles

---

## Code Style Guidelines

### Component Structure

```javascript
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ComponentName = () => {
  // Hooks
  const dispatch = useDispatch();
  const data = useSelector((state) => state.feature.data);

  // State
  const [localState, setLocalState] = useState(initialValue);

  // Handlers
  const handleAction = () => {
    // Logic
  };

  // Render
  return <div>{/* JSX */}</div>;
};

export default ComponentName;
```

### Redux Slice Structure

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

// Async thunks
export const fetchData = createAsyncThunk("feature/fetchData", async () => {
  return await GetData("/endpoint");
});

// Slice
const featureSlice = createSlice({
  name: "feature",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    // Async thunk handlers
  },
});

export const { actions } = featureSlice.actions;
export default featureSlice.reducer;
```

### API Helper Usage

```javascript
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

// GET
const data = await GetData("/endpoint");

// POST
const response = await PostData("/endpoint", { key: "value" });

// PUT
const updated = await PutData("/endpoint", { id: 1, key: "newValue" });

// DELETE
await DeleteData("/endpoint/1");
```

---

## Performance Considerations

### Current Optimizations

- Vite's fast HMR during development
- Tree-shaking in production builds
- Code splitting via React Router
- LocalStorage for offline-first data

### Recommended Improvements

- Implement React.lazy() for route-based code splitting
- Add memoization (useMemo, useCallback) for expensive computations
- Virtualize large tables (react-window or react-virtualized)
- Optimize Redux selectors with reselect
- Add service worker for offline support

---

## Security Considerations

### Current Implementation

- Environment variables for sensitive config
- Axios interceptors for error handling
- Token management ready (commented out)

### Recommendations

- Implement JWT token refresh logic
- Add CSRF protection
- Sanitize user inputs
- Implement rate limiting on API calls
- Add security headers in production
- Encrypt sensitive localStorage data

---

## Accessibility

### Current Status

- Material-UI components have built-in accessibility
- Semantic HTML structure

### Recommendations

- Add ARIA labels to interactive elements
- Ensure keyboard navigation works throughout
- Test with screen readers
- Add focus management for modals/dialogs
- Ensure color contrast meets WCAG standards

---

## Browser Support

### Target Browsers

Modern browsers with ES6+ support:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Vite's default target is `modules`, which supports:

- Chrome ≥87
- Firefox ≥78
- Safari ≥14
- Edge ≥88

---

## Useful Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Package Management
npm install              # Install dependencies
npm update              # Update dependencies
npm audit               # Security audit
npm audit fix           # Fix vulnerabilities

# Git Workflow
git checkout -b feature/US#XXXX  # Create feature branch
git add .                        # Stage changes
git commit -m "US#XXXX message"  # Commit with ticket
git push origin feature/US#XXXX  # Push to remote

# Clean Build
rm -rf node_modules dist         # Remove dependencies and build
npm install                      # Reinstall
npm run build                    # Rebuild
```

---

## Resources

### Documentation

- [React Docs](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Material-UI Docs](https://mui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

### Internal Documentation

- [README.md](README.md) - Basic project info

---

## Contact & Support

For questions or issues related to this project:

- Check Git commit history for recent changes
- Review relevant feature branch commits
- Consult team documentation
- Refer to ticket system (US#, ST#, P# tickets)

---

**Last Updated:** Generated on 2025-10-31
**Current Branch:** auth_integration
**Active Development Focus:** Authentication integration, API endpoints, driver tracking, pickup management
