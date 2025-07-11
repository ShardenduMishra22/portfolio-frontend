import { fetchAllStats } from "./fetch"


let cachedStats: any = null

export async function getCachedStats() {
  if (cachedStats) return cachedStats
  cachedStats = await fetchAllStats()
  return cachedStats
}
