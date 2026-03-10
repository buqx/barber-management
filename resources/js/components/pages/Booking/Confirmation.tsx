import React, { useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Button } from "../../atoms/Button";
import { H1, H2, Body } from "../../atoms/Typography";
import { Badge } from "../../atoms/Badge";
import { motion } from "framer-motion";
import { toast } from "../../ui/toast";

interface ConfirmationProps {
  barbero: {
    nombre: string;
    photoUrl: string;
  };
  fecha: string;
  hora: string;
  servicios: Array<{ nombre: string; precio: number; duracion_minutos: number }>;
  total: number;
}

export const BookingConfirmation: React.FC<ConfirmationProps> = ({ barbero, fecha, hora, servicios, total }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: "",
    telefono: "",
    email: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/booking/confirm", {
      onSuccess: () => {
        setSuccess(true);
        toast({ title: "¡Cita confirmada!", description: "Recibirás un correo de confirmación." });
        reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err?.message || "No se pudo confirmar la cita." });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-gray-200 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#222] rounded-xl p-6 shadow-lg"
      >
        <H1>Confirmación de Cita</H1>
        <div className="flex items-center gap-4 mb-4">
          <img src={barbero.photoUrl} alt={barbero.nombre} className="w-16 h-16 rounded-full border-2 border-[#D4AF37]" />
          <div>
            <H2>{barbero.nombre}</H2>
            <Body>{fecha} - {hora}</Body>
          </div>
        </div>
        <div className="mb-4">
          <H2>Servicios</H2>
          <ul className="space-y-2">
            {servicios.map((s, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{s.nombre}</span>
                <span className="text-[#D4AF37]">${s.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4 flex justify-between">
          <span className="font-bold text-lg text-[#D4AF37]">Total:</span>
          <span className="font-bold text-lg text-[#D4AF37]">${total.toFixed(2)}</span>
        </div>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input
                type="text"
                value={data.nombre}
                onChange={e => setData("nombre", e.target.value)}
                className="w-full rounded-md bg-[#181818] border border-[#333] text-gray-200 p-2"
                required
              />
              {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre}</span>}
            </div>
            <div>
              <label className="block text-sm mb-1">Teléfono</label>
              <input
                type="tel"
                value={data.telefono}
                onChange={e => setData("telefono", e.target.value)}
                className="w-full rounded-md bg-[#181818] border border-[#333] text-gray-200 p-2"
                required
              />
              {errors.telefono && <span className="text-red-500 text-xs">{errors.telefono}</span>}
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData("email", e.target.value)}
                className="w-full rounded-md bg-[#181818] border border-[#333] text-gray-200 p-2"
                required
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
            </div>
            <Button type="submit" className="w-full mt-2" disabled={processing}>
              Confirmar Cita
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center mt-6"
          >
            <Badge status="confirmada" />
            <H2 className="mt-4 text-[#D4AF37]">¡Cita confirmada!</H2>
            <Body>Recibirás un correo de confirmación en breve.</Body>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
