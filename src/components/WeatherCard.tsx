import { useEffect, useState } from 'react'
import { useLocations } from '../hooks/useLocations'
import { searchCity, weathernewsUrl, type GeocodeResult } from '../lib/weather'

export function WeatherCard() {
  const { locations, addLocation, removeLocation } = useLocations()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    const timer = setTimeout(() => {
      searchCity(q)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-card__title">今日の天気</h2>

      {locations.length === 0 && (
        <p className="todo-list__empty">地点を登録するとリンクが表示されます</p>
      )}

      <div className="weather-tiles">
        {locations.map((loc) => (
          <div key={loc.id} className="weather-tile">
            <button
              type="button"
              className="weather-tile__remove"
              aria-label="削除"
              onClick={() => removeLocation(loc.id)}
            >
              ×
            </button>
            <p className="weather-tile__name">{loc.name}</p>
            <a
              className="weather-tile__link"
              href={weathernewsUrl(loc.latitude, loc.longitude)}
              target="_blank"
              rel="noopener noreferrer"
            >
              ウェザーニュースで見る →
            </a>
          </div>
        ))}
      </div>

      <div className="location-search">
        <input
          type="text"
          placeholder="都市名を入力(例: 東京)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searching && <p className="location-search__hint">検索中…</p>}
        {results.length > 0 && (
          <ul className="location-search__results">
            {results.map((r, i) => (
              <li key={`${r.name}-${i}`}>
                <button
                  type="button"
                  onClick={() => {
                    addLocation(r.name, r.latitude, r.longitude)
                    setQuery('')
                    setResults([])
                  }}
                >
                  {r.name}
                  {r.admin1 ? ` (${r.admin1})` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
