import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import { toast } from '../../components/Toast';
import { Eye, EyeOff, User, Mail, Lock, Key } from 'lucide-react';
import Spinner from '../../components/Spinner';

const AdminRegister = () => {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password rules checks
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_+-]/.test(password),
  };

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Admin name is required';
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email';
    }
    
    const allRulesMet = rules.length && rules.uppercase && rules.lowercase && rules.number && rules.special;
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (!allRulesMet) {
      tempErrors.password = 'Password must meet all security requirements';
    }
    
    if (!securityKey.trim()) {
      tempErrors.securityKey = 'Security Key is required';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerAdmin(name, email, password, securityKey);
      toast.success('Admin registration successful! Please login.');
      navigate('/admin/login');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Registration">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <User className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${
                errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-white/20 dark:border-white/5 focus:border-emerald-500'
              } text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium`}
            />
          </div>
          {errors.name && <span className="text-xs font-semibold text-rose-500 mt-0.5">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Mail className="h-5 w-5" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${
                errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-white/20 dark:border-white/5 focus:border-emerald-500'
              } text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium`}
            />
          </div>
          {errors.email && <span className="text-xs font-semibold text-rose-500 mt-0.5">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Lock className="h-5 w-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${
                errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-white/20 dark:border-white/5 focus:border-emerald-500'
              } text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Live password requirements list */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className={`flex items-center gap-1.5 transition-colors ${rules.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <span>{rules.length ? '✔' : '○'}</span> <span>8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${rules.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <span>{rules.uppercase ? '✔' : '○'}</span> <span>Uppercase letter</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${rules.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <span>{rules.lowercase ? '✔' : '○'}</span> <span>Lowercase letter</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${rules.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <span>{rules.number ? '✔' : '○'}</span> <span>Number</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${rules.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <span>{rules.special ? '✔' : '○'}</span> <span>Special character</span>
            </div>
          </div>

          {errors.password && <span className="text-xs font-semibold text-rose-500 mt-1.5">{errors.password}</span>}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Security Key</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Key className="h-5 w-5" />
            </span>
            <input
              type="password"
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
              placeholder="Security Key"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${
                errors.securityKey ? 'border-rose-500 focus:ring-rose-500' : 'border-white/20 dark:border-white/5 focus:border-emerald-500'
              } text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium`}
            />
          </div>
          {errors.securityKey && <span className="text-xs font-semibold text-rose-500 mt-0.5">{errors.securityKey}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner size="sm" color="white" /> : 'Register Admin'}
        </button>

        <div className="mt-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
          Already have an Admin account?{' '}
          <Link to="/admin/login" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
            Log in here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminRegister;

