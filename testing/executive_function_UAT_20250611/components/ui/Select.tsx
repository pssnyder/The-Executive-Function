
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  children: React.ReactNode; // To pass <option> elements
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className = '', wrapperClassName = '', children, ...props }) => {
  const baseStyles = 'block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md shadow-sm';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className={` ${wrapperClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
