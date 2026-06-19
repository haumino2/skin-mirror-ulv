import { useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { answerVietnameseQuestion } from '../lib/chatEngine'
import { trackEvent } from '../lib/eventTracker'
import {
  isSpeechRecognitionSupported,
  startVietnameseSpeechRecognition,
} from '../lib/speechRecognition'
import type {
  ChatMessage,
  RoutinePreference,
  RoutineRecommendation,
  SkinAnalysisResult,
  SkinGoal,
} from '../types/skinMirror'

export type ChatPanelProps = {
  skinResult?: SkinAnalysisResult
  recommendation?: RoutineRecommendation
  selectedGoal?: SkinGoal
  selectedPreference?: RoutinePreference
  onMessageSent?: (question: string) => void
}

const SUGGESTED_QUESTIONS = [
  'Da dầu dùng kem dưỡng này được không?',
  'Nếu chỉ mua 1 sản phẩm thì nên chọn gì?',
  'Routine này dùng sáng hay tối?',
  'Da nhạy cảm cần lưu ý gì?',
  'Có combo nào hợp hơn không?',
] as const

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

export default function ChatPanel({
  skinResult,
  recommendation,
  selectedGoal,
  selectedPreference,
  onMessageSent,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null)

  const handleVoiceInput = async () => {
    setVoiceNotice(null)

    if (!skinResult) {
      setVoiceNotice('Chưa có kết quả scan — hãy hoàn tất scan trước khi hỏi.')
      return
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceNotice(
        'Trình duyệt này chưa hỗ trợ nhận giọng nói ổn định. Bạn có thể nhập câu hỏi bằng bàn phím.',
      )
      return
    }

    if (isListening) return

    setIsListening(true)
    try {
      const transcript = await startVietnameseSpeechRecognition()
      setInput(transcript)
    } catch {
      // User can retry or type manually
    } finally {
      setIsListening(false)
    }
  }

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return

    if (!skinResult) {
      setMessages((prev) => [
        ...prev,
        createMessage('user', trimmed),
        createMessage(
          'assistant',
          'Chưa có kết quả scan — hãy hoàn tất scan trước khi hỏi về routine.',
        ),
      ])
      setInput('')
      return
    }

    setMessages((prev) => [...prev, createMessage('user', trimmed)])
    setInput('')
    setIsLoading(true)

    try {
      const answer = await answerVietnameseQuestion({
        question: trimmed,
        skinResult,
        recommendation,
        selectedGoal,
        selectedPreference,
      })

      setMessages((prev) => [...prev, createMessage('assistant', answer)])
      trackEvent('chat_question_sent', { questionLength: trimmed.length })
      onMessageSent?.(trimmed)
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', 'Không thể kết nối. Vui lòng thử lại.'),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    submitQuestion(input)
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <header>
        <h2 className="font-semibold text-base text-ink">Hỏi Skin Mirror AI</h2>
        <p className="mt-0.5 text-xs leading-snug text-muted">
          Gợi ý dựa trên kết quả scan — không thay tư vấn chuyên môn.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => submitQuestion(chip)}
            disabled={isLoading}
            className="rounded-xl bg-unilever-50 px-3 py-2 text-left text-xs leading-snug text-ink hover:bg-unilever-100 min-h-[2.75rem] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {chip}
          </button>
        ))}
      </div>

      {(messages.length > 0 || isLoading) && (
        <div className="flex max-h-52 flex-col gap-2.5 overflow-y-auto rounded-2xl bg-sand/60 p-3">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={[
                'rounded-xl px-3 py-2 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'ml-6 bg-unilever-50 text-ink'
                  : 'mr-4 bg-white shadow-sm text-ink',
              ].join(' ')}
            >
              <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-unilever-600">
                {message.role === 'user' ? 'Bạn' : 'Skin Mirror'}
              </span>
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div
              className="mr-4 rounded-xl bg-white shadow-sm px-3 py-2 text-sm leading-relaxed text-muted"
              role="status"
              aria-live="polite"
            >
              <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-unilever-600">
                Skin Mirror
              </span>
              Đang trả lời...
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nhập câu hỏi về routine hoặc sản phẩm..."
            disabled={isLoading}
            className="h-11 min-w-0 flex-1 rounded-xl bg-sand px-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-unilever-600 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Câu hỏi cho Skin Mirror AI"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-unilever-600 text-white hover:bg-unilever-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Gửi câu hỏi"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </form>

        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={isListening}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white border border-line px-3 text-sm text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Hỏi bằng giọng nói"
        >
          <Mic className="h-4 w-4 shrink-0" aria-hidden />
          Hỏi bằng giọng nói
        </button>

        {isListening && (
          <p className="text-xs text-muted" role="status" aria-live="polite">
            Đang nghe...
          </p>
        )}

        {voiceNotice && (
          <p className="text-xs leading-snug text-muted" role="status">
            {voiceNotice}
          </p>
        )}
      </div>
    </section>
  )
}
