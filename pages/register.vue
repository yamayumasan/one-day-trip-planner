<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="mb-6 text-center text-xl font-bold">
      {{ t('auth.register') }}
    </h1>

    <AuthOAuthButtons />

    <div class="my-6 flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200" />
      <span class="text-xs text-gray-400">or</span>
      <div class="h-px flex-1 bg-gray-200" />
    </div>

    <AuthRegisterForm />

    <p class="mt-6 text-center text-sm text-gray-500">
      {{ t('auth.hasAccount') }}
      <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-700">
        {{ t('auth.loginHere') }}
      </NuxtLink>
    </p>
  </div>
</template>
