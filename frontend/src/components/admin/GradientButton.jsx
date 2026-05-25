import React from 'react';

const GradientButton = ({ children, variant = 'primary', className = '', type = 'button', disabled = false, ...props }) => {
  const baseClass = "h-14 px-6 rounded-2xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/5",
    secondary: "bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 text-slate-350 hover:text-white"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
