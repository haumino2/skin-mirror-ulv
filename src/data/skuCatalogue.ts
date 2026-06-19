export type SkuConcern = 'brightening' | 'acne' | 'hydration' | 'anti_aging' | 'pores'
export type BrandName = 'Simple' | "Pond's" | 'Vaseline' | 'Hazeline' | 'AHC'

export interface Sku {
  id: string
  brand: BrandName
  name: string
  price: string
  shelf: string
  imageUrl: string
  concerns: SkuConcern[]
  bestForSkinType: string[]
  keyBenefit: string
  matchReason?: string
}

export const SKU_CATALOGUE: Sku[] = [
  {
    id: 'SKU001',
    brand: "Pond's",
    name: "Kem dưỡng trắng sáng da White Beauty",
    price: '89.000đ',
    shelf: 'Kệ A · Hàng 2',
    imageUrl: '/image/ponds-white-beauty.png',
    concerns: ['brightening'],
    bestForSkinType: ['normal', 'dry', 'combination'],
    keyBenefit: 'Làm sáng da, giảm thâm nám sau 2 tuần',
  },
  {
    id: 'SKU002',
    brand: 'Simple',
    name: 'Sữa rửa mặt dịu nhẹ Kind To Skin',
    price: '95.000đ',
    shelf: 'Kệ A · Hàng 1',
    imageUrl: '/image/simple-cleanser.png',
    concerns: ['acne'],
    bestForSkinType: ['oily', 'combination', 'sensitive'],
    keyBenefit: 'Làm sạch không gây khô, phù hợp da nhạy cảm',
  },
  {
    id: 'SKU003',
    brand: 'Vaseline',
    name: 'Sữa dưỡng thể Healthy Bright',
    price: '75.000đ',
    shelf: 'Kệ B · Hàng 1',
    imageUrl: '/image/vaseline-healthy-bright.png',
    concerns: ['hydration'],
    bestForSkinType: ['dry', 'normal'],
    keyBenefit: 'Dưỡng ẩm sâu, phục hồi da khô trong 1 tuần',
  },
  {
    id: 'SKU004',
    brand: 'Hazeline',
    name: 'Kem dưỡng da Snow White & Rose',
    price: '65.000đ',
    shelf: 'Kệ A · Hàng 3',
    imageUrl: '/image/hazeline-snow-white.png',
    concerns: ['brightening', 'pores'],
    bestForSkinType: ['combination', 'oily'],
    keyBenefit: 'Dưỡng trắng tự nhiên, kiểm soát dầu nhẹ',
  },
  {
    id: 'SKU005',
    brand: 'AHC',
    name: 'Essential Real Eye Cream For Face',
    price: '320.000đ',
    shelf: 'Kệ B · Hàng 2',
    imageUrl: '/image/ahc-eye-cream.png',
    concerns: ['anti_aging'],
    bestForSkinType: ['all'],
    keyBenefit: 'Giảm nếp nhăn, làm đều màu da sau 4 tuần',
  },
]
