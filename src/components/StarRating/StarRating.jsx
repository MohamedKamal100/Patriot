
import { useState } from "react"

const StarRating = ({
  rating = 0,
  onRatingChange,
  size = "text-2xl",
  readonly = false,
  showValue = false,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const getStarColor = (starIndex) => {
    const currentRating = hoverRating || rating
    if (starIndex <= currentRating) {
      return "text-yellow-500"
    }
    return "text-slate-300 dark:text-slate-600"
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            className={`${size} transition-all duration-200 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transform"
            } ${getStarColor(starIndex)}`}
            disabled={readonly}
          >
            ⭐
          </button>
        ))}
      </div>

      {showValue && (
        <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400">({rating.toFixed(1)})</span>
      )}
    </div>
  )
}

export default StarRating
