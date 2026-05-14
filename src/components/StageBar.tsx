export interface StageBarProps {
  currentStage: number
  onStageClick?: (stage: number) => void
}

const STAGES: string[] = [
  "1 · Chờ",
  "2 · Đồng ý",
  "3 · Chọn",
  "4 · Scan",
  "5 · Kết quả",
  "6 · Dự đoán",
  "7 · Lưu",
]

export default function StageBar({ currentStage, onStageClick }: StageBarProps) {
  return (
    <div className="flex gap-1.5 mb-3.5">
      {STAGES.map((label, index) => {
        const state =
          index === currentStage ? "active" : index < currentStage ? "done" : "pending"

        const stateClasses =
          state === "active"
            ? "bg-unilever-900 text-white"
            : state === "done"
              ? "bg-unilever-50 text-unilever-600"
              : "bg-gray-100 text-gray-500"

        return (
          <button
            key={label}
            type="button"
            className={[
              "flex-1 py-1.5 px-2.5 text-xs rounded-md text-center cursor-pointer transition",
              stateClasses,
            ].join(" ")}
            onClick={() => onStageClick?.(index)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
