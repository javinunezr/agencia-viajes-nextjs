'use client';

import { useState, useEffect } from 'react';

export default function FormularioSolicitud({ onSubmit, loading, error, success }) {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);

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

  const handleSearchCliente = (value) => {
    setSearchTerm(value);
    setFormData({ ...formData, nombreCliente: value });
    if (value.length >= 2 && clientes.length > 0) {
      const filtered = clientes.filter(cliente =>
        cliente.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClientes(filtered);
      setShowClienteDropdown(true);
    } else {
      setFilteredClientes([]);
      setShowClienteDropdown(false);
    }
  };

  const selectCliente = (cliente) => {
    setFormData({ ...formData, nombreCliente: cliente });
    setSearchTerm(cliente);
    setShowClienteDropdown(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, () => {
      // Reset form
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
      setSearchTerm('');
    });
  };

  return (
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
            <div className="autocomplete-wrapper">
              <input
                type="text"
                id="nombreCliente"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={(e) => handleSearchCliente(e.target.value)}
                onFocus={() => {
                  if (filteredClientes.length > 0) {
                    setShowClienteDropdown(true);
                  }
                }}
                placeholder="Buscar o ingresar nombre completo"
                required
              />
              {showClienteDropdown && filteredClientes.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredClientes.map((cliente, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => selectCliente(cliente)}
                    >
                      {cliente}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                <span>⏳ Pendiente</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="estado"
                  value="en proceso"
                  checked={formData.estado === 'en proceso'}
                  onChange={handleChange}
                />
                <span>🔄 En Proceso</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="estado"
                  value="finalizada"
                  checked={formData.estado === 'finalizada'}
                  onChange={handleChange}
                />
                <span>✅ Finalizada</span>
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
  );
}
