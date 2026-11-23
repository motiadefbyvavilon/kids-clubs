<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useClubsStore } from './stores/clubs'
import ToastStack from './components/ToastStack.vue'

const store = useClubsStore()
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <div class="topbar-inner">
        <RouterLink to="/" class="brand">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="15" cy="15" r="13.2" class="b-ring" />
            <circle cx="15" cy="15" r="8.4" class="b-ring mid" />
            <circle cx="15" cy="15" r="3.4" class="b-core" />
          </svg>
          <span class="brand-name">КружокРядом</span>
        </RouterLink>

        <nav class="nav" aria-label="Основная навигация">
          <RouterLink to="/" class="nav-item">Каталог</RouterLink>
          <RouterLink to="/children" class="nav-item">Мои дети</RouterLink>
          <RouterLink to="/schedule" class="nav-item">
            Расписание
            <span v-if="store.enrollments.filter(e => e.status === 'active').length" class="nav-badge">
              {{ store.enrollments.filter(e => e.status === 'active').length }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <RouterView />
    </main>

    <ToastStack />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
}

.topbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}

.b-ring {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
}

.b-ring.mid {
  stroke: var(--p-teal-600);
  opacity: 0.75;
}

.b-core {
  fill: var(--p-amber-600);
}

.brand-name {
  font-weight: 800;
  font-size: 18px;
}

.nav {
  display: flex;
  gap: 4px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 14.5px;
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
}

.nav-item:hover {
  background: var(--surface-2);
  color: var(--text);
}

.nav-item.router-link-active {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.nav-badge {
  background: var(--accent);
  color: var(--surface);
  font-size: 11.5px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.main {
  flex: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 56px;
}

@media (max-width: 640px) {
  .topbar-inner {
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px;
  }
  .main {
    padding: 16px 16px 40px;
  }
}
</style>
