import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { BarberSelector } from "../../molecules/BarberSelector";
import { ServiceCard } from "../../molecules/ServiceCard";
import { StepIndicator } from "../../molecules/StepIndicator";
import { Button } from "../../atoms/Button";
import { H1 } from "../../atoms/Typography";

interface Barber {
  id: string;
  nombre: string;
  photoUrl: string;
  disponible: boolean;
}

interface Service {
  id: string;
  nombre: string;
  precio: number;
  duracion_minutos: number;
}

interface BookingSelectServicesProps {
  barbers: Barber[];
  services: Service[];
}

export const BookingSelectServices: React.FC<BookingSelectServicesProps> = ({ barbers, services }) => {
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceToggle = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = selectedServices
    .map((id) => services.find((s) => s.id === id)?.precio || 0)
    .reduce((acc, val) => acc + val, 0);

  const totalMinutes = selectedServices
    .map((id) => services.find((s) => s.id === id)?.duracion_minutos || 0)
    .reduce((acc, val) => acc + val, 0);

  const handleNext = () => {
    if (!selectedBarber || selectedServices.length === 0) return;
    Inertia.post("/booking/check-availability", {
      barber_id: selectedBarber,
      service_ids: selectedServices,
      // Puedes agregar más datos si lo requiere el backend
    });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-gray-200 flex flex-col">
      <StepIndicator steps={["Barbero", "Servicios", "Fecha"]} current={1} />
      <H1>Selecciona tu Barbero</H1>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {barbers.map((barber) => (
          <BarberSelector
            key={barber.id}
            name={barber.nombre}
            photoUrl={barber.photoUrl}
            available={barber.disponible}
            onClick={() => setSelectedBarber(barber.id)}
          />
        ))}
      </div>
      <H1>Servicios</H1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-24">
        {services.map((service) => (
          <div key={service.id}>
            <ServiceCard
              name={service.nombre}
              duration={service.duracion_minutos}
              price={service.precio}
            />
            <Button
              className={`mt-2 w-full ${selectedServices.includes(service.id) ? "bg-[#D4AF37] text-black" : "bg-[#181818] text-[#D4AF37]"}`}
              onClick={() => handleServiceToggle(service.id)}
            >
              {selectedServices.includes(service.id) ? "Quitar" : "Agregar"}
            </Button>
          </div>
        ))}
      </div>
      {/* Barra de resumen sticky */}
      <div className="fixed bottom-0 left-0 w-full bg-[#222] border-t border-[#333] p-4 flex justify-between items-center z-50">
        <div>
          <span className="text-[#D4AF37] font-bold text-lg">Total: ${total.toFixed(2)}</span>
          <span className="ml-4 text-gray-400">Tiempo estimado: {totalMinutes} min</span>
        </div>
        <Button
          className="px-6 py-2 text-lg font-bold"
          onClick={handleNext}
          disabled={!selectedBarber || selectedServices.length === 0}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
