import React, { useState, useEffect } from 'react';

function CleanSensitiveModal({ currentSensitivity = 70, onSave, onClose }) {
  const [sensitivity, setSensitivity] = useState(currentSensitivity);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setSensitivity(currentSensitivity);
  }, [currentSensitivity]);

  const handleSave = () => {
    if (sensitivity < 0 || sensitivity > 100) {
      setSubmitError('민감도는 0부터 100 사이여야 합니다.');
      return;
    }
    onSave(sensitivity);
    onClose();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>청소 민감도</h3>

      <div style={styles.currentSensitivity}>
        현재 청소 민감도: {sensitivity}%
      </div>

      <div style={styles.description}>
        <span>0: 둔감해요</span>
        <span>50: 적당히 깨끗해요</span>
        <span>100: 청결대마왕</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={sensitivity}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (!isNaN(newValue)) {
            setSensitivity(newValue);
            document.documentElement.style.setProperty('--value', newValue);
            setSubmitError('');
          }
        }}
        className="sensitivity-slider"
        style={{
          width: '100%',
          marginTop: '20px',
          appearance: 'none',
          height: '13px',
          borderRadius: '30px',
          outline: 'none',
          background: `linear-gradient(
            to right,
            #83EBB7 0%,
            #83EBB7 ${sensitivity}%,
            #f5f5f5 ${sensitivity}%,
            #f5f5f5 100%
          )`,
        }}
      />

      <div
        className="sensitivity-ticks"
        style={{
          position: 'relative',
          width: '100%',
          height: '20px',
          marginTop: '5px',
          marginBottom: '30px',
        }}
      >
        <span style={tickStyle(0)}>0</span>
        <span style={tickStyle('50%')}>50</span>
        <span style={tickStyle('100%', true)}>100</span>
      </div>

      <div style={styles.buttonWrapper}>
        <button
          onClick={handleSave}
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.background = '#74D3A4';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#8BE2B6';
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}

// ✅ 이 스타일을 Modal에 props로 넘겨야 함
export const modalContentStyle = {
  width: '600px', // 가로 폭 넓게
  maxWidth: '90vw',
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '0 0px',
    position: 'relative',
  },
  title: {
    marginBottom: '50px',
    fontSize: '20px',
    fontWeight: 700,
  },
  currentSensitivity: {
    justifyContent: 'center',
    fontSize: '16px',
    marginBottom: '40px',
    fontWeight: 600,
  },
  description: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: 400,
    color: '#787878',
    marginBottom: '0px',
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
    marginTop: '15px',
  },
};

const tickStyle = (position, isRight = false) => ({
  position: 'absolute',
  fontSize: '13px',
  fontWeight: 500,
  color: '#B5B5B5',
  ...(isRight ? { right: 0 } : { left: position }),
  ...(position === '50%' ? { transform: 'translateX(-50%)' } : {}),
});

export default CleanSensitiveModal;
