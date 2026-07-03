import { useState, useEffect } from 'react';

function RepairFormModal({ isOpen, onClose, onSubmit, selectedItem, equipments, usersList, userRole, defaultEqId }) {
  const [form, setForm] = useState({
    equipment_id: '',
    description: '',
    status: 'Pendente',
    repairer_id: ''
  });

  useEffect(() => {
    if (selectedItem) {
      setForm({
        equipment_id: selectedItem.equipment_id || '',
        description: selectedItem.description || '',
        status: selectedItem.status || 'Pendente',
        repairer_id: selectedItem.repairer_id || ''
      });
    } else {
      setForm({
        equipment_id: defaultEqId || (equipments[0]?.id || ''),
        description: '',
        status: 'Pendente',
        repairer_id: userRole !== 'cliente' ? (usersList.find(u => u.role === 'reparador' || u.role === 'admin')?.id || '') : ''
      });
    }
  }, [selectedItem, isOpen, defaultEqId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const getClientName = (clientId) => {
    const client = usersList.find(u => u.id === clientId);
    return client ? client.name : `Cliente ID: ${clientId}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <div className="modal-header">
          <h3 className="modal-title">{selectedItem ? 'Atualizar Intervenção Técnica' : 'Registar Intervenção Técnica'}</h3>
          <span className="modal-close" onClick={onClose}>x</span>
        </div>
        <form onSubmit={handleSubmit}>
          {!selectedItem && (
            <div className="form-group">
              <label className="form-label">Selecione o Equipamento</label>
              <select 
                className="form-control"
                required
                value={form.equipment_id}
                onChange={e => setForm({...form, equipment_id: e.target.value})}
              >
                <option value="">Selecione...</option>
                {equipments.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    [{eq.brand} {eq.model}] - S/N: {eq.serial_number || 'S/N'} ({getClientName(eq.client_id)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Descrição Detalhada do Problema / Intervenção</label>
            <textarea 
              rows="4" 
              className="form-control" 
              placeholder="Descreva a avaria técnica ou intervenção feita..."
              required
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Estado da Intervenção</label>
              <select 
                className="form-control"
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Analise">Em Análise</option>
                <option value="Aguardando Aprovacao">Aguardando Aprovação</option>
                <option value="Em Reparacao">Em Reparação</option>
                <option value="Concluido">Concluído</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>

            {userRole !== 'cliente' && (
              <div className="form-group">
                <label className="form-label">Técnico Encarregue</label>
                <select 
                  className="form-control"
                  value={form.repairer_id}
                  onChange={e => setForm({...form, repairer_id: e.target.value})}
                >
                  <option value="">Sem técnico atribuído</option>
                  {usersList.filter(u => u.role === 'reparador' || u.role === 'admin').map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name} ({tech.role})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{selectedItem ? 'Guardar Alterações' : 'Gravar Intervenção'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RepairFormModal;
