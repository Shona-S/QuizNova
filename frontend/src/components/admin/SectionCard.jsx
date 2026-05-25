import React from 'react';

const SectionCard = ({ children, className = '', onClick, interactive = false }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6 md:p-8 text-left transition-all duration-300 ${
        interactive 
          ? 'cursor-pointer hover:border-emerald-500/30 hover:scale-[1.01] hover:-translate-y-0.5 shadow-md hover:shadow-emerald-500/5' 
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionCard;
