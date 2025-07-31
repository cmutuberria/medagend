# 🏥 Caso de Negocio: Aplicación de Gestión de Citas para Profesionales de la Salud Independientes

## 📌 Problema

Doctores y enfermeros independientes suelen depender de métodos manuales, redes sociales, llamadas o aplicaciones genéricas para agendar citas y coordinar pagos con sus pacientes. Esto genera:

- Pérdida de tiempo en la coordinación.
- Dificultades para asegurar pagos anticipados.
- Falta de historial de citas y estadísticas.
- Problemas para manejar cancelaciones o reembolsos.

## 🎯 Solución

Desarrollar una aplicación web/móvil que permita a profesionales de la salud:

- Crear su perfil profesional.
- Establecer disponibilidad.
- Recibir reservas de citas.
- Cobrar pagos anticipados (con tarjeta, Zelle, etc.).
- Gestionar cancelaciones, reembolsos y recordatorios automáticos.
- Consultar reportes de citas y pagos.

## 👥 Usuarios Objetivo

- Doctores independientes (médicos generales, pediatras, dermatólogos, etc.).
- Enfermeros/as o paramédicos que ofrecen atención a domicilio.
- Especialistas que atienden en consultorios alquilados o de forma itinerante.

## 💻 Características Clave

- **Agenda inteligente**: Calendario de disponibilidad editable.
- **Sistema de pagos**: Integración con Stripe, PayPal u otros.
- **Gestión de pacientes**: Perfil, historial, notas clínicas básicas.
- **Recordatorios**: Notificaciones por email y/o SMS.
- **Panel del profesional**: Dashboard con métricas y control financiero.
- **Panel del paciente**: Reservas, pagos y reprogramaciones.
- **Política de cancelación configurable**.

## 💰 Modelo de Negocio

- **Freemium**: Gratis con funciones básicas. Plan Premium con más funcionalidades.
- **Comisión por transacción**: Porcentaje fijo del pago procesado (ej. 5%).
- **Suscripción mensual**: Planes para desbloquear más pacientes o herramientas avanzadas (ej. reportes, historial clínico).

## 🛠️ Tecnología Propuesta

- **Frontend**: React (con NX monorepo), GraphQL Apollo Client.
- **Backend**: NestJS con GraphQL (Apollo Server).
- **Base de datos**: PostgreSQL (con Prisma o TypeORM).
- **Autenticación**: Auth0, Firebase Auth o JWT personalizado.
- **Pagos**: Stripe (opcionalmente MercadoPago para LatAm).
- **Notificaciones**: Email (SendGrid) y SMS (Twilio).

---

# ✅ Roadmap MVP: Listado de Tareas

## 🔧 1. Configuración Inicial del Entorno

- [ ] Crear workspace con NX (`npx create-nx-workspace`)
- [ ] Agregar apps: `frontend` (React), `backend` (NestJS)
- [ ] Configurar GraphQL en NestJS (con Apollo Server)
- [ ] Configurar GraphQL Apollo Client en React
- [ ] Configurar base de datos (PostgreSQL) y ORM (Prisma o TypeORM)
- [ ] Configurar autenticación básica con JWT

## 👨‍⚕️ 2. Gestión de Usuarios

- [ ] Registro e inicio de sesión para doctores/enfermeros
- [ ] Registro e inicio de sesión para pacientes
- [ ] Perfiles de usuario (nombre, foto, especialidad, descripción)
- [ ] Verificación de identidad opcional (documento/licencia)

## 🗓️ 3. Gestión de Disponibilidad y Citas

- [ ] Crear interfaz de calendario editable para disponibilidad
- [ ] Mostrar horarios disponibles a los pacientes
- [ ] Agendar cita (selección de horario)
- [ ] Confirmación automática de cita
- [ ] CRUD de citas (ver, editar, cancelar)
- [ ] Cancelación con política de aviso anticipado

## 💳 4. Pagos Anticipados

- [ ] Integrar Stripe (cuentas conectadas por profesional)
- [ ] Lógica de cobro automático al reservar cita
- [ ] Reembolsos según política de cancelación
- [ ] Historial de pagos y facturas

## 🔔 5. Notificaciones y Recordatorios

- [ ] Confirmación de cita por email
- [ ] Recordatorios automáticos (24h y 1h antes)
- [ ] Email resumen semanal al profesional

## 📊 6. Paneles de Control

- [ ] Dashboard del profesional (citas, ingresos, próximos pacientes)
- [ ] Dashboard del paciente (citas futuras, historial)
- [ ] Filtros por fecha, estado, especialidad

## 🚀 7. Extras (Versión Avanzada / Premium)

- [ ] Video-consulta integrada (Zoom, Daily, WebRTC)
- [ ] Notas clínicas privadas
- [ ] Recetas y archivos adjuntos
- [ ] Reportes y estadísticas
- [ ] App móvil (React Native)
