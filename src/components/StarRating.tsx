interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 3 }: StarRatingProps) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className="star-rating__star"
          aria-label={`評価 ${n}`}
          onClick={() => onChange(n === value ? 0 : n)}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
