import axios from 'axios'

const BASE_URL = 'https://portfolio-backend-2iw4.onrender.com/api'
const withTimeout = (url: string, ms = 8000) => axios.get(url, { timeout: ms }).catch(() => null)

export async function fetchAllStats() {
  const [lc, gh] = await Promise.all([
    withTimeout(`${BASE_URL}/leetcode`),
    withTimeout(`${BASE_URL}/github`),
  ])

  const [commits, langs, stars, top, cal] = await Promise.all([
    withTimeout(`${BASE_URL}/github/commits`),
    withTimeout(`${BASE_URL}/github/languages`),
    withTimeout(`${BASE_URL}/github/stars`),
    withTimeout(`${BASE_URL}/github/top-repos`),
    withTimeout(`${BASE_URL}/github/calendar`),
  ])

  return {
    leetcode: lc?.data?.data?.matchedUser || {},
    github: gh?.data || {},
    commits: commits?.data || [],
    languages: langs?.data || {},
    stars: stars?.data?.stars || 0,
    topRepos: top?.data || [],
    calendar: cal?.data || {},
  }
}
