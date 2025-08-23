import React from "react";

const FinalsLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8 mr-2" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle with Gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-blue-600 dark:text-blue-400" stopColor="currentColor" />
          <stop offset="100%" className="text-purple-600 dark:text-purple-400" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle 
        cx="16" 
        cy="16" 
        r="15" 
        fill="url(#logoGradient)"
        className="drop-shadow-lg"
      />
      
      {/* Shield Shape */}
      <path 
        d="M16 4 L24 8 L24 16 C24 22 16 26 16 26 C16 26 8 22 8 16 L8 8 Z" 
        fill="white" 
        fillOpacity="0.9"
        className="drop-shadow-sm"
      />
      
      {/* Letter 'S' for SecureDrop */}
      <path 
        d="M12 11 C12 9.5 13.5 8 16 8 C18.5 8 20 9.5 20 11 C20 12 19.5 12.5 18.5 13 L13.5 15 C12.5 15.5 12 16 12 17 C12 18.5 13.5 20 16 20 C18.5 20 20 18.5 20 17"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        className="dark:stroke-current dark:text-blue-400"
      />
      
      {/* Security Dots */}
      <circle cx="22" cy="10" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="10" cy="10" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="16" cy="22" r="1.5" fill="white" fillOpacity="0.8" />
    </svg>
  </div>
);

export default FinalsLogo;
