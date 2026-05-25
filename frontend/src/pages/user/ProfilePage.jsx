import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Save, User, Mail, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from '../../components/Toast';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/user/profile');
        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("Failed to fetch profile details", err);
        toast.error("Failed to load profile details.");
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        email,
        password: password || null
      };

      await api.put('/api/user/profile', payload);
      
      const emailChanged = email.toLowerCase() !== user.email.toLowerCase();
      
      if (emailChanged) {
        toast.success("Profile saved. Email changed, please login again.");
        logout();
        navigate('/login');
      } else {
        toast.success("Profile updated successfully!");
        updateUser({ name });
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="pt-32 max-w-2xl mx-auto px-6 text-left">
        {/* Back link */}
        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your account name, email address, or security credentials</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching profile details...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-emerald-500" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-emerald-500" /> Email Address
                  </label>
                  {user && email !== user.email && (
                    <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5 animate-pulse">
                      <ShieldAlert className="h-3 w-3" /> Requires Re-login
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>

              {/* Password Divider */}
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />

              {/* New Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" /> New Password (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {/* Confirm Password Field */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required={!!password}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/user/dashboard')}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-white hover:bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
