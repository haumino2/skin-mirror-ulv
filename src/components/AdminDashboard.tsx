import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  OVERALL_COVERAGE,
  STATUS_COLORS,
  brandStats,
  capabilityScores,
  costSummary,
  feedbackLog,
  feedbackSummary,
  funnelStages,
  getBiggestDropOff,
  getFunnelMetrics,
  getPeakDay,
  getShareRate,
  getTotalWeeklyScans,
  skinTypeBreakdown,
  weeklyTrend,
  type CapabilityScore,
  type FeedbackEntry,
} from '../data/mockAnalytics'

const UNILEVER_BLUE = '#004d99'

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}

function formatUsd(value: number): string {
  return `$${value.toFixed(3)}`
}

function formatUsdTotal(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface DashboardCardProps {
  children: ReactNode
  className?: string
}

function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

interface SectionHeaderProps {
  eyebrow: string
  title: string
  action?: ReactNode
}

function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          {eyebrow}
        </p>
        <h2 className="text-lg font-bold text-[#004d99]">{title}</h2>
      </div>
      {action}
    </div>
  )
}

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
}

function ProgressRing({ value, size = 56, strokeWidth = 5 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={UNILEVER_BLUE}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  )
}

interface HorizontalBarProps {
  value: number
  max: number
  color: string
  animate: boolean
}

function HorizontalBar({ value, max, color, animate }: HorizontalBarProps) {
  const widthPct = max > 0 ? (value / max) * 100 : 0

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: animate ? `${widthPct}%` : '0%',
          backgroundColor: color,
        }}
      />
    </div>
  )
}

function SkinTypeDonut({ animate }: { animate: boolean }) {
  const size = 160
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const colors = ['#004d99', '#3385d6', '#66a3e0', '#99c2eb', '#cce0f5']

  let cumulative = 0

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {skinTypeBreakdown.map((slice, index) => {
          const segment = (slice.pct / 100) * circumference
          const offset = circumference - cumulative - segment
          cumulative += segment
          return (
            <circle
              key={slice.type}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[index]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${animate ? segment : 0} ${circumference}`}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          )
        })}
      </svg>
      <ul className="w-full space-y-2">
        {skinTypeBreakdown.map((slice, index) => (
          <li key={slice.type} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              {slice.type}
            </span>
            <span className="tabular-nums font-medium text-gray-800">{slice.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WeeklySparkline({ animate }: { animate: boolean }) {
  const width = 320
  const height = 120
  const padding = { top: 12, right: 8, bottom: 24, left: 8 }
  const peak = getPeakDay()
  const maxScans = Math.max(...weeklyTrend.map((d) => d.scans))
  const minScans = Math.min(...weeklyTrend.map((d) => d.scans))
  const range = maxScans - minScans || 1

  const points = weeklyTrend.map((day, index) => {
    const x =
      padding.left +
      (index / (weeklyTrend.length - 1)) * (width - padding.left - padding.right)
    const y =
      padding.top +
      (1 - (day.scans - minScans) / range) * (height - padding.top - padding.bottom)
    return { ...day, x, y, isPeak: day.day === peak.day }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-hidden>
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={UNILEVER_BLUE} stopOpacity="0.2" />
            <stop offset="100%" stopColor={UNILEVER_BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {animate ? (
          <>
            <path d={areaPath} fill="url(#sparkFill)" className="transition-all duration-500" />
            <path
              d={linePath}
              fill="none"
              stroke={UNILEVER_BLUE}
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
          </>
        ) : null}
        {points.map((p) => (
          <g key={p.day}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.isPeak ? 5 : 3.5}
              fill={p.isPeak ? UNILEVER_BLUE : '#ffffff'}
              stroke={UNILEVER_BLUE}
              strokeWidth={p.isPeak ? 2 : 1.5}
            />
            <text
              x={p.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-gray-400 text-[10px]"
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-xs text-gray-500">
        Peak: <span className="font-medium text-[#004d99]">{peak.day}</span>{' '}
        <span className="tabular-nums font-semibold text-gray-800">{peak.scans}</span> scans
      </p>
    </div>
  )
}

function PositiveRateDonut({ rate, animate }: { rate: number; animate: boolean }) {
  const size = 140
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filled = rate * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={UNILEVER_BLUE}
            strokeWidth={strokeWidth}
            strokeDasharray={`${animate ? filled : 0} ${circumference}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-[#004d99]">
            {formatPercent(rate * 100)}
          </span>
          <span className="text-[11px] text-gray-500">Positive</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        <span className="tabular-nums font-medium text-gray-700">
          {formatNumber(feedbackSummary.totalFeedback)}
        </span>{' '}
        total feedback
      </p>
    </div>
  )
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Z"
        stroke={UNILEVER_BLUE}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 17l6-6 4 4 8-8M14 7h7v7"
        stroke={UNILEVER_BLUE}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={UNILEVER_BLUE} strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke={UNILEVER_BLUE} strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.25" fill={UNILEVER_BLUE} />
    </svg>
  )
}

const INSIGHT_ICONS = [LightbulbIcon, TrendingUpIcon, TargetIcon]

type FeedbackFilter = 'all' | 'positive' | 'negative'

function FeedbackBadge({ feedback }: { feedback: FeedbackEntry['feedback'] }) {
  const isPositive = feedback === 'positive'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isPositive ? 'bg-green-600' : 'bg-red-600'}`}
      />
      {isPositive ? 'Positive' : 'Negative'}
    </span>
  )
}

function CapabilityBar({ cap, animate }: { cap: CapabilityScore; animate: boolean }) {
  return (
    <li>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-gray-800">{cap.name}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-700">
          {cap.score}
        </span>
      </div>
      <HorizontalBar
        value={cap.score}
        max={100}
        color={STATUS_COLORS[cap.status]}
        animate={animate}
      />
      <p className="mt-1 text-xs text-gray-400">{cap.note}</p>
    </li>
  )
}

export default function AdminDashboard() {
  const [animate, setAnimate] = useState(false)
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>('all')

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimate(true), 50)
    return () => window.clearTimeout(timer)
  }, [])

  const funnelMetrics = useMemo(() => getFunnelMetrics(), [])
  const biggestDropOff = useMemo(() => getBiggestDropOff(), [])
  const maxFunnelCount = funnelStages[0].count
  const totalWeeklyScans = getTotalWeeklyScans()
  const shareRate = getShareRate()
  const maxBrandRecs = brandStats[0]?.recommendations ?? 1
  const maxCostLine = Math.max(...costSummary.lines.map((l) => l.usd), 0.001)

  const filteredFeedback = useMemo(() => {
    if (feedbackFilter === 'all') return feedbackLog
    return feedbackLog.filter((entry) => entry.feedback === feedbackFilter)
  }, [feedbackFilter])

  const filterCounts = useMemo(
    () => ({
      all: feedbackLog.length,
      positive: feedbackLog.filter((e) => e.feedback === 'positive').length,
      negative: feedbackLog.filter((e) => e.feedback === 'negative').length,
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="border-b border-gray-200 pb-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Unilever Vietnam · Beauty &amp; Wellbeing
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#004d99] sm:text-3xl">
            Simple Skin Mirror — BU Capability Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Watson HCMC · Live Demo</p>
        </header>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Overall Coverage
            </p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={OVERALL_COVERAGE} />
              <p className="text-3xl font-bold tabular-nums text-[#004d99]">
                {OVERALL_COVERAGE}%
              </p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Total Scans
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">
              {formatNumber(totalWeeklyScans)}
            </p>
            <p className="mt-1 text-xs text-gray-400">This week</p>
          </DashboardCard>

          <DashboardCard>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Share Rate
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">
              {formatPercent(shareRate * 100, 1)}
            </p>
            <p className="mt-1 text-xs text-gray-400">Share ÷ Sessions</p>
          </DashboardCard>

          <DashboardCard>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Est. Cost / Scan
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">
              {formatUsd(costSummary.totalPerScan)}
            </p>
            <p className="mt-1 text-xs text-gray-400">All services combined</p>
          </DashboardCard>
        </div>

        <DashboardCard>
          <SectionHeader eyebrow="Capability" title="Capability Coverage Scorecard" />
          <ul className="space-y-4">
            {capabilityScores.map((cap) => (
              <CapabilityBar key={cap.name} cap={cap} animate={animate} />
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS.strong }} />
              Strong
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS.partial }} />
              Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS.gap }} />
              Gap
            </span>
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionHeader eyebrow="Learning & Data Capture" title="Customer Feedback Loop" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-600">Feedback Log</p>
                <div className="flex gap-1 rounded-lg bg-gray-50 p-1">
                  {(['all', 'positive', 'negative'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setFeedbackFilter(filter)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        feedbackFilter === filter
                          ? 'bg-[#004d99] text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {filter} ({filterCounts[filter]})
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      <th className="pb-2 pr-3">Time</th>
                      <th className="pb-2 pr-3">Skin Type</th>
                      <th className="pb-2 pr-3">Concern</th>
                      <th className="pb-2 pr-3">Products</th>
                      <th className="pb-2">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFeedback.map((entry, index) => (
                      <tr key={`${entry.time}-${index}`} className="hover:bg-gray-50">
                        <td className="py-3 pr-3 tabular-nums text-gray-500">{entry.time}</td>
                        <td className="py-3 pr-3 text-gray-800">{entry.skinType}</td>
                        <td className="py-3 pr-3 text-gray-800">{entry.concern}</td>
                        <td className="py-3 pr-3">
                          <span className="text-gray-800">{entry.products}</span>
                          {entry.feedback === 'negative' && entry.note ? (
                            <p className="mt-0.5 text-xs text-gray-400">{entry.note}</p>
                          ) : null}
                        </td>
                        <td className="py-3">
                          <FeedbackBadge feedback={entry.feedback} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium text-gray-600">Learning Summary</p>
                <PositiveRateDonut rate={feedbackSummary.positiveRate} animate={animate} />
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-gray-600">Top Negative Reasons</p>
                <ol className="space-y-2">
                  {feedbackSummary.topNegativeReasons.map((reason, index) => (
                    <li key={reason} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500">
                        {index + 1}
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-4 text-sm font-medium text-gray-600">AI Improvement Insights</p>
            <div className="grid gap-4 md:grid-cols-3">
              {feedbackSummary.aiInsights.map((insight, index) => {
                const Icon = INSIGHT_ICONS[index] ?? LightbulbIcon
                return (
                  <div
                    key={insight}
                    className="rounded-xl border border-gray-100 border-l-4 border-l-[#004d99] bg-[#f7f9fc] p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon />
                      <span className="text-[10px] font-medium uppercase tracking-wide text-[#004d99]">
                        Skin Mirror AI đề xuất
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{insight}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </DashboardCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardCard>
            <SectionHeader eyebrow="Funnel" title="Conversion Funnel" />
            <ul className="space-y-3">
              {funnelMetrics.map((stage) => {
                const isBiggestDrop =
                  biggestDropOff.toStage === stage.stage && stage.dropOffFromPrevious !== null
                return (
                  <li
                    key={stage.stage}
                    className={isBiggestDrop ? 'rounded-lg bg-amber-50 px-3 py-2 -mx-3' : ''}
                  >
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium text-gray-800">{stage.stage}</span>
                      <span className="shrink-0 tabular-nums text-gray-600">
                        {formatNumber(stage.count)}
                        {stage.retainedFromPrevious !== null ? (
                          <span className="ml-2 text-xs text-gray-400">
                            {formatPercent(stage.retainedFromPrevious, 1)} retained
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <HorizontalBar
                      value={stage.count}
                      max={maxFunnelCount}
                      color={isBiggestDrop ? '#f59e0b' : UNILEVER_BLUE}
                      animate={animate}
                    />
                    {isBiggestDrop ? (
                      <p className="mt-1 text-xs font-medium text-amber-700">
                        Biggest drop-off: {formatPercent(biggestDropOff.dropOffPct, 1)} from{' '}
                        {biggestDropOff.fromStage}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader eyebrow="Demographics" title="Skin Type Breakdown" />
            <SkinTypeDonut animate={animate} />
          </DashboardCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardCard>
            <SectionHeader eyebrow="Brands" title="Brand Performance" />
            <ul className="space-y-3">
              {brandStats.map((brand) => (
                <li key={brand.brand}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-gray-800">{brand.brand}</span>
                    <span className="shrink-0 tabular-nums text-gray-600">
                      {formatNumber(brand.recommendations)}
                      <span className="ml-2 text-xs text-gray-400">
                        {formatPercent(brand.shareOfVoice, 1)} SOV
                      </span>
                    </span>
                  </div>
                  <HorizontalBar
                    value={brand.recommendations}
                    max={maxBrandRecs}
                    color={UNILEVER_BLUE}
                    animate={animate}
                  />
                </li>
              ))}
            </ul>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader eyebrow="Traffic" title="Weekly Trend" />
            <WeeklySparkline animate={animate} />
          </DashboardCard>
        </div>

        <DashboardCard>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeader eyebrow="Unit Economics" title="Cost Per Scan" />
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-red-600">
              Optimization opportunity
            </span>
          </div>

          <ul className="space-y-3">
            {costSummary.lines.map((line) => (
              <li key={line.label}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-gray-700">{line.label}</span>
                  <span className="shrink-0 tabular-nums font-medium text-gray-800">
                    {formatUsd(line.usd)}
                  </span>
                </div>
                <HorizontalBar
                  value={line.usd}
                  max={maxCostLine}
                  color="#99c2eb"
                  animate={animate}
                />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-400">Total per scan</p>
              <p className="text-2xl font-bold tabular-nums text-[#004d99]">
                {formatUsd(costSummary.totalPerScan)}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              ≈ {formatUsdTotal(costSummary.monthlyEstimate)} / mo @{' '}
              <span className="tabular-nums font-medium text-gray-700">
                {formatNumber(costSummary.monthlyScans)}
              </span>{' '}
              scans
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
