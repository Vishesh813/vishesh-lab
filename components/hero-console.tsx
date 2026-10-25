const mapNodes = [
  { x: 30, y: 38, hot: false },
  { x: 108, y: 20, hot: false },
  { x: 186, y: 44, hot: true },
  { x: 264, y: 18, hot: false },
  { x: 342, y: 40, hot: false },
];

const mapLines = [
  "M 38 38 C 66 38, 72 20, 100 20",
  "M 116 20 C 144 20, 150 44, 178 44",
  "M 194 44 C 222 44, 228 18, 256 18",
  "M 272 18 C 300 18, 306 40, 334 40",
];

export function HeroConsole() {
  return (
    <div className="console-wrap">
      <div className="console-glow" aria-hidden="true" />
      <div className="console">
        <div className="console-bar">
          <span className="console-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>vishesh-lab — zsh</span>
          <span className="console-live">indexed</span>
        </div>

        <div className="console-body">
          <div className="console-line">
            <span className="c-prompt">vishesh ~</span>
            <span className="c-cmd">vishesh init</span>
          </div>
          <div className="console-line">
            <span className="c-ok">✓</span>
            <span className="c-note">17 modules · 8 mapped problems · 3 field notes</span>
          </div>
          <div className="console-line">
            <span className="c-prompt">vishesh ~</span>
            <span className="c-cmd">vishesh next</span>
          </div>
          <div className="console-line">
            <span className="c-arrow">→</span>
            <span>
              Foundations / <span className="c-cmd">01 Programming Foundations</span>
            </span>
          </div>
          <div className="console-line">
            <span className="c-prompt">vishesh ~</span>
            <span className="c-cmd">vishesh progress</span>
            <span className="cursor" aria-hidden="true" />
          </div>
          <div className="console-line">
            <span className="c-dim">
              ▓▓▓░░░░░░░░░ 24% · progress stays in this browser
            </span>
          </div>

          <div className="console-map" aria-hidden="true">
            <svg viewBox="0 0 372 64" preserveAspectRatio="none">
              {mapLines.map((d) => (
                <path key={d} className="console-map-line" d={d} />
              ))}
              {mapNodes.map((node, index) => (
                <circle
                  key={index}
                  className={`console-map-node${node.hot ? " is-hot" : ""}`}
                  cx={node.x}
                  cy={node.y}
                  r={node.hot ? 5 : 4}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="console-foot">
          <span>
            <kbd>⌘</kbd> <kbd>K</kbd> to search the site
          </span>
          <span>v1.0 · static</span>
        </div>
      </div>
    </div>
  );
}
