import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../Toast';
import { LogOut, User as UserIcon, ChevronRight } from 'lucide-react';

const AdminNavbar = ({ breadcrumbs = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out from admin console");
    navigate('/');
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full bg-[#040405]/95 backdrop-blur-md border-b border-white/10 dark:border-white/5 py-5 px-8 shadow-md select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Left Side: Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
              Q
            </div>
            <div className="flex flex-col text-left leading-tight hidden sm:flex">
              <span className="font-black text-lg text-white tracking-tight">QuizNova</span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 mt-0.5">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Center: Breadcrumbs */}
        <div className="flex-1 flex justify-center overflow-x-auto scrollbar-none px-4">
          <nav className="flex items-center gap-2 text-lg font-medium text-slate-400 whitespace-nowrap">
            <Link to="/admin/dashboard" className="hover:text-emerald-400 transition-colors duration-250">
              Dashboard
            </Link>
            {breadcrumbs.length > 0 && <ChevronRight className="h-5 w-5 text-slate-600" />}
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {crumb.path && !isLast ? (
                    <Link to={crumb.path} className="hover:text-emerald-400 transition-colors duration-250">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-emerald-400 font-bold" : ""}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="h-5 w-5 text-slate-600" />}
                </React.Fragment>
                  );
            })}
          </nav>
        </div>

        {/* Right Side: Profile Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-3 border-l border-white/10 dark:border-white/5">
            {/* User Avatar */}
            <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer hidden md:flex" title={user?.email}>
              <UserIcon className="h-5 w-5" />
            </div>
            
            {/* User name */}
            <div className="flex flex-col text-left leading-none max-w-[120px] hidden md:flex">
              <span className="font-extrabold text-sm text-white truncate">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Admin</span>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 border border-transparent text-rose-500 hover:text-white transition-all duration-200 ml-2"
              title="Logout from console"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;
