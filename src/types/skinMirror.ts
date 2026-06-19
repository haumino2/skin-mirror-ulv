export type SkinConcern =
  | 'low_hydration'
  | 'oily_t_zone'
  | 'redness'
  | 'uneven_texture'
  | 'visible_pores'
  | 'sensitivity'
  | 'dullness'

export type RoutinePreference =
  | 'minimal_2_step'
  | 'full_3_step'
  | 'promo_combo'

export type SkinGoal =
  | 'hydrate'
  | 'reduce_oil'
  | 'calm'
  | 'smooth_texture'

export interface SkinScore {
  hydration: number
  oiliness: number
  redness: number
  texture: number
  pores: number
  dullness: number
}

export interface SkinAnalysisResult {
  skinType: string
  concerns: SkinConcern[]
  scores: SkinScore
  insight: string
  confidenceLabel?: 'demo' | 'ai_generated' | 'fallback'
}

export interface Product {
  id: string
  brand: 'Simple'
  name: string
  routineStep: 'cleanse' | 'hydrate' | 'calm_repair' | 'protect'
  targetConcerns: SkinConcern[]
  claims: string[]
  usage: string
  whyRecommended: string
  priority: number
  imageUrl?: string
}

export interface RoutineRecommendation {
  title: string
  summary: string
  products: Product[]
  preference: RoutinePreference
  goal: SkinGoal
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface DemoSession {
  id: string
  label: string
  result: SkinAnalysisResult
  goal: SkinGoal
  preference: RoutinePreference
  audioScriptId?: string
}
