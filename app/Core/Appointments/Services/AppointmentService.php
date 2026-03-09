use App\Notifications\AppointmentBooked;
use Illuminate\Support\Facades\Notification;
<?php

declare(strict_types=1);

namespace App\Core\Appointments\Services;

use App\Core\Appointments\Contracts\AppointmentRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Barbero;
use App\Infrastructure\Persistence\Eloquent\Servicio;
use App\Infrastructure\Persistence\Eloquent\HorarioBase;
use App\Infrastructure\Persistence\Eloquent\BloqueoExcepcion;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class AppointmentService

    /**
     * Guarda una cita y dispara la notificación.
     */
    public function bookAppointment($appointmentEntity)
    {
        $appointment = $this->appointmentRepository->save($appointmentEntity);
        // Notificar al cliente (o barbero, según lógica de negocio)
        if ($appointment && $appointment->cliente) {
            Notification::send($appointment->cliente, new AppointmentBooked($appointment));
        }
        return $appointment;
    }
{
    public function __construct(
        protected AppointmentRepositoryInterface $appointmentRepository
    ) {}

    /**
     * @param string $barberId
     * @param array $serviceIds
     * @param Carbon $date
     * @return Collection
     */
    public function getAvailableWindows(string $barberId, array $serviceIds, Carbon $date): Collection
    {
        // 1. Sumar duración total de los servicios
        $totalDuration = Servicio::whereIn('id', $serviceIds)->sum('duracion_minutos');
        if ($totalDuration <= 0) {
            return collect();
        }

        // 2. Obtener horario base del barbero para ese día
        $diaSemana = $date->dayOfWeek;
        $horarios = HorarioBase::where('barbero_id', $barberId)
            ->where('dia_semana', $diaSemana)
            ->get();
        if ($horarios->isEmpty()) {
            return collect();
        }

        // 3. Obtener bloqueos/excepciones para ese día
        $bloqueos = BloqueoExcepcion::where('barbero_id', $barberId)
            ->whereDate('fecha_inicio', '<=', $date->toDateString())
            ->whereDate('fecha_fin', '>=', $date->toDateString())
            ->get();

        // 4. Obtener citas ocupadas para ese día
        $ocupados = $this->appointmentRepository->getOccupiedSlots($barberId, $date);

        // 5. Generar slots disponibles
        $slots = collect();
        foreach ($horarios as $horario) {
            $start = Carbon::parse($date->toDateString().' '.$horario->hora_inicio);
            $end = Carbon::parse($date->toDateString().' '.$horario->hora_fin);
            $step = 15; // minutos
            while ($start->copy()->addMinutes($totalDuration) <= $end) {
                $slotStart = $start->copy();
                $slotEnd = $slotStart->copy()->addMinutes($totalDuration);
                // Verificar bloqueos
                $intersectaBloqueo = $bloqueos->first(function($b) use ($slotStart, $slotEnd) {
                    $bloqueoInicio = Carbon::parse($b->fecha_inicio);
                    $bloqueoFin = Carbon::parse($b->fecha_fin);
                    return $slotStart < $bloqueoFin && $slotEnd > $bloqueoInicio;
                });
                if ($intersectaBloqueo) {
                    $start->addMinutes($step);
                    continue;
                }
                // Verificar citas ocupadas
                $intersectaCita = $ocupados->first(function($c) use ($slotStart, $slotEnd) {
                    $citaInicio = Carbon::parse($c->inicio_at);
                    $citaFin = Carbon::parse($c->fin_at);
                    return $slotStart < $citaFin && $slotEnd > $citaInicio;
                });
                if ($intersectaCita) {
                    $start->addMinutes($step);
                    continue;
                }
                // Verificar almuerzo
                if ($horario->almuerzo_inicio && $horario->almuerzo_fin) {
                    $almuerzoInicio = Carbon::parse($date->toDateString().' '.$horario->almuerzo_inicio);
                    $almuerzoFin = Carbon::parse($date->toDateString().' '.$horario->almuerzo_fin);
                    if ($slotStart < $almuerzoFin && $slotEnd > $almuerzoInicio) {
                        $start->addMinutes($step);
                        continue;
                    }
                }
                $slots->push([
                    'inicio' => $slotStart->format('H:i'),
                    'fin' => $slotEnd->format('H:i'),
                ]);
                $start->addMinutes($step);
            }
        }
        return $slots;
    }
}
