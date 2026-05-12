import { useEffect, useState } from "react"
import { UserCircle } from "lucide-react"

export interface ScanScreenProps {
  onComplete: () => void
}

const STATUS_MESSAGES: Array<{ status: string; detail: string }> = [
  {
    status: "Đang phân tích vùng chữ T...",
    detail: "Phát hiện 12 điểm trên vùng cằm",
  },
  {
    status: "Đo độ ẩm và dầu...",
    detail: "Vùng má — độ ẩm thấp hơn baseline",
  },
  {
    status: "Quét vùng viêm nhẹ...",
    detail: "Phát hiện break out cằm + 2 bên má",
  },
  {
    status: "So với benchmark người Việt 25-30...",
    detail: "Hoàn thành 247/247 điểm phân tích",
  },
]

const DOTS: Array<{ top: number; left: number; delay: string }> = [
  { top: 30, left: 35, delay: "0s" },
  { top: 35, left: 65, delay: "0.3s" },
  { top: 50, left: 30, delay: "0.6s" },
  { top: 55, left: 70, delay: "0.9s" },
  { top: 65, left: 50, delay: "1.2s" },
  { top: 70, left: 40, delay: "1.5s" },
  { top: 45, left: 50, delay: "1.8s" },
]

export default function ScanScreen({ onComplete }: ScanScreenProps) {
  const [progress, setProgress] = useState<number>(0)
  const [statusIndex, setStatusIndex] = useState<number>(0)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    let isMounted = true

    const progressTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (!isMounted) return
      setProgress(100)
    }, 50)

    const statusInterval: ReturnType<typeof setInterval> = setInterval(() => {
      if (!isMounted) return
      setStatusIndex((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) return prev
        return prev + 1
      })
    }, 1250)

    const countInterval: ReturnType<typeof setInterval> = setInterval(() => {
      if (!isMounted) return
      setCount((prev) => {
        const next = Math.min(247, prev + 5)
        return next
      })
    }, 95)

    const completeTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (!isMounted) return
      onComplete()
    }, 5000)

    return () => {
      isMounted = false
      clearTimeout(progressTimeout)
      clearInterval(statusInterval)
      clearInterval(countInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  const current = STATUS_MESSAGES[statusIndex] ?? STATUS_MESSAGES[0]
  const countText = `${String(count).padStart(3, "0")} / 247 điểm`

  return (
    <div className="flex flex-col items-center justify-center min-h-[520px]">
      <div className="w-full">
        <div className="font-serif text-xl text-ink mb-1.5 text-center">
          Đang phân tích da
        </div>
        <div className="text-xs text-muted text-center mb-5">
          Giữ khoảng cách 30cm và nhìn thẳng vào camera
        </div>

        <div className="relative w-[200px] h-[200px] rounded-full bg-sand mx-auto mb-3.5 flex items-center justify-center overflow-hidden">
          <UserCircle size={80} style={{ color: "#B4B2A9" }} />

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-unilever-600 border-r-unilever-600 animate-scan-spin" />

          {DOTS.map((dot) => (
            <div
              key={`${dot.top}-${dot.left}-${dot.delay}`}
              className="absolute w-1.5 h-1.5 bg-unilever-600 rounded-full opacity-0 animate-scan-dot -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${dot.top}%`,
                left: `${dot.left}%`,
                animationDelay: dot.delay,
              }}
            />
          ))}
        </div>

        <div className="w-[220px] h-1 bg-line rounded-full mx-auto mb-2 overflow-hidden">
          <div
            className="h-full bg-unilever-600 transition-all duration-[5000ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm font-medium text-unilever-600 text-center mb-1">
          {current.status}
        </div>
        <div className="text-xs text-tertiary italic text-center mb-1.5">
          {current.detail}
        </div>
        <div className="text-[10px] text-tertiary font-mono text-center">
          {countText}
        </div>
      </div>
    </div>
  )
}

