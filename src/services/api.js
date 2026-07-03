const API_BASE_URL = 'http://localhost:3000';

let token = localStorage.getItem('token') || '';
let user = JSON.parse(localStorage.getItem('user')) || null;
const logListeners = [];

export const setAuthToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
    const decoded = JSON.parse(atob(newToken.split('.')[1]));
    user = decoded;
    localStorage.setItem('user', JSON.stringify(decoded));
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user = null;
  }
};

export const getAuthToken = () => token;
export const getLoggedUser = () => user;

export const subscribeToApiLogs = (callback) => {
  logListeners.push(callback);
  return () => {
    const index = logListeners.indexOf(callback);
    if (index > -1) logListeners.splice(index, 1);
  };
};

const notifyLogs = (log) => {
  logListeners.forEach(listener => listener(log));
};

export const apiCall = async (method, path, body = null) => {
  const url = `${API_BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    notifyLogs({
      time: new Date().toLocaleTimeString(),
      method,
      url: path,
      status: response.status,
      requestBody: body,
      responseData: data
    });

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro na comunicação com a API');
    }
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      notifyLogs({
        time: new Date().toLocaleTimeString(),
        method,
        url: path,
        status: 'FAILED',
        requestBody: body,
        responseData: { error: 'API Offline' }
      });
      throw new Error('A API parece estar offline. Garante que o servidor Node está a correr!');
    }
    throw err;
  }
};
