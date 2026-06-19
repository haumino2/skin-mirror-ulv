import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '../lib/eventTracker'

export type AudioAdviceButtonProps = {
  script?: string
  audioUrl?: string
  label?: string
  onPlayed?: () => void
  onPlayStart?: () => void
  onPlayStop?: () => void
  compact?: boolean
  showVoiceSelector?: boolean
  onVoiceChange?: (voiceId: string, emotion: string) => void
}

const DEFAULT_LABEL = 'Nghe tư vấn'
const LOADING_LABEL = 'Đang chuẩn bị...'
const STOP_LABEL = 'Dừng'
const PLAYBACK_ERROR_MESSAGE =
  'Không phát được audio, bạn có thể đọc phần tư vấn bên dưới.'

const VOICE_OPTIONS = [
  'Ngọc Lan',
  'Thu Hà',
  'Mỹ Duyên',
  'Phương Anh',
  'Hải Yến',
  'Bảo Trâm',
  'Diễm My',
  'Lan Phương',
] as const

const EMOTION_OPTIONS = [
  { value: 'natural', label: 'Tự nhiên' },
  { value: 'storytelling', label: 'Kể chuyện' },
] as const

async function fetchVieNeuAudio(
  text: string,
  voiceId: string,
  emotion: string,
): Promise<string | null> {
  try {
    const jobRes = await fetch('/api/vieneu-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId, emotion }),
    })
    if (!jobRes.ok) {
      console.log('[VieNeu TTS] Job failed:', jobRes.status, await jobRes.text())
      return null
    }
    const { jobId } = await jobRes.json()
    console.log('[VieNeu TTS] jobId:', jobId)
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const poll = await fetch(`/api/vieneu-poll?jobId=${jobId}`)
      const data = await poll.json()
      console.log('[VieNeu TTS] poll:', data)
      if (data.status === 'completed' && data.audioUrl) return data.audioUrl
      if (data.status === 'failed') return null
    }
    return null
  } catch (e) {
    console.log('[VieNeu TTS] error:', e)
    return null
  }
}

function canUseAudio(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined'
}

function canUseSpeechSynthesis(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.speechSynthesis.speak === 'function'
  )
}

export default function AudioAdviceButton({
  script = '',
  audioUrl,
  label = DEFAULT_LABEL,
  onPlayed,
  onPlayStart,
  onPlayStop,
  compact = false,
  showVoiceSelector = false,
  onVoiceChange,
}: AudioAdviceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_OPTIONS[0])
  const [selectedEmotion, setSelectedEmotion] = useState<string>(
    EMOTION_OPTIONS[0].value,
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const usingSpeechRef = useRef(false)
  const requestInFlightRef = useRef(false)

  const releasePlaybackResources = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current = null
    }

    if (canUseSpeechSynthesis()) {
      window.speechSynthesis.cancel()
      usingSpeechRef.current = false
      utteranceRef.current = null
    }
  }, [])

  const notifyPlaybackStopped = useCallback(() => {
    setIsPlaying(false)
    setIsLoading(false)
    requestInFlightRef.current = false
    onPlayStop?.()
  }, [onPlayStop])

  const stopPlayback = useCallback(() => {
    releasePlaybackResources()
    notifyPlaybackStopped()
  }, [releasePlaybackResources, notifyPlaybackStopped])

  const handlePlaybackError = useCallback(() => {
    stopPlayback()
    setErrorMessage(PLAYBACK_ERROR_MESSAGE)
  }, [stopPlayback])

  const notifyPlaybackStarted = useCallback(() => {
    setIsLoading(false)
    setIsPlaying(true)
    setErrorMessage(null)
    onPlayStart?.()
    onPlayed?.()
  }, [onPlayStart, onPlayed])

  const playWithAudioElement = useCallback(
    async (
      url: string,
      source: 'audio' | 'vieneu',
    ): Promise<boolean> => {
      if (!url || !canUseAudio()) {
        return false
      }

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        audioRef.current = null
        notifyPlaybackStopped()
      }

      audio.onerror = () => {
        handlePlaybackError()
      }

      try {
        await audio.play()
        notifyPlaybackStarted()
        trackEvent('tts_played', { source })
        return true
      } catch {
        handlePlaybackError()
        return false
      }
    },
    [handlePlaybackError, notifyPlaybackStarted, notifyPlaybackStopped],
  )

  const playWithSpeechSynthesis = useCallback(() => {
    if (!canUseSpeechSynthesis()) {
      handlePlaybackError()
      return
    }

    if (!script.trim()) {
      handlePlaybackError()
      return
    }

    try {
      const utterance = new SpeechSynthesisUtterance(script)
      const voices = window.speechSynthesis.getVoices()
      const viVoice =
        voices.find((v) => v.lang.startsWith('vi')) ||
        voices.find((v) => v.lang.startsWith('vi-VN'))
      if (viVoice) utterance.voice = viVoice
      utterance.lang = 'vi-VN'
      utteranceRef.current = utterance
      usingSpeechRef.current = true

      utterance.onstart = () => {
        notifyPlaybackStarted()
        trackEvent('tts_played', { source: 'speechSynthesis' })
      }

      utterance.onend = () => {
        usingSpeechRef.current = false
        utteranceRef.current = null
        notifyPlaybackStopped()
      }

      utterance.onerror = () => {
        handlePlaybackError()
      }

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch {
      handlePlaybackError()
    }
  }, [script, handlePlaybackError, notifyPlaybackStarted, notifyPlaybackStopped])

  const startPlayback = useCallback(async () => {
    if (requestInFlightRef.current || isLoading || isPlaying) {
      return
    }

    requestInFlightRef.current = true
    setErrorMessage(null)
    setIsLoading(true)

    if (audioUrl) {
      const played = await playWithAudioElement(audioUrl, 'audio')
      if (!played) {
        requestInFlightRef.current = false
        setIsLoading(false)
        handlePlaybackError()
      }
      return
    }

    const trimmedScript = script.trim()
    if (trimmedScript) {
      const vieneuUrl = await fetchVieNeuAudio(
        trimmedScript,
        selectedVoice,
        selectedEmotion,
      )
      if (vieneuUrl) {
        const played = await playWithAudioElement(vieneuUrl, 'vieneu')
        if (played) return
      }
    }

    console.log('[VieNeu TTS] Falling back to browser speechSynthesis')
    playWithSpeechSynthesis()
  }, [
    audioUrl,
    script,
    selectedVoice,
    selectedEmotion,
    isLoading,
    isPlaying,
    playWithAudioElement,
    playWithSpeechSynthesis,
    handlePlaybackError,
  ])

  const handleClick = () => {
    if (isLoading) {
      return
    }

    if (isPlaying) {
      stopPlayback()
      return
    }

    void startPlayback()
  }

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId)
    onVoiceChange?.(voiceId, selectedEmotion)
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    onVoiceChange?.(selectedVoice, emotion)
  }

  useEffect(() => {
    releasePlaybackResources()
    setIsPlaying(false)
    setIsLoading(false)
    requestInFlightRef.current = false
  }, [script, audioUrl, releasePlaybackResources])

  useEffect(() => {
    return () => {
      releasePlaybackResources()
    }
  }, [releasePlaybackResources])

  const buttonLabel = isLoading
    ? LOADING_LABEL
    : isPlaying
      ? STOP_LABEL
      : label

  const buttonClassName = compact
    ? 'inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex h-11 w-full items-center justify-center rounded-xl border border-line bg-white text-sm text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60'

  const selectClassName = compact
    ? 'h-9 w-full rounded-xl bg-sand px-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-unilever-600'
    : 'h-9 w-full rounded-xl bg-sand px-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-unilever-600'

  return (
    <div className="flex flex-col gap-1.5">
      {showVoiceSelector ? (
        <div className="flex flex-col gap-1.5 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-muted">Giọng đọc</span>
            <select
              value={selectedVoice}
              onChange={(e) => handleVoiceSelect(e.target.value)}
              disabled={isLoading || isPlaying}
              className={selectClassName}
            >
              {VOICE_OPTIONS.map((voice) => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-muted">Phong cách</span>
            <select
              value={selectedEmotion}
              onChange={(e) => handleEmotionSelect(e.target.value)}
              disabled={isLoading || isPlaying}
              className={selectClassName}
            >
              {EMOTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-pressed={isPlaying}
        aria-busy={isLoading}
        aria-label={buttonLabel}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {errorMessage ? (
        <p className="text-[11px] leading-snug text-muted" role="status">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
