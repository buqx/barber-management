<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cita Confirmada</title>
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
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
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
        .success-icon {
            width: 60px;
            height: 60px;
            background-color: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .success-icon svg {
            width: 30px;
            height: 30px;
            color: #16a34a;
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
            background-color: #f0fdf4;
            border: 2px solid #16a34a;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        .appointment-card h3 {
            color: #166534;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dcfce7;
        }
        .detail:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #15803d;
            font-weight: 500;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 600;
        }
        .status-badge {
            display: inline-block;
            background-color: #16a34a;
            color: white;
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
        .footer {
            background-color: #f9fafb;
            padding: 25px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
        }
        .footer a {
            color: #16a34a;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1>{{ $barberia->nombre }}</h1>
            <p>¡Cita Confirmada!</p>
        </div>

        <div class="content">
            <p class="greeting">¡Hola {{ $cliente->nombre }}!</p>

            <p class="message">
                ¡Buenas noticias! Tu cita ha sido confirmada. Aquí están los detalles:
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
                    <span class="status-badge">Confirmada</span>
                </div>
            </div>

            <p class="message">
                Por favor arrives unos minutos antes de tu cita. Si necesitas cancelarla o reprogramarla, contactanos con anticipación.
            </p>

            <p class="message" style="margin-top: 30px;">
                ¡Te esperamos!
            </p>
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
