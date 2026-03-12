<?php

namespace App\Domain\Reservas\Citas\Http\Controllers;

use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Reservas\Citas\Http\Requests\AgendaStoreRequest;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Reservas\Citas\Services\AppointmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function __construct(
        protected AppointmentService             $appointmentService,
        protected ServicioRepositoryInterface    $servicioRepository,
        protected HorarioBaseRepositoryInterface $horarioRepository,
    ) {}

    public function index(Request $request): Response
    {
        $user     = auth()->user();
        $barberos = Barbero::where('activo', true)->get();

        // Detect current user's barbero by matching email
        $miBarbero = $barberos->firstWhere('email', $user->email);

        $barberoId = $request->get('barbero_id', $miBarbero?->id);
        $barbero   = $barberoId ? $barberos->firstWhere('id', $barberoId) : null;

        $selectedDate = Carbon::parse($request->get('fecha', today()->toDateString()));
        $horarios     = collect();
        $citas        = collect();
        $servicios    = collect();

        if ($barbero) {
            $barbero->load('servicios');
            $diaSemana = $selectedDate->dayOfWeek;
            $horarios  = $this->horarioRepository->findByBarberoAndDay($barbero->id, $diaSemana);
            $citas     = Appointment::where('barbero_id', $barbero->id)
                ->whereDate('inicio_at', $selectedDate->toDateString())
                ->with('cliente')
                ->orderBy('inicio_at')
                ->get();
            // Show only services this barbero offers (fallback to all if none assigned)
            $servicios = $barbero->servicios->isEmpty()
                ? $this->servicioRepository->findAll()
                : $barbero->servicios;
        }

        return Inertia::render('agenda/Index', [
            'barbero'      => $barbero,
            'barberos'     => $barberos,
            'horarios'     => $horarios,
            'citas'        => $citas,
            'servicios'    => $servicios,
            'selectedDate' => $selectedDate->toDateString(),
            'isMiAgenda'   => $miBarbero !== null && $miBarbero->id === $barberoId,
        ]);
    }

    public function checkDisponibilidad(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'barbero_id'    => ['required', 'uuid', 'exists:barberos,id'],
            'service_ids'   => ['required', 'array', 'min:1'],
            'service_ids.*' => ['uuid', 'exists:servicios,id'],
            'fecha'         => ['required', 'date'],
        ]);

        $slots = $this->appointmentService->getAvailableWindows(
            $request->barbero_id,
            $request->service_ids,
            Carbon::parse($request->fecha),
        );

        return response()->json(['slots' => $slots]);
    }

    public function store(AgendaStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $barbero   = Barbero::findOrFail($validated['barbero_id']);

        $cliente = Cliente::firstOrCreate(
            [
                'barberia_id' => $barbero->barberia_id,
                'email'       => $validated['cliente_email'],
            ],
            [
                'nombre'   => $validated['cliente_nombre'],
                'telefono' => $validated['cliente_telefono'] ?? null,
            ]
        );

        $fecha    = Carbon::parse($validated['fecha']);
        $inicioAt = $fecha->copy()->setTimeFromTimeString($validated['slot_inicio']);
        $finAt    = $fecha->copy()->setTimeFromTimeString($validated['slot_fin']);

        $entity = new AppointmentEntity(
            id:          Str::uuid()->toString(),
            barberiaId:  $barbero->barberia_id,
            barberoId:   $barbero->id,
            clienteId:   $cliente->id,
            inicioAt:    $inicioAt->toDateTimeString(),
            finAt:       $finAt->toDateTimeString(),
            estado:      'confirmada',
            totalPagado: 0,
            serviceIds:  $validated['service_ids'],
        );

        $this->appointmentService->bookAppointment($entity);

        return redirect()->back()->with('success', 'Cita agendada correctamente.');
    }

    public function updateEstado(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'estado' => ['required', 'in:pendiente,confirmada,completada,cancelada'],
        ]);

        Appointment::findOrFail($id)->update(['estado' => $request->estado]);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }
}
