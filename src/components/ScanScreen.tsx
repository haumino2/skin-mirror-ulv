import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, ImageUp, RefreshCcw, UserCircle } from "lucide-react"
import { analyzeSkin, type SkinAnalysisResult } from "../lib/claudeSkinAnalysis"
import { trackEvent } from "../lib/eventTracker"

export interface ScanScreenProps {
  onComplete: (result: SkinAnalysisResult) => void
}

export default function ScanScreen({ onComplete }: ScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [mode, setMode] = useState<"upload" | "camera">("upload")
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const canUseCamera = useMemo(() => {
    return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia
  }, [])

  useEffect(() => {
    return () => {
      const stream = streamRef.current
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mode !== "camera") return
    if (!canUseCamera) return
    if (streamRef.current) return

    let isMounted = true
    setIsCameraReady(false)
    setError(null)

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          void video.play().catch(() => {})
        }
      })
      .catch(() => {
        setError("Không thể truy cập camera. Vui lòng dùng upload ảnh.")
        setMode("upload")
      })

    return () => {
      isMounted = false
    }
  }, [mode, canUseCamera])

  useEffect(() => {
    if (mode === "camera") return
    const stream = streamRef.current
    if (!stream) return
    stream.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setIsCameraReady(false)
  }, [mode])

  const reset = () => {
    setError(null)
    setPreviewDataUrl(null)
    setIsLoading(false)
  }

  const downscaleToJpegDataUrl = async (sourceDataUrl: string): Promise<string> => {
    const img = new Image()
    img.decoding = "async"
    img.src = sourceDataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Invalid image"))
    })

    const maxSide = 900
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas context not available")

    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL("image/jpeg", 0.92)
  }

  const onPickFile = async (file: File) => {
    reset()
    if (!file.type.startsWith("image/")) {
      setError("File không đúng định dạng ảnh.")
      return
    }
    const reader = new FileReader()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result ?? ""))
      reader.onerror = () => reject(new Error("File read error"))
      reader.readAsDataURL(file)
    })
    const jpegDataUrl = await downscaleToJpegDataUrl(dataUrl)
    setPreviewDataUrl(jpegDataUrl)
  }

  const captureFromCamera = async () => {
    reset()
    const video = videoRef.current
    if (!video) return

    const w = video.videoWidth || 640
    const h = video.videoHeight || 640
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setError("Không thể tạo canvas.")
      return
    }
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    const jpegDataUrl = await downscaleToJpegDataUrl(dataUrl)
    setPreviewDataUrl(jpegDataUrl)
  }

  const runAnalysis = async () => {
    if (!previewDataUrl) {
      setError("Vui lòng chọn/chụp ảnh trước.")
      return
    }
    setIsLoading(true)
    setError(null)
    trackEvent('scan_started', { mode })
    try {
      const result = await analyzeSkin(previewDataUrl)
      trackEvent('scan_completed', { skinType: result.skinType })
      onComplete(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Phân tích thất bại.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] px-5 pb-5">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-ink mb-1.5 text-center">
          Phân tích da mặt
        </h1>
        <p className="text-sm text-secondary leading-relaxed text-center mb-5">
          Upload ảnh hoặc chụp ảnh để bắt đầu
        </p>

        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            type="button"
            className={[
              "text-xs px-4 py-2 rounded-xl transition-all",
              mode === "upload"
                ? "bg-unilever-600 text-white"
                : "bg-white text-ink border border-line shadow-sm",
            ].join(" ")}
            onClick={() => {
              reset()
              setMode("upload")
            }}
            disabled={isLoading}
          >
            <span className="inline-flex items-center gap-1.5">
              <ImageUp size={14} />
              Upload ảnh
            </span>
          </button>

          <button
            type="button"
            className={[
              "text-xs px-4 py-2 rounded-xl transition-all",
              mode === "camera"
                ? "bg-unilever-600 text-white"
                : "bg-white text-ink border border-line shadow-sm",
              !canUseCamera ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
            onClick={() => {
              if (!canUseCamera) return
              reset()
              setMode("camera")
            }}
            disabled={isLoading || !canUseCamera}
            title={!canUseCamera ? "Thiết bị không hỗ trợ camera" : undefined}
          >
            <span className="inline-flex items-center gap-1.5">
              <Camera size={14} />
              Chụp ảnh
            </span>
          </button>
        </div>

        <div className="w-full max-w-[360px] mx-auto mb-3">
          {mode === "upload" ? (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void onPickFile(f)
                }}
                disabled={isLoading}
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 bg-unilever-600 text-white rounded-xl h-11 text-sm font-semibold hover:bg-unilever-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Chọn ảnh
                </button>
                <button
                  type="button"
                  className="shrink-0 bg-white border border-line rounded-xl px-3 h-11 text-xs text-ink disabled:opacity-50"
                  onClick={reset}
                  disabled={isLoading && !previewDataUrl}
                  title="Làm lại"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCcw size={14} />
                    Làm lại
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="relative rounded-2xl overflow-hidden bg-sand w-full aspect-square flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  onCanPlay={() => setIsCameraReady(true)}
                />
                {!isCameraReady ? (
                  <div className="absolute text-xs text-muted">
                    Đang khởi động camera...
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex-1 bg-unilever-600 text-white rounded-xl h-11 text-sm font-semibold hover:bg-unilever-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  onClick={() => void captureFromCamera()}
                  disabled={isLoading || !isCameraReady}
                >
                  Chụp ảnh
                </button>
                <button
                  type="button"
                  className="shrink-0 bg-white border border-line rounded-xl px-3 h-11 text-xs text-ink disabled:opacity-50"
                  onClick={reset}
                  disabled={isLoading && !previewDataUrl}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCcw size={14} />
                    Làm lại
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[360px] mx-auto">
          <div className="relative w-full aspect-square rounded-2xl bg-sand overflow-hidden flex items-center justify-center mb-3 shadow-sm">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Ảnh preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-tertiary">
                <UserCircle size={64} className="text-tertiary" />
                <div className="text-xs text-muted">Chưa có ảnh</div>
              </div>
            )}

            {isLoading ? (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/95 rounded-2xl px-4 py-2.5 text-xs text-ink shadow-sm">
                  Đang phân tích bằng Skin Mirror AI...
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mb-3 text-xs text-red-700 bg-red-50 rounded-2xl px-4 py-2.5">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            className={[
              "bg-unilever-600 text-white rounded-xl h-14 text-base font-semibold w-full transition-all",
              "hover:bg-unilever-700 active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:hover:bg-unilever-600 disabled:active:scale-100",
              !previewDataUrl && !isLoading ? "opacity-40" : "",
            ].join(" ")}
            onClick={() => void runAnalysis()}
            disabled={isLoading || !previewDataUrl}
          >
            {isLoading ? "Đang phân tích..." : "Phân tích ngay"}
          </button>
        </div>
      </div>
    </div>
  )
}
