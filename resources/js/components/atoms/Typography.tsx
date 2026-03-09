import React from "react";

export const H1: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight text-[#D4AF37] mb-4 ${className}`}>{children}</h1>
);

export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h2 className={`text-xl md:text-2xl font-bold text-gray-200 mb-2 ${className}`}>{children}</h2>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-base text-gray-300 ${className}`}>{children}</p>
);
