import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, ImageUp, RefreshCcw, UserCircle } from "lucide-react"
import { analyzeSkin, type SkinAnalysisResult } from "../lib/claudeSkinAnalysis"

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
    try {
      const result = await analyzeSkin(previewDataUrl)
      onComplete(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Phân tích thất bại.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[520px]">
      <div className="w-full">
        <div className="font-serif text-xl text-ink mb-1.5 text-center">
          Phân tích da mặt
        </div>
        <div className="text-xs text-muted text-center mb-5">
          Upload ảnh hoặc chụp từ webcam để bắt đầu
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            type="button"
            className={[
              "text-[11px] px-3 py-1.5 rounded-md border",
              mode === "upload"
                ? "bg-unilever-600 text-white border-unilever-600"
                : "bg-white text-ink border-line",
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
              "text-[11px] px-3 py-1.5 rounded-md border",
              mode === "camera"
                ? "bg-unilever-600 text-white border-unilever-600"
                : "bg-white text-ink border-line",
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
              Webcam
            </span>
          </button>
        </div>

        <div className="w-full max-w-[360px] mx-auto mb-3">
          {mode === "upload" ? (
            <div className="bg-white border border-line rounded-lg p-3">
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

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 bg-ink text-white text-sm font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Chọn ảnh
                </button>
                <button
                  type="button"
                  className="shrink-0 bg-white border border-line rounded-md px-3 py-2 text-xs text-ink disabled:opacity-50"
                  onClick={reset}
                  disabled={isLoading && !previewDataUrl}
                  title="Làm mới"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCcw size={14} />
                    Reset
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-line rounded-lg p-3">
              <div className="relative rounded-md overflow-hidden bg-sand w-full aspect-square flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  onCanPlay={() => setIsCameraReady(true)}
                />
                {!isCameraReady ? (
                  <div className="absolute text-[11px] text-tertiary">
                    Đang khởi động camera...
                  </div>
                ) : null}
              </div>

              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  className="flex-1 bg-ink text-white text-sm font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
                  onClick={() => void captureFromCamera()}
                  disabled={isLoading || !isCameraReady}
                >
                  Chụp ảnh
                </button>
                <button
                  type="button"
                  className="shrink-0 bg-white border border-line rounded-md px-3 py-2 text-xs text-ink disabled:opacity-50"
                  onClick={reset}
                  disabled={isLoading && !previewDataUrl}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCcw size={14} />
                    Reset
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[360px] mx-auto">
          <div className="relative w-full aspect-square rounded-lg bg-sand border border-line overflow-hidden flex items-center justify-center mb-3">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Ảnh preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-tertiary">
                <UserCircle size={64} style={{ color: "#B4B2A9" }} />
                <div className="text-[11px]">Chưa có ảnh</div>
              </div>
            )}

            {isLoading ? (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 rounded-md px-3 py-2 text-[11px] text-ink">
                  Đang phân tích bằng Skin Mirror AI...
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mb-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            className="w-full bg-unilever-600 text-white text-sm font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
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

