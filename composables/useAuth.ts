interface AuthUser {
  readonly id: string
  readonly email: string | null
  readonly displayName: string
  readonly avatarUrl: string | null
  readonly authProvider: 'google' | 'line' | 'email'
  readonly freeSessionUsed: 0 | 1
}

interface LoginPayload {
  readonly email: string
  readonly password: string
}

interface RegisterPayload {
  readonly email: string
  readonly password: string
  readonly displayName: string
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function fetchCurrentUser(): Promise<void> {
    try {
      const response = await $fetch<{ success: boolean; data: { user: AuthUser } }>('/api/auth/me')
      if (response.success && response.data) {
        user.value = response.data.user
      }
    } catch {
      user.value = null
    }
  }

  async function login(payload: LoginPayload): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: { user: AuthUser }; error?: string }>('/api/auth/login', {
        method: 'POST',
        body: payload,
      })
      if (response.success && response.data) {
        user.value = response.data.user
        return true
      }
      error.value = response.error ?? 'ログインに失敗しました'
      return false
    } catch (e: unknown) {
      const fetchError = e as { data?: { error?: string } }
      error.value = fetchError.data?.error ?? 'ログインに失敗しました'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: { user: AuthUser }; error?: string }>('/api/auth/register', {
        method: 'POST',
        body: payload,
      })
      if (response.success && response.data) {
        user.value = response.data.user
        return true
      }
      error.value = response.error ?? '登録に失敗しました'
      return false
    } catch (e: unknown) {
      const fetchError = e as { data?: { error?: string } }
      error.value = fetchError.data?.error ?? '登録に失敗しました'
      return false
    } finally {
      loading.value = false
    }
  }

  function loginWithGoogle(): void {
    navigateTo('/api/auth/google/redirect', { external: true })
  }

  function loginWithLine(): void {
    navigateTo('/api/auth/line/redirect', { external: true })
  }

  async function logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      await navigateTo('/login')
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    fetchCurrentUser,
    login,
    register,
    loginWithGoogle,
    loginWithLine,
    logout,
  }
}
