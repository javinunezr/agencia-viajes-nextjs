'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';

// Lazy loading de componentes
const DashboardStats = lazy(() => import('@/components/DashboardStats'));

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');

    if (!token) {
      router.push('/login');
      return;
    }

    setUserEmail(email);
    
    // Determinar rol del usuario
    const agentes = ['agente@agencia.cl', 'admin@agencia.cl'];
    setUserRole(agentes.includes(email) ? 'agente' : 'cliente');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1> Dashboard</h1>
        <p className="subtitle">Bienvenido al panel de control</p>

        <div className="user-info">
          <p><strong> Usuario:</strong> {userEmail}</p>
          <p><strong> Rol:</strong> {userRole === 'agente' ? ' Agente' : ' Cliente'}</p>
          <p><strong> Proveedor:</strong> Local</p>
        </div>

        <Suspense fallback={<div className="loading">⏳ Cargando estadísticas...</div>}>
          <DashboardStats />
        </Suspense>

        <div className="dashboard-actions">
          <button
            onClick={() => router.push('/solicitudes')}
            className="btn-primary"
          >
             Gestionar Solicitudes
          </button>
          <button onClick={handleLogout} className="btn-logout">
             Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
