import { useState, useEffect } from 'react';
import { apiCall, setAuthToken, getLoggedUser, getAuthToken } from './services/api';

// Components
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import ApiConsole from './components/ApiConsole';
import Metrics from './components/Metrics';
import EquipmentFormModal from './components/EquipmentFormModal';
import RepairFormModal from './components/RepairFormModal';
import UserFormModal from './components/UserFormModal';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(getLoggedUser());
  const [view, setView] = useState(user ? 'equipments' : 'login');

  // Lists
  const [equipments, setEquipments] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // UI state
  const [notification, setNotification] = useState(null);
  const [modalType, setModalType] = useState(null); // 'createEquipment' | 'editEquipment' | 'createRepair' | 'editRepair' | 'createUser' | 'editUser'
  const [selectedItem, setSelectedItem] = useState(null);
  const [defaultEqId, setDefaultEqId] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadData = async () => {
    if (!token) return;
    try {
      const eqData = await apiCall('GET', '/api/equipments');
      setEquipments(eqData);
      
      const repData = await apiCall('GET', '/api/repairs');
      setRepairs(repData);

      if (user?.role === 'admin' || user?.role === 'reparador') {
        const uData = await apiCall('GET', '/api/users');
        setUsersList(uData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleLogin = async (username, password) => {
    try {
      const result = await apiCall('POST', '/oauth/token', {
        grant_type: 'password',
        username,
        password
      });

      setAuthToken(result.access_token);
      setToken(result.access_token);
      setUser(getLoggedUser());
      setView('equipments');
      showNotification('Sessão iniciada com sucesso!', 'success');
    } catch (err) {
      if (err.message.includes('API Offline') || err.message.includes('offline')) {
        showNotification(err.message, 'danger');
      } else {
        showNotification('Credenciais inválidas ou erro no login.', 'danger');
      }
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      await apiCall('POST', '/api/users/register', { name, email, password, role: 'cliente' });
      showNotification('Conta criada com sucesso! Faça login.', 'success');
      setView('login');
    } catch (err) {
      // Handled internally in apiCall
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setToken('');
    setUser(null);
    setEquipments([]);
    setRepairs([]);
    setUsersList([]);
    setView('login');
    showNotification('Sessão encerrada.', 'info');
  };

  // Modals operations
  const handleCreateEquipment = async (form) => {
    try {
      const payload = { ...form };
      if (user.role === 'cliente') {
        delete payload.client_id;
      } else {
        payload.client_id = parseInt(payload.client_id);
      }
      await apiCall('POST', '/api/equipments', payload);
      showNotification('Equipamento registado com sucesso!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleEditEquipment = async (form) => {
    try {
      await apiCall('PUT', `/api/equipments/${selectedItem.id}`, form);
      showNotification('Equipamento atualizado com sucesso!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Tem a certeza que deseja remover este equipamento? Todas as reparações associadas serão eliminadas.')) return;
    try {
      await apiCall('DELETE', `/api/equipments/${id}`);
      showNotification('Equipamento removido com sucesso!');
      loadData();
    } catch (err) {}
  };

  const handleCreateRepair = async (form) => {
    try {
      const payload = { 
        equipment_id: parseInt(form.equipment_id),
        description: form.description,
        status: form.status
      };
      if (user.role !== 'cliente' && form.repairer_id) {
        payload.repairer_id = parseInt(form.repairer_id);
      }
      await apiCall('POST', '/api/repairs', payload);
      showNotification('Intervenção registada com sucesso!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleEditRepair = async (form) => {
    try {
      const payload = {
        description: form.description,
        status: form.status,
        repairer_id: form.repairer_id ? parseInt(form.repairer_id) : null
      };
      if (user.role === 'cliente') {
        delete payload.repairer_id;
      }
      await apiCall('PUT', `/api/repairs/${selectedItem.id}`, payload);
      showNotification('Intervenção técnica atualizada!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleDeleteRepair = async (id) => {
    if (!window.confirm('Deseja eliminar este registo de reparação?')) return;
    try {
      await apiCall('DELETE', `/api/repairs/${id}`);
      showNotification('Reparação removida com sucesso!');
      loadData();
    } catch (err) {}
  };

  const handleCreateUser = async (form) => {
    try {
      await apiCall('POST', '/api/users', form);
      showNotification('Utilizador criado com sucesso!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleEditUser = async (form) => {
    try {
      await apiCall('PUT', `/api/users/${selectedItem.id}`, form);
      showNotification('Utilizador atualizado com sucesso!');
      setModalType(null);
      loadData();
    } catch (err) {}
  };

  const handleDeleteUser = async (id) => {
    if (id === user.id) {
      showNotification('Não pode excluir o seu próprio utilizador!', 'danger');
      return;
    }
    if (!window.confirm('Deseja remover este utilizador? Todos os equipamentos e reparações dele serão removidos.')) return;
    try {
      await apiCall('DELETE', `/api/users/${id}`);
      showNotification('Utilizador removido do sistema.');
      loadData();
    } catch (err) {}
  };

  return (
    <div className="app-container">
      {/* Floating notifications */}
      <Notification notification={notification} />

      {/* Auth Views */}
      {view === 'login' && (
        <Login 
          onLoginSuccess={handleLogin} 
          onGoToRegister={() => setView('register')} 
        />
      )}

      {view === 'register' && (
        <Register 
          onRegisterSuccess={handleRegister} 
          onGoToLogin={() => setView('login')} 
        />
      )}

      {/* Authenticated Dashboard View */}
      {user && (
        <>
          <Sidebar 
            user={user} 
            view={view} 
            setView={setView} 
            onLogout={handleLogout} 
          />

          <main className="main-content">
            <header className="header">
              <h2>
                {view === 'equipments' && 'Gestão de Equipamentos'}
                {view === 'repairs' && 'Histórico de Intervenções Técnicas'}
                {view === 'users' && 'Administração de Utilizadores'}
              </h2>
              <div className="header-actions">
                {view === 'equipments' && (
                  <button onClick={() => { setSelectedItem(null); setModalType('createEquipment'); }} className="btn btn-primary">
                    Novo Equipamento
                  </button>
                )}
                {view === 'repairs' && user.role !== 'cliente' && (
                  <button onClick={() => { setSelectedItem(null); setDefaultEqId(''); setModalType('createRepair'); }} className="btn btn-primary">
                    Registar Reparação
                  </button>
                )}
                {view === 'users' && (user.role === 'admin' || user.role === 'reparador') && (
                  <button onClick={() => { setSelectedItem(null); setModalType('createUser'); }} className="btn btn-primary">
                    Novo Utilizador
                  </button>
                )}
              </div>
            </header>

            {view === 'equipments' && <Metrics equipments={equipments} repairs={repairs} />}

            <div className="content-body">
              <Dashboard 
                view={view}
                user={user}
                equipments={equipments}
                repairs={repairs}
                usersList={usersList}
                onOpenCreateEq={() => { setSelectedItem(null); setModalType('createEquipment'); }}
                onOpenEditEq={(item) => { setSelectedItem(item); setModalType('editEquipment'); }}
                onDeleteEq={handleDeleteEquipment}
                onOpenCreateRep={(eqId) => { setSelectedItem(null); setDefaultEqId(eqId); setModalType('createRepair'); }}
                onOpenEditRep={(item) => { setSelectedItem(item); setModalType('editRepair'); }}
                onDeleteRep={handleDeleteRepair}
                onOpenCreateUser={() => { setSelectedItem(null); setModalType('createUser'); }}
                onOpenEditUser={(item) => { setSelectedItem(item); setModalType('editUser'); }}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          </main>

          {/* Console / Auditoria de chamadas API */}
          <ApiConsole />
        </>
      )}

      {/* Equipment Modals */}
      <EquipmentFormModal 
        isOpen={modalType === 'createEquipment' || modalType === 'editEquipment'}
        onClose={() => setModalType(null)}
        onSubmit={modalType === 'createEquipment' ? handleCreateEquipment : handleEditEquipment}
        selectedItem={selectedItem}
        usersList={usersList}
        userRole={user?.role}
      />

      {/* Repair Modals */}
      <RepairFormModal 
        isOpen={modalType === 'createRepair' || modalType === 'editRepair'}
        onClose={() => setModalType(null)}
        onSubmit={modalType === 'createRepair' ? handleCreateRepair : handleEditRepair}
        selectedItem={selectedItem}
        equipments={equipments}
        usersList={usersList}
        userRole={user?.role}
        defaultEqId={defaultEqId}
      />

      {/* User Modals */}
      <UserFormModal 
        isOpen={modalType === 'createUser' || modalType === 'editUser'}
        onClose={() => setModalType(null)}
        onSubmit={modalType === 'createUser' ? handleCreateUser : handleEditUser}
        selectedItem={selectedItem}
        userRole={user?.role}
      />
    </div>
  );
}

export default App;
