'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <h1>✈️ Agencia de Viajes Oeste</h1>
          <p className="subtitle">Portal de Gestión de Reservas de Vuelos</p>
        </div>

        <div className="home-content">
          <p className="welcome-text">
            Bienvenido al sistema de gestión de solicitudes de viaje. 
            Por favor, inicia sesión o regístrate para continuar.
          </p>

          <div className="button-group">
            <button
              onClick={() => router.push('/login')}
              className="btn-primary"
            >
              🔐 Iniciar Sesión
            </button>
            <button
              onClick={() => router.push('/register')}
              className="btn-secondary"
            >
              📝 Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
