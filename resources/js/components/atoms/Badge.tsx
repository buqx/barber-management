import React from "react";

export type BadgeStatus = "pendiente" | "confirmada" | "cancelada" | "completada";

interface BadgeProps {
  status: BadgeStatus;
}

const statusMap: Record<BadgeStatus, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-600 text-yellow-200 border-yellow-400" },
  confirmada: { label: "Confirmada", color: "bg-green-700 text-green-200 border-green-400" },
  cancelada: { label: "Cancelada", color: "bg-red-700 text-red-200 border-red-400" },
  completada: { label: "Completada", color: "bg-gray-700 text-gray-200 border-gray-400" },
};

export const Badge: React.FC<BadgeProps> = ({ status }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusMap[status].color} shadow-sm`}
  >
    {statusMap[status].label}
  </span>
);
