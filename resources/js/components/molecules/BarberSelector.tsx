import React from "react";
import { CheckCircle } from "lucide-react";

export interface BarberSelectorProps {
  name: string;
  photoUrl: string;
  available: boolean;
  onClick?: () => void;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({ name, photoUrl, available, onClick }) => (
  <button
    className={`flex flex-col items-center p-3 rounded-lg border border-[#222] bg-[#181818] shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${available ? "" : "opacity-50 grayscale"}`}
    onClick={onClick}
    disabled={!available}
    type="button"
  >
    <img
      src={photoUrl}
      alt={name}
      className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] mb-2"
    />
    <span className="text-gray-200 font-medium text-sm mb-1">{name}</span>
    {available ? (
      <CheckCircle className="text-green-400 w-5 h-5" />
    ) : (
      <span className="text-xs text-gray-500">No disponible</span>
    )}
  </button>
);
