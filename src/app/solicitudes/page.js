'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getSolicitudes, createSolicitud, deleteSolicitud, getClientes } from '@/lib/api';
import SkeletonSolicitud from '@/components/SkeletonSolicitud';

// Lazy loading de componentes con delay simulado de 3 segundos
const SolicitudCard = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('@/components/SolicitudCard'));
    }, 3000);
  });
});

const FiltrosEstado = lazy(() => import('@/components/FiltrosEstado'));

export default function Solicitudes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('formulario');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('cliente');
  const [estadoFilter, setEstadoFilter] = useState('todas');

  const [formData, setFormData] = useState({
    dni: '',
    nombreCliente: '',
    origen: '',
    destino: '',
    tipoViaje: 'turismo',
    fechaSalida: '',
    fechaRegreso: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (activeTab === 'listado') {
      cargarSolicitudes();
    }
  }, [router, activeTab, estadoFilter]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await getSolicitudes(estadoFilter);
      setSolicitudes(data.solicitudes || []);
      setUserRole(data.rol || 'cliente');
    } catch (err) {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarDNI = (dni) => {
    const dniRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
    return dniRegex.test(dni);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validarDNI(formData.dni)) {
      setError('Formato de DNI inválido. Debe ser: 12345678-9');
      return;
    }

    if (!formData.nombreCliente.trim() || !formData.origen.trim() || !formData.destino.trim()) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!formData.fechaSalida || !formData.fechaRegreso) {
      setError('Por favor selecciona las fechas de viaje');
      return;
    }

    const salida = new Date(formData.fechaSalida);
    const regreso = new Date(formData.fechaRegreso);
    if (regreso <= salida) {
      setError('La fecha de regreso debe ser posterior a la fecha de salida');
      return;
    }

    try {
      setLoading(true);
      const data = await createSolicitud(formData);
      setSuccess(`✅ Solicitud #${data.solicitud.id} registrada exitosamente`);
      
      setFormData({
        dni: '',
        nombreCliente: '',
        origen: '',
        destino: '',
        tipoViaje: 'turismo',
        fechaSalida: '',
        fechaRegreso: '',
        estado: 'pendiente'
      });

      setTimeout(() => {
        setActiveTab('listado');
        cargarSolicitudes();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;

    try {
      await deleteSolicitud(id);
      alert('✅ Solicitud eliminada exitosamente');
      cargarSolicitudes();
    } catch (err) {
      alert(err.message || 'Error al eliminar solicitud');
    }
  };

  const formatearFecha = (isoString) => {
    const date = new Date(isoString);
    const opciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleString('es-CL', opciones);
  };

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-card">
        <div className="solicitudes-header">
          <h1>Gestión de Solicitudes de Viaje</h1>
          <div>
            <span className="user-role-badge">
              {userRole === 'agente' ? '👨‍💼 Agente' : '👤 Cliente'}
            </span>
            <button onClick={() => router.push('/dashboard')} className="btn-volver">
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'formulario' ? 'active' : ''}`}
            onClick={() => setActiveTab('formulario')}
          >
            📝 Nueva Solicitud
          </button>
          <button
            className={`tab ${activeTab === 'listado' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('listado');
              cargarSolicitudes();
            }}
          >
            📋 Listado de Solicitudes
          </button>
        </div>

        {activeTab === 'formulario' && (
          <div className="tab-content">
            <h2>Registro de Nueva Solicitud</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="solicitud-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dni">DNI / RUT del Cliente *</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="12345678-9"
                    required
                  />
                  <small>Formato: 12345678-9</small>
                </div>

                <div className="form-group">
                  <label htmlFor="nombreCliente">Nombre del Cliente *</label>
                  <input
                    type="text"
                    id="nombreCliente"
                    name="nombreCliente"
                    value={formData.nombreCliente}
                    onChange={handleChange}
                    placeholder="Esteban Castro Paredes"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="origen">Origen *</label>
                  <input
                    type="text"
                    id="origen"
                    name="origen"
                    value={formData.origen}
                    onChange={handleChange}
                    placeholder="Santiago, Chile"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destino">Destino *</label>
                  <input
                    type="text"
                    id="destino"
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    placeholder="Madrid, España"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipoViaje">Tipo de Viaje *</label>
                  <select
                    id="tipoViaje"
                    name="tipoViaje"
                    value={formData.tipoViaje}
                    onChange={handleChange}
                    required
                  >
                    <option value="turismo">Turismo</option>
                    <option value="negocios">Negocios</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado de la Solicitud *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="estado"
                        value="pendiente"
                        checked={formData.estado === 'pendiente'}
                        onChange={handleChange}
                      />
                      <span>Pendiente</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="estado"
                        value="en proceso"
                        checked={formData.estado === 'en proceso'}
                        onChange={handleChange}
                      />
                      <span>En Proceso</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="estado"
                        value="finalizada"
                        checked={formData.estado === 'finalizada'}
                        onChange={handleChange}
                      />
                      <span>Finalizada</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaSalida">Fecha y Hora de Salida *</label>
                  <input
                    type="datetime-local"
                    id="fechaSalida"
                    name="fechaSalida"
                    value={formData.fechaSalida}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fechaRegreso">Fecha y Hora de Regreso *</label>
                  <input
                    type="datetime-local"
                    id="fechaRegreso"
                    name="fechaRegreso"
                    value={formData.fechaRegreso}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '⏳ Registrando...' : '✈️ Registrar Solicitud'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'listado' && (
          <div className="tab-content">
            <h2>Solicitudes Registradas</h2>
            
            <Suspense fallback={<div className="loading">⏳ Cargando filtros...</div>}>
              <FiltrosEstado estadoActual={estadoFilter} onCambiarEstado={setEstadoFilter} />
            </Suspense>

            {loading && (
              <div className="solicitudes-list">
                <SkeletonSolicitud />
                <SkeletonSolicitud />
                <SkeletonSolicitud />
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {!loading && solicitudes.length === 0 && (
              <div className="empty-state">
                <p>📭 No hay solicitudes registradas</p>
                <button onClick={() => setActiveTab('formulario')} className="btn-primary">
                  Crear primera solicitud
                </button>
              </div>
            )}

            {!loading && solicitudes.length > 0 && (
              <div className="solicitudes-list">
                <div className="solicitudes-count">
                  Total: {solicitudes.length} solicitud(es)
                </div>
                {solicitudes.map((solicitud) => (
                  <Suspense key={solicitud.id} fallback={<SkeletonSolicitud />}>
                    <SolicitudCard
                      solicitud={solicitud}
                      userRole={userRole}
                      onDelete={handleDelete}
                      formatearFecha={formatearFecha}
                    />
                  </Suspense>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
