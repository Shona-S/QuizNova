import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Users, HelpCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pb-12 text-left">
      <Navbar />
      
      <div className="pt-32 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-white/20 dark:border-white/5 relative overflow-hidden shadow-lg mb-8 bg-gradient-to-br from-emerald-500/5 to-green-500/5"
        >
          <div className="relative z-10 flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              Admin Console - <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl font-medium">
              Access administrative controls, review reports, configure active evaluations, and configure global roles.
            </p>
          </div>
        </motion.div>
 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Candidates", value: "1,248", icon: <Users className="h-5 w-5 text-emerald-500" /> },
            { label: "Active Quizzes", value: "8", icon: <FileText className="h-5 w-5 text-green-500" /> },
            { label: "Total Questions", value: "154", icon: <HelpCircle className="h-5 w-5 text-teal-500" /> },
            { label: "Security Status", value: "Secure", icon: <ShieldCheck className="h-5 w-5 text-emerald-500" /> },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-5 rounded-2xl border border-white/10 flex flex-col gap-2"
            >
              <div className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 w-fit">{stat.icon}</div>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{stat.value}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 border border-white/10 shadow-lg text-center py-16"
        >
          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-800 dark:text-white">Admin Console Authenticated</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              You are logged in with role <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 font-bold">{user?.role}</code>.
              Your administrator claims have been verified by the backend security interceptors.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
