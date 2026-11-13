import { AnimatePresence, motion } from 'framer-motion';

interface HolidaySnowOverlayProps {
  isActive: boolean;
}

interface SnowParticle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  kind: 'flake-a' | 'flake-b' | 'star' | 'bokeh';
  tone: 'gold' | 'ivory' | 'pine';
}

const PARTICLES: SnowParticle[] = [
  { id: 1, left: '3%', size: 15, duration: 13, delay: 0, sway: 22, kind: 'flake-a', tone: 'gold' },
  { id: 2, left: '7%', size: 7, duration: 11, delay: 1.8, sway: -16, kind: 'bokeh', tone: 'ivory' },
  { id: 3, left: '11%', size: 13, duration: 15, delay: 3.1, sway: 18, kind: 'star', tone: 'gold' },
  { id: 4, left: '15%', size: 17, duration: 14, delay: 0.7, sway: -20, kind: 'flake-b', tone: 'ivory' },
  { id: 5, left: '19%', size: 6, duration: 10.5, delay: 4.2, sway: 14, kind: 'bokeh', tone: 'gold' },
  { id: 6, left: '23%', size: 14, duration: 16, delay: 2.3, sway: -18, kind: 'flake-a', tone: 'pine' },
  { id: 7, left: '27%', size: 11, duration: 12.5, delay: 5.0, sway: 20, kind: 'star', tone: 'gold' },
  { id: 8, left: '31%', size: 16, duration: 14.5, delay: 1.1, sway: -22, kind: 'flake-b', tone: 'gold' },
  { id: 9, left: '35%', size: 8, duration: 11.5, delay: 3.6, sway: 16, kind: 'bokeh', tone: 'ivory' },
  { id: 10, left: '39%', size: 13, duration: 15.5, delay: 0.4, sway: -14, kind: 'flake-a', tone: 'ivory' },
  { id: 11, left: '43%', size: 12, duration: 13.5, delay: 2.9, sway: 19, kind: 'star', tone: 'gold' },
  { id: 12, left: '47%', size: 7, duration: 12, delay: 4.8, sway: -17, kind: 'bokeh', tone: 'gold' },
  { id: 13, left: '51%', size: 18, duration: 16.5, delay: 1.5, sway: 21, kind: 'flake-b', tone: 'gold' },
  { id: 14, left: '55%', size: 12, duration: 13, delay: 3.9, sway: -19, kind: 'flake-a', tone: 'pine' },
  { id: 15, left: '59%', size: 6, duration: 10.8, delay: 0.9, sway: 15, kind: 'bokeh', tone: 'ivory' },
  { id: 16, left: '63%', size: 14, duration: 14.8, delay: 2.5, sway: -21, kind: 'star', tone: 'gold' },
  { id: 17, left: '67%', size: 16, duration: 15.2, delay: 4.4, sway: 18, kind: 'flake-a', tone: 'ivory' },
  { id: 18, left: '71%', size: 8, duration: 11.2, delay: 1.3, sway: -15, kind: 'bokeh', tone: 'gold' },
  { id: 19, left: '75%', size: 15, duration: 14.2, delay: 3.3, sway: 22, kind: 'flake-b', tone: 'gold' },
  { id: 20, left: '79%', size: 11, duration: 12.8, delay: 5.4, sway: -18, kind: 'star', tone: 'gold' },
  { id: 21, left: '83%', size: 14, duration: 15.8, delay: 0.6, sway: 17, kind: 'flake-a', tone: 'pine' },
  { id: 22, left: '87%', size: 7, duration: 11.8, delay: 2.7, sway: -16, kind: 'bokeh', tone: 'ivory' },
  { id: 23, left: '90%', size: 16, duration: 14.4, delay: 4.1, sway: 20, kind: 'flake-b', tone: 'ivory' },
  { id: 24, left: '93%', size: 12, duration: 13.2, delay: 1.9, sway: -19, kind: 'star', tone: 'gold' },
  { id: 25, left: '96%', size: 15, duration: 15.6, delay: 3.5, sway: 15, kind: 'flake-a', tone: 'gold' },
  { id: 26, left: '25%', size: 10, duration: 17, delay: 6.2, sway: -12, kind: 'flake-b', tone: 'ivory' },
  { id: 27, left: '53%', size: 10, duration: 16.2, delay: 5.8, sway: 14, kind: 'star', tone: 'gold' },
  { id: 28, left: '77%', size: 9, duration: 16.8, delay: 6.7, sway: -13, kind: 'flake-a', tone: 'gold' },
];

function getToneClasses(tone: SnowParticle['tone']) {
  switch (tone) {
    case 'gold':
      return 'text-gold drop-shadow-[0_0_6px_rgba(204,158,66,0.45)]';
    case 'pine':
      return 'text-pine/35 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]';
    case 'ivory':
    default:
      return 'text-bone drop-shadow-[0_1px_4px_rgba(21,43,33,0.22)]';
  }
}

export function HolidaySnowOverlay({ isActive }: HolidaySnowOverlayProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="holiday-snow-overlay"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        >
          {/* Subtle golden & pine winter top aura */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-gold/[0.11] via-pine/[0.04] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-berry/[0.06] to-transparent" />

          {PARTICLES.map((p) => {
            if (p.kind === 'bokeh') {
              return (
                <motion.span
                  key={p.id}
                  style={{
                    left: p.left,
                    top: 0,
                    width: p.size,
                    height: p.size,
                  }}
                  initial={{ y: '-8vh', x: 0, opacity: 0 }}
                  animate={{
                    y: ['-8vh', '108vh'],
                    x: [0, p.sway, -p.sway * 0.7, 0],
                    opacity: [0, 0.7, 0.55, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className={`pointer-events-none absolute rounded-full will-change-transform ${
                    p.tone === 'gold'
                      ? 'bg-gold/70 shadow-[0_0_10px_rgba(204,158,66,0.55)]'
                      : 'bg-bone/90 shadow-[0_0_8px_rgba(255,255,255,0.65)]'
                  }`}
                />
              );
            }

            const symbol =
              p.kind === 'flake-a' ? '❄' : p.kind === 'flake-b' ? '❅' : '✦';

            return (
              <motion.span
                key={p.id}
                style={{
                  left: p.left,
                  top: 0,
                  fontSize: p.size,
                  lineHeight: 1,
                }}
                initial={{ y: '-8vh', x: 0, rotate: 0, opacity: 0 }}
                animate={{
                  y: ['-8vh', '108vh'],
                  x: [0, p.sway, -p.sway * 0.7, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.78, 0.68, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className={`pointer-events-none absolute select-none will-change-transform ${getToneClasses(
                  p.tone
                )}`}
              >
                {symbol}
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
