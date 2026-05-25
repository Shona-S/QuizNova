import React from 'react';

const FormSelect = ({ label, id, error, icon, children, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label htmlFor={id} className="text-base font-semibold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`w-full h-14 rounded-2xl bg-zinc-950/40 text-white border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium text-base transition-all duration-200 cursor-pointer ${
            icon ? 'pl-14 pr-5' : 'px-5'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <span className="text-sm text-rose-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormSelect;
