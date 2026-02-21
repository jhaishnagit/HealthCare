// Add Cart Modal
function AddCartModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#4CAF50',
      color: 'white',
      padding: '20px 30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      zIndex: 2000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>✓ Success</h3>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}
export default AddCartModal;