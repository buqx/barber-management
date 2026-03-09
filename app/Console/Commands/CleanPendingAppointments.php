<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Infrastructure\Persistence\Eloquent\Appointment;
use Illuminate\Support\Carbon;

class CleanPendingAppointments extends Command
{
    protected $signature = 'appointments:clean-pending {minutes=30}';
    protected $description = 'Elimina citas pendientes no confirmadas en X minutos';

    public function handle(): int
    {
        $minutes = (int) $this->argument('minutes');
        $cutoff = Carbon::now()->subMinutes($minutes);
        $count = Appointment::where('estado', 'pendiente')
            ->where('created_at', '<', $cutoff)
            ->delete();
        $this->info("Citas pendientes eliminadas: $count");
        return 0;
    }
}
