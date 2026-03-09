import React from "react";

export interface ServiceCardProps {
  name: string;
  duration: number; // minutos
  price: number; // en la moneda local
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ name, duration, price }) => (
  <div className="bg-[#181818] border border-[#333] rounded-lg p-4 shadow-md flex flex-col gap-2 hover:shadow-lg transition-shadow">
    <span className="text-lg font-semibold text-[#D4AF37]">{name}</span>
    <span className="text-sm text-gray-400">{duration} min</span>
    <span className="text-xl font-bold text-gray-200">${price.toFixed(2)}</span>
  </div>
);
