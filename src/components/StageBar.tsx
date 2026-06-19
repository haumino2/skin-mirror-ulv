export interface StageBarProps {
  currentStage: number
}

const STAGES: string[] = [
  "Chờ",
  "Đồng ý",
  "Chọn",
  "Scan",
  "Kết quả",
  "Mô phỏng",
  "Lưu",
]

export default function StageBar({ currentStage }: StageBarProps) {
  const stageIndex = Math.min(Math.max(currentStage, 0), STAGES.length - 1)
  const progress = ((stageIndex + 1) / STAGES.length) * 100

  return (
    <div className="max-h-[36px] px-5 pt-3 shrink-0">
      <div className="h-1 w-full overflow-hidden rounded-full bg-unilever-100">
        <div
          className="h-1 rounded-full bg-unilever-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-center text-xs leading-none text-muted">
        Bước {stageIndex + 1} · {STAGES[stageIndex]}
      </p>
    </div>
  )
}
