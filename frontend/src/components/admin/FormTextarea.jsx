import React from 'react';

const FormTextarea = ({ label, id, error, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label htmlFor={id} className="text-base font-semibold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-5 top-5 text-slate-450 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <textarea
          id={id}
          className={`w-full min-h-[120px] rounded-2xl bg-zinc-950/40 text-white border border-zinc-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium text-base transition-all duration-200 resize-none leading-relaxed ${
            icon ? 'pl-14 pr-5 py-4' : 'px-5 py-4'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-rose-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormTextarea;
