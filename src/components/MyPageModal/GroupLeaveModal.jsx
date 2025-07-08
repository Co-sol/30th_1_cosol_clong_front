import React from 'react';

function GroupLeaveModal({ currentGroup = '', onLeave, onClose }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>그룹 탈퇴</h3>

      <div style={styles.currentGroup}>
        현재 그룹: {currentGroup}
      </div>

      <p style={styles.confirmText}>정말 탈퇴하시겠습니까?</p>

      <div style={styles.buttonWrapper}>
        <button
          onClick={() => {
            onLeave();
            onClose();
          }}
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.background = '#74D3A4';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#8BE2B6';
          }}
        >
          탈퇴
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '0 0px',
  },
  title: {
    marginBottom: '50px',
    fontSize: '20px',
    fontWeight: 700,
  },
  currentGroup: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '16px',
  },
  confirmText: {
    marginBottom: '20px',
    fontSize: '18px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#8BE2B6',
    color: '#fff',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    width: '70px',
    height: '35px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '25px',
  },
};

export default GroupLeaveModal;