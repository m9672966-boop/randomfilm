// src/components/ConfettiAnimation.jsx
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const ConfettiAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const words = ['Сегодня', 'мы', 'будем', 'смотреть', '...'];

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      if (textIndex < words.length) {
        setTextIndex(textIndex + 1);
      } else {
        setShow(false);
        onComplete();
      }
    }, 800); // Задержка между словами

    return () => clearTimeout(timer);
  }, [textIndex, show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <ReactConfetti width={window.innerWidth} height={window.innerHeight} />
      <div className="text-white text-4xl font-bold animate-pulse">
        {words.slice(0, textIndex).join(' ')}
      </div>
    </div>
  );
};

export default ConfettiAnimation;
