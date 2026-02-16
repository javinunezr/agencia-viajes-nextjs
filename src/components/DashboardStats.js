'use client';

import { useEffect, useState } from 'react';
import { getSolicitudes } from '@/lib/api';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    finalizadas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await getSolicitudes('todas');
      const solicitudes = data.solicitudes || [];
      
      setStats({
        total: solicitudes.length,
        pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
        enProceso: solicitudes.filter(s => s.estado === 'en proceso').length,
        finalizadas: solicitudes.filter(s => s.estado === 'finalizada').length
      });
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">⏳ Cargando estadísticas...</div>;
  }

  return (
    <div className="dashboard-stats">
      <h3>📊 Estadísticas de Solicitudes</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-emoji">📋</span>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">⏳</span>
          <span className="stat-number">{stats.pendientes}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">🔄</span>
          <span className="stat-number">{stats.enProceso}</span>
          <span className="stat-label">En Proceso</span>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">✅</span>
          <span className="stat-number">{stats.finalizadas}</span>
          <span className="stat-label">Finalizadas</span>
        </div>
      </div>
    </div>
  );
}
