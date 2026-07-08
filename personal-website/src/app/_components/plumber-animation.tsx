import styles from "./plumber-animation.module.css";

const PIPE_TARGETS = [120, 185, 250, 315];

function PlacedPipe({ className, x }: { className: string; x: number }) {
  return (
    <g transform={`translate(${x}, 100)`}>
      <ellipse className={styles.shadow} cx="17" cy="14" rx="19" ry="4" />
      <g className={className}>
        <circle cx="0" cy="0" r="7" fill="#f2c6a0" />
        <rect x="0" y="-6" width="34" height="12" rx="6" fill="#dfe9e3" />
        <rect x="0" y="-6" width="34" height="4" rx="2" fill="#eef5f0" />
        <circle cx="34" cy="0" r="7" fill="#f2c6a0" />
      </g>
    </g>
  );
}

function PipeStack() {
  return (
    <g transform="translate(28, 100)">
      <ellipse className={styles.shadow} cx="10" cy="16" rx="18" ry="4" />
      <rect x="-2" y="-6" width="24" height="8" rx="4" fill="#dfe9e3" />
      <rect x="-2" y="-15" width="24" height="8" rx="4" fill="#dfe9e3" />
      <rect x="-2" y="-24" width="24" height="8" rx="4" fill="#dfe9e3" />
    </g>
  );
}

export default function PlumberAnimation() {
  return (
    <div className="my-8">
      <svg
        className={styles.scene}
        viewBox="0 0 460 150"
        role="img"
        aria-label="Animation of a small plumber laying and connecting pipes, then checking the monitoring station"
      >
        <line
          className={styles.ground}
          x1="6"
          y1="122"
          x2="454"
          y2="122"
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />

        <PipeStack />

        {/* Monitoring / control station, drawn as a simple isometric box */}
        <g transform="translate(392, 40)">
          <ellipse className={styles.shadow} cx="0" cy="72" rx="26" ry="5" />
          <rect x="-4" y="58" width="8" height="14" fill="#1f403c" />
          <rect x="-16" y="70" width="32" height="6" rx="3" fill="#1f403c" />

          {/* right (dark) face for iso depth */}
          <polygon points="42,0 52,-8 52,50 42,58" fill="#12211f" />
          {/* top (light) face for iso depth */}
          <polygon points="-42,0 42,0 52,-8 -32,-8" fill="#dfe9e3" />
          {/* front face */}
          <rect x="-42" y="0" width="84" height="58" rx="4" fill="#1f403c" />
          <rect x="-35" y="7" width="70" height="42" rx="3" fill="#12211f" />
          <polyline
            className={styles.graphA}
            points="-29,28 -20,16 -12,34 -3,10 6,26 15,18 24,28"
            fill="none"
            stroke="#f2c6a0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            className={styles.graphB}
            points="-29,20 -20,32 -12,12 -3,24 6,8 15,30 24,16"
            fill="none"
            stroke="#f2c6a0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle className={styles.statusLight} cx="30" cy="15" r="3" fill="#f2c6a0" />
        </g>

        {/* Plumber */}
        <g className={styles.plumberWalk}>
          <ellipse className={styles.shadow} cx="0" cy="14" rx="12" ry="3.5" />
          <g>
            {/* carried pipe */}
            <g className={styles.plumberCarry} transform="translate(-4, -30)">
              <rect x="-9" y="-3" width="18" height="7" rx="3.5" fill="#dfe9e3" />
              <circle cx="-9" cy="0" r="3.6" fill="#f2c6a0" />
              <circle cx="9" cy="0" r="3.6" fill="#f2c6a0" />
            </g>
            {/* legs */}
            <rect className={styles.legLeft} x="-6" y="0" width="5" height="12" rx="2" fill="#1f403c" />
            <rect className={styles.legRight} x="2" y="0" width="5" height="12" rx="2" fill="#1f403c" />
            {/* body */}
            <rect x="-8" y="-20" width="16" height="20" rx="4" fill="#1f403c" />
            {/* head */}
            <circle cx="0" cy="-27" r="7" fill="#f2c6a0" />
            {/* cap */}
            <path d="M -7 -31 a 7 7 0 0 1 14 0 z" fill="#1a1f25" />
            <rect x="-8" y="-31" width="9" height="3" rx="1.5" fill="#1a1f25" />
            {/* arm + wrench */}
            <g transform="translate(8, -14)">
              <g className={styles.plumberArm}>
                <rect x="0" y="-3" width="12" height="5" rx="2.5" fill="#1f403c" />
                <rect x="11" y="-6" width="4" height="10" rx="1.5" fill="#dfe9e3" />
              </g>
            </g>
          </g>
        </g>

        {PIPE_TARGETS.map((x, i) => (
          <PlacedPipe key={x} className={`${styles.pipe} ${styles[`pipe${i}`]}`} x={x} />
        ))}
      </svg>
    </div>
  );
}
