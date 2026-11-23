<script setup>
import { useClubsStore } from '../stores/clubs'

const store = useClubsStore()
</script>

<template>
  <div class="toast-stack" aria-live="polite">
    <TransitionGroup name="fade">
      <div v-for="t in store.toasts" :key="t.id" class="toast" :class="`toast-${t.tone}`" role="status">
        <svg v-if="t.tone === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.6" />
          <path d="m5 8.2 2 2 4-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: var(--z-toast);
  max-width: min(420px, calc(100vw - 48px));
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--text);
  color: var(--surface);
  padding: 12px 16px;
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-pop);
  font-size: 14.5px;
  font-weight: 500;
}
</style>
