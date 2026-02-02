<script setup lang="ts">
interface Props {
  readonly message?: string
  readonly size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  message: undefined,
  size: 'md',
})

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <div
      :class="[
        'animate-spin rounded-full border-primary-200 border-t-primary-500',
        sizeClasses[props.size],
      ]"
    />
    <p v-if="props.message" class="text-sm text-gray-500">
      {{ props.message }}
    </p>
  </div>
</template>
