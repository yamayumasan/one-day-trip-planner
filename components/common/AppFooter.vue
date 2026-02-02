<script setup lang="ts">
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-100 bg-white py-8">
    <div class="mx-auto max-w-5xl px-4 text-center text-sm text-gray-400">
      &copy; {{ currentYear }} {{ t('common.appName') }}
    </div>
  </footer>
</template>
