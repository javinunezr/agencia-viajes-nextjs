# ✈️ Agencia de Viajes Oeste - Sistema de Gestión de Solicitudes

Sistema web profesional para la gestión de solicitudes de viajes, desarrollado con **Next.js 16** y **Express.js**. Incluye autenticación JWT, gestión de estados, y una interfaz moderna y responsiva.

## 🚀 Características

### Frontend (Next.js)
- ✅ **Next.js 16** con App Router y Turbopack
- ✅ **React 19** con Hooks modernos
- ✅ **Lazy Loading** y Suspense para optimización de carga
- ✅ **Skeleton Loaders** para mejor UX
- ✅ **CSS Modules** con diseño corporativo profesional
- ✅ **Responsive Design** adaptado a móviles y tablets
- ✅ **Autenticación JWT** con localStorage
- ✅ **Filtros dinámicos** por estado de solicitudes

### Backend (Express)
- ✅ **Express.js** con API RESTful
- ✅ **JWT** (JSON Web Tokens) para autenticación
- ✅ **bcrypt** para hash de contraseñas
- ✅ **CORS** configurado para desarrollo
- ✅ **Persistencia en JSON** (archivos locales)
- ✅ **Validación de datos** en servidor

## 🎨 Paleta de Colores Corporativa

```css
--primary: #1e3a8a        /* Azul corporativo oscuro */
--primary-light: #3b82f6  /* Azul brillante */
--accent: #f97316         /* Naranja corporativo */
--secondary: #10b981      /* Verde éxito */
--danger: #dc2626         /* Rojo peligro */
```

## 📋 Requisitos Previos

- **Node.js** 18.0 o superior
- **npm** 9.0 o superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/agencia-viajes-nextjs.git
cd agencia-viajes-nextjs
```

### 2. Instalar dependencias del Frontend

```bash
npm install
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

## 🚀 Ejecución

### Terminal 1 - Backend:
```bash
cd backend
npm start
```
El backend estará disponible en: `http://localhost:3001`

### Terminal 2 - Frontend:
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
agencia-viajes-nextjs/
├── src/
│   ├── app/
│   │   ├── page.js              # Página de inicio
│   │   ├── layout.js            # Layout principal
│   │   ├── globals.css          # Estilos globales
│   │   ├── login/               # Página de login
│   │   ├── register/            # Página de registro
│   │   ├── dashboard/           # Dashboard principal
│   │   └── solicitudes/         # Gestión de solicitudes
│   ├── components/
│   │   ├── DashboardStats.js    # Estadísticas del dashboard
│   │   ├── FiltrosEstado.js     # Filtros de estado
│   │   ├── SolicitudCard.js     # Tarjeta de solicitud
│   │   └── SkeletonSolicitud.js # Skeleton loader
│   └── lib/
│       └── api.js               # Funciones API
├── backend/
│   ├── server.js                # Servidor Express
│   ├── users.json               # Base de datos de usuarios
│   ├── solicitudes.json         # Base de datos de solicitudes
│   └── package.json             # Dependencias del backend
└── package.json                 # Dependencias del frontend
```

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

## 🎨 Características de UI/UX

- ✨ Animaciones suaves con CSS
- 🎭 Skeleton Loaders durante la carga
- 📱 Diseño responsive para móviles
- 🎨 Gradientes corporativos profesionales
- 🔄 Lazy Loading de componentes
- ⚡ Hot Module Replacement

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Validación de datos en cliente y servidor
- ✅ CORS configurado correctamente
- ✅ Protección de rutas privadas

## 📚 Tecnologías Utilizadas

### Frontend
- Next.js 16.1.6
- React 19
- CSS3 (Variables CSS, Flexbox, Grid)

### Backend
- Express 4.18.2
- JSON Web Tokens 9.0.2
- bcryptjs 2.4.3
- cors 2.8.5

## 👥 Autor

**Javier** - Desarrollo Frontend III - Semana 1

---

**Desarrollado con ❤️ para Agencia de Viajes Oeste**
