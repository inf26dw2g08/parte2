import { AlertCircle, CheckCircle } from 'lucide-react';

function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      padding: '16px 24px',
      borderRadius: '12px',
      backgroundColor: notification.type === 'danger' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backdropFilter: 'blur(8px)',
      fontWeight: 500,
      animation: 'fadeIn 0.2s ease forwards'
    }}>
      {notification.type === 'danger' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span>{notification.message}</span>
    </div>
  );
}

export default Notification;
