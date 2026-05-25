import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { toast } from './Toast';
import ProfileDropdown from '../pages/user/ProfileDropdown';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/20 dark:border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          Q
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">
          Quiz<span className="text-emerald-500 dark:text-emerald-400">Nova</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {user.role === 'ROLE_USER' ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/30 dark:bg-slate-900/30 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <User className="h-4 w-4 text-emerald-500" />
                  <span>{user.name}</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ml-1">
                    User
                  </span>
                </button>
                <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/30 dark:bg-slate-900/30 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <User className="h-4 w-4 text-emerald-500" />
                <span>{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ml-1">
                  Admin
                </span>
              </div>
            )}
            
            <Link 
              to={user.role === 'ROLE_ADMIN' ? "/admin/dashboard" : "/user/dashboard"}
              className="p-2 rounded-lg glass glass-hover text-slate-700 dark:text-slate-200"
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg glass glass-hover text-rose-600 hover:bg-rose-50/20 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
