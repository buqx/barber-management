<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Cita Pendiente</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .alert-badge {
            display: inline-block;
            background-color: #fee2e2;
            color: #dc2626;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 25px;
        }
        .appointment-card {
            background-color: #fef2f2;
            border: 2px solid #dc2626;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        .appointment-card h3 {
            color: #991b1b;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #fecaca;
        }
        .detail:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #7f1d1d;
            font-weight: 500;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 600;
        }
        .action-section {
            margin-top: 30px;
            text-align: center;
        }
        .cta-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
        }
        .btn-primary {
            background-color: #16a34a;
            color: white;
        }
        .btn-danger {
            background-color: #dc2626;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .info-text {
            color: #6b7280;
            font-size: 14px;
            margin-top: 20px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f9fafb;
            padding: 25px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $barberia->nombre }}</h1>
            <p>Nueva Solicitud de Cita</p>
            <div class="alert-badge">¡Acción requerida!</div>
        </div>

        <div class="content">
            <p class="greeting">¡Hola {{ $barbero->nombre }}!</p>

            <p class="info-text">
                Tienes una nueva cita pendiente por confirmar. Por favor revisa los detalles y confirma o rechaza a la brevedad.
            </p>

            <div class="appointment-card">
                <h3>Detalles del Cliente</h3>

                <div class="detail">
                    <span class="detail-label">Cliente</span>
                    <span class="detail-value">{{ $cliente->nombre }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Teléfono</span>
                    <span class="detail-value">{{ $cliente->telefono ?? 'No proporcionado' }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">{{ $cliente->email }}</span>
                </div>

                <h3 style="margin-top: 20px;">Detalles de la Cita</h3>

                <div class="detail">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->inicio_at)->format('d/m/Y') }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Hora</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->inicio_at)->format('H:i') }} - {{ \Carbon\Carbon::parse($appointment->fin_at)->format('H:i') }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Estado</span>
                    <span class="detail-value" style="color: #dc2626; font-weight: 700;">PENDIENTE</span>
                </div>
            </div>

            <div class="action-section">
                <p class="info-text">¿Deseas confirmar o rechazar esta cita?</p>
                <div class="cta-buttons">
                    <a href="{{ config('app.url') }}/agenda" class="btn btn-primary">
                        Confirmar Cita
                    </a>
                    <a href="{{ config('app.url') }}/agenda" class="btn btn-danger">
                        Rechazar
                    </a>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Barber Management. Todos los derechos reservados.</p>
            <p style="margin-top: 10px;">Este es un correo automático del sistema de reservas.</p>
        </div>
    </div>
</body>
</html>
