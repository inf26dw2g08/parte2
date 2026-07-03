import { useState } from 'react';
import { UserPlus } from 'lucide-react';

function Register({ onRegisterSuccess, onGoToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterSuccess(form.name, form.email, form.password);
  };

  return (
    <div className="auth-page fade-in" style={{ width: '100%' }}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 16px auto' }}>R</div>
          <h1>Registo de Cliente</h1>
          <p>Crie a sua conta para solicitar assistências</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="O seu nome"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Endereço de E-mail</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="seuemail@gmail.com"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Palavra-passe</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Minimo 6 caracteres"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
            <UserPlus size={18} /> Confirmar Registo
          </button>
        </form>
        <div className="auth-footer">
          Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onGoToLogin(); }}>Fazer Login</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
