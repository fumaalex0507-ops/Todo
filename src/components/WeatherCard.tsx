import { useLocations } from '../hooks/useLocations'

export function WeatherCard() {
  const { locations } = useLocations()

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-card__title">今日の天気</h2>

      {locations.length === 0 ? (
        <p className="todo-list__empty">「設定」タブから地点を登録すると表示されます</p>
      ) : (
        <div className="weather-tiles">
          {locations.map((loc) => (
            <a
              key={loc.id}
              className="weather-tile weather-tile--link"
              href={loc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="weather-tile__name">{loc.name}</p>
              <span className="weather-tile__link">天気を見る →</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
