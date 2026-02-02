<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-2xl font-bold text-primary-600">
          {{ t('common.appName') }}
        </NuxtLink>
      </div>

      <div class="card">
        <slot />
      </div>
    </div>
  </div>
</template>
