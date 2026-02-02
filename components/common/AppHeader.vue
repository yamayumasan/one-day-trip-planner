<script setup lang="ts">
const { t } = useI18n()

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
      <NuxtLink to="/" class="text-lg font-bold text-primary-600">
        {{ t('common.appName') }}
      </NuxtLink>

      <nav class="hidden items-center gap-4 md:flex">
        <NuxtLink to="/conditions" class="text-sm text-gray-600 transition-colors hover:text-primary-600">
          {{ t('conditions.title') }}
        </NuxtLink>
        <NuxtLink to="/history" class="text-sm text-gray-600 transition-colors hover:text-primary-600">
          {{ t('history.title') }}
        </NuxtLink>
        <NuxtLink to="/login" class="btn-primary text-sm">
          {{ t('auth.login') }}
        </NuxtLink>
      </nav>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
        @click="toggleMenu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-48 opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="max-h-48 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <nav v-if="isMenuOpen" class="overflow-hidden border-t border-gray-100 md:hidden">
        <div class="flex flex-col gap-1 px-4 py-3">
          <NuxtLink to="/conditions" class="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50" @click="toggleMenu">
            {{ t('conditions.title') }}
          </NuxtLink>
          <NuxtLink to="/history" class="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50" @click="toggleMenu">
            {{ t('history.title') }}
          </NuxtLink>
          <NuxtLink to="/login" class="rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-50" @click="toggleMenu">
            {{ t('auth.login') }}
          </NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>
