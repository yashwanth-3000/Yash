'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { Counter } from '@/components/ui/animated-counter'
import {
  BarChart3,
  X,
  TrendingUp,
  Users,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface CustomerStats {
  total: number
  recent24h: number
  timestamp: string
  customers: Array<{ created_at: string }>
}

type DayPoint = { date: string; count: number }
type TimeRange = 7 | 14 | 30 | 60 | 90 | 'all'
type ChartMode = 'daily' | 'cumulative'
type PopupTab = 'overview' | 'daily' | 'heatmap' | 'monthly' | 'hourly' | 'topdays'

function buildSmoothPath(
  points: { x: number; y: number }[],
  smoothing = 0.2,
): string {
  if (points.length < 2) return ''
  const line = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
    const angle = Math.atan2(b.y - a.y, b.x - a.x)
    return { len, angle }
  }
  const cp = (
    cur: { x: number; y: number },
    prev: { x: number; y: number } | undefined,
    next: { x: number; y: number } | undefined,
    rev: boolean,
  ) => {
    const p = prev || cur
    const n = next || cur
    const { len, angle } = line(p, n)
    const a = angle + (rev ? Math.PI : 0)
    const r = len * smoothing
    return { x: cur.x + Math.cos(a) * r, y: cur.y + Math.sin(a) * r }
  }
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const c1 = cp(points[i - 1], points[i - 2], points[i], false)
    const c2 = cp(points[i], points[i - 1], points[i + 1], true)
    d += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} ${points[i].x},${points[i].y}`
  }
  return d
}

function useAllGraphData(stats: CustomerStats | null): DayPoint[] {
  return useMemo(() => {
    if (!stats?.customers?.length) return []
    const now = new Date()
    now.setHours(23, 59, 59, 999)

    // Find the earliest customer date
    let earliest = now
    const dailyCounts: Record<string, number> = {}
    stats.customers.forEach((customer) => {
      const date = new Date(customer.created_at)
      if (date < earliest) earliest = date
      const dayKey = date.toISOString().split('T')[0]
      dailyCounts[dayKey] = (dailyCounts[dayKey] || 0) + 1
    })

    // Build day-by-day array from earliest to today
    const startDate = new Date(earliest)
    startDate.setHours(0, 0, 0, 0)
    const result: DayPoint[] = []
    for (
      let d = new Date(startDate);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      const dayKey = d.toISOString().split('T')[0]
      result.push({ date: dayKey, count: dailyCounts[dayKey] || 0 })
    }
    return result
  }, [stats])
}

function useSvgPaths(
  graphData: DayPoint[],
  maxCount: number,
  w: number,
  h: number,
  px: number,
  py = 6,
) {
  return useMemo(() => {
    if (!graphData.length || maxCount === 0) return { linePath: '', areaPath: '' }
    const pts = graphData.map((d, i) => ({
      x: px + (i / Math.max(graphData.length - 1, 1)) * (w - px * 2),
      y: h - py - (d.count / maxCount) * (h - py * 2 - 4),
    }))
    const lp = buildSmoothPath(pts, 0.22)
    const ap = `${lp} L ${pts[pts.length - 1].x},${h} L ${pts[0].x},${h} Z`
    return { linePath: lp, areaPath: ap }
  }, [graphData, maxCount, w, h, px, py])
}

// ─── Loader ──────────────────────────────────────────
function StatsLoader() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 px-4 py-3.5 dark:border-zinc-800/60 dark:bg-zinc-900">
      <div className="relative z-10 space-y-3">
        <div className="h-2.5 w-20 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70" />
        <div className="flex items-end gap-2">
          <div className="h-7 w-12 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70" />
          <div className="mb-1 h-3 w-20 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-2.5 w-28 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end gap-[6px] px-4 pb-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 origin-bottom rounded-full bg-zinc-200/40 dark:bg-zinc-700/30"
            animate={{
              height: ['12%', `${20 + Math.random() * 40}%`, '12%'],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
        />
      </div>
    </div>
  )
}

// ─── Tooltip on chart hover ──────────────────────────
function ChartTooltip({
  x,
  y,
  date,
  count,
  containerRect,
}: {
  x: number
  y: number
  date: string
  count: number
  containerRect: DOMRect | null
}) {
  if (!containerRect) return null
  const d = new Date(date)
  const label = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-zinc-200/60 bg-white px-2.5 py-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      style={{ left: x, top: y - 48 }}
    >
      <p className="text-[0.65rem] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
        {count} download{count !== 1 ? 's' : ''}
      </p>
    </motion.div>
  )
}

// ─── Interactive chart ──────────────────────────────
function InteractiveChart({
  data,
  maxVal,
  mode,
  width: W,
  height: H,
  paddingX: PX,
  paddingY: PY,
}: {
  data: DayPoint[]
  maxVal: number
  mode: ChartMode
  width: number
  height: number
  paddingX: number
  paddingY: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)

  const displayData = useMemo(() => {
    if (mode === 'cumulative') {
      let sum = 0
      return data.map((d) => {
        sum += d.count
        return { ...d, count: sum }
      })
    }
    return data
  }, [data, mode])

  const displayMax = useMemo(
    () => Math.max(...displayData.map((d) => d.count), 1),
    [displayData],
  )

  const { linePath, areaPath } = useSvgPaths(displayData, displayMax, W, H, PX, PY)

  const pts = useMemo(
    () =>
      displayData.map((d, i) => ({
        x: PX + (i / Math.max(displayData.length - 1, 1)) * (W - PX * 2),
        y: H - PY - (d.count / displayMax) * (H - PY * 2 - 4),
      })),
    [displayData, displayMax, W, H, PX, PY],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setContainerRect(rect)
      const relX = e.clientX - rect.left
      const chartLeft = (PX / W) * rect.width
      const chartRight = ((W - PX) / W) * rect.width
      const pct = (relX - chartLeft) / (chartRight - chartLeft)
      const idx = Math.round(pct * (displayData.length - 1))
      if (idx >= 0 && idx < displayData.length) {
        setHoveredIdx(idx)
      } else {
        setHoveredIdx(null)
      }
    },
    [displayData.length, W, PX],
  )

  const hoveredPt = hoveredIdx !== null ? pts[hoveredIdx] : null
  const hoveredPixelX =
    hoveredPt && containerRect
      ? (hoveredPt.x / W) * containerRect.width
      : 0
  const hoveredPixelY =
    hoveredPt && containerRect
      ? (hoveredPt.y / H) * containerRect.height
      : 0

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[170px] w-full">
        <defs>
          <linearGradient id="pop-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="pop-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0.5" />
          </linearGradient>
          <filter id="pop-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={PX}
            y1={H - PY - pct * (H - PY * 2 - 4)}
            x2={W - PX}
            y2={H - PY - pct * (H - PY * 2 - 4)}
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-800"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <text
            key={pct}
            x={PX - 4}
            y={H - PY - pct * (H - PY * 2 - 4) + 3}
            textAnchor="end"
            className="fill-zinc-400 dark:fill-zinc-600"
            fontSize="9"
          >
            {Math.round(displayMax * pct)}
          </text>
        ))}
        {areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#pop-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
        {linePath && (
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#pop-line)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#pop-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
        {/* Hover vertical line */}
        {hoveredIdx !== null && hoveredPt && (
          <line
            x1={hoveredPt.x}
            y1={PY}
            x2={hoveredPt.x}
            y2={H - PY}
            stroke="rgb(139,92,246)"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />
        )}
        {/* Data points */}
        {pts.map((pt, i) => {
          const isHovered = hoveredIdx === i
          const hasValue = displayData[i].count > 0
          if (!hasValue && !isHovered) return null
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={isHovered ? 5 : 3}
              fill={isHovered ? 'rgb(139,92,246)' : 'rgb(139,92,246)'}
              fillOpacity={isHovered ? 0.9 : 0.5}
              stroke="white"
              strokeWidth={isHovered ? 2 : 0}
              className="transition-all duration-150"
            />
          )
        })}
      </svg>
      {/* X-axis labels */}
      <div className="mt-1 flex justify-between px-1">
        {(() => {
          const len = displayData.length
          const indices =
            len <= 7
              ? Array.from({ length: len }, (_, i) => i)
              : len <= 14
                ? [0, Math.floor(len / 3), Math.floor((len * 2) / 3), len - 1]
                : [0, 9, 19, 29].filter((i) => i < len)
          return indices.map((i) => {
            const d = new Date(displayData[i]?.date || '')
            return (
              <span key={i} className="text-[0.6rem] tabular-nums text-zinc-400 dark:text-zinc-500">
                {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )
          })
        })()}
      </div>
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <ChartTooltip
            x={hoveredPixelX}
            y={hoveredPixelY}
            date={displayData[hoveredIdx].date}
            count={displayData[hoveredIdx].count}
            containerRect={containerRect}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Day-of-week heatmap ──────────────────────────────
function DayOfWeekHeatmap({ graphData }: { graphData: DayPoint[] }) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const buckets = useMemo(() => {
    const sums = Array(7).fill(0)
    const counts = Array(7).fill(0)
    graphData.forEach((d) => {
      const dow = new Date(d.date).getDay()
      sums[dow] += d.count
      counts[dow]++
    })
    return dayNames.map((name, i) => ({
      name,
      total: sums[i],
      avg: counts[i] > 0 ? Math.round((sums[i] / counts[i]) * 10) / 10 : 0,
    }))
  }, [graphData])

  const maxTotal = Math.max(...buckets.map((b) => b.total), 1)

  return (
    <div className="space-y-1.5">
      {buckets.map((b, i) => (
        <div key={b.name} className="flex items-center gap-2.5">
          <span className="w-8 shrink-0 text-[0.65rem] font-medium text-zinc-400 dark:text-zinc-500">
            {b.name}
          </span>
          <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800/60">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-md"
              style={{
                background: `linear-gradient(90deg, rgba(139,92,246,${0.25 + (b.total / maxTotal) * 0.55}), rgba(139,92,246,${0.15 + (b.total / maxTotal) * 0.35}))`,
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.max((b.total / maxTotal) * 100, b.total > 0 ? 6 : 0)}%`,
              }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
            />
            <div className="relative flex h-full items-center justify-between px-2">
              <span className="text-[0.6rem] font-medium tabular-nums text-zinc-600 dark:text-zinc-300">
                {b.total} total
              </span>
              <span className="text-[0.55rem] tabular-nums text-zinc-400 dark:text-zinc-500">
                ~{b.avg}/day
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Daily log ──────────────────────────────────────
function DailyLog({ graphData }: { graphData: DayPoint[] }) {
  const maxCount = Math.max(...graphData.map((d) => d.count), 1)
  const reversed = useMemo(() => [...graphData].reverse(), [graphData])
  return (
    <div className="max-h-[320px] space-y-0.5 overflow-y-auto pr-1 scrollbar-hide">
      {reversed.map((d) => {
        const date = new Date(d.date)
        const isToday =
          new Date().toISOString().split('T')[0] === d.date
        return (
          <motion.div
            key={d.date}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
          >
            <div className="w-24 shrink-0">
              <span className="text-[0.7rem] font-medium text-zinc-600 dark:text-zinc-300">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="ml-1.5 text-[0.6rem] text-zinc-400 dark:text-zinc-600">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              {isToday && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0 text-[0.5rem] font-semibold uppercase text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  today
                </span>
              )}
            </div>
            <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/60">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-violet-500/30 dark:bg-violet-400/25"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 4 : 0)}%`,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <span
              className={`w-6 shrink-0 text-right text-xs font-semibold tabular-nums ${
                d.count > 0
                  ? 'text-zinc-700 dark:text-zinc-200'
                  : 'text-zinc-300 dark:text-zinc-700'
              }`}
            >
              {d.count}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Monthly breakdown ──────────────────────────────
function MonthlyBreakdown({
  graphData,
  stats,
}: {
  graphData: DayPoint[]
  stats: CustomerStats
}) {
  const monthly = useMemo(() => {
    const buckets: Record<string, number> = {}
    graphData.forEach((d) => {
      const key = d.date.slice(0, 7)
      buckets[key] = (buckets[key] || 0) + d.count
    })
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => {
        const d = new Date(month + '-01')
        return {
          key: month,
          label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total,
        }
      })
  }, [graphData])

  const maxMonth = Math.max(...monthly.map((m) => m.total), 1)

  const cumulative = useMemo(() => {
    let sum = 0
    return monthly.map((m) => {
      sum += m.total
      return { ...m, cumulative: sum }
    })
  }, [monthly])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {cumulative.map((m, i) => (
          <div key={m.key} className="group">
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">
                {m.label}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800/60">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-violet-500/60 to-violet-400/40"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max((m.total / maxMonth) * 100, m.total > 0 ? 6 : 0)}%`,
                  }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                />
                <div className="relative flex h-full items-center px-2.5">
                  <span className="text-[0.65rem] font-semibold tabular-nums text-zinc-700 dark:text-zinc-200">
                    {m.total}
                  </span>
                </div>
              </div>
              <span className="w-14 shrink-0 text-right text-[0.6rem] tabular-nums text-zinc-400 dark:text-zinc-500">
                cum: {m.cumulative}
              </span>
            </div>
          </div>
        ))}
      </div>
      {monthly.length >= 2 && (
        <div className="rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-800/60">
          <p className="text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Month-over-month
          </p>
          <div className="mt-1.5 flex gap-2">
            {monthly.map((m, i) => {
              if (i === 0) return null
              const prev = monthly[i - 1].total
              const pct = prev > 0 ? Math.round(((m.total - prev) / prev) * 100) : m.total > 0 ? 100 : 0
              return (
                <div
                  key={m.key}
                  className="flex flex-col items-center rounded-md bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-900/60"
                >
                  <span className="text-[0.55rem] text-zinc-400 dark:text-zinc-500">{m.label}</span>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      pct >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {pct >= 0 ? '+' : ''}{pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Hourly heatmap ──────────────────────────────────
function HourlyHeatmap({ stats, graphData }: { stats: CustomerStats; graphData: DayPoint[] }) {
  const dateSet = useMemo(
    () => new Set(graphData.map((d) => d.date)),
    [graphData],
  )

  const hourly = useMemo(() => {
    const hours = Array(24).fill(0)
    stats.customers.forEach((c) => {
      const d = new Date(c.created_at)
      const dayKey = d.toISOString().split('T')[0]
      if (dateSet.has(dayKey)) {
        hours[d.getUTCHours()]++
      }
    })
    return hours
  }, [stats, dateSet])

  const maxHour = Math.max(...hourly, 1)

  const peakHour = hourly.indexOf(Math.max(...hourly))
  const quietHour = hourly.indexOf(Math.min(...hourly))

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-[0.6rem]">
        <div className="rounded-md bg-violet-500/10 px-2 py-1 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
          Peak: <span className="font-bold">{peakHour}:00 UTC</span> ({hourly[peakHour]} downloads)
        </div>
        <div className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          Quietest: <span className="font-bold">{quietHour}:00 UTC</span> ({hourly[quietHour]})
        </div>
      </div>

      {/* Grid heatmap: 6 cols x 4 rows */}
      <div className="grid grid-cols-6 gap-1.5">
        {hourly.map((count, h) => {
          const intensity = count / maxHour
          return (
            <motion.div
              key={h}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: h * 0.02, duration: 0.3 }}
              className="group relative flex flex-col items-center rounded-lg p-1.5 transition-transform hover:scale-105"
              style={{
                backgroundColor: count > 0
                  ? `rgba(139,92,246,${0.08 + intensity * 0.45})`
                  : 'rgba(139,92,246,0.03)',
              }}
            >
              <span className="text-[0.55rem] tabular-nums text-zinc-400 dark:text-zinc-500">
                {String(h).padStart(2, '0')}:00
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  count > 0
                    ? 'text-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-300 dark:text-zinc-700'
                }`}
              >
                {count}
              </span>
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-0.5 text-[0.55rem] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                {count} download{count !== 1 ? 's' : ''} at {String(h).padStart(2, '0')}:00 UTC
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Time-of-day bar chart */}
      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/80">
        <p className="mb-2 text-[0.55rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Distribution
        </p>
        <div className="flex items-end gap-[3px]" style={{ height: 80 }}>
          {hourly.map((count, h) => (
            <motion.div
              key={h}
              className="group relative flex-1 cursor-pointer rounded-t-sm transition-colors"
              style={{
                backgroundColor: `rgba(139,92,246,${0.2 + (count / maxHour) * 0.6})`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((count / maxHour) * 100, count > 0 ? 4 : 1)}%` }}
              transition={{ delay: h * 0.02, duration: 0.4, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-[0.5rem] text-zinc-400 dark:text-zinc-500">00:00</span>
          <span className="text-[0.5rem] text-zinc-400 dark:text-zinc-500">06:00</span>
          <span className="text-[0.5rem] text-zinc-400 dark:text-zinc-500">12:00</span>
          <span className="text-[0.5rem] text-zinc-400 dark:text-zinc-500">18:00</span>
          <span className="text-[0.5rem] text-zinc-400 dark:text-zinc-500">23:00</span>
        </div>
      </div>
    </div>
  )
}

// ─── Top days ──────────────────────────────────────
function TopDays({ graphData }: { graphData: DayPoint[] }) {
  const sorted = useMemo(
    () =>
      [...graphData]
        .filter((d) => d.count > 0)
        .sort((a, b) => b.count - a.count),
    [graphData],
  )

  const maxCount = sorted[0]?.count || 1
  const totalActive = sorted.length
  const totalDays = graphData.length
  const zeroDays = totalDays - totalActive

  return (
    <div className="space-y-4">
      <div className="flex gap-3 text-[0.6rem]">
        <div className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <span className="font-bold">{totalActive}</span> active days
        </div>
        <div className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <span className="font-bold">{zeroDays}</span> zero days
        </div>
        <div className="rounded-md bg-violet-500/10 px-2.5 py-1 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
          Activity rate: <span className="font-bold">{totalDays > 0 ? Math.round((totalActive / totalDays) * 100) : 0}%</span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No downloads in this period.</p>
      ) : (
        <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1 scrollbar-hide">
          {sorted.map((d, i) => {
            const date = new Date(d.date)
            const isTop3 = i < 3
            return (
              <motion.div
                key={d.date}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.015, duration: 0.25 }}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <span
                  className={`w-6 shrink-0 text-center text-[0.65rem] font-bold tabular-nums ${
                    isTop3
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="w-28 shrink-0">
                  <span className="text-[0.7rem] font-medium text-zinc-600 dark:text-zinc-300">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="ml-1.5 text-[0.6rem] text-zinc-400 dark:text-zinc-600">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
                <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/60">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      isTop3
                        ? 'bg-gradient-to-r from-violet-500/60 to-violet-400/40'
                        : 'bg-violet-500/25 dark:bg-violet-400/20'
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(d.count / maxCount) * 100}%`,
                    }}
                    transition={{ delay: i * 0.015, duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <span
                  className={`w-6 shrink-0 text-right text-xs font-bold tabular-nums ${
                    isTop3
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {d.count}
                </span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Analytics popup ──────────────────────────────────
function AnalyticsPopup({
  stats,
  allGraphData,
  onClose,
}: {
  stats: CustomerStats
  allGraphData: DayPoint[]
  onClose: () => void
}) {
  const [range, setRange] = useState<TimeRange>(30)
  const [chartMode, setChartMode] = useState<ChartMode>('daily')
  const [activeTab, setActiveTab] = useState<PopupTab>('overview')
  const [weekExpanded, setWeekExpanded] = useState<number | null>(null)

  const POP_W = 560
  const POP_H = 200
  const POP_PX = 40
  const POP_PY = 16

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const graphData = useMemo(() => {
    if (range === 'all') return allGraphData
    return allGraphData.slice(-range)
  }, [allGraphData, range])

  const maxCount = useMemo(
    () => Math.max(...graphData.map((d) => d.count), 1),
    [graphData],
  )

  const rangeTotal = useMemo(
    () => graphData.reduce((s, d) => s + d.count, 0),
    [graphData],
  )

  const peakDay = useMemo(() => {
    if (!graphData.length) return { count: 0, label: '-' }
    const peak = graphData.reduce((max, d) => (d.count > max.count ? d : max), graphData[0])
    const date = new Date(peak.date)
    return {
      count: peak.count,
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  }, [graphData])

  const avgPerDay = useMemo(() => {
    const activeDays = graphData.filter((d) => d.count > 0).length
    if (activeDays === 0) return 0
    return Math.round((rangeTotal / activeDays) * 10) / 10
  }, [graphData, rangeTotal])

  const streak = useMemo(() => {
    let current = 0
    let best = 0
    for (let i = graphData.length - 1; i >= 0; i--) {
      if (graphData[i].count > 0) {
        current++
        best = Math.max(best, current)
      } else {
        if (i < graphData.length - 1) break
        current = 0
      }
    }
    let bestStreak = 0
    let run = 0
    for (const d of graphData) {
      if (d.count > 0) {
        run++
        bestStreak = Math.max(bestStreak, run)
      } else {
        run = 0
      }
    }
    return { current, best: bestStreak }
  }, [graphData])

  const weeklyData = useMemo(() => {
    const numWeeks = Math.ceil(graphData.length / 7)
    const weeks: { label: string; total: number; days: DayPoint[] }[] = []
    for (let w = 0; w < numWeeks; w++) {
      const start = w * 7
      const end = Math.min(start + 7, graphData.length)
      const slice = graphData.slice(start, end)
      const total = slice.reduce((sum, d) => sum + d.count, 0)
      const startDate = new Date(slice[0]?.date || '')
      const label = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      weeks.push({ label: `Week of ${label}`, total, days: slice })
    }
    return weeks
  }, [graphData])

  const weekMax = Math.max(...weeklyData.map((w) => w.total), 1)

  const tabs: { id: PopupTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'hourly', label: 'Hourly' },
    { id: 'topdays', label: 'Top Days' },
    { id: 'daily', label: 'Daily Log' },
    { id: 'heatmap', label: 'By Day' },
  ]

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-2xl dark:border-zinc-800/60 dark:bg-zinc-950"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Download Analytics
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Time range pills */}
            <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
              {([7, 14, 30, 60, 90, 'all'] as TimeRange[]).map((r) => (
                <button
                  key={String(r)}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2 py-0.5 text-[0.65rem] font-medium transition-all ${
                    range === r
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  {r === 'all' ? 'All' : `${r}d`}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 gap-0 border-b border-zinc-100 px-5 dark:border-zinc-800/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3 py-2 text-[0.7rem] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="analytics-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-violet-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-2.5 px-5 pt-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-1 text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      <Users className="h-2.5 w-2.5" /> {range === 'all' ? 'All-time' : `${range}d Total`}
                    </div>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {rangeTotal}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-1 text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      <TrendingUp className="h-2.5 w-2.5" /> Peak
                    </div>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {peakDay.count}
                    </p>
                    <p className="text-[0.55rem] text-zinc-400 dark:text-zinc-500">
                      {peakDay.label}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-1 text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      <Clock className="h-2.5 w-2.5" /> Avg/Day
                    </div>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {avgPerDay}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-1 text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      <Flame className="h-2.5 w-2.5" /> Streak
                    </div>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {streak.current}d
                    </p>
                    <p className="text-[0.55rem] text-zinc-400 dark:text-zinc-500">
                      best: {streak.best}d
                    </p>
                  </div>
                </div>

                {/* Main graph */}
                <div className="px-5 pt-3 pb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      {range === 'all' ? 'All Time' : `Last ${range} Days`}
                    </p>
                    {/* Daily / Cumulative toggle */}
                    <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
                      {(['daily', 'cumulative'] as ChartMode[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setChartMode(m)}
                          className={`rounded-md px-2 py-0.5 text-[0.6rem] font-medium capitalize transition-all ${
                            chartMode === m
                              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/80">
                    <InteractiveChart
                      data={graphData}
                      maxVal={maxCount}
                      mode={chartMode}
                      width={POP_W}
                      height={POP_H}
                      paddingX={POP_PX}
                      paddingY={POP_PY}
                    />
                  </div>
                </div>

                {/* Weekly breakdown */}
                <div className="px-5 pb-5 pt-3">
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Weekly Breakdown
                  </p>
                  <div className="space-y-1.5">
                    {weeklyData.map((week, i) => (
                      <div key={i}>
                        <button
                          type="button"
                          onClick={() =>
                            setWeekExpanded(weekExpanded === i ? null : i)
                          }
                          className="flex w-full items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                        >
                          <span className="w-28 shrink-0 text-left text-[0.7rem] text-zinc-500 dark:text-zinc-400">
                            {week.label}
                          </span>
                          <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/80">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500/70 to-violet-400/50"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.max(
                                  (week.total / weekMax) * 100,
                                  week.total > 0 ? 8 : 0,
                                )}%`,
                              }}
                              transition={{
                                delay: 0.1 + i * 0.08,
                                duration: 0.5,
                                ease: 'easeOut',
                              }}
                            />
                          </div>
                          <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums text-zinc-600 dark:text-zinc-300">
                            {week.total}
                          </span>
                          {weekExpanded === i ? (
                            <ChevronUp className="h-3 w-3 shrink-0 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 shrink-0 text-zinc-400" />
                          )}
                        </button>
                        <AnimatePresence>
                          {weekExpanded === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex gap-1 py-1.5 pl-[7.5rem]">
                                {week.days.map((d) => {
                                  const date = new Date(d.date)
                                  const dayLabel = date.toLocaleDateString(
                                    'en-US',
                                    { weekday: 'narrow' },
                                  )
                                  const intensity =
                                    maxCount > 0 ? d.count / maxCount : 0
                                  return (
                                    <div
                                      key={d.date}
                                      className="flex flex-1 flex-col items-center gap-0.5"
                                      title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${d.count}`}
                                    >
                                      <div
                                        className="h-5 w-full rounded-sm transition-colors"
                                        style={{
                                          backgroundColor:
                                            d.count > 0
                                              ? `rgba(139,92,246,${0.15 + intensity * 0.6})`
                                              : 'rgba(139,92,246,0.05)',
                                        }}
                                      />
                                      <span className="text-[0.5rem] tabular-nums text-zinc-400 dark:text-zinc-500">
                                        {dayLabel}
                                      </span>
                                      <span className="text-[0.5rem] font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
                                        {d.count}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'monthly' && (
              <motion.div
                key="monthly"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-4"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Monthly Breakdown
                </p>
                <MonthlyBreakdown graphData={graphData} stats={stats} />
              </motion.div>
            )}

            {activeTab === 'hourly' && (
              <motion.div
                key="hourly"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-4"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Downloads by Hour (UTC)
                </p>
                <HourlyHeatmap stats={stats} graphData={graphData} />
              </motion.div>
            )}

            {activeTab === 'topdays' && (
              <motion.div
                key="topdays"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-4"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Top Days — Ranked
                </p>
                <TopDays graphData={graphData} />
              </motion.div>
            )}

            {activeTab === 'daily' && (
              <motion.div
                key="daily"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-4"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Daily Downloads ({range === 'all' ? 'all time' : `${range} days`})
                </p>
                <DailyLog graphData={graphData} />
              </motion.div>
            )}

            {activeTab === 'heatmap' && (
              <motion.div
                key="heatmap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-4"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Downloads by Day of Week ({range === 'all' ? 'all time' : `${range}d`})
                </p>
                <DayOfWeekHeatmap graphData={graphData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

// ─── Main component ──────────────────────────────────
export function CustomersStats() {
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/customers', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()

      const recent24h = data.customers.filter((c: any) => {
        const diff = new Date().getTime() - new Date(c.created_at).getTime()
        return diff < 24 * 60 * 60 * 1000
      }).length

      setStats({
        total: data.total,
        recent24h,
        timestamp: data.timestamp,
        customers: data.customers,
      })
    } catch (error) {
      console.error('Error fetching customer stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const allGraphData = useAllGraphData(stats)
  const cardGraphData = useMemo(() => allGraphData.slice(-30), [allGraphData])
  const maxCount = Math.max(...cardGraphData.map((d) => d.count), 1)

  const SVG_W = 320
  const SVG_H = 100
  const PADDING_X = 4

  const { linePath, areaPath } = useSvgPaths(cardGraphData, maxCount, SVG_W, SVG_H, PADDING_X)

  if (isLoading || !stats) return <StatsLoader />

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 px-4 py-3.5 dark:border-zinc-800/60 dark:bg-zinc-900">
        {/* SVG area chart background — blurred so text stays readable */}
        <div className="pointer-events-none absolute inset-0 opacity-60 blur-[1px]">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="stats-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.18" />
                <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.07" />
                <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="stats-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.12" />
                <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.30" />
                <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0.18" />
              </linearGradient>
              <filter id="stats-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {areaPath && (
              <motion.path
                d={areaPath}
                fill="url(#stats-area-grad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
            {linePath && (
              <motion.path
                d={linePath}
                fill="none"
                stroke="url(#stats-line-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#stats-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
              />
            )}
          </svg>
        </div>

        {/* Vertical lines overlay — softened */}
        <div className="pointer-events-none absolute inset-0 flex items-end gap-[5px] px-3 pb-2 opacity-50 blur-[0.5px]">
          {cardGraphData.map((point, i) => (
            <motion.div
              key={point.date}
              className="flex flex-1 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.025, duration: 0.4 }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${Math.max((point.count / maxCount) * 65, point.count > 0 ? 6 : 0)}%`,
                }}
                transition={{ delay: 0.5 + i * 0.025, duration: 0.5, ease: 'easeOut' }}
                className="w-[1.5px] origin-bottom rounded-full"
                style={{
                  background: `linear-gradient(to top, rgba(139,92,246,0.03), rgba(139,92,246,${0.08 + (point.count / maxCount) * 0.14}))`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Large background number */}
        <motion.span
          className="pointer-events-none absolute -right-1 -top-2 select-none text-[4.5rem] font-black leading-none text-zinc-200/60 dark:text-zinc-800/40"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8, ease: 'easeIn' }}
        >
          {stats.total}
        </motion.span>

        {/* Content */}
        <div className="relative z-10">
          <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Downloads
          </p>
          <div className="flex items-end gap-1.5">
            <Counter
              end={stats.total}
              duration={1.8}
              fontSize={24}
              className="text-zinc-900 dark:text-zinc-100"
            />
            <span className="pb-[5px] text-xs text-zinc-400 dark:text-zinc-500">
              and counting
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[0.68rem] text-zinc-400 dark:text-zinc-500">
                live from Dodo Payments
              </span>
            </div>
            <motion.button
              type="button"
              onClick={() => setShowPopup(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-[0.62rem] font-semibold text-violet-600 transition-colors hover:bg-violet-500/20 dark:bg-violet-500/15 dark:text-violet-400 dark:hover:bg-violet-500/25"
            >
              <BarChart3 className="h-3 w-3" />
              Analytics
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <AnalyticsPopup
            stats={stats}
            allGraphData={allGraphData}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
