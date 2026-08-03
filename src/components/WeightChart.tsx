import { useMemo, useState } from 'react'
import type { WeightEntry } from '../types'

interface WeightChartProps {
  entries: WeightEntry[]
  targetWeight?: number | null
}

const WIDTH = 600
const HEIGHT = 220
const PAD_LEFT = 36
const PAD_RIGHT = 16
const PAD_TOP = 16
const PAD_BOTTOM = 28

function formatShort(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function WeightChart({ entries, targetWeight }: WeightChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  )

  const { points, yMin, yMax } = useMemo(() => {
    if (sorted.length === 0) {
      return { points: [] as { x: number; y: number }[], yMin: 0, yMax: 0 }
    }
    const weights = sorted.map((e) => e.weight)
    let min = Math.min(...weights)
    let max = Math.max(...weights)
    if (targetWeight != null) {
      min = Math.min(min, targetWeight)
      max = Math.max(max, targetWeight)
    }
    if (min === max) {
      min -= 1
      max += 1
    }
    const margin = (max - min) * 0.15
    min -= margin
    max += margin

    const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT
    const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

    const xForIdx = (i: number) =>
      sorted.length === 1
        ? PAD_LEFT + plotWidth / 2
        : PAD_LEFT + (plotWidth * i) / (sorted.length - 1)

    const yFor = (w: number) => PAD_TOP + plotHeight * (1 - (w - min) / (max - min))

    return {
      points: sorted.map((e, i) => ({ x: xForIdx(i), y: yFor(e.weight) })),
      yMin: min,
      yMax: max,
    }
  }, [sorted, targetWeight])

  if (sorted.length === 0) {
    return <p className="todo-list__empty">まだ記録がありません</p>
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM
  const targetY =
    targetWeight != null ? PAD_TOP + plotHeight * (1 - (targetWeight - yMin) / (yMax - yMin)) : null

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH
    let nearest = 0
    let nearestDist = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - px)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const hovered = hoverIndex != null ? sorted[hoverIndex] : null
  const hoveredPoint = hoverIndex != null ? points[hoverIndex] : null

  return (
    <div className="weight-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="weight-chart__svg"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <line
          x1={PAD_LEFT}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_RIGHT}
          y2={HEIGHT - PAD_BOTTOM}
          className="weight-chart__axis"
        />

        {targetY != null && (
          <>
            <line
              x1={PAD_LEFT}
              y1={targetY}
              x2={WIDTH - PAD_RIGHT}
              y2={targetY}
              className="weight-chart__target-line"
            />
            <text x={WIDTH - PAD_RIGHT} y={targetY - 4} textAnchor="end" className="weight-chart__target-label">
              目標 {targetWeight}kg
            </text>
          </>
        )}

        <path d={linePath} className="weight-chart__line" fill="none" />

        {points.map((p, i) => (
          <circle key={sorted[i].id} cx={p.x} cy={p.y} r={i === hoverIndex ? 5 : 3} className="weight-chart__dot" />
        ))}

        <text x={PAD_LEFT} y={HEIGHT - 8} className="weight-chart__axis-label">
          {formatShort(sorted[0].date)}
        </text>
        <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 8} textAnchor="end" className="weight-chart__axis-label">
          {formatShort(sorted[sorted.length - 1].date)}
        </text>

        {hoveredPoint && (
          <line
            x1={hoveredPoint.x}
            y1={PAD_TOP}
            x2={hoveredPoint.x}
            y2={HEIGHT - PAD_BOTTOM}
            className="weight-chart__crosshair"
          />
        )}
      </svg>

      {hovered && hoveredPoint && (
        <div
          className="weight-chart__tooltip"
          style={{
            left: `${(hoveredPoint.x / WIDTH) * 100}%`,
            top: `${(hoveredPoint.y / HEIGHT) * 100}%`,
          }}
        >
          {formatShort(hovered.date)} ・ {hovered.weight}kg
        </div>
      )}
    </div>
  )
}
