
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};
