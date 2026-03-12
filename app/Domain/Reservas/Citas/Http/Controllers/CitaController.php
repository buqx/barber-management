<?php

namespace App\Domain\Reservas\Citas\Http\Controllers;

use App\Domain\Reservas\Citas\Repositories\Contracts\AppointmentRepositoryInterface;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CitaController extends Controller
{
    public function __construct(
        protected AppointmentRepositoryInterface $appointmentRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('citas/Index', [
            'citas' => $this->appointmentRepository->findAll(),
        ]);
    }

    public function show(string $id): Response
    {
        return Inertia::render('citas/Show', [
            'cita' => $this->appointmentRepository->findById($id),
        ]);
    }
}
