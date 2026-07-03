import { useState, useEffect } from 'react';

function UserFormModal({ isOpen, onClose, onSubmit, selectedItem, userRole }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente'
  });

  useEffect(() => {
    if (selectedItem) {
      setForm({
        name: selectedItem.name || '',
        email: selectedItem.email || '',
        password: '', // Do not populate password on edit
        role: selectedItem.role || 'cliente'
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'cliente'
      });
    }
  }, [selectedItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <div className="modal-header">
          <h3 className="modal-title">{selectedItem ? 'Editar Utilizador' : 'Criar Novo Utilizador'}</h3>
          <span className="modal-close" onClick={onClose}>x</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nome do utilizador"
              required
              disabled={selectedItem && !isAdmin} // Non-admins can't edit existing users details (admin only)
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Endereço de E-mail</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="utilizador@gmail.com"
              required
              disabled={selectedItem && !isAdmin}
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="form-grid">
            {!selectedItem && (
              <div className="form-group">
                <label className="form-label">Palavra-passe Inicial</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Mínimo 6 chars"
                  required
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            )}

            <div className="form-group" style={{ gridColumn: selectedItem ? '1 / -1' : 'auto' }}>
              <label className="form-label">Papel (Role)</label>
              <select 
                className="form-control"
                disabled={!isAdmin} // Non-admins (reparadores) can ONLY create 'cliente' role
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
              >
                <option value="cliente">Cliente</option>
                {isAdmin && <option value="reparador">Reparador</option>}
                {isAdmin && <option value="admin">Administrador</option>}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{selectedItem ? 'Salvar Alterações' : 'Criar Utilizador'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
