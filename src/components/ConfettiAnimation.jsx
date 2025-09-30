// src/components/ConfettiAnimation.jsx
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const ConfettiAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <ReactConfetti width={window.innerWidth} height={window.innerHeight} />
      <div className="text-white text-4xl font-bold animate-pulse">Выбираем фильм...</div>
    </div>
  );
};

export default ConfettiAnimation;
