<script setup lang="ts">
interface Props {
  readonly slotId: string
  readonly size: 'banner' | 'rectangle' | 'leaderboard'
}

const props = defineProps<Props>()

const sizeClasses: Record<Props['size'], string> = {
  banner: 'h-[50px] w-full',
  rectangle: 'h-[250px] w-[300px]',
  leaderboard: 'h-[90px] w-full max-w-[728px]',
}
</script>

<template>
  <div
    :data-ad-slot="props.slotId"
    :class="[
      'flex items-center justify-center bg-gray-50 text-xs text-gray-300',
      sizeClasses[props.size],
    ]"
  >
    AD
  </div>
</template>
