type SessionPreviewProps = Readonly<{
  roomCode?: string;
  title?: string;
}>;

const fillerWords = ["um", "ah", "like", "so", "other"];

export function SessionPreview({
  roomCode = "BRIGHT-MAPLE-42",
  title = "Shared timer",
}: SessionPreviewProps) {
  return (
    <div className="session-panel" aria-label="Demo session preview">
      <div className="panel-header">
        <div>
          <span className="label">Room</span>
          <strong>{roomCode}</strong>
        </div>
        <span className="status">Demo</span>
      </div>

      <div className="timer">
        <span>{title}</span>
        <strong>00:00</strong>
        <div className="timer-actions">
          <button type="button">Start</button>
          <button type="button" disabled>
            Pause
          </button>
          <button type="button" disabled>
            Stop
          </button>
        </div>
      </div>

      <div className="filler-row" aria-label="Filler word controls">
        {fillerWords.map((word) => (
          <button key={word} type="button">
            + {word}
          </button>
        ))}
      </div>
    </div>
  );
}
