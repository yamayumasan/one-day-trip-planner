export type AuthProvider = 'google' | 'line' | 'email'

export type TripSessionStatus =
  | 'input'
  | 'generated'
  | 'selected'
  | 'active'
  | 'completed'
  | 'cancelled'

export type TransportMode = 'train' | 'bus' | 'car' | 'walk'

export type RescheduleStatus = 'proposed' | 'accepted' | 'rejected'

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface User {
  readonly id: string
  readonly email: string | null
  readonly passwordHash: string | null
  readonly displayName: string
  readonly avatarUrl: string | null
  readonly authProvider: AuthProvider
  readonly googleId: string | null
  readonly lineId: string | null
  readonly freeSessionUsed: 0 | 1
  readonly createdAt: string
  readonly updatedAt: string
}

export interface AuthSession {
  readonly id: string
  readonly userId: string
  readonly tokenHash: string
  readonly expiresAt: string
  readonly createdAt: string
}

export interface TripSession {
  readonly id: string
  readonly userId: string
  readonly status: TripSessionStatus
  readonly regenerationCount: number
  readonly paymentId: string | null
  readonly isFree: 0 | 1
  readonly originLat: number | null
  readonly originLng: number | null
  readonly originAddress: string | null
  readonly budgetMax: number | null
  readonly timeStart: string | null
  readonly timeEnd: string | null
  readonly transportMode: TransportMode | null
  readonly createdAt: string
  readonly updatedAt: string
}

export interface Plan {
  readonly id: string
  readonly tripSessionId: string
  readonly generationRound: number
  readonly planIndex: number
  readonly isSelected: 0 | 1
  readonly title: string
  readonly summary: string | null
  readonly totalBudget: number | null
  readonly planData: string
  readonly createdAt: string
}

export interface PlanSpot {
  readonly placeId: string
  readonly name: string
  readonly address: string
  readonly lat: number
  readonly lng: number
  readonly rating: number | null
  readonly photoUrl: string | null
  readonly estimatedMinutes: number
  readonly admissionFee: number
}

export interface PlanRestaurant {
  readonly placeId: string
  readonly name: string
  readonly address: string
  readonly lat: number
  readonly lng: number
  readonly rating: number | null
  readonly photoUrl: string | null
  readonly priceLevel: number | null
  readonly estimatedCost: number
}

export interface ScheduleEntry {
  readonly time: string
  readonly endTime: string
  readonly type: 'spot' | 'restaurant' | 'transport'
  readonly title: string
  readonly description: string
  readonly placeId: string | null
  readonly durationMinutes: number
}

export interface BudgetBreakdown {
  readonly transport: number
  readonly meals: number
  readonly admission: number
  readonly other: number
  readonly total: number
}

export interface PlanData {
  readonly spots: readonly PlanSpot[]
  readonly restaurants: readonly PlanRestaurant[]
  readonly schedule: readonly ScheduleEntry[]
  readonly budget: BudgetBreakdown
}

export interface Reschedule {
  readonly id: string
  readonly planId: string
  readonly tripSessionId: string
  readonly triggerLat: number
  readonly triggerLng: number
  readonly triggerTime: string
  readonly newScheduleData: string
  readonly status: RescheduleStatus
  readonly createdAt: string
}

export interface Payment {
  readonly id: string
  readonly userId: string
  readonly tripSessionId: string
  readonly stripePaymentIntentId: string | null
  readonly stripeCheckoutSessionId: string | null
  readonly amount: number
  readonly currency: string
  readonly status: PaymentStatus
  readonly createdAt: string
  readonly updatedAt: string
}
