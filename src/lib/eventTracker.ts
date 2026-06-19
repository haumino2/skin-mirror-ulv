export type SkinMirrorEventName =
  | 'session_started'
  | 'idle_cta_clicked'
  | 'consent_accepted'
  | 'scan_started'
  | 'scan_completed'
  | 'result_viewed'
  | 'micro_quiz_completed'
  | 'routine_viewed'
  | 'product_card_clicked'
  | 'chat_started'
  | 'chat_question_sent'
  | 'tts_played'
  | 'voice_question_started'
  | 'voice_transcript_confirmed'
  | 'promo_clicked'
  | 'ba_handoff_clicked'
  | 'save_clicked'
  | 'zalo_qr_clicked'

interface SkinMirrorEventRecord {
  name: SkinMirrorEventName
  timestamp: number
  payload?: Record<string, unknown>
}

declare global {
  interface Window {
    __skinMirrorEvents?: SkinMirrorEventRecord[]
  }
}

function appendToWindowBuffer(event: SkinMirrorEventRecord): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!Array.isArray(window.__skinMirrorEvents)) {
    window.__skinMirrorEvents = []
  }

  window.__skinMirrorEvents.push(event)
}

export function trackEvent(
  name: SkinMirrorEventName,
  payload?: Record<string, unknown>,
): void {
  try {
    const event: SkinMirrorEventRecord = {
      name,
      timestamp: Date.now(),
      ...(payload !== undefined ? { payload } : {}),
    }

    if (import.meta.env.DEV) {
      console.log('[SkinMirror]', name, payload ?? {})
    }

    appendToWindowBuffer(event)
  } catch {
    // Analytics must never break the app.
  }
}
