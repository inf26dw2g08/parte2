import { useState, useEffect } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { subscribeToApiLogs } from '../services/api';

function ApiConsole() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToApiLogs((newLog) => {
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="api-logger" style={{ transform: isOpen ? 'translateY(0)' : 'translateY(180px)' }}>
      <div className="api-logger-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="api-logger-title">
          <Activity size={14} /> CONSOLE DE COMUNICAÇÃO API (DEVELOPER LOGS)
        </div>
        <div style={{ color: '#94a3b8' }}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>
      <div className="api-logger-body">
        {logs.length === 0 ? (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            Nenhuma chamada de API registada de momento. Interaja com o sistema para ver os pedidos em tempo real.
          </div>
        ) : (
          logs.map((lg, i) => (
            <div key={i} className="log-entry">
              <span className="time">[{lg.time}]</span>
              <span className={`method ${lg.method}`}>{lg.method}</span>
              <span style={{ color: '#ffffff' }}>{lg.url}</span>
              <span style={{ color: '#64748b' }}>-&gt; Status:</span>
              <span className={`status ${lg.status < 400 || lg.status === '200' || lg.status === '201' ? 'success' : 'error'}`}>{lg.status}</span>
              {lg.requestBody && (
                <span style={{ color: '#c084fc' }}>Body: {JSON.stringify(lg.requestBody)}</span>
              )}
              {lg.responseData && (
                <span style={{ color: '#93c5fd' }}>Resp: {JSON.stringify(lg.responseData).substring(0, 120)}...</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApiConsole;
