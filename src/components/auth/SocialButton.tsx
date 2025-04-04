// src/components/auth/SocialButton.tsx
import React from 'react';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  providerName: string;
  icon: React.ReactNode; // Expecting an SVG element or similar
}

const SocialButton: React.FC<SocialButtonProps> = ({ providerName, icon, className, ...props }) => {
  const baseStyle = "group relative flex w-full items-center justify-center rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 transition-colors duration-300";

  return (
    <button
      className={`${baseStyle} ${className}`}
      {...props}
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </span>
      Se connecter avec {providerName}
    </button>
  );
};

// Example Google Icon (replace with a proper SVG if you have one)
export const GoogleIcon = () => (
  <svg className="h-5 w-5 text-white group-hover:text-gray-300" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
     {/* Basic Google G - Replace with a better SVG */}
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path d="M12 5.38c1.63 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);


export default SocialButton;