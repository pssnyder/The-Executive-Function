
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, className, tooltip, ...props }) => {
  return (
    <button
      type="button"
      className={`p-2 rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 relative group ${className}`}
      {...props}
    >
      {icon}
      {tooltip && (
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {tooltip}
        </span>
      )}
    </button>
  );
};
