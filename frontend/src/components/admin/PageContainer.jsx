import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

const PageContainer = ({ children, title, subtitle, breadcrumbs = [], backUrl, headerActions }) => {
  return (
    <div className="min-h-screen text-slate-100 bg-[#040405] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Sticky top navbar */}
      <AdminNavbar breadcrumbs={breadcrumbs} />
      
      {/* Main content centered container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-10 py-8 flex flex-col gap-6 md:gap-8 animate-fade-in">
        
        {/* Optional back button */}
        {backUrl && (
          <div className="flex items-center text-left">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>
        )}

        {/* Middle Header: Title, Description, and Header Actions */}
        {(title || subtitle) && (
          <div className="text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/40 pb-6">
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-base text-slate-400 mt-2 font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-3 shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        )}

        {/* Bottom Section: Main Content */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
