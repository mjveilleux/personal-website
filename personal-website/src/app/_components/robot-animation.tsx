import styles from "./robot-animation.module.css";

/* Pipes are 100 wide, chaining end-to-end from the generator outlet (60)
   to the wall front face (360): 60 -> 160 -> 260 -> 360. */
const PIPE_TARGETS = [60, 160, 260];

const MATRIX_CELLS: { x: number; y: number; delay: number; dur: number }[] = [
  { x: -16, y: 64, delay: 0.0, dur: 1.4 },
  { x: -8, y: 64, delay: 0.5, dur: 1.8 },
  { x: 0, y: 64, delay: 1.1, dur: 1.3 },
  { x: 8, y: 64, delay: 0.3, dur: 2.0 },
  { x: 16, y: 64, delay: 0.8, dur: 1.5 },
  { x: -16, y: 73, delay: 1.4, dur: 1.6 },
  { x: -8, y: 73, delay: 0.2, dur: 1.9 },
  { x: 0, y: 73, delay: 0.7, dur: 1.2 },
  { x: 8, y: 73, delay: 1.3, dur: 1.7 },
  { x: 16, y: 73, delay: 0.45, dur: 1.5 },
  { x: -16, y: 82, delay: 0.9, dur: 1.8 },
  { x: -8, y: 82, delay: 1.6, dur: 1.3 },
  { x: 0, y: 82, delay: 0.35, dur: 2.0 },
  { x: 8, y: 82, delay: 1.0, dur: 1.4 },
  { x: 16, y: 82, delay: 0.6, dur: 1.6 },
];

const FLOAT_CHARS: { x: number; y: number; ch: string; delay: number; dur: number }[] = [
  { x: 12, y: 38, ch: "0", delay: 0.0, dur: 2.2 },
  { x: 36, y: 34, ch: "1", delay: 1.0, dur: 2.5 },
  { x: 22, y: 42, ch: "0", delay: 0.4, dur: 2.0 },
  { x: 46, y: 36, ch: "1", delay: 1.6, dur: 2.3 },
  { x: 8, y: 32, ch: "1", delay: 0.8, dur: 2.7 },
  { x: 28, y: 40, ch: "0", delay: 2.0, dur: 2.1 },
  { x: 16, y: 30, ch: "0", delay: 1.3, dur: 2.4 },
  { x: 42, y: 32, ch: "1", delay: 0.6, dur: 2.6 },
  { x: 20, y: 36, ch: "0", delay: 1.8, dur: 2.2 },
  { x: 50, y: 38, ch: "1", delay: 2.4, dur: 2.0 },
];

function IsoBox({
  x, y, w, h, depth, front, top, side, rx = 0,
}: {
  x: number; y: number; w: number; h: number; depth: number;
  front: string; top: string; side: string; rx?: number;
}) {
  const dx = depth;
  const dy = depth / 2;
  return (
    <g>
      <polygon
        points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`}
        fill={side}
      />
      <polygon
        points={`${x},${y} ${x + w},${y} ${x + w + dx},${y - dy} ${x + dx},${y - dy}`}
        fill={top}
      />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={front} />
    </g>
  );
}

function DataTank() {
  return (
    <g className={styles.dataTank}>
      <ellipse className={styles.shadow} cx="26" cy="144" rx="34" ry="5" />
      <IsoBox x={0} y={80} w={52} h={60} depth={12} rx={3}
        front="#1a2638" top="#2a3850" side="#111b29" />
      <rect x={6} y={88} width={40} height={18} rx={3} fill="#0a121e" />
      <rect x={6} y={88} width={40} height={18} rx={3} fill="none" stroke="#3a4a5e" strokeWidth="1" />
      <circle className={styles.tankStatus} cx="26" cy="97" r="2" fill="#7fd8ff" />
      <line x1="10" y1="94" x2="22" y2="94" stroke="#7fd8ff" strokeWidth="0.8" opacity="0.4" />
      <line x1="10" y1="100" x2="18" y2="100" stroke="#7fd8ff" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="103" x2="26" y2="103" stroke="#7fd8ff" strokeWidth="0.8" opacity="0.5" />
      {/* funnel at tank top */}
      <line x1="-2" y1="52" x2="10" y2="74" stroke="#3a4a5e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="52" x2="44" y2="74" stroke="#3a4a5e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="-4" y1="52" x2="60" y2="52" stroke="#3a4a5e" strokeWidth="3" strokeLinecap="round" />
      {/* pipe outlet on right side, aligns with placed pipe 0's left flange */}
      <rect x={52} y={120} width={10} height={16} rx="2" fill="#3a4a5e" />
      <circle cx={62} cy={128} r="4.5" fill="#15202e" />
      <circle cx={62} cy={128} r="2.8" fill="#7fd8ff" opacity="0.45" />
      {FLOAT_CHARS.map((fc, i) => (
        <text
          key={i}
          className={styles.floatChar}
          x={fc.x}
          y={fc.y}
          style={{ animationDelay: `${fc.delay}s`, animationDuration: `${fc.dur}s` }}
        >
          {fc.ch}
        </text>
      ))}
    </g>
  );
}

function PlacedPipe({ className, x }: { className: string; x: number }) {
  return (
    <g transform={`translate(${x}, 132)`}>
      <ellipse className={styles.shadow} cx="50" cy="12" rx="54" ry="4" />
      <g className={className}>
        <rect x="-4" y="-11" width="7" height="22" rx="2" fill="#3a4a5e" />
        <circle cx="-0.5" cy="-7" r="1.1" fill="#7fd8ff" />
        <circle cx="-0.5" cy="7" r="1.1" fill="#7fd8ff" />
        <rect x="0" y="-9" width="100" height="18" rx="9" fill="#6b829e" />
        <rect x="3" y="-8" width="94" height="4" rx="2" fill="#aac4dd" />
        <rect x="3" y="5" width="94" height="3" rx="1.5" fill="#566c84" opacity="0.6" />
        <rect x="97" y="-11" width="7" height="22" rx="2" fill="#3a4a5e" />
        <circle cx="100.5" cy="-7" r="1.1" fill="#7fd8ff" />
        <circle cx="100.5" cy="7" r="1.1" fill="#7fd8ff" />
        <circle cx="100" cy="0" r="5.5" fill="none" stroke="#7fd8ff" strokeWidth="1.4" opacity="0.7" />
      </g>
    </g>
  );
}

export default function RobotAnimation() {
  return (
    <div className="my-8">
      <svg
        className={styles.scene}
        viewBox="0 0 480 170"
        role="img"
        aria-label="Isometric data-generator feeding a pipeline to a wall monitor, with a robot building the pipeline then going back and forth between generator and monitor, thinking at each stop"
      >
        <polygon className={styles.groundPlane} points="6,140 474,140 494,130 26,130" />

        <DataTank />

        {/* Wall (isometric box) */}
        <g transform="translate(400, 0)">
          <ellipse className={styles.shadow} cx="0" cy="144" rx="46" ry="5" />
          <IsoBox x={-40} y={50} w={80} h={90} depth={14} rx={3}
            front="#2a3850" top="#3a4a5e" side="#1a2638" />
          <line x1="-40" y1="78" x2="40" y2="78" stroke="#1a2638" strokeWidth="1" />
          <line x1="-40" y1="108" x2="40" y2="108" stroke="#1a2638" strokeWidth="1" />
          <rect x="-26" y="58" width="52" height="34" rx="4" fill="#15202e" />
          <rect x="-23" y="61" width="46" height="28" rx="3" fill="#0a121e" />
          <circle className={styles.statusLight} cx="20" cy="65" r="2" fill="#7fd8ff" />
          <g className={styles.monitorActive}>
            {MATRIX_CELLS.map((cell, i) => (
              <g key={i}>
                <text
                  className={styles.matrixZero}
                  x={cell.x}
                  y={cell.y}
                  style={{ animationDelay: `${cell.delay}s`, animationDuration: `${cell.dur}s` }}
                >
                  0
                </text>
                <text
                  className={styles.matrixOne}
                  x={cell.x}
                  y={cell.y}
                  style={{ animationDelay: `${cell.delay}s`, animationDuration: `${cell.dur}s` }}
                >
                  1
                </text>
              </g>
            ))}
          </g>
          <circle cx="-40" cy="132" r="5" fill="#15202e" />
        </g>

        {/* Robot */}
        <g className={styles.robotWalk}>
          <ellipse className={styles.shadow} cx="0" cy="6" rx="16" ry="4" />
          <g>
            <g className={styles.robotCarry} transform="translate(-4, -34)">
              <rect x="-11" y="-4" width="22" height="8" rx="4" fill="#6b829e" />
              <circle cx="-11" cy="0" r="4.2" fill="#3a4a5e" />
              <circle cx="11" cy="0" r="4.2" fill="#3a4a5e" />
            </g>
            <rect className={styles.legLeft} x="-9" y="-16" width="7" height="16" rx="2" fill="#3a4a5e" />
            <rect className={styles.legRight} x="2" y="-16" width="7" height="16" rx="2" fill="#3a4a5e" />
            <IsoBox x={-14} y={-44} w={28} h={28} depth={8} rx={3}
              front="#4a6080" top="#5a7090" side="#3a5070" />
            <rect x="-6" y="-38" width="12" height="10" rx="2" fill="#2a3850" />
            <circle className={styles.chestLight} cx="0" cy="-33" r="1.8" fill="#7fd8ff" />
            <g className={styles.robotHead}>
              <IsoBox x={-11} y={-60} w={22} h={14} depth={6} rx={2}
                front="#5a7090" top="#6a80a0" side="#4a6080" />
              <rect x="-8" y="-56" width="16" height="5" rx="2" fill="#15202e" />
              <circle className={styles.eye} cx="0" cy="-53.5" r="1.8" fill="#7fd8ff" />
              <line x1="0" y1="-60" x2="0" y2="-66" stroke="#3a4a5e" strokeWidth="1.5" />
              <circle className={styles.antennaLight} cx="0" cy="-67" r="2" fill="#7fd8ff" />
            </g>
            {/* right arm — always visible, wrenches at pipe spots */}
            <g transform="translate(14, -40)">
              <g className={styles.robotArm}>
                <rect x="0" y="-3" width="13" height="5" rx="2.5" fill="#4a6080" />
                <rect x="12" y="-6" width="4" height="10" rx="1.5" fill="#cfd8e3" />
              </g>
            </g>
            {/* left arm — hangs at rest, rises to scratch head while thinking */}
            <g className={styles.restArm}>
              <line x1="-14" y1="-40" x2="-18" y2="-28" stroke="#4a6080" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g className={styles.scratchArm}>
              <line x1="-14" y1="-40" x2="-12" y2="-54" stroke="#4a6080" strokeWidth="4" strokeLinecap="round" />
              <g transform="translate(-12, -54)">
                <g className={styles.scratchWiggle}>
                  <line x1="0" y1="0" x2="8" y2="-8" stroke="#4a6080" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="8" cy="-8" r="2.6" fill="#5a7090" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {PIPE_TARGETS.map((x, i) => (
          <PlacedPipe key={x} className={`${styles.pipe} ${styles[`pipe${i}`]}`} x={x} />
        ))}

        <g transform="translate(360, 132)">
          <circle className={styles.connectGlow} r="9" fill="none" stroke="#7fd8ff" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
