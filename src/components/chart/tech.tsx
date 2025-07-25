import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getLanguageColor, getThemeColors } from '@/util/theme'
import { ResponsivePie } from '@nivo/pie'
import { Code } from 'lucide-react'
import { LanguageBar } from './helper'

interface TechnologyStackCardProps {
  languages: Record<string, number>
}

export const TechnologyStackCard = ({ languages }: TechnologyStackCardProps) => {
  const processLanguageData = () => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0)

    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang, bytes], index) => ({
        id: lang,
        label: lang,
        value: Number(((bytes / total) * 100).toFixed(1)),
        color: getLanguageColor(lang, index),
      }))
  }

  const themeColors = getThemeColors()
  const chartData = processLanguageData()

  return (
    <Card className="col-span-1 lg:col-span-2 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5"></div>

      <CardHeader className="relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative p-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Technology Stack</CardTitle>
            <p className="text-sm text-muted-foreground">Programming Languages Distribution</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 p-4 bg-card/50 rounded-xl border backdrop-blur-sm relative">
            <div className="h-80 w-full">
              <ResponsivePie
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.65}
                padAngle={2}
                cornerRadius={8}
                activeOuterRadiusOffset={8}
                colors={(d) => d.data.color}
                borderWidth={0}
                enableArcLabels={false}
                enableArcLinkLabels={false}
                animate={true}
                motionConfig="gentle"
                theme={{
                  background: 'transparent',
                  text: {
                    fontSize: 12,
                    fill: themeColors.text,
                    outlineWidth: 0,
                    outlineColor: 'transparent',
                  },
                  tooltip: {
                    container: {
                      background: themeColors.background,
                      color: themeColors.text,
                      fontSize: 12,
                      borderRadius: '8px',
                      boxShadow:
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${themeColors.text}20`,
                    },
                  },
                }}
                tooltip={({ datum }) => (
                  <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-xl border">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: datum.color }}
                      />
                      <span className="font-medium">{datum.label}</span>
                    </div>
                    <div className="text-sm opacity-90">{datum.value}% of codebase</div>
                  </div>
                )}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{chartData.length}</div>
                <div className="text-sm text-muted-foreground mb-2">Languages</div>
                <div className="flex items-center gap-1 justify-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: chartData[0]?.color }}
                  />
                  <div className="text-xs text-muted-foreground">{chartData[0]?.label} leads</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-foreground mb-4">Language Breakdown</h4>
            {chartData.map((lang) => (
              <LanguageBar key={lang.id} language={lang} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
