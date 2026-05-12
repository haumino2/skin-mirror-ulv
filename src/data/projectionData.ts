export type ScenarioKey = 'combo' | 'cleanser' | 'none'

export interface ScenarioData {
  oil: number[] // [tuần 0, 1, 2, 3, 4]
  inflam: number[]
  hydration: number[]
  confidence: number[] // confidence width tăng theo time
  evidence: string // HTML string với <strong>
  label: string // hiển thị trên scenario button
  color: string // hex cho dot indicator
}

export const PROJECTION_DATA: Record<ScenarioKey, ScenarioData> = {
  combo: {
    oil: [7.8, 7.3, 6.5, 5.8, 5.3],
    inflam: [6.2, 5.4, 4.2, 3.6, 3.4],
    hydration: [4.2, 5.0, 5.9, 6.5, 6.8],
    confidence: [0, 0.3, 0.5, 0.8, 1.1],
    evidence:
      '<strong>Combo Toner + Moisturizer:</strong> giải dầu 32% + viêm 45% trong 4 tuần. Texture cải thiện chậm hơn (sau tuần 6).',
    label: 'Dùng combo gợi ý',
    color: '#534AB7',
  },
  cleanser: {
    oil: [7.8, 7.4, 7.0, 6.7, 6.5],
    inflam: [6.2, 5.8, 5.3, 5.0, 4.8],
    hydration: [4.2, 4.1, 4.0, 3.9, 3.8],
    confidence: [0, 0.4, 0.7, 1.0, 1.4],
    evidence:
      '<strong>Chỉ cleanser:</strong> giảm dầu 17% + viêm 23%. Nhưng ẩm giảm thêm 10% vì thiếu moisturizer bù.',
    label: 'Chỉ cleanser',
    color: '#EF9F27',
  },
  none: {
    oil: [7.8, 7.9, 8.0, 8.1, 8.1],
    inflam: [6.2, 6.4, 6.7, 7.0, 7.2],
    hydration: [4.2, 4.0, 3.8, 3.6, 3.4],
    confidence: [0, 0.5, 1.0, 1.5, 2.0],
    evidence:
      '<strong>Không thay đổi routine:</strong> dầu, viêm tăng nhẹ. Ẩm giảm 19% trong 4 tuần. Vấn đề da hiện tại có thể nặng hơn.',
    label: 'Không thay đổi',
    color: '#888780',
  },
}

export const WEEK_LABELS = ['Hôm nay', 'T1', 'T2', 'T3', 'T4']
