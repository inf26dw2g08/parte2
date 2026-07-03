import { Cpu, Wrench, DollarSign, Clock } from 'lucide-react';

function Metrics({ equipments, repairs }) {
  const totalEq = equipments.length;
  const underRepair = equipments.filter(e => e.status === 'em reparação').length;
  const pendingRep = repairs.filter(r => r.status === 'Pendente' || r.status === 'Em Analise').length;
  const approvedBudget = equipments.filter(e => e.budget_status === 'aprovado').length;

  return (
    <div className="metrics-grid fade-in">
      <div className="metric-card">
        <div className="metric-info">
          <h3>Equipamentos</h3>
          <div className="value">{totalEq}</div>
        </div>
        <div className="metric-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
          <Cpu size={24} />
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-info">
          <h3>Em Reparação</h3>
          <div className="value">{underRepair}</div>
        </div>
        <div className="metric-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          <Wrench size={24} />
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-info">
          <h3>Orçamentos Aprovados</h3>
          <div className="value">{approvedBudget} / {totalEq}</div>
        </div>
        <div className="metric-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          <DollarSign size={24} />
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-info">
          <h3>Avarias Pendentes</h3>
          <div className="value">{pendingRep}</div>
        </div>
        <div className="metric-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
          <Clock size={24} />
        </div>
      </div>
    </div>
  );
}

export default Metrics;
