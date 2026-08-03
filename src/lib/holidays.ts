export async function fetchHolidays(year: number): Promise<Record<string, string>> {
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`)
    if (!res.ok) return {}
    return await res.json()
  } catch {
    return {}
  }
}
