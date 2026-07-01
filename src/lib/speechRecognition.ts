interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

const UNSUPPORTED_ERROR =
  'Trình duyệt này chưa hỗ trợ nhận giọng nói.'

function getWindow(): WindowWithSpeechRecognition | null {
  if (typeof window === 'undefined') return null
  return window as WindowWithSpeechRecognition
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const win = getWindow()
  if (!win) return null
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null
}

function mapSpeechRecognitionError(error: string): string {
  switch (error) {
    case 'no-speech':
      return 'Không phát hiện giọng nói. Vui lòng thử lại.'
    case 'aborted':
      return 'Nhận giọng nói đã bị hủy.'
    case 'audio-capture':
      return 'Không truy cập được micro. Kiểm tra thiết bị và quyền truy cập.'
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Quyền truy cập micro bị từ chối.'
    case 'network':
      return 'Nhận giọng nói thất bại do lỗi mạng.'
    case 'language-not-supported':
      return 'Thiết bị này chưa hỗ trợ nhận giọng nói tiếng Việt.'
    default:
      return `Nhận giọng nói thất bại (${error}).`
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null
}

export function startVietnameseSpeechRecognition(): Promise<string> {
  const SpeechRecognitionCtor = getSpeechRecognitionConstructor()
  if (!SpeechRecognitionCtor) {
    return Promise.reject(new Error(UNSUPPORTED_ERROR))
  }

  return new Promise((resolve, reject) => {
    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'vi-VN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    let settled = false

    const settle = (action: 'resolve' | 'reject', value: string) => {
      if (settled) return
      settled = true
      try {
        recognition.stop()
      } catch {
        // stop() may throw if recognition already ended
      }
      if (action === 'resolve') {
        resolve(value)
        return
      }
      reject(new Error(value))
    }

    recognition.onresult = (event) => {
      const alternative = event.results[0]?.[0]
      const transcript = alternative?.transcript?.trim() ?? ''
      if (!transcript) {
        settle('reject', 'Không phát hiện giọng nói. Vui lòng thử lại.')
        return
      }
      settle('resolve', transcript)
    }

    recognition.onerror = (event) => {
      settle('reject', mapSpeechRecognitionError(event.error))
    }

    recognition.onend = () => {
      settle('reject', 'Nhận giọng nói kết thúc mà không có kết quả.')
    }

    try {
      recognition.start()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Không thể khởi động nhận giọng nói.'
      settle('reject', message)
    }
  })
}
