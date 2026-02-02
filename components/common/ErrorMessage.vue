<script setup lang="ts">
const { t } = useI18n()

interface Props {
  readonly message?: string
  readonly retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: undefined,
  retryable: false,
})

const emit = defineEmits<{
  retry: []
}>()

const displayMessage = computed(() => props.message ?? t('errors.generic'))
</script>

<template>
  <div class="rounded-xl border border-red-100 bg-red-50 p-4">
    <div class="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="flex-1">
        <p class="text-sm text-red-700">
          {{ displayMessage }}
        </p>
        <button
          v-if="props.retryable"
          class="mt-2 text-sm font-medium text-red-600 underline transition-colors hover:text-red-800"
          @click="emit('retry')"
        >
          {{ t('common.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>
