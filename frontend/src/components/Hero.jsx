import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden min-h-screen">
      {/* Premium Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] -z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:via-transparent dark:to-[#030712] -z-20" />
      
      {/* Background glowing decorations with smooth animations */}
      <motion.div 
        animate={{ 
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-[10%] w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 40, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-[10%] w-[450px] h-[450px] bg-green-500/10 dark:bg-green-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" 
      />

      {/* Super Header Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 dark:border-emerald-500/10 bg-emerald-500/5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-8 backdrop-blur-md"
      >
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Elevate Your Learning Evaluation</span>
      </motion.div>

      {/* Main Title (Larger & Premium) */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-slate-900 dark:text-white"
      >
        Assess, Learn and Spark<br />
        Your <span className="text-gradient">Potential</span>
      </motion.h1>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center w-full sm:w-auto"
      >
        <Link
          to="/login"
          className="group w-full sm:w-auto px-8 py-4 font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <GraduationCap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Student Workspace</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/admin/login"
          className="group w-full sm:w-auto px-8 py-4 font-extrabold glass text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all duration-300 active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <Shield className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
          <span>Admin Console</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Hero;

