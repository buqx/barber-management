import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={`px-5 py-2 rounded-md font-semibold shadow-sm border border-[#D4AF37] bg-gradient-to-br from-[#222] to-black text-[#D4AF37] hover:bg-[#2d2d2d] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);
