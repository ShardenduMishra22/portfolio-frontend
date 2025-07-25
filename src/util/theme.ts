import { ChartTheme } from "@/data/types.data"

// Memoized getThemeColors
let _themeColors: ChartTheme | null = null
export const getThemeColors = (): ChartTheme => {
  if (_themeColors) return _themeColors
  if (typeof window === 'undefined') {
    _themeColors = { text: '#000000', grid: '#e5e7eb', background: '#ffffff', primary: '#3b82f6' }
    return _themeColors
  }
  const isDark = document.documentElement.classList.contains('dark')
  _themeColors = {
    text: isDark ? '#e5e7eb' : '#374151',
    grid: isDark ? '#374151' : '#e5e7eb', 
    background: isDark ? '#1f2937' : '#ffffff',
    primary: isDark ? '#60a5fa' : '#3b82f6'
  }
  return _themeColors
}

// Memoized getLanguageColor
const _langColorCache: Record<string, string> = {}
export const getLanguageColor = (language: string, index: number): string => {
  const key = language + ':' + index
  if (_langColorCache[key]) return _langColorCache[key]
  const languageColors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f7df1e',
    'Python': '#3776ab',
    'Java': '#ed8b00',
    'Go': '#00add8',
    'Rust': '#000000',
    'C++': '#00599c',
    'C': '#a8b9cc',
    'HTML': '#e34f26',
    'CSS': '#1572b6',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff'
  }
  _langColorCache[key] = languageColors[language] || [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
    '#ef4444', '#6366f1', '#ec4899', '#84cc16'
  ][index % 8]
  return _langColorCache[key]
}
