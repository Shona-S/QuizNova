import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, CheckCircle, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, histRes] = await Promise.all([
          api.get('/api/user/subjects'),
          api.get('/api/user/history')
        ]);
        setSubjects(subRes.data);
        setHistory(histRes.data);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalQuizzesCompleted = history.length;
  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / history.length)
    : 0;

  const stats = [
    { label: "Available Subjects", value: subjects.length, icon: <Layers className="h-5 w-5 text-emerald-500" /> },
    { label: "Quizzes Completed", value: totalQuizzesCompleted, icon: <CheckCircle className="h-5 w-5 text-emerald-500" /> },
    { label: "Average Score", value: `${averageScore}%`, icon: <Award className="h-5 w-5 text-green-500" /> },
    { label: "Recent Performance", value: history.length > 0 ? `${history[0].percentage}%` : 'N/A', icon: <HelpCircle className="h-5 w-5 text-teal-500" /> },
  ];

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <div className="pt-32 w-full max-w-[1360px] mx-auto px-6 md:px-12 lg:pr-8 text-left">
        {/* Flex Layout: Subjects on Left, Fixed Width Sticky Sidebar on Right */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Subjects Catalog (Left Side) */}
          <div className="flex-1 w-full">
            {/* Simple Title Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-400 dark:to-green-300">{user?.name || 'shona'}</span>!
              </h1>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Explore Subjects</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching subjects database...</span>
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {subjects.map((subj, index) => (
                  <motion.div
                    key={subj.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => navigate(`/user/subjects/${subj.id}`)}
                    className="group cursor-pointer p-6 rounded-2xl border border-slate-200 hover:border-emerald-500/30 dark:border-white/5 dark:hover:border-emerald-500/20 bg-white hover:bg-slate-50/50 dark:bg-slate-900/25 dark:hover:bg-slate-900/50 shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[180px]"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                          {subj.topicCount || 0} Quizzes
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {subj.description || "No description available for this subject."}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {subj.questionCount || 0} Total Qs
                      </span>
                      <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-white/20 dark:bg-slate-900/10">
                <h3 className="font-bold text-lg">No Subjects Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check back later or contact your instructor.</p>
              </div>
            )}
          </div>

          {/* Performance Sidebar (Right Side - Sticky, 6cm width) */}
          <div className="w-full lg:w-[226px] shrink-0 lg:sticky lg:top-32 h-fit flex flex-col gap-4 self-start">
            <div className="mb-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Performance</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Your statistics overview</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 shadow-sm flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{stat.label}</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60 shrink-0 text-slate-500 dark:text-slate-400">
                    {stat.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
