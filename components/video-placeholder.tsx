import { Clock, Play } from "./icons";

type Props = {
  title?: string;
  description?: string;
  minutes?: number;
  compact?: boolean;
};

export function VideoPlaceholder({
  title = "Video walkthrough",
  description = "The written lesson is ready now. A recorded walkthrough is being edited and will appear here — check back soon.",
  minutes,
  compact = false,
}: Props) {
  return (
    <section
      className={`video-placeholder${compact ? " is-compact" : ""}`}
      aria-labelledby="video-placeholder-title"
    >
      <div className="video-frame" aria-hidden="true">
        <div className="video-frame-grid" />
        <span className="video-play">
          <Play width={22} height={22} />
        </span>
        <span className="video-soon">Available soon</span>
      </div>
      <div className="video-copy">
        <p className="eyebrow">Watch, then read</p>
        <h2 id="video-placeholder-title">{title}</h2>
        <p>{description}</p>
        <div className="video-meta">
          <span>
            <Play width={11} height={11} aria-hidden="true" />
            Recorded walkthrough
          </span>
          {minutes ? (
            <span>
              <Clock width={11} height={11} aria-hidden="true" />
              ~{minutes} min
            </span>
          ) : null}
          <span className="video-status">Available soon</span>
        </div>
      </div>
    </section>
  );
}
