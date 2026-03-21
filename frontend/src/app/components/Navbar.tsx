import { Link, useNavigate, useLocation } from 'react-router';
import { getCurrentUser, logout } from '../utils/mockData';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 glass-effect border-b border-border-light z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            UniShare
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/browse" 
            className={`text-[15px] font-medium transition-colors ${
              isActive('/browse') 
                ? 'text-primary' 
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Browse
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-[15px] font-medium transition-colors ${
              isActive('/dashboard') 
                ? 'text-primary' 
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className={`text-[15px] font-medium transition-colors ${
              isActive('/profile') 
                ? 'text-primary' 
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Profile
          </Link>
          
          <ThemeToggle />
          
          <button
            onClick={handleLogout}
            className="text-[15px] font-medium text-text-secondary hover:text-error transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}