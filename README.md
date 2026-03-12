# Barber Management

Sistema de gestión para barberías construido con Laravel 12 + Inertia + React + TypeScript.

Incluye gestión de barberías, barberos, clientes, servicios, agenda de citas y ventas (servicios + productos, con soporte de venta desde cita o mostrador).

---

## 1) Stack tecnológico

- Backend: Laravel 12, PHP 8.2+
- Frontend: React 18, TypeScript, Inertia.js, Vite
- UI: Tailwind + componentes UI del proyecto
- Base de datos: SQLite (por defecto) o MySQL
- Auth/seguridad: Laravel Fortify + 2FA
- Testing: Pest

---

## 2) Requisitos previos

Instala lo siguiente antes de iniciar:

- PHP 8.2 o superior
- Composer 2.x
- Node.js 20+ y npm
- Git
- (Opcional) MySQL 8+ si no usarás SQLite

Verifica versiones:

- php -v
- composer -V
- node -v
- npm -v

---

## 3) Instalación rápida (desde cero)

### Opción recomendada (comando único)

1. Clona el proyecto y entra al directorio.
2. Ejecuta:

composer run setup

Este script hace:

- composer install
- crea .env si no existe
- php artisan key:generate
- php artisan migrate
- npm install
- npm run build

---

## 4) Instalación manual paso a paso

1. Instalar dependencias backend:

composer install

2. Crear archivo de entorno:

cp .env.example .env

En Windows PowerShell:

Copy-Item .env.example .env

3. Generar clave de app:

php artisan key:generate

4. Configurar base de datos en .env.

Por defecto viene SQLite:

- DB_CONNECTION=sqlite

Si usarás SQLite, asegúrate de tener el archivo:

- database/database.sqlite

En PowerShell:

New-Item database/database.sqlite -ItemType File -Force

5. Ejecutar migraciones:

php artisan migrate

6. Instalar frontend:

npm install

7. Generar rutas y actions de wayfinder (recomendado):

php artisan wayfinder:generate

8. Compilar frontend:

npm run build

---

## 5) Ejecutar en desarrollo

### Modo recomendado (todo junto)

composer run dev

Levanta en paralelo:

- servidor Laravel
- cola de jobs
- Vite dev server

### Alternativa en terminales separadas

Terminal 1:

php artisan serve

Terminal 2:

php artisan queue:listen --tries=1

Terminal 3:

npm run dev

---

## 6) Archivos importantes de configuración

- Entorno: .env
- Rutas principales: routes/web.php
- Rutas por dominio: app/Domain/**/Routes/*.php
- Tipos frontend: resources/js/types
- Config frontend build: vite.config.ts, package.json

---

## 7) Módulos funcionales incluidos

- Barberías
- Barberos
- Clientes
- Servicios
- Productos
- Citas
- Agenda (vista operativa por barbero)
- Ventas

---

## 8) Reglas de negocio actuales importantes

### Barberos y dueños

Al crear un barbero:

- Se crea también su usuario de acceso con:
  - email del barbero
  - contraseña inicial = cédula
- Si marcas Es dueño:
  - barbero.es_dueno = true
  - usuario.is_admin = true

La barbería del dueño corresponde al barberia_id seleccionado en el formulario.

### Formularios con barbería

Los formularios de creación usan select de barberías (no input libre de ID) en:

- Crear barbero
- Crear cliente
- Crear servicio

### Ventas

El sistema soporta:

- Venta asociada a cita
- Venta de mostrador (sin cita)
- Mezcla de servicios y productos en una misma venta
- Actualización de stock para productos
- Registro de movimientos de inventario

---

## 9) Comandos útiles

### Calidad de código

- Formatear PHP:

composer run lint

- Verificar formato PHP:

composer run lint:check

- Lint frontend:

npm run lint

- Verificar lint frontend:

npm run lint:check

- Verificar tipos TypeScript:

npm run types:check

### Tests

composer test

O directamente:

php artisan test

---

## 10) Troubleshooting

### A) npm run build termina con “built in ...” pero Exit Code 1

En PowerShell puede aparecer Exit Code 1 por warnings del wrapper aunque el build haya compilado correctamente.

Si ves salida similar a:

- built in XXs

y no hay errores TS/Vite, el build está bien.

### B) Problemas de wayfinder (rutas/actions)

Si cambias rutas backend y frontend no reconoce nuevos helpers:

php artisan wayfinder:generate

Luego:

npm run types:check

### C) Imágenes no visibles (fotos de barberos)

Ejecuta:

php artisan storage:link

---

## 11) Flujo recomendado para desarrollo diario

1. git pull
2. composer install
3. npm install
4. php artisan migrate
5. php artisan wayfinder:generate
6. composer run dev

---

## 12) Primer arranque funcional (checklist)

- Proyecto instala sin errores
- Migraciones ejecutadas
- Build frontend exitoso
- Puedes abrir:
  - /barberos
  - /agenda
  - /ventas
- Puedes crear:
  - barbero con usuario y foto
  - venta desde cita
  - venta de mostrador

---

## 13) Estructura de arquitectura

El proyecto sigue una organización por dominio en app/Domain:

- Contexto / Módulo / (Http, Models, Services, Repositories, Routes)

Ejemplo:

- app/Domain/Personal/Barberos/...
- app/Domain/Reservas/Citas/...
- app/Domain/Ventas/Gestion/...

Esto permite mantener reglas de negocio agrupadas por contexto funcional y escalables.

---

## 14) Notas para producción

Antes de desplegar:

- APP_ENV=production
- APP_DEBUG=false
- Configurar APP_URL
- Configurar DB y colas productivas
- Ejecutar:
  - php artisan config:cache
  - php artisan route:cache
  - php artisan view:cache
  - npm run build

---

## 15) Contacto técnico

Si el equipo define nuevas reglas de negocio (por ejemplo, dueño único por barbería, devoluciones de ventas, o control avanzado de inventario), se recomienda implementar primero la validación en capa Service y luego reflejarla en UI para mantener consistencia.
