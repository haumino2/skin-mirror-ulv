import AudioAdviceButton from "./AudioAdviceButton"
import { trackEvent } from "../lib/eventTracker"
import type { RoutinePreference, SkinGoal } from "../types/skinMirror"

export type MicroQuizProps = {
  selectedGoal: SkinGoal
  selectedPreference: RoutinePreference
  onChangeGoal: (goal: SkinGoal) => void
  onChangePreference: (preference: RoutinePreference) => void
  onContinue: () => void
  onSkip?: () => void
}

const GOAL_QUESTION_SCRIPT =
  "Bạn muốn ưu tiên điều gì hôm nay: cấp ẩm, giảm dầu, làm dịu hay cải thiện bề mặt da?"

const GOAL_OPTIONS: { value: SkinGoal; label: string }[] = [
  { value: "hydrate", label: "Cấp ẩm" },
  { value: "reduce_oil", label: "Giảm dầu" },
  { value: "calm", label: "Làm dịu" },
  { value: "smooth_texture", label: "Bề mặt da/lỗ chân lông" },
]

const PREFERENCE_OPTIONS: { value: RoutinePreference; label: string }[] = [
  { value: "minimal_2_step", label: "Tối giản 2 bước" },
  { value: "full_3_step", label: "Đầy đủ 3 bước" },
  { value: "promo_combo", label: "Theo combo/promo" },
]

function OptionCard({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "w-full text-left bg-white rounded-2xl shadow-sm px-4 py-3.5 min-h-[3.25rem] transition-all",
        selected ? "ring-2 ring-unilever-600 ring-offset-2" : "",
      ].join(" ")}
    >
      <span className="text-sm text-ink leading-snug">{label}</span>
    </button>
  )
}

export default function MicroQuiz({
  selectedGoal,
  selectedPreference,
  onChangeGoal,
  onChangePreference,
  onContinue,
  onSkip,
}: MicroQuizProps) {
  const handleContinue = () => {
    trackEvent('micro_quiz_completed', {
      goal: selectedGoal,
      preference: selectedPreference,
      skipped: false,
    })
    onContinue()
  }

  const handleSkip = () => {
    trackEvent('micro_quiz_completed', {
      goal: selectedGoal,
      preference: selectedPreference,
      skipped: true,
    })
    onSkip?.()
  }

  return (
    <div className="flex flex-col h-full px-5 pb-5">
      <header className="shrink-0 mb-5">
        <h1 className="text-2xl font-bold text-ink mb-1 text-center">
          Gợi ý routine cho bạn
        </h1>
        <p className="text-sm text-secondary leading-relaxed text-center">
          Chọn ưu tiên và kiểu routine — Mirror sẽ gợi ý sản phẩm phù hợp
        </p>
      </header>

      <section className="mb-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h2 className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase">
            Bạn muốn ưu tiên điều gì hôm nay?
          </h2>
          <AudioAdviceButton
            script={GOAL_QUESTION_SCRIPT}
            label="Nghe câu hỏi"
            compact
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {GOAL_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={selectedGoal === option.value}
              onSelect={() => onChangeGoal(option.value)}
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-[11px] font-semibold tracking-widest text-unilever-600 uppercase mb-2.5">
          Bạn thích routine kiểu nào?
        </h2>
        <div className="flex flex-col gap-2.5">
          {PREFERENCE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={selectedPreference === option.value}
              onSelect={() => onChangePreference(option.value)}
            />
          ))}
        </div>
      </section>

      <div className="mt-auto shrink-0 flex flex-col gap-3">
        <button
          type="button"
          className="bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full hover:bg-unilever-700 active:scale-[0.98] transition-all"
          onClick={handleContinue}
        >
          Xem routine gợi ý
        </button>

        {onSkip && (
          <button
            type="button"
            className="text-unilever-600 underline-offset-2 text-sm hover:underline"
            onClick={handleSkip}
          >
            Bỏ qua
          </button>
        )}
      </div>
    </div>
  )
}
