<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <CommonAppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <CommonAdBanner slot-id="footer-banner" size="banner" class="md:hidden" />

    <CommonAppFooter />
  </div>
</template>
