export interface GeocodeResult {
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

async function searchCityRaw(query: string): Promise<GeocodeResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ja&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('地点の検索に失敗しました')
  const data = await res.json()
  return (data.results ?? []).map((r: { name: string; latitude: number; longitude: number; admin1?: string; country?: string }) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1,
    country: r.country,
  }))
}

// 「東京」「大阪」「札幌」のように市区町村の接尾辞を省略した入力は
// ジオコーディングAPIが0件を返すことが多いため、接尾辞を補って再検索する
const CITY_SUFFIXES = ['', '市', '都', '区', '町', '村', '道', '府', '県']

export async function searchCity(query: string): Promise<GeocodeResult[]> {
  for (const suffix of CITY_SUFFIXES) {
    const results = await searchCityRaw(`${query}${suffix}`)
    if (results.length > 0) return results
  }
  return []
}

export function weathernewsUrl(latitude: number, longitude: number) {
  return `https://weathernews.jp/onebox/${latitude}/${longitude}/?temp=c&lang=ja`
}
