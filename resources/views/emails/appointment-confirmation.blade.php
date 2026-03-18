<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Cita</title>
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
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
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
            background-color: #fffbeb;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        .appointment-card h3 {
            color: #92400e;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .detail:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #6b7280;
            font-weight: 500;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 600;
        }
        .status-badge {
            display: inline-block;
            background-color: #fef3c7;
            color: #92400e;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .message {
            color: #4b5563;
            line-height: 1.7;
            margin-top: 25px;
        }
        .cta-button {
            display: inline-block;
            background-color: #f59e0b;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 25px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 25px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
        }
        .footer a {
            color: #f59e0b;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $barberia->nombre }}</h1>
            <p>Confirmación de Cita</p>
        </div>

        <div class="content">
            <p class="greeting">¡Hola {{ $cliente->nombre }}!</p>

            <p class="message">
                Tu cita ha sido registrada exitosamente. A continuación encontrarás los detalles:
            </p>

            <div class="appointment-card">
                <h3>Detalles de tu Cita</h3>

                <div class="detail">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->inicio_at)->format('d/m/Y') }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Hora</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->inicio_at)->format('H:i') }} - {{ \Carbon\Carbon::parse($appointment->fin_at)->format('H:i') }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Barbero</span>
                    <span class="detail-value">{{ $barbero->nombre }}</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Estado</span>
                    <span class="status-badge">Pendiente de confirmación</span>
                </div>
            </div>

            <p class="message">
                <strong>Nota:</strong> Tu cita se encuentra pendiente de confirmación por parte del barbero.
                Recibirás un correo cuando sea confirmada. Si tienes alguna consulta, no dudes en contactarnos.
            </p>

            <a href="{{ config('app.url') }}/{{ $barberia->slug }}/booking" class="cta-button">
                Verificar Estado
            </a>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ $barberia->nombre }}. Todos los derechos reservados.</p>
            <p style="margin-top: 10px;">
                ¿Tienes preguntas? Contáctanos en <a href="mailto:{{ $barberia->telefono }}">{{ $barberia->telefono }}</a>
            </p>
        </div>
    </div>
</body>
</html>
