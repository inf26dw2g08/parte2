import { useState, useEffect } from 'react';

function EquipmentFormModal({ isOpen, onClose, onSubmit, selectedItem, usersList, userRole }) {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    serial_number: '',
    equipment_type: 'desktop',
    status: 'em espera',
    budget_status: 'não aprovado',
    client_id: ''
  });

  useEffect(() => {
    if (selectedItem) {
      setForm({
        brand: selectedItem.brand || '',
        model: selectedItem.model || '',
        serial_number: selectedItem.serial_number || '',
        equipment_type: selectedItem.equipment_type || 'desktop',
        status: selectedItem.status || 'em espera',
        budget_status: selectedItem.budget_status || 'não aprovado',
        client_id: selectedItem.client_id || ''
      });
    } else {
      setForm({
        brand: '',
        model: '',
        serial_number: '',
        equipment_type: 'desktop',
        status: 'em espera',
        budget_status: 'não aprovado',
        client_id: userRole !== 'cliente' ? (usersList.find(u => u.role === 'cliente')?.id || '') : ''
      });
    }
  }, [selectedItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isClient = userRole === 'cliente';

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <div className="modal-header">
          <h3 className="modal-title">
            {selectedItem 
              ? (isClient ? 'Aprovar / Rejeitar Orçamento' : 'Editar Equipamento') 
              : 'Registar Novo Equipamento'}
          </h3>
          <span className="modal-close" onClick={onClose}>x</span>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Brand & Model - Read-only for Client on edit */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: HP, Apple, Samsung" 
                required 
                disabled={isClient && selectedItem}
                value={form.brand}
                onChange={e => setForm({...form, brand: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Modelo</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: LaserJet, iPhone 14" 
                required
                disabled={isClient && selectedItem}
                value={form.model}
                onChange={e => setForm({...form, model: e.target.value})}
              />
            </div>
          </div>

          {/* Serial Number - Read-only for Client on edit */}
          <div className="form-group">
            <label className="form-label">Número de Série (Único)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: SN-92381-XYZ" 
              disabled={isClient && selectedItem}
              value={form.serial_number}
              onChange={e => setForm({...form, serial_number: e.target.value})}
            />
          </div>

          <div className="form-grid">
            {/* Equipment Type - Read-only for Client on edit */}
            <div className="form-group">
              <label className="form-label">Tipo de Equipamento</label>
              <select 
                className="form-control"
                disabled={isClient && selectedItem}
                value={form.equipment_type}
                onChange={e => setForm({...form, equipment_type: e.target.value})}
              >
                <option value="desktop">Desktop</option>
                <option value="portatil">Portátil</option>
                <option value="telemovel">Telemóvel</option>
                <option value="impressora">Impressora</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            {/* Status (Repair state) - Disabled for Client always */}
            <div className="form-group">
              <label className="form-label">Estado de Reparação</label>
              <select 
                className="form-control"
                disabled={isClient}
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="em espera">Em espera</option>
                <option value="em reparação">Em reparação</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            {/* Budget status - Editable by Client on edit, or Tech on edit/create */}
            <div className="form-group" style={{ gridColumn: (isClient || selectedItem) ? '1 / -1' : 'auto' }}>
              <label className="form-label">Estado do Orçamento</label>
              <select 
                className="form-control"
                disabled={!selectedItem && isClient} // Default to 'não aprovado' on create for client
                value={form.budget_status}
                onChange={e => setForm({...form, budget_status: e.target.value})}
              >
                <option value="não aprovado">Não Aprovado</option>
                <option value="aprovado">Aprovado</option>
              </select>
            </div>

            {/* Owner - Only visible on creation for Admin/Tech */}
            {!selectedItem && userRole !== 'cliente' && (
              <div className="form-group">
                <label className="form-label">Proprietário (Cliente)</label>
                <select 
                  className="form-control"
                  required
                  value={form.client_id}
                  onChange={e => setForm({...form, client_id: e.target.value})}
                >
                  <option value="">Selecione um cliente</option>
                  {usersList.filter(u => u.role === 'cliente').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {selectedItem ? 'Salvar Alterações' : 'Registar Equipamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipmentFormModal;
