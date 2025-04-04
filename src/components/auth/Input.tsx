// src/components/auth/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label if needed visually, good for accessibility
  id: string;
  hasError?: boolean; // To style the input differently on error
}

const Input: React.FC<InputProps> = ({ label, id, hasError, className, ...props }) => {
  const baseStyle = "appearance-none relative block w-full rounded-md border px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm";
  const borderStyle = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-slate-600 focus:border-cyan-500 focus:ring-cyan-500';
  const backgroundStyle = 'bg-slate-700/50'; // Slightly transparent background

  return (
    <div>
      {label && (
        <label htmlFor={id} className="sr-only"> {/* Visually hidden label */}
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyle} ${borderStyle} ${backgroundStyle} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;