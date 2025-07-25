import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import {
  Activity,
  BarChart3,
  LineChart,
  AreaChart,
  Calendar,
  GitCommit,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { CommitData } from '@/data/types.data'
import { getThemeColors } from '@/util/theme'

interface EnhancedCommitsChartProps {
  commits: CommitData[]
}

export const EnhancedCommitsChart = ({ commits }: EnhancedCommitsChartProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '90d' | '1y'>('all')

  const processedData = useMemo(() => {
    if (!commits || commits.length === 0) return { chartData: [], stats: null }

    const sortedCommits = [...commits].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const now = new Date()
    const cutoffDate =
      timeRange === 'all'
        ? null
        : timeRange === '30d'
          ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          : timeRange === '90d'
            ? new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const filteredCommits = cutoffDate
      ? sortedCommits.filter((commit) => new Date(commit.date) >= cutoffDate)
      : sortedCommits

    const weeklyData = new Map<string, number>()

    filteredCommits.forEach((commit) => {
      const date = new Date(commit.date)
      const monday = new Date(date)
      monday.setDate(date.getDate() - date.getDay() + 1)
      const weekKey = monday.toISOString().split('T')[0]

      weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + commit.count)
    })

    const chartData = Array.from(weeklyData.entries())
      .map(([date, commits]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        }),
        commits,
        rawDate: date,
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))

    const totalCommits = filteredCommits.reduce((sum, commit) => sum + commit.count, 0)
    const avgCommitsPerWeek = chartData.length > 0 ? Math.round(totalCommits / chartData.length) : 0
    const maxWeek = chartData.reduce(
      (max, week) => (week.commits > max.commits ? week : max),
      chartData[0]
    )

    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2))
    const firstAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, item) => sum + item.commits, 0) / firstHalf.length
        : 0
    const secondAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, item) => sum + item.commits, 0) / secondHalf.length
        : 0
    const percentage = firstAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0

    const trend = {
      direction:
        percentage > 5
          ? ('up' as const)
          : percentage < -5
            ? ('down' as const)
            : ('stable' as const),
      percentage: Math.abs(percentage),
    }

    const stats = {
      totalCommits,
      avgCommitsPerWeek,
      maxWeek,
      trend,
      totalWeeks: chartData.length,
      activeWeeks: chartData.filter((week) => week.commits > 0).length,
    }

    return { chartData, stats }
  }, [commits, timeRange])

  const themeColors = getThemeColors()

  const chartProps = {
    data: processedData.chartData,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    animate: true,
    motionConfig: 'gentle' as const,
    theme: {
      background: 'transparent',
      text: {
        fontSize: 12,
        fill: themeColors.text,
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
      axis: {
        domain: {
          line: {
            stroke: themeColors.grid,
            strokeWidth: 1,
          },
        },
        legend: {
          text: {
            fontSize: 12,
            fill: themeColors.text,
            outlineWidth: 0,
            outlineColor: 'transparent',
          },
        },
        ticks: {
          line: {
            stroke: themeColors.grid,
            strokeWidth: 1,
          },
          text: {
            fontSize: 11,
            fill: themeColors.text,
            outlineWidth: 0,
            outlineColor: 'transparent',
          },
        },
      },
      grid: {
        line: {
          stroke: themeColors.grid,
          strokeWidth: 1,
          strokeOpacity: 0.3,
        },
      },
      tooltip: {
        container: {
          background: themeColors.background,
          color: themeColors.text,
          fontSize: 12,
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${themeColors.grid}`,
        },
      },
    },
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveLine
            {...chartProps}
            data={[
              {
                id: 'commits',
                data: processedData.chartData.map((d) => ({ x: d.date, y: d.commits })),
              },
            ]}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="monotoneX"
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Week',
              legendPosition: 'middle',
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: 'Commits',
              legendPosition: 'middle',
              legendOffset: -45,
            }}
            colors={[themeColors.primary]}
            pointSize={6}
            pointColor={themeColors.primary}
            pointBorderWidth={2}
            pointBorderColor={themeColors.background}
            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
            lineWidth={3}
          />
        )

      case 'area':
        return (
          <ResponsiveLine
            {...chartProps}
            data={[
              {
                id: 'commits',
                data: processedData.chartData.map((d) => ({ x: d.date, y: d.commits })),
              },
            ]}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
            curve="monotoneX"
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Week',
              legendPosition: 'middle',
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: 'Commits',
              legendPosition: 'middle',
              legendOffset: -45,
            }}
            colors={[themeColors.primary]}
            enableArea={true}
            areaOpacity={0.3}
            lineWidth={2}
            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
          />
        )

      default:
        return (
          <ResponsiveBar
            {...chartProps}
            keys={['commits']}
            indexBy="date"
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={[themeColors.primary]}
            borderRadius={4}
            borderWidth={1}
            borderColor={themeColors.primary}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Week',
              legendPosition: 'middle',
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: 'Commits',
              legendPosition: 'middle',
              legendOffset: -45,
            }}
            enableLabel={false}
            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
          />
        )
    }
  }

  const { stats } = processedData

  return (
    <Card className="col-span-1 lg:col-span-2 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>

      <CardHeader className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
              <div className="relative p-3 bg-primary rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Commits Over Time
              </CardTitle>
              <p className="text-sm text-muted-foreground">Development Activity Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-20">
            <div className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm">
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="h-8 w-8 p-0 relative z-30"
                type="button"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-8 w-8 p-0 relative z-30"
                type="button"
              >
                <LineChart className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
                className="h-8 w-8 p-0 relative z-30"
                type="button"
              >
                <AreaChart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 relative z-20">
          {(['all', '1y', '90d', '30d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs relative z-30"
              type="button"
            >
              {range === 'all'
                ? 'All Time'
                : range === '1y'
                  ? '1 Year'
                  : range === '90d'
                    ? '3 Months'
                    : '30 Days'}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6 z-0">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <GitCommit className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stats.totalCommits}</p>
            </div>

            <div className="p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Avg/Week</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stats.avgCommitsPerWeek}</p>
            </div>

            <div className="p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Peak Week</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stats.maxWeek?.commits || 0}</p>
            </div>

            <div className="p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                {stats.trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : stats.trend.direction === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-muted-foreground">Trend</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold text-foreground">{stats.trend.percentage}%</p>
                <Badge
                  variant={
                    stats.trend.direction === 'up'
                      ? 'default'
                      : stats.trend.direction === 'down'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {stats.trend.direction}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="h-80 p-4 bg-card/50 rounded-xl border backdrop-blur-sm relative z-0">
          {processedData.chartData.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No commit data available</p>
              </div>
            </div>
          )}
        </div>

        {stats && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">Activity Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Active Weeks:</span>
                <span className="ml-2 font-medium text-foreground">
                  {stats.activeWeeks} / {stats.totalWeeks}(
                  {Math.round((stats.activeWeeks / stats.totalWeeks) * 100)}%)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Consistency:</span>
                <span className="ml-2 font-medium text-foreground">
                  {stats.activeWeeks / stats.totalWeeks > 0.7
                    ? 'High'
                    : stats.activeWeeks / stats.totalWeeks > 0.4
                      ? 'Medium'
                      : 'Low'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Peak Performance:</span>
                <span className="ml-2 font-medium text-foreground">
                  {stats.maxWeek?.date} ({stats.maxWeek?.commits} commits)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
