type TimerProps = {
  seconds: number;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Timer({ seconds }: TimerProps) {
  return (
    <div className="timer" role="timer" aria-live="polite">
      {formatTimer(seconds)}
    </div>
  );
}
