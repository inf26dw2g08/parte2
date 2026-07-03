import { useState } from 'react';
import { Key } from 'lucide-react';

function Login({ onLoginSuccess, onGoToRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(form.username, form.password);
  };

  return (
    <div className="auth-page fade-in" style={{ width: '100%' }}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 16px auto' }}>R</div>
          <h1>Iniciar Sessão</h1>
          <p>Portal de Gestão de Reparações Eletrónicas</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Endereço de E-mail</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="exemplo@gmail.com"
              required
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Palavra-passe</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Digite a sua palavra-passe"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
            <Key size={18} /> Entrar com OAuth 2.0
          </button>
        </form>
        <div className="auth-footer">
          Ainda não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); onGoToRegister(); }}>Criar conta de Cliente</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
