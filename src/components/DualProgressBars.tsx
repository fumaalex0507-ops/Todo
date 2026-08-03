interface DualProgressBarsProps {
  weightPercent: number
  datePercent: number
}

export function DualProgressBars({ weightPercent, datePercent }: DualProgressBarsProps) {
  return (
    <div className="dual-progress">
      <div className="dual-progress__row">
        <span className="dual-progress__label">体重</span>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${weightPercent}%` }} />
        </div>
        <span className="dual-progress__percent dual-progress__percent--weight">
          {Math.round(weightPercent)}%
        </span>
      </div>
      <div className="dual-progress__row">
        <span className="dual-progress__label">期間</span>
        <div className="progress-bar">
          <div className="progress-bar__fill progress-bar__fill--date" style={{ width: `${datePercent}%` }} />
        </div>
        <span className="dual-progress__percent dual-progress__percent--date">
          {Math.round(datePercent)}%
        </span>
      </div>
    </div>
  )
}
