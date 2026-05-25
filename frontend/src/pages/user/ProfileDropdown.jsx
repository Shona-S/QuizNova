import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const res = await api.get('/api/user/profile');
          setProfile(res.data);
        } catch (err) {
          console.error("Failed to load profile", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Click-away backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 shadow-2xl z-50 text-left text-slate-800 dark:text-white"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500">Loading profile...</span>
          </div>
        ) : profile ? (
          <div className="flex flex-col gap-4">
            {/* User Info Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight truncate">{profile.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3" /> {profile.email}
                </span>
              </div>
            </div>

            {/* Registration Details */}
            <div className="flex flex-col gap-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                <span>Joined {new Date(profile.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <Link
                to="/user/profile"
                onClick={onClose}
                className="py-1.5 w-full text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-950/80 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1"
              >
                Edit Profile
              </Link>
            </div>

            {/* Recent Attempts Section */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>Recent Quiz Attempts</span>
                <Link to="/user/history" className="hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-0.5 transition-colors" onClick={onClose}>
                  View All <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>

              {profile.recentAttempts && profile.recentAttempts.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {profile.recentAttempts.map((attempt) => (
                    <Link
                      key={attempt.attemptId}
                      to={`/user/results/${attempt.attemptId}`}
                      onClick={onClose}
                      className="group p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-950/80 border border-transparent hover:border-slate-200 dark:hover:border-white/5 flex justify-between items-center transition-all duration-200"
                    >
                      <div className="flex flex-col gap-0.5 text-left max-w-[70%]">
                        <span className="text-xs font-bold truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {attempt.quizTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {attempt.subjectName}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {attempt.score}/{attempt.totalMarks}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          attempt.percentage >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                          attempt.percentage >= 50 ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {attempt.percentage}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center">
                  No attempts yet. Start a quiz!
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-rose-500 py-4 text-center">
            Failed to load profile.
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProfileDropdown;
