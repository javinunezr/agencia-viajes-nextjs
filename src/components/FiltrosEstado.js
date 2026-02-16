export default function FiltrosEstado({ estadoActual, onCambiarEstado }) {
  const estados = [
    { id: 'todas', label: '📋 Todas', emoji: '' },
    { id: 'pendiente', label: 'Pendiente', emoji: '⏳' },
    { id: 'en proceso', label: 'En Proceso', emoji: '🔄' },
    { id: 'finalizada', label: 'Finalizada', emoji: '✅' }
  ];

  return (
    <div className="filtros-estado">
      <h3>Filtrar por estado:</h3>
      <div className="filtros-buttons">
        {estados.map((estado) => (
          <button
            key={estado.id}
            className={`filtro-btn ${estadoActual === estado.id ? 'active' : ''}`}
            onClick={() => onCambiarEstado(estado.id)}
          >
            {estado.emoji} {estado.label}
          </button>
        ))}
      </div>
    </div>
  );
}
