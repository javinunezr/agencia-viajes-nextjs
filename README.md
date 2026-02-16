# ✈️ Agencia de Viajes Oeste - Sistema de Gestión de Solicitudes

Sistema web profesional para la gestión de solicitudes de viajes, desarrollado con **Next.js 16** y **Express.js**.

## 🔐 Usuarios de Prueba

### Agente
- **Email:** `agente@agencia.cl`
- **Password:** `agente123`
- **Permisos:** Ver todas las solicitudes, eliminar solicitudes

### Cliente
- **Email:** `cliente@test.cl`
- **Password:** `cliente123`
- **Permisos:** Ver solo sus propias solicitudes

## 📡 API Endpoints

### Autenticación
- `POST /api/register` - Registro de nuevo usuario
- `POST /api/login` - Inicio de sesión
- `POST /api/logout` - Cerrar sesión
- `GET /api/profile` - Obtener perfil del usuario

### Solicitudes
- `GET /api/solicitudes` - Listar solicitudes
- `POST /api/solicitudes` - Crear solicitud
- `GET /api/solicitudes/:id` - Obtener solicitud específica
- `PUT /api/solicitudes/:id` - Actualizar solicitud
- `DELETE /api/solicitudes/:id` - Eliminar solicitud (solo agentes)

### Clientes
- `GET /api/clientes` - Listar clientes con autocompletado

## 🎯 Funcionalidades Principales

1. **Sistema de Autenticación** - Registro, login con JWT y rutas protegidas
2. **Gestión de Solicitudes** - CRUD completo de solicitudes de viaje
3. **Dashboard Interactivo** - Estadísticas y resumen en tiempo real
4. **Filtros Dinámicos** - Por estado de solicitud
5. **Validaciones** - DNI/RUT, fechas coherentes, campos obligatorios

