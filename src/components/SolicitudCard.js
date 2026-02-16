export default function SolicitudCard({ solicitud, userRole, onDelete, formatearFecha }) {
  return (
    <div className="solicitud-card">
      <div className="solicitud-header-card">
        <span className="solicitud-id">
          {userRole === 'agente' && `📋 Solicitud #${solicitud.id}`}
          {userRole === 'cliente' && `📋 Solicitud de Viaje`}
        </span>
        <span className={`estado-badge estado-${solicitud.estado.replace(' ', '-')}`}>
          {solicitud.estado === 'pendiente' && '⏳'}
          {solicitud.estado === 'en proceso' && '🔄'}
          {solicitud.estado === 'finalizada' && '✅'}
          {' ' + solicitud.estado.toUpperCase()}
        </span>
      </div>

      <div className="solicitud-body">
        {userRole === 'agente' && (
          <div className="solicitud-info">
            <strong>🔢 ID Solicitud:</strong>
            <span className="id-correlativo">{solicitud.id}</span>
          </div>
        )}
        <div className="solicitud-info">
          <strong>👤 Cliente:</strong>
          <span>{solicitud.nombreCliente}</span>
        </div>
        <div className="solicitud-info">
          <strong>🆔 DNI:</strong>
          <span>{solicitud.dni}</span>
        </div>
        <div className="solicitud-info">
          <strong>🛫 Origen:</strong>
          <span>{solicitud.origen}</span>
        </div>
        <div className="solicitud-info">
          <strong>🛬 Destino:</strong>
          <span>{solicitud.destino}</span>
        </div>
        <div className="solicitud-info">
          <strong>✈️ Tipo:</strong>
          <span className="tipo-viaje">{solicitud.tipoViaje}</span>
        </div>
        <div className="solicitud-info">
          <strong>📅 Salida:</strong>
          <span>{formatearFecha(solicitud.fechaSalida)}</span>
        </div>
        <div className="solicitud-info">
          <strong>📅 Regreso:</strong>
          <span>{formatearFecha(solicitud.fechaRegreso)}</span>
        </div>
        <div className="solicitud-info">
          <strong>🕒 Registrado:</strong>
          <span>{formatearFecha(solicitud.fechaRegistro)}</span>
        </div>
      </div>

      {userRole === 'agente' && (
        <div className="solicitud-actions">
          <button
            onClick={() => onDelete(solicitud.id)}
            className="btn-delete"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
