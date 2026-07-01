import { useState } from 'react'
import ProjectionChart from './ProjectionChart'
import {
  PROJECTION_DATA,
  type ScenarioKey,
} from '../data/projectionData'
import { trackEvent } from '../lib/eventTracker'

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
    flat: 'text-muted',
    decline: 'text-red-700',
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 py-4 pb-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
            XU HƯỚNG DA · 4 TUẦN
          </p>
          <h2 className="mb-0.5 text-2xl font-bold text-ink">
            Mô phỏng routine 4 tuần
          </h2>
          <p className="text-xs leading-snug text-muted">
            Minh họa dựa trên routine gợi ý — chỉ tham khảo, kết quả thực tế có thể khác.
          </p>
        </div>
        <span className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-unilever-50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-unilever-600">
          Dữ liệu khoa học
        </span>
      </div>

      <div className="mb-3 flex gap-1.5 rounded-2xl bg-sand p-1">
        {SCENARIO_KEYS.map((key) => {
          const item = PROJECTION_DATA[key]
          const active = scenario === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setScenario(key)}
              className={`flex-1 cursor-pointer rounded-xl px-2 py-2 text-xs font-medium transition ${
                active
                  ? 'bg-white text-ink shadow-sm'
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

      <div className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <span className="text-xs text-muted">Tuần</span>
        <p className="font-semibold text-sm text-ink">
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
        aria-label="Chọn tuần xem mô phỏng"
      />
      <div className="mb-3 flex justify-between px-0.5 text-[9px] text-muted">
        <span>Hôm nay</span>
        <span>Tuần 1</span>
        <span>Tuần 2</span>
        <span>Tuần 3</span>
        <span>Tuần 4</span>
      </div>

      <ProjectionChart scenario={scenario} currentWeek={weekIndex} />

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted">
            Dầu
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-base leading-none text-ink">
              {data.oil[0].toFixed(1)}
            </span>
            <span className="text-xs text-muted">→</span>
            <span className="font-semibold text-base leading-none text-unilever-600">
              {data.oil[weekIndex].toFixed(1)}
            </span>
          </div>
          <p
            className={`mt-1 text-[10px] font-medium ${deltaToneClass[oilDelta.tone]}`}
          >
            {oilDelta.text}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted">
            Ẩm
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-base leading-none text-ink">
              {data.hydration[0].toFixed(1)}
            </span>
            <span className="text-xs text-muted">→</span>
            <span className="font-semibold text-base leading-none text-unilever-600">
              {data.hydration[weekIndex].toFixed(1)}
            </span>
          </div>
          <p
            className={`mt-1 text-[10px] font-medium ${deltaToneClass[hydrationDelta.tone]}`}
          >
            {hydrationDelta.text}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted">
            Viêm
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-base leading-none text-ink">
              {data.inflam[0].toFixed(1)}
            </span>
            <span className="text-xs text-muted">→</span>
            <span className="font-semibold text-base leading-none text-unilever-600">
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

      <div className="mb-3 rounded-2xl bg-unilever-50 px-4 py-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-unilever-600">
          NHẬN XÉT CHÍNH
        </p>
        <div
          className="text-sm leading-relaxed text-unilever-900 [&_strong]:font-medium"
          dangerouslySetInnerHTML={{ __html: data.evidence }}
        />
      </div>

      <div className="mb-3 rounded-2xl bg-sand px-4 py-3 text-xs italic leading-relaxed text-muted">
        <strong className="font-medium not-italic text-secondary">
          Mô phỏng dựa trên
        </strong>{' '}
        dữ liệu lâm sàng tổng hợp · kết quả thực tế phụ thuộc routine, môi
        trường, di truyền. Mirror không thay thế tư vấn bác sĩ da liễu.
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-1">
        <button
          type="button"
          onClick={onNext}
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
        >
          Lấy ra quầy
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent('save_clicked', { source: 'projection_qr' })
            onSaveQR()
          }}
          className="bg-white text-ink rounded-xl h-14 text-base border border-line w-full"
        >
          Quét QR lưu kết quả
        </button>
      </div>
    </div>
  )
}
