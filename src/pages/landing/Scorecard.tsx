const ROWS = [
  { label: "Technical knowledge", score: 8 },
  { label: "Problem solving", score: 7 },
  { label: "Communication", score: 6 },
  { label: "System design", score: 4, circled: true },
];

export default function Scorecard() {
  return (
    <div className="lp-visual">
      <div className="lp-sheet">
        <div className="lp-sheet-head">
          <h2>Mock interview scorecard</h2>
          <span>Backend · Spring Boot</span>
        </div>

        <ul className="lp-rows">
          {ROWS.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>

              <span className="lp-score">
                {row.score}
                <small>/10</small>
                {row.circled && (
                  <svg
                    className="lp-pen"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      pathLength={1}
                      vectorEffect="non-scaling-stroke"
                      d="M8 27 C 4 8, 44 0, 78 8 C 98 14, 96 40, 56 46 C 22 50, 2 40, 10 20 C 14 12, 24 8, 34 7"
                    />
                  </svg>
                )}
              </span>

              <span className="lp-meter" aria-hidden="true">
                <i style={{ width: `${row.score * 10}%` }} />
              </span>
            </li>
          ))}
        </ul>

        <p className="lp-note">
          <b>System design:</b> you named the components but skipped how they
          fail. Practice explaining trade-offs out loud.
        </p>

        <div className="lp-sheet-foot">
          <span>Hiring readiness</span>
          <strong>Almost ready</strong>
        </div>
      </div>

      <p className="lp-sample">Sample scorecard. Not a real candidate.</p>
    </div>
  );
}
