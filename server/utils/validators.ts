import { z } from 'zod'

export const conditionInputSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  originAddress: z.string().min(1).max(200),
  budgetMax: z.number().int().min(1000).max(100000),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, '時刻はHH:MM形式で入力してください'),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, '時刻はHH:MM形式で入力してください'),
  transportMode: z.enum(['train', 'bus', 'car', 'walk']),
})

export const emailLoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください').max(128),
})

export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください').max(128),
  displayName: z.string().min(1, '表示名を入力してください').max(50),
})

export const rescheduleSchema = z.object({
  planId: z.string().min(1),
  currentLat: z.number().min(-90).max(90),
  currentLng: z.number().min(-180).max(180),
})

export const selectPlanSchema = z.object({
  planId: z.string().min(1),
})

export type ConditionInput = z.infer<typeof conditionInputSchema>
export type EmailLoginInput = z.infer<typeof emailLoginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RescheduleInput = z.infer<typeof rescheduleSchema>
