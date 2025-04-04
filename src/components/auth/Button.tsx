// src/components/auth/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyle = "group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 shadow-md";
  const primaryStyle = "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus-visible:outline-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed";
  // const secondaryStyle = "bg-transparent border border-cyan-500/50 text-white hover:border-cyan-500 focus-visible:outline-cyan-500 disabled:opacity-50"; // Example secondary

  const combinedClassName = `${baseStyle} ${variant === 'primary' ? primaryStyle : ''} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;