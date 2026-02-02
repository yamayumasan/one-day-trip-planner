<script setup lang="ts">
const { t } = useI18n()
const { login, loading, error } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  const success = await login({
    email: form.email,
    password: form.password,
  })
  if (success) {
    await router.push('/conditions')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div>
      <label for="email" class="label-text">{{ t('auth.email') }}</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        autocomplete="email"
        class="input-field"
      />
    </div>

    <div>
      <label for="password" class="label-text">{{ t('auth.password') }}</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        minlength="8"
        autocomplete="current-password"
        class="input-field"
      />
    </div>

    <CommonErrorMessage v-if="error" :message="error" />

    <button
      type="submit"
      class="btn-primary w-full"
      :disabled="loading"
    >
      <CommonLoadingSpinner v-if="loading" size="sm" />
      <span v-else>{{ t('auth.login') }}</span>
    </button>
  </form>
</template>
