import React from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function UserLeaveModal({ onClose }) {
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    try {
      await axiosInstance.post('/mypage/withdraw/');
      // 토큰 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // 첫 화면으로 이동
      navigate('/');
    } catch (err) {
    } finally {
      onClose();
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>회원 탈퇴</h3>

      <p style={styles.subconfirmText}>
        탈퇴 시 계정 정보가 삭제되며,<br />
        이후 복구는 어렵습니다.
      </p>

      <p style={styles.confirmText}>정말 탈퇴하시겠습니까?</p>

      <div style={styles.buttonWrapper}>
        <button
          onClick={handleWithdraw}
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.background = '#74D3A4';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = styles.button.backgroundColor;
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
  subconfirmText: {
    marginBottom: '30px',
    fontSize: '14px',
    color: '#666',
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

export default UserLeaveModal;
