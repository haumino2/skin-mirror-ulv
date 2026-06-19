import { simpleProducts } from '../data/simpleProducts'
import type { SkinAnalysisResult } from './claudeSkinAnalysis'
import type {
  Product,
  RoutinePreference,
  RoutineRecommendation,
  SkinGoal,
} from '../types/skinMirror'

const GOAL_LABELS: Record<SkinGoal, string> = {
  hydrate: 'Cấp ẩm',
  reduce_oil: 'Giảm dầu',
  calm: 'Làm dịu',
  smooth_texture: 'Texture/lỗ chân lông',
}

const GOAL_CONCERNS: Record<SkinGoal, string[]> = {
  hydrate: ['low_hydration', 'dullness'],
  reduce_oil: ['oily_t_zone'],
  calm: ['redness', 'sensitivity'],
  smooth_texture: ['uneven_texture', 'visible_pores'],
}

export function getDefaultPreference(): RoutinePreference {
  return 'minimal_2_step'
}

export function getDefaultGoalFromSkinResult(result: SkinAnalysisResult): SkinGoal {
  const { scores, concerns } = result
  const concernText = concerns.join(' ').toLowerCase()

  if (scores.redness >= 55 || concernText.includes('red')) return 'calm'
  if (scores.oiliness >= 60 || concernText.includes('oil')) return 'reduce_oil'
  if (scores.texture >= 55 || scores.pores >= 55 || concernText.includes('texture') || concernText.includes('pore')) {
    return 'smooth_texture'
  }
  if (scores.hydration >= 50 || concernText.includes('hydrat') || concernText.includes('dry')) {
    return 'hydrate'
  }
  return 'hydrate'
}

function productScore(product: Product, goal: SkinGoal): number {
  const targets = GOAL_CONCERNS[goal]
  const overlap = product.targetConcerns.filter((c) => targets.includes(c)).length
  return overlap * 10 - product.priority
}

function pickByStep(
  step: Product['routineStep'],
  goal: SkinGoal,
  exclude: Set<string>,
): Product | undefined {
  const candidates = simpleProducts
    .filter((p) => p.routineStep === step && !exclude.has(p.id))
    .sort((a, b) => productScore(b, goal) - productScore(a, goal))
  return candidates[0]
}

function selectProducts(goal: SkinGoal, preference: RoutinePreference): Product[] {
  const picked: Product[] = []
  const used = new Set<string>()

  const add = (product: Product | undefined) => {
    if (!product || used.has(product.id)) return
    used.add(product.id)
    picked.push(product)
  }

  add(pickByStep('cleanse', goal, used))

  if (preference === 'minimal_2_step') {
    add(
      pickByStep(goal === 'calm' ? 'calm_repair' : 'hydrate', goal, used) ??
        pickByStep('hydrate', goal, used),
    )
    return picked
  }

  if (preference === 'full_3_step') {
    add(pickByStep('hydrate', goal, used))
    add(
      pickByStep(goal === 'calm' ? 'calm_repair' : 'hydrate', goal, used) ??
        pickByStep('calm_repair', goal, used),
    )
    return picked
  }

  add(pickByStep('hydrate', goal, used))
  add(pickByStep('protect', goal, used))
  return picked
}

export function buildRoutineRecommendation(
  result: SkinAnalysisResult,
  goal: SkinGoal,
  preference: RoutinePreference,
): RoutineRecommendation {
  const products = selectProducts(goal, preference)
  const goalLabel = GOAL_LABELS[goal].toLowerCase()

  return {
    title: `Routine Simple · ${GOAL_LABELS[goal]}`,
    summary: `Gợi ý ${products.length} sản phẩm phù hợp với ${result.skinType} — ưu tiên ${goalLabel}.`,
    products,
    preference,
    goal,
  }
}
