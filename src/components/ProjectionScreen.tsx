import { useState } from 'react'
import ProjectionChart from './ProjectionChart'
import {
  PROJECTION_DATA,
  type ScenarioKey,
} from '../data/projectionData'

export interface ProjectionScreenProps {
  onNext: () => void
  onSaveQR: () => void
}

type DeltaTone = 'improve' | 'flat' | 'decline'

function getMetricDeltaDisplay(
  now: number,
  future: number,
  inverse: boolean,
): { tone: DeltaTone; text: string } {
  const delta = future - now
  const pct =
    now === 0 || !Number.isFinite(now)
      ? 0
      : Math.round((delta / now) * 100)
  const absPct = Math.abs(pct)

  if (Math.abs(pct) < 3) {
    return { tone: 'flat', text: `→ ${absPct}% không đổi` }
  }

  if (inverse) {
    if (delta < 0) {
      return { tone: 'improve', text: `↓ ${absPct}% cải thiện` }
    }
    return { tone: 'decline', text: `↑ ${absPct}% xấu đi` }
  }

  if (delta > 0) {
    return { tone: 'improve', text: `↑ +${absPct}% cải thiện` }
  }
  return { tone: 'decline', text: `↓ ${absPct}% xấu đi` }
}

const SCENARIO_KEYS = Object.keys(PROJECTION_DATA) as ScenarioKey[]

export default function ProjectionScreen({
  onNext,
  onSaveQR,
}: ProjectionScreenProps) {
  const [scenario, setScenario] = useState<ScenarioKey>('combo')
  const [currentWeek, setCurrentWeek] = useState(4)

  const data = PROJECTION_DATA[scenario]
  const weekIndex = Math.min(4, Math.max(0, currentWeek))
  const weekLabel = weekIndex === 0 ? 'Hôm nay' : `Tuần ${weekIndex}`

  const oilDelta = getMetricDeltaDisplay(
    data.oil[0],
    data.oil[weekIndex],
    true,
  )
  const hydrationDelta = getMetricDeltaDisplay(
    data.hydration[0],
    data.hydration[weekIndex],
    false,
  )
  const inflamDelta = getMetricDeltaDisplay(
    data.inflam[0],
    data.inflam[weekIndex],
    true,
  )

  const deltaToneClass: Record<DeltaTone, string> = {
    improve: 'text-green-700',
    flat: 'text-tertiary',
    decline: 'text-red-700',
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-unilever-600">
            SKIN TRAJECTORY · 4 TUẦN
          </p>
          <h2 className="mb-0.5 font-serif text-lg text-ink">Dự đoán da bạn</h2>
          <p className="text-[10px] leading-snug text-tertiary">
            Mô phỏng dựa trên 12,847 ca clinical có skin profile tương tự
          </p>
        </div>
        <span className="ml-2 shrink-0 whitespace-nowrap rounded-sm bg-unilever-50 px-2 py-1 text-[10px] font-medium tracking-wide text-unilever-600">
          Dữ liệu khoa học
        </span>
      </div>

      <div className="mb-3 flex gap-1.5 rounded-lg bg-sand p-1">
        {SCENARIO_KEYS.map((key) => {
          const item = PROJECTION_DATA[key]
          const active = scenario === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setScenario(key)}
              className={`flex-1 cursor-pointer rounded-md px-2 py-2 text-[11px] font-medium transition ${
                active
                  ? 'bg-white text-ink'
                  : 'bg-transparent text-muted'
              }`}
            >
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="mb-2 flex items-center justify-between rounded-md border border-line bg-white p-2.5">
        <span className="text-[11px] text-tertiary">Tuần</span>
        <p className="font-serif text-sm text-ink">
          Hôm nay{' '}
          <strong className="font-medium text-unilever-600">→ {weekLabel}</strong>
        </p>
      </div>

      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={currentWeek}
        onChange={(e) => setCurrentWeek(Number(e.target.value))}
        className="mb-1 w-full cursor-pointer accent-unilever-600"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={currentWeek}
        aria-label="Chọn tuần xem dự đoán"
      />
      <div className="mb-3 flex justify-between px-0.5 text-[9px] text-tertiary">
        <span>Hôm nay</span>
        <span>Tuần 1</span>
        <span>Tuần 2</span>
        <span>Tuần 3</span>
        <span>Tuần 4</span>
      </div>

      <ProjectionChart scenario={scenario} currentWeek={weekIndex} />

      <div className="mb-3.5 grid grid-cols-3 gap-2">
        <div className="rounded-md border border-line bg-white p-2.5">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-tertiary">
            Dầu
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-base font-medium leading-none text-ink">
              {data.oil[0].toFixed(1)}
            </span>
            <span className="text-[11px] text-tertiary">→</span>
            <span className="font-serif text-base font-medium leading-none text-unilever-600">
              {data.oil[weekIndex].toFixed(1)}
            </span>
          </div>
          <p
            className={`mt-1 text-[10px] font-medium ${deltaToneClass[oilDelta.tone]}`}
          >
            {oilDelta.text}
          </p>
        </div>

        <div className="rounded-md border border-line bg-white p-2.5">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-tertiary">
            Ẩm
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-base font-medium leading-none text-ink">
              {data.hydration[0].toFixed(1)}
            </span>
            <span className="text-[11px] text-tertiary">→</span>
            <span className="font-serif text-base font-medium leading-none text-unilever-600">
              {data.hydration[weekIndex].toFixed(1)}
            </span>
          </div>
          <p
            className={`mt-1 text-[10px] font-medium ${deltaToneClass[hydrationDelta.tone]}`}
          >
            {hydrationDelta.text}
          </p>
        </div>

        <div className="rounded-md border border-line bg-white p-2.5">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-tertiary">
            Viêm
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-base font-medium leading-none text-ink">
              {data.inflam[0].toFixed(1)}
            </span>
            <span className="text-[11px] text-tertiary">→</span>
            <span className="font-serif text-base font-medium leading-none text-unilever-600">
              {data.inflam[weekIndex].toFixed(1)}
            </span>
          </div>
          <p
            className={`mt-1 text-[10px] font-medium ${deltaToneClass[inflamDelta.tone]}`}
          >
            {inflamDelta.text}
          </p>
        </div>
      </div>

      <div className="mb-3 rounded-md border-l-[3px] border-l-unilever-600 bg-unilever-50 px-3.5 py-2.5">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-unilever-600">
          INSIGHT CHÍNH
        </p>
        <div
          className="text-[11px] leading-relaxed text-unilever-900 [&_strong]:font-medium"
          dangerouslySetInnerHTML={{ __html: data.evidence }}
        />
      </div>

      <div className="mb-3 rounded-md bg-sand px-2.5 py-2 text-[10px] italic leading-relaxed text-tertiary">
        <strong className="font-medium not-italic text-muted">
          Mô phỏng dựa trên
        </strong>{' '}
        dữ liệu clinical aggregated · không phải kết quả chắc chắn cho bạn · kết
        quả thực tế phụ thuộc routine, môi trường, di truyền. Mirror không thay
        thế tư vấn bác sĩ da liễu.
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-md bg-ink py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Lấy ra quầy
        </button>
        <button
          type="button"
          onClick={onSaveQR}
          className="flex-1 rounded-md border border-tertiary bg-transparent py-2.5 text-sm text-ink hover:bg-sand"
        >
          Quét QR lưu kết quả
        </button>
      </div>
    </div>
  )
}
