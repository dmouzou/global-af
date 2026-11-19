import React, { useCallback, useRef, useState } from 'react';
import wave from '../../assets/mascot/babi-clean-waving.png';
import welcome from '../../assets/mascot/babi-clean-welcome.png';
import wallet from '../../assets/mascot/babi-clean-wallet.png';
import academic from '../../assets/mascot/babi-clean-academic.png';
import security from '../../assets/mascot/babi-clean-security.png';

const POSES = [
  { src: wave, say: 'Akwaba ! Moi, c\'est Babi.' },
  { src: academic, say: 'Apprends à ton rythme, module après module.' },
  { src: wallet, say: 'Tes retraits vont vers Wave, Orange, MTN ou Moov.' },
  { src: security, say: 'Ici, pas de hasard et pas de promesse de gain.' },
  { src: welcome, say: 'Prêt ? Crée ton compte gratuit.' },
];

/**
 * Babi 3D interactif : respire, suit le curseur (inclinaison douce),
 * saute et change de pose à chaque clic ou touche.
 */
export const BabiHero: React.FC<{ className?: string; bubble?: boolean }> = ({ className = '', bubble = true }) => {
  const [pose, setPose] = useState(0);
  const [hop, setHop] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
  }, []);

  const onLeave = useCallback(() => {
    stage.current?.style.setProperty('--ry', '0deg');
    stage.current?.style.setProperty('--rx', '0deg');
  }, []);

  const onClick = () => {
    setPose(p => (p + 1) % POSES.length);
    setHop(false);
    requestAnimationFrame(() => setHop(true));
  };

  return (
    <div
      ref={stage}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative select-none ${className}`}
      style={{ ['--rx' as string]: '0deg', ['--ry' as string]: '0deg' }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Faire réagir Babi"
        className="relative block w-full cursor-pointer rounded-full focus-visible:outline-offset-8"
        style={{ transform: 'perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))', transition: 'transform 180ms ease-out' }}
      >
        <span className={`block ${hop ? 'babi-hop' : 'babi-float'}`} onAnimationEnd={() => setHop(false)}>
          {POSES.map((p, i) => (
            <img
              key={p.src}
              src={p.src}
              alt={i === pose ? "Babi l'éléphant, mascotte de GLOBAL-AF" : ''}
              aria-hidden={i !== pose}
              draggable={false}
              className={`${i === 0 ? 'relative' : 'absolute inset-0'} w-full h-auto object-contain drop-shadow-[0_24px_30px_rgba(15,42,30,0.22)] transition-opacity duration-300 ${i === pose ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </span>
      </button>

      {bubble && (
      <div
        key={pose}
        role="status"
        className="absolute -top-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-[-6%] sm:translate-x-0 max-w-[15rem] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm font-semibold leading-snug text-ink shadow-[0_12px_30px_-10px_rgba(15,42,30,0.35)] ring-1 ring-ink/10 animate-[fadeIn_.35s_ease-out]"
      >
        {POSES[pose].say}
      </div>
      )}
    </div>
  );
};
