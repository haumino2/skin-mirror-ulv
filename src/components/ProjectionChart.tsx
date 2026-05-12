import {
  Area,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  PROJECTION_DATA,
  WEEK_LABELS,
  type ScenarioKey,
} from '../data/projectionData'

export interface ProjectionChartProps {
  scenario: ScenarioKey
  /** Week index 0–4; drives reference highlight */
  currentWeek: number
}

interface ChartRow {
  week: string
  oil: number
  oilUpper: number
  oilLower: number
  inflam: number
  inflamUpper: number
  inflamLower: number
  hydration: number
  hydrationUpper: number
  hydrationLower: number
}

const CREAM_FILL = '#FAFAF7'

interface TooltipPayloadEntry {
  dataKey?: string | number
  value?: number | string
}

function ProjectionTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: readonly TooltipPayloadEntry[]
}) {
  if (!active || !payload?.length) {
    return null
  }

  const lineKeys = new Set(['oil', 'inflam', 'hydration'])
  const values: Record<string, number> = {}
  for (const item of payload) {
    const key = item?.dataKey != null ? String(item.dataKey) : ''
    if (!lineKeys.has(key)) continue
    const raw = item?.value
    const num = typeof raw === 'number' ? raw : Number(raw)
    if (Number.isFinite(num)) {
      values[key] = num
    }
  }

  const oil = values.oil
  const inflam = values.inflam
  const hydration = values.hydration
  if (
    oil === undefined ||
    inflam === undefined ||
    hydration === undefined
  ) {
    return null
  }

  return (
    <div className="rounded-md border border-line bg-white px-2 py-1.5 text-[10px]">
      <div className="mb-0.5 font-medium text-ink">
        {label ?? ''} (tuần)
      </div>
      <div className="text-muted">
        <div>• Dầu: {oil}</div>
        <div>• Viêm: {inflam}</div>
        <div>• Ẩm: {hydration}</div>
      </div>
    </div>
  )
}

function buildChartData(scenario: ScenarioKey): ChartRow[] {
  const data = PROJECTION_DATA[scenario]
  return WEEK_LABELS.map((week, i) => ({
    week,
    oil: data.oil[i],
    oilUpper: Math.min(10, data.oil[i] + data.confidence[i]),
    oilLower: Math.max(0, data.oil[i] - data.confidence[i]),
    inflam: data.inflam[i],
    inflamUpper: Math.min(10, data.inflam[i] + data.confidence[i]),
    inflamLower: Math.max(0, data.inflam[i] - data.confidence[i]),
    hydration: data.hydration[i],
    hydrationUpper: Math.min(10, data.hydration[i] + data.confidence[i]),
    hydrationLower: Math.max(0, data.hydration[i] - data.confidence[i]),
  }))
}

export default function ProjectionChart({
  scenario,
  currentWeek,
}: ProjectionChartProps) {
  const chartData = buildChartData(scenario)
  const weekIndex = Math.min(4, Math.max(0, Math.round(currentWeek)))
  const highlight = chartData[weekIndex]

  const lineDot = {
    r: 3,
    stroke: '#fff',
    strokeWidth: 1.5,
  } as const

  return (
    <div className="mb-3.5 rounded-lg border border-line bg-white p-3.5 pb-2 pt-3">
      <h3 className="mb-1 ml-2 text-[11px] font-medium text-muted">
        Trajectory 3 metric chính
      </h3>
      <p className="mb-2 ml-2 text-[10px] italic text-tertiary">
        Vùng nhạt = khoảng tin cậy 80% · đường đậm = giá trị dự đoán trung bình
      </p>

      <div className="mb-1.5 ml-2 flex gap-3 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#EF9F27]" />
          Dầu
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#E24B4A]" />
          Viêm
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#85B7EB]" />
          Ẩm
        </span>
      </div>

      <div className="h-[200px] w-full px-1.5">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 6, right: 6, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: '#888780' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 10, fill: '#888780' }}
              axisLine={false}
              tickLine={false}
            />

            <Area
              dataKey="oilUpper"
              stroke="transparent"
              fill="#EF9F27"
              fillOpacity={0.12}
            />
            <Area
              dataKey="oilLower"
              stroke="transparent"
              fill={CREAM_FILL}
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="oil"
              stroke="#EF9F27"
              strokeWidth={2}
              dot={{ ...lineDot, fill: '#EF9F27' }}
            />

            <Area
              dataKey="inflamUpper"
              stroke="transparent"
              fill="#E24B4A"
              fillOpacity={0.1}
            />
            <Area
              dataKey="inflamLower"
              stroke="transparent"
              fill={CREAM_FILL}
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="inflam"
              stroke="#E24B4A"
              strokeWidth={2}
              dot={{ ...lineDot, fill: '#E24B4A' }}
            />

            <Area
              dataKey="hydrationUpper"
              stroke="transparent"
              fill="#85B7EB"
              fillOpacity={0.1}
            />
            <Area
              dataKey="hydrationLower"
              stroke="transparent"
              fill={CREAM_FILL}
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="hydration"
              stroke="#85B7EB"
              strokeWidth={2}
              dot={{ ...lineDot, fill: '#85B7EB' }}
            />

            {highlight ? (
              <>
                <ReferenceDot
                  x={highlight.week}
                  y={highlight.oil}
                  r={5}
                  fill="#EF9F27"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <ReferenceDot
                  x={highlight.week}
                  y={highlight.inflam}
                  r={5}
                  fill="#E24B4A"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <ReferenceDot
                  x={highlight.week}
                  y={highlight.hydration}
                  r={5}
                  fill="#85B7EB"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </>
            ) : null}

            <Tooltip
              content={(tooltipProps) => (
                <ProjectionTooltip
                  active={tooltipProps.active}
                  label={
                    typeof tooltipProps.label === 'string'
                      ? tooltipProps.label
                      : undefined
                  }
                  payload={
                    tooltipProps.payload as
                      | readonly TooltipPayloadEntry[]
                      | undefined
                  }
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
