<?php

declare(strict_types=1);

namespace App\Domain\Reservas\Citas\Services;

use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Reservas\Citas\Notifications\AppointmentBooked;
use App\Domain\Reservas\Citas\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\BloqueoExcepcionRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\TurnoFijoRepositoryInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class AppointmentService
{
    public function __construct(
        protected AppointmentRepositoryInterface       $appointmentRepository,
        protected ServicioRepositoryInterface          $servicioRepository,
        protected HorarioBaseRepositoryInterface       $horarioBaseRepository,
        protected BloqueoExcepcionRepositoryInterface  $bloqueoExcepcionRepository,
        protected TurnoFijoRepositoryInterface        $turnoFijoRepository,
    ) {}

    public function bookAppointment(AppointmentEntity $appointmentEntity): Appointment
    {
        // Re-validate slot availability (anti-race condition)
        $date      = new Carbon($appointmentEntity->inicioAt);
        $available = $this->getAvailableWindows(
            $appointmentEntity->barberoId,
            $appointmentEntity->serviceIds,
            $date
        );

        $slotFound = $available->first(fn ($slot) =>
            $slot['inicio'] === (new Carbon($appointmentEntity->inicioAt))->format('H:i')
            && $slot['fin']  === (new Carbon($appointmentEntity->finAt))->format('H:i')
        );

        if (!$slotFound) {
            throw new \RuntimeException('El horario seleccionado ya no está disponible.');
        }

        $appointment = $this->appointmentRepository->save($appointmentEntity);

        if ($appointment->cliente) {
            Notification::send($appointment->cliente, new AppointmentBooked($appointment));
        }

        return $appointment;
    }

    public function getAvailableWindows(string $barberId, array $serviceIds, Carbon $date): Collection
    {
        $totalDuration = $this->servicioRepository->sumDuration($serviceIds);
        if ($totalDuration <= 0) {
            return collect();
        }

        $diaSemana = $date->dayOfWeek;
        $horarios  = $this->horarioBaseRepository->findByBarberoAndDay($barberId, $diaSemana);
        if ($horarios->isEmpty()) {
            return collect();
        }

        $bloqueos = $this->bloqueoExcepcionRepository->findForBarberoOnDate($barberId, $date->toDateString());
        $ocupados = $this->appointmentRepository->getOccupiedSlots($barberId, $date);

        // Obtener turnos fijos del día
        $turnosFijos = $this->turnoFijoRepository->findByBarberoAndDay($barberId, $diaSemana);
        // Convertir turnos fijos a formato de ocupado
        $turnosFijosOcupados = $turnosFijos->map(function ($tf) use ($date) {
            $horaInicio = Carbon::parse($tf->hora_inicio)->format('H:i');
            $duracion = $tf->duracion_total;
            return (object) [
                'inicio_at' => $date->copy()->setTimeFromTimeString($horaInicio)->toDateTimeString(),
                'fin_at' => $date->copy()->setTimeFromTimeString($horaInicio)->addMinutes($duracion)->toDateTimeString(),
            ];
        });
        $ocupados = $ocupados->merge($turnosFijosOcupados);

        $slots = collect();
        $step  = 15; // minutos

        foreach ($horarios as $horario) {
            $start = Carbon::parse($date->toDateString() . ' ' . $horario->hora_inicio);
            $end   = Carbon::parse($date->toDateString() . ' ' . $horario->hora_fin);

            while ($start->copy()->addMinutes($totalDuration) <= $end) {
                $slotStart = $start->copy();
                $slotEnd   = $slotStart->copy()->addMinutes($totalDuration);

                // Check blocks/exceptions
                $hasBloqueo = $bloqueos->contains(function ($b) use ($slotStart, $slotEnd) {
                    return $slotStart < Carbon::parse($b->fecha_fin)
                        && $slotEnd > Carbon::parse($b->fecha_inicio);
                });
                if ($hasBloqueo) { $start->addMinutes($step); continue; }

                // Check existing appointments
                $hasCita = $ocupados->contains(function ($c) use ($slotStart, $slotEnd) {
                    return $slotStart < Carbon::parse($c->fin_at)
                        && $slotEnd > Carbon::parse($c->inicio_at);
                });
                if ($hasCita) { $start->addMinutes($step); continue; }

                // Check lunch break
                if ($horario->almuerzo_inicio && $horario->almuerzo_fin) {
                    $almuerzoInicio = Carbon::parse($date->toDateString() . ' ' . $horario->almuerzo_inicio);
                    $almuerzoFin    = Carbon::parse($date->toDateString() . ' ' . $horario->almuerzo_fin);
                    if ($slotStart < $almuerzoFin && $slotEnd > $almuerzoInicio) {
                        $start->addMinutes($step);
                        continue;
                    }
                }

                $slots->push(['inicio' => $slotStart->format('H:i'), 'fin' => $slotEnd->format('H:i')]);
                $start->addMinutes($step);
            }
        }

        return $slots;
    }
}
