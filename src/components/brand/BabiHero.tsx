import React, { useCallback, useRef, useState } from 'react';
import { BabiMood, BabiProp, BabiVector } from './BabiVector';

interface Pose {
  mood: BabiMood;
  prop: BabiProp;
  say: string;
}

const POSES: Pose[] = [
  { mood: 'wave', prop: 'none', say: "Akwaba ! Moi, c'est Babi." },
  { mood: 'think', prop: 'book', say: 'Apprends à ton rythme, module après module.' },
  { mood: 'cheer', prop: 'coin', say: 'Tes retraits vont vers Wave, Orange, MTN ou Moov.' },
  { mood: 'happy', prop: 'shield', say: 'Ici, pas de hasard et pas de promesse de gain.' },
  { mood: 'happy', prop: 'none', say: 'Prêt ? Crée ton compte gratuit.' },
];

/**
 * Babi Vector interactif : clignement, oreilles, trompe et accessoires vectoriels.
 * Réagit au survol et change de pose / réplique à chaque clic.
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
    el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
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

  const currentPose = POSES[pose];

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
        className="relative block w-full cursor-pointer focus-visible:outline-offset-8"
        style={{ transform: 'perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))', transition: 'transform 180ms ease-out' }}
      >
        <span className={`block transition-transform duration-200 ${hop ? 'babi-hop' : 'babi-float'}`} onAnimationEnd={() => setHop(false)}>
          <div className="flex justify-center">
            <BabiVector
              mood={currentPose.mood}
              prop={currentPose.prop}
              size={260}
              className="drop-shadow-[0_20px_25px_rgba(15,42,30,0.18)]"
            />
          </div>
        </span>
      </button>

      {bubble && (
        <div
          key={pose}
          role="status"
          className="absolute -top-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-[-6%] sm:translate-x-0 max-w-[15rem] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm font-semibold leading-snug text-ink shadow-[0_12px_30px_-10px_rgba(15,42,30,0.35)] ring-1 ring-ink/10 animate-[fadeIn_.35s_ease-out]"
        >
          {currentPose.say}
        </div>
      )}
    </div>
  );
};
