import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

function NicknameModal({ currentNickname = 'solux', onSave, onClose }) {
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    setNewNickname('');
  }, [currentNickname]);

  const handleSave = async () => {
    if (newNickname.trim() === '') {
      return;
    }
    try {
      const res = await axiosInstance.patch('/mypage/info/', {
        name: newNickname.trim()
      });
      onSave(res.data.data.name);
    } catch (error) {
    } finally {
      onClose();
    }
  };
  return (
    <div style={styles.container}>
      {/* 👇 Focus 스타일을 위한 style 태그 삽입 */}
      <style>{`
        .modal-input {
          width: 100%;
          height: 40px;
          padding: 10px;
          border-radius: 15px;
          border: none;
          font-size: 14px;
          font-family: 'NotoSansKR-Regular';
          margin-top: 20px;
          color: #787878;
          background-color: #F5F5F5;
          box-sizing: border-box;
        }

        .modal-input:focus {
          border: 1.5px solid #aee9d1;
          outline: none;
          box-shadow: 0 0 0 1px #aee9d1;
        }
      `}</style>

      <h3 style={styles.title}>회원 정보 수정</h3>

      <div style={styles.labelWrapper}>
        <label><strong>현재 닉네임:</strong> {currentNickname}</label>
      </div>

      <div style={styles.inputWrapper}>
        <label><strong>변경할 닉네임:</strong></label>
        <input
          type="text"
          placeholder="변경하실 닉네임을 입력하세요 (4글자 이하)"
          value={newNickname}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 4) {
              setNewNickname(value);
            }
          }}
          maxLength={4}
          className="modal-input"
        />
        
      </div>

      <div style={styles.buttonWrapper}>
        <button
          onClick={handleSave}
          disabled={newNickname.trim() === ''}
          style={{
            ...styles.button,
            backgroundColor: newNickname.trim() === '' ? '#d6f2e4' : '#8BE2B6',
            cursor: newNickname.trim() === '' ? 'not-allowed' : 'pointer',
          }}
        >
          저장
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
  labelWrapper: {
    textAlign: 'left',
    marginBottom: '30px',
  },
  inputWrapper: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    color: '#fff',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    width: '70px',
    height: '35px',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default NicknameModal;
