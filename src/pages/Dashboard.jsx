import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Wrench, 
  Cpu, 
  Laptop, 
  Smartphone, 
  Printer, 
  Monitor, 
  Users 
} from 'lucide-react';

function Dashboard({ 
  view, 
  user, 
  equipments, 
  repairs, 
  usersList, 
  onOpenCreateEq, 
  onOpenEditEq, 
  onDeleteEq, 
  onOpenCreateRep, 
  onOpenEditRep, 
  onDeleteRep, 
  onOpenCreateUser, 
  onOpenEditUser, 
  onDeleteUser 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRepairStatus, setFilterRepairStatus] = useState('');

  // Icon selector helper
  const getEquipmentIcon = (type) => {
    switch (type) {
      case 'portatil': return <Laptop size={18} />;
      case 'telemovel': return <Smartphone size={18} />;
      case 'impressora': return <Printer size={18} />;
      case 'desktop': return <Monitor size={18} />;
      default: return <Cpu size={18} />;
    }
  };

  // Client name helper
  const getClientName = (clientId) => {
    if (user?.role === 'cliente') return user.name;
    const client = usersList.find(u => u.id === clientId);
    return client ? client.name : `Cliente ID: ${clientId}`;
  };

  // Technician name helper
  const getTechnicianName = (techId) => {
    if (!techId) return 'Sem Técnico Atribuído';
    const tech = usersList.find(u => u.id === techId);
    return tech ? tech.name : `Técnico ID: ${techId}`;
  };

  // Filters logic
  const filteredEquipments = equipments.filter(item => {
    const matchesSearch = 
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType ? item.equipment_type === filterType : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredRepairs = repairs.filter(item => {
    const matchesSearch = 
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterRepairStatus ? item.status === filterRepairStatus : true;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = usersList.filter(item => {
    return (
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const isClient = user?.role === 'cliente';
  const isAdmin = user?.role === 'admin';
  const isTech = user?.role === 'reparador';

  return (
    <div className="glass-card fade-in">
      {/* Search & Filter Controls */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Pesquisar..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          {view === 'equipments' && (
            <>
              <select 
                className="form-control"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="desktop">Desktop</option>
                <option value="portatil">Portátil</option>
                <option value="telemovel">Telemóvel</option>
                <option value="impressora">Impressora</option>
                <option value="outros">Outros</option>
              </select>

              <select 
                className="form-control"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os estados</option>
                <option value="em espera">Em espera</option>
                <option value="em reparação">Em reparação</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </>
          )}

          {view === 'repairs' && (
            <select 
              className="form-control"
              value={filterRepairStatus}
              onChange={e => setFilterRepairStatus(e.target.value)}
            >
              <option value="">Todos os estados</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Analise">Em Análise</option>
              <option value="Aguardando Aprovacao">Aguardando Aprovação</option>
              <option value="Em Reparacao">Em Reparação</option>
              <option value="Concluido">Concluído</option>
              <option value="Entregue">Entregue</option>
            </select>
          )}
        </div>
      </div>

      {/* TABLE VIEW FOR EQUIPMENTS */}
      {view === 'equipments' && (
        <div className="table-responsive">
          {filteredEquipments.length === 0 ? (
            <div className="empty-state">
              <Cpu size={48} />
              <h3>Nenhum equipamento encontrado</h3>
              <p>Tente registar um novo equipamento eletrónico ou redefinir os filtros de pesquisa.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Marca / Modelo</th>
                  <th>Tipo</th>
                  <th>Nº Série</th>
                  <th>Proprietário</th>
                  <th>Orçamento</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{item.brand}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.model}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getEquipmentIcon(item.equipment_type)}
                        <span style={{ textTransform: 'capitalize' }}>{item.equipment_type}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{item.serial_number || 'S/N'}</td>
                    <td>{getClientName(item.client_id)}</td>
                    <td>
                      <span className={`badge ${item.budget_status === 'aprovado' ? 'badge-success' : 'badge-danger'}`}>
                        {item.budget_status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.status === 'finalizado' ? 'badge-success' : 
                        item.status === 'em reparação' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {/* Wrench: Only for admin and technician to log technical repairs */}
                        {!isClient && (
                          <button 
                            onClick={() => onOpenCreateRep(item.id)}
                            title="Registar Intervenção" 
                            className="btn btn-secondary btn-icon"
                            style={{ color: '#10b981' }}
                          >
                            <Wrench size={14} />
                          </button>
                        )}
                        {/* Edit: Available for everyone (For Client, it updates only budget_status) */}
                        <button 
                          onClick={() => onOpenEditEq(item)}
                          title={isClient ? "Aprovar/Rejeitar Orçamento" : "Editar Equipamento"} 
                          className="btn btn-secondary btn-icon"
                        >
                          <Edit size={14} />
                        </button>
                        {/* Delete: Admin only */}
                        {isAdmin && (
                          <button 
                            onClick={() => onDeleteEq(item.id)}
                            title="Eliminar Equipamento" 
                            className="btn btn-secondary btn-icon btn-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TABLE VIEW FOR REPAIRS */}
      {view === 'repairs' && (
        <div className="table-responsive">
          {filteredRepairs.length === 0 ? (
            <div className="empty-state">
              <Wrench size={48} />
              <h3>Nenhum histórico de reparações</h3>
              <p>Nenhuma intervenção técnica ou pedido de assistência registado para estes equipamentos.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Equipamento</th>
                  <th>Descrição da Avaria</th>
                  <th>Técnico Responsável</th>
                  <th>Estado da Reparação</th>
                  {!isClient && <th style={{ textAlign: 'right' }}>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRepairs.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{item.brand}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.model}</div>
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.85rem' }}>{item.description}</td>
                    <td>{getTechnicianName(item.repairer_id)}</td>
                    <td>
                      <span className={`badge ${
                        (item.status === 'Concluido' || item.status === 'Entregue') ? 'badge-success' :
                        (item.status === 'Em Reparacao' || item.status === 'Em Analise') ? 'badge-info' :
                        item.status === 'Aguardando Aprovacao' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    {/* Actions: Client only observes, cannot edit/delete repairs */}
                    {!isClient && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            onClick={() => onOpenEditRep(item)}
                            title="Editar Reparação" 
                            className="btn btn-secondary btn-icon"
                          >
                            <Edit size={14} />
                          </button>
                          {isAdmin && (
                            <button 
                              onClick={() => onDeleteRep(item.id)}
                              title="Eliminar Reparação" 
                              className="btn btn-secondary btn-icon btn-danger"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TABLE VIEW FOR USERS (Admin only) */}
      {view === 'users' && isAdmin && (
        <div className="table-responsive">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>Nenhum utilizador encontrado</h3>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Papel (Role)</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{item.name}</td>
                    <td style={{ fontFamily: 'monospace' }}>{item.email}</td>
                    <td>
                      <span className={`badge ${
                        item.role === 'admin' ? 'badge-danger' :
                        item.role === 'reparador' ? 'badge-info' : 'badge-success'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          onClick={() => onOpenEditUser(item)}
                          title="Editar Utilizador" 
                          className="btn btn-secondary btn-icon"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteUser(item.id)}
                          title="Eliminar Utilizador" 
                          className="btn btn-secondary btn-icon btn-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
