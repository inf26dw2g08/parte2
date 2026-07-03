import { Cpu, Wrench, Users, LogOut } from 'lucide-react';

function Sidebar({ user, view, setView, onLogout }) {
  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">R</div>
        <span className="logo-text">ReparaCenter</span>
      </div>

      <div className="user-card">
        <div className="name">{user.name || user.email}</div>
        <div className="role">{user.role}</div>
      </div>

      <ul className="nav-links">
        <li 
          className={`nav-item ${view === 'equipments' ? 'active' : ''}`}
          onClick={() => setView('equipments')}
        >
          <Cpu size={18} /> Equipamentos
        </li>
        <li 
          className={`nav-item ${view === 'repairs' ? 'active' : ''}`}
          onClick={() => setView('repairs')}
        >
          <Wrench size={18} /> Intervenções
        </li>
        {(user.role === 'admin' || user.role === 'reparador') && (
          <li 
            className={`nav-item ${view === 'users' ? 'active' : ''}`}
            onClick={() => setView('users')}
          >
            <Users size={18} /> Utilizadores
          </li>
        )}
        
        <button onClick={onLogout} className="btn logout-btn" style={{ width: '100%', marginTop: '32px' }}>
          <LogOut size={16} /> Terminar Sessão
        </button>
      </ul>
    </aside>
  );
}

export default Sidebar;
