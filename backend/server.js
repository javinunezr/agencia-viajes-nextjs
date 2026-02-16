import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const SECRET_KEY = 'agencia-viajes-oeste-secret-key-2026'; // Clave secreta para JWT

// Middleware
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en las peticiones

// Ruta del archivo de usuarios
const USERS_FILE = path.join(__dirname, 'users.json');
const SOLICITUDES_FILE = path.join(__dirname, 'solicitudes.json');

// ============================================
// FUNCIONES AUXILIARES - USUARIOS
// ============================================

// Leer usuarios del archivo JSON
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, retornar array vacío
    return [];
  }
}

// Guardar usuarios en el archivo JSON
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Buscar usuario por email
async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find(user => user.email === email);
}

// ============================================
// FUNCIONES AUXILIARES - SOLICITUDES
// ============================================

// Leer solicitudes del archivo JSON
async function readSolicitudes() {
  try {
    const data = await fs.readFile(SOLICITUDES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Guardar solicitudes en el archivo JSON
async function saveSolicitudes(solicitudes) {
  await fs.writeFile(SOLICITUDES_FILE, JSON.stringify(solicitudes, null, 2));
}

// Generar ID correlativo para solicitudes
async function generateSolicitudId() {
  const solicitudes = await readSolicitudes();
  if (solicitudes.length === 0) {
    return 1118; // ID inicial según especificación
  }
  const lastId = Math.max(...solicitudes.map(s => parseInt(s.id)));
  return lastId + 1;
}

// Obtener rol del usuario
function getUserRole(email) {
  const agentes = ['agente@agencia.cl', 'admin@agencia.cl'];
  return agentes.includes(email) ? 'agente' : 'cliente';
}

// Validar formato de DNI/RUT chileno
function validarDNI(dni) {
  const dniRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
  return dniRegex.test(dni);
}

// Validar formato de fecha
function validarFecha(fecha) {
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
}

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🛫 API de Agencia de Viajes Oeste',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      logout: 'POST /api/logout'
    }
  });
});

// REGISTRO DE USUARIOS
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Por favor, completa todos los campos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Por favor, ingresa un email válido' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      rol: getUserRole(email), // Asignar rol según el email
      createdAt: new Date().toISOString()
    };

    // Guardar usuario
    const users = await readUsers();
    users.push(newUser);
    await saveUsers(users);

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });

    console.log(`✅ Usuario registrado: ${email}`);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error del servidor al registrar usuario' 
    });
  }
});

// LOGIN DE USUARIOS
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Por favor, completa todos los campos' 
      });
    }

    // Buscar usuario
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas' 
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

    console.log(`✅ Login exitoso: ${email}`);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error del servidor al iniciar sesión' 
    });
  }
});

// LOGOUT (opcional - el logout real se hace en el cliente eliminando el token)
app.post('/api/logout', (req, res) => {
  res.json({ 
    message: 'Logout exitoso' 
  });
  console.log('✅ Logout realizado');
});

// Middleware para verificar token JWT (para rutas protegidas)
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ 
      error: 'No se proporcionó token de autenticación' 
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado' 
    });
  }
}

// Ruta protegida de ejemplo
app.get('/api/profile', verifyToken, async (req, res) => {
  const user = await findUserByEmail(req.user.email);
  if (user) {
    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// ============================================
// AUTENTICACIÓN OAUTH - GITHUB
// ============================================

// Configuración de OAuth
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'tu_github_client_id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'tu_github_client_secret';
const FRONTEND_URL = 'http://localhost:5173';

// ============================================
// RUTAS DE API - SOLICITUDES DE VIAJE
// ============================================

// CREAR SOLICITUD DE VIAJE
app.post('/api/solicitudes', verifyToken, async (req, res) => {
  try {
    const {
      dni,
      nombreCliente,
      origen,
      destino,
      tipoViaje,
      fechaSalida,
      fechaRegreso,
      estado
    } = req.body;

    // Validaciones en el servidor
    if (!dni || !nombreCliente || !origen || !destino || !tipoViaje || 
        !fechaSalida || !fechaRegreso || !estado) {
      return res.status(400).json({ 
        error: 'Por favor, completa todos los campos obligatorios' 
      });
    }

    // Validar formato de DNI
    if (!validarDNI(dni)) {
      return res.status(400).json({ 
        error: 'Formato de DNI inválido. Debe ser formato: 12345678-9' 
      });
    }

    // Validar fechas
    if (!validarFecha(fechaSalida) || !validarFecha(fechaRegreso)) {
      return res.status(400).json({ 
        error: 'Formato de fecha inválido' 
      });
    }

    // Validar que fecha de regreso sea posterior a fecha de salida
    const salida = new Date(fechaSalida);
    const regreso = new Date(fechaRegreso);
    if (regreso <= salida) {
      return res.status(400).json({ 
        error: 'La fecha de regreso debe ser posterior a la fecha de salida' 
      });
    }

    // Validar tipo de viaje
    const tiposValidos = ['negocios', 'turismo', 'otros'];
    if (!tiposValidos.includes(tipoViaje)) {
      return res.status(400).json({ 
        error: 'Tipo de viaje no válido' 
      });
    }

    // Validar estado
    const estadosValidos = ['pendiente', 'en proceso', 'finalizada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado no válido' 
      });
    }

    // Generar ID correlativo
    const id = await generateSolicitudId();

    // Crear nueva solicitud
    const nuevaSolicitud = {
      id: id.toString(),
      dni,
      nombreCliente,
      origen,
      destino,
      tipoViaje,
      fechaSalida,
      fechaRegreso,
      fechaRegistro: new Date().toISOString(),
      estado,
      usuarioEmail: req.user.email
    };

    // Guardar solicitud
    const solicitudes = await readSolicitudes();
    solicitudes.push(nuevaSolicitud);
    await saveSolicitudes(solicitudes);

    res.status(201).json({
      message: 'Solicitud de viaje registrada exitosamente',
      solicitud: nuevaSolicitud
    });

    console.log(`✅ Solicitud creada #${id} por ${req.user.email}`);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ 
      error: 'Error del servidor al crear solicitud' 
    });
  }
});

// LISTAR TODAS LAS SOLICITUDES (con filtros por rol y estado)
app.get('/api/solicitudes', verifyToken, async (req, res) => {
  try {
    const solicitudes = await readSolicitudes();
    const { estado } = req.query;
    const userEmail = req.user.email;
    const userRole = getUserRole(userEmail);
    
    let solicitudesFiltradas = solicitudes;
    
    // Clientes solo ven sus propias solicitudes
    if (userRole === 'cliente') {
      solicitudesFiltradas = solicitudes.filter(s => s.usuarioEmail === userEmail);
    }
    
    // Filtrar por estado si se proporciona
    if (estado && estado !== 'todas') {
      solicitudesFiltradas = solicitudesFiltradas.filter(s => s.estado === estado);
    }
    
    // Devolver solicitudes y rol del usuario
    res.json({ 
      solicitudes: solicitudesFiltradas,
      rol: userRole 
    });
  } catch (error) {
    console.error('Error al listar solicitudes:', error);
    res.status(500).json({ 
      error: 'Error del servidor al obtener solicitudes' 
    });
  }
});

// OBTENER UNA SOLICITUD POR ID
app.get('/api/solicitudes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const solicitudes = await readSolicitudes();
    const solicitud = solicitudes.find(s => s.id === id);

    if (!solicitud) {
      return res.status(404).json({ 
        error: 'Solicitud no encontrada' 
      });
    }

    res.json({ solicitud });
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ 
      error: 'Error del servidor al obtener solicitud' 
    });
  }
});

// ACTUALIZAR SOLICITUD
app.put('/api/solicitudes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dni,
      nombreCliente,
      origen,
      destino,
      tipoViaje,
      fechaSalida,
      fechaRegreso,
      estado
    } = req.body;

    // Validaciones similares al crear
    if (!dni || !nombreCliente || !origen || !destino || !tipoViaje || 
        !fechaSalida || !fechaRegreso || !estado) {
      return res.status(400).json({ 
        error: 'Por favor, completa todos los campos obligatorios' 
      });
    }

    if (!validarDNI(dni)) {
      return res.status(400).json({ 
        error: 'Formato de DNI inválido' 
      });
    }

    const solicitudes = await readSolicitudes();
    const index = solicitudes.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ 
        error: 'Solicitud no encontrada' 
      });
    }

    // Actualizar solicitud
    solicitudes[index] = {
      ...solicitudes[index],
      dni,
      nombreCliente,
      origen,
      destino,
      tipoViaje,
      fechaSalida,
      fechaRegreso,
      estado,
      fechaActualizacion: new Date().toISOString()
    };

    await saveSolicitudes(solicitudes);

    res.json({
      message: 'Solicitud actualizada exitosamente',
      solicitud: solicitudes[index]
    });

    console.log(`✅ Solicitud #${id} actualizada`);
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ 
      error: 'Error del servidor al actualizar solicitud' 
    });
  }
});

// ELIMINAR SOLICITUD (solo agentes)
app.delete('/api/solicitudes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const userRole = getUserRole(userEmail);
    
    // Verificar que el usuario sea agente
    if (userRole !== 'agente') {
      return res.status(403).json({ 
        error: 'Solo los agentes pueden eliminar solicitudes' 
      });
    }
    
    const solicitudes = await readSolicitudes();
    const index = solicitudes.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ 
        error: 'Solicitud no encontrada' 
      });
    }

    solicitudes.splice(index, 1);
    await saveSolicitudes(solicitudes);

    res.json({
      message: 'Solicitud eliminada exitosamente'
    });

    console.log(`✅ Solicitud #${id} eliminada por ${userEmail}`);
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ 
      error: 'Error del servidor al eliminar solicitud' 
    });
  }
});

// OBTENER LISTADO DE CLIENTES (para el campo de búsqueda)
app.get('/api/clientes', verifyToken, async (req, res) => {
  try {
    const solicitudes = await readSolicitudes();
    
    // Obtener lista única de clientes
    const clientesSet = new Set();
    solicitudes.forEach(s => clientesSet.add(s.nombreCliente));
    
    const clientes = Array.from(clientesSet).sort();
    
    res.json({ clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ 
      error: 'Error del servidor al obtener clientes' 
    });
  }
});

// ============================================
// AUTENTICACIÓN OAUTH - GITHUB (continuación)
// ============================================


// Ruta para iniciar autenticación con GitHub
app.get('/api/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3001/api/auth/github/callback&scope=user:email`;
  res.redirect(githubAuthUrl);
});

// Callback de GitHub
app.get('/api/auth/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=no_code`);
  }

  try {
    // Intercambiar código por token de acceso
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=no_access_token`);
    }

    // Obtener información del usuario
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = await userResponse.json();

    // Obtener email del usuario (puede ser privado)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find(e => e.primary)?.email || userData.email || `${userData.login}@github.com`;

    // Generar token JWT para nuestra aplicación
    const token = jwt.sign(
      { 
        id: userData.id.toString(), 
        email: primaryEmail,
        name: userData.name || userData.login,
        provider: 'github'
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Redirigir al frontend con el token
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&email=${encodeURIComponent(primaryEmail)}&name=${encodeURIComponent(userData.name || userData.login)}&provider=github`);
    
    console.log(`✅ Autenticación GitHub exitosa: ${primaryEmail}`);
  } catch (error) {
    console.error('Error en autenticación GitHub:', error);
    res.redirect(`${FRONTEND_URL}/auth/callback?error=github_auth_failed`);
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🛫 ========================================');
  console.log('   Agencia de Viajes Oeste - Backend API');
  console.log('   ========================================');
  console.log(`   🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`   📁 Usuarios: ${USERS_FILE}`);
  console.log(`   📝 Solicitudes: ${SOLICITUDES_FILE}`);
  console.log('   ========================================');
  console.log('   Endpoints disponibles:');
  console.log('   - POST   /api/register');
  console.log('   - POST   /api/login');
  console.log('   - POST   /api/logout');
  console.log('   - GET    /api/profile');
  console.log('   - POST   /api/solicitudes');
  console.log('   - GET    /api/solicitudes');
  console.log('   - GET    /api/solicitudes/:id');
  console.log('   - PUT    /api/solicitudes/:id');
  console.log('   - DELETE /api/solicitudes/:id');
  console.log('   - GET    /api/clientes');
  console.log('   ========================================');
  console.log('');
});
