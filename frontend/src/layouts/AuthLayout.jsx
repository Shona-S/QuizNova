import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/10 dark:bg-green-600/5 rounded-full blur-3xl -z-10" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md glass border border-white/20 dark:border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col gap-6"
      >
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>

        {/* Title and subtitle */}
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>}
        </div>

        {/* Children content */}
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
