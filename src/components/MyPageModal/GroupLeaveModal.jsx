import React from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function GroupLeaveModal({ currentGroup = '', onClose }) {
  const navigate = useNavigate();

  const handleLeave = async () => {
    try {
      // API 호출: 그룹 탈퇴
      await axiosInstance.patch('/mypage/leaveGroup/');
      // 탈퇴 후 noGroup으로 이동
      navigate('/noGroup');
    } catch (err) {
      console.error('그룹 탈퇴 실패:', err);
      alert('그룹 탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      onClose();
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>그룹 탈퇴</h3>

      <div style={styles.currentGroup}>
        <strong>현재 그룹:</strong> {currentGroup}
      </div>

      <p style={styles.confirmText}>정말 탈퇴하시겠습니까?</p>

      <div style={styles.buttonWrapper}>
        <button
          onClick={handleLeave}
          style={styles.button}
          onMouseEnter={(e) => { e.target.style.background = '#74D3A4'; }}
          onMouseLeave={(e) => { e.target.style.background = '#8BE2B6'; }}
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
    fontSize: '17px',
    fontWeight: 500,
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