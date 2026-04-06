import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="loading-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <div className="loading-kanji">斬</div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          color: 'rgba(240, 237, 229, 0.4)',
          textTransform: 'uppercase',
          marginTop: '0.5rem',
        }}
      >
        Carregando
      </p>
      <div className="loading-bar-container">
        <div className="loading-bar" />
      </div>
    </div>
  );
}
