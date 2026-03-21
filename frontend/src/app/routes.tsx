import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { ListingDetails } from './pages/ListingDetails';
import { Dashboard } from './pages/Dashboard';
import { CreateListing } from './pages/CreateListing';
import { Profile } from './pages/Profile';
import { getCurrentUser } from './utils/mockData';

// Route guard component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public route component (redirect to home if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LandingOrHome />
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/browse',
    element: (
      <ProtectedRoute>
        <Browse />
      </ProtectedRoute>
    ),
  },
  {
    path: '/listing/:id',
    element: (
      <ProtectedRoute>
        <ListingDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-listing',
    element: (
      <ProtectedRoute>
        <CreateListing />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// Component to show Landing for logged-out users, Home for logged-in users
function LandingOrHome() {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Landing />;
  }
  
  return <Home />;
}