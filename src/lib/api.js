const API_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  return data;
};

export const registerUser = async (email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};

export const getClientes = async () => {
  const response = await fetch(`${API_URL}/clientes`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const getSolicitudes = async (estado = 'todas') => {
  const url = estado !== 'todas' 
    ? `${API_URL}/solicitudes?estado=${estado}` 
    : `${API_URL}/solicitudes`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};

export const createSolicitud = async (formData) => {
  const response = await fetch(`${API_URL}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(formData)
  });
  return handleResponse(response);
};

export const deleteSolicitud = async (id) => {
  const response = await fetch(`${API_URL}/solicitudes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
};
