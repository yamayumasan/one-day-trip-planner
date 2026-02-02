export class AppError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'ログインが必要です') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message = 'お支払いが必要です') {
    super(message, 402, 'PAYMENT_REQUIRED')
    this.name = 'PaymentRequiredError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'アクセスが拒否されました') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'リソースが見つかりません') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message = '入力内容に誤りがあります') {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class SessionLimitError extends AppError {
  constructor(message = '再生成の上限に達しました') {
    super(message, 429, 'SESSION_LIMIT')
    this.name = 'SessionLimitError'
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, message = '外部サービスとの通信に失敗しました') {
    super(`${service}: ${message}`, 502, 'EXTERNAL_API_ERROR')
    this.name = 'ExternalApiError'
  }
}
