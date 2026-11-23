<script setup>
import { computed, ref } from 'vue'
import { useClubsStore, CATEGORY_COLORS } from '../stores/clubs'
import { WEEKDAYS_SHORT, ageFromYear, ageLabel } from '../utils/schedule'

const store = useClubsStore()

const selectedChild = ref(store.children[0]?.id || '')
const confirmCancel = ref(null)

const rows = computed(() => {
  if (!selectedChild.value) return []
  return store
    .enrollmentsForChild(selectedChild.value)
    .map((e) => ({ ...e, club: store.clubById(e.clubId) }))
    .filter((e) => e.club)
})

/** Сетка недели: day → занятия */
const weekGrid = computed(() => {
  const grid = Array.from({ length: 7 }, () => [])
  for (const e of rows.value) {
    for (const s of e.club.schedule) {
      grid[s.day].push({ enrollment: e, slot: s })
    }
  }
  for (const day of grid) day.sort((a, b) => a.slot.start.localeCompare(b.slot.start))
  return grid
})

const totalClubs = computed(() => rows.value.length)
</script>

<template>
  <section class="schedule-page">
    <header class="page-head">
      <div>
        <h1>Расписание</h1>
        <p class="subtitle">Занятия ваших детей на неделе</p>
      </div>
      <select v-if="store.children.length" v-model="selectedChild" class="child-select" aria-label="Выберите ребёнка">
        <option v-for="ch in store.children" :key="ch.id" :value="ch.id">
          {{ ch.name }}, {{ ageLabel(ageFromYear(ch.birthYear)) }}
        </option>
      </select>
    </header>

    <template v-if="store.children.length">
      <div v-if="rows.length" class="week">
        <div v-for="(day, di) in weekGrid" :key="di" class="day-col card">
          <h2 class="day-name" :class="{ empty: !day.length }">{{ WEEKDAYS_SHORT[di] }}</h2>
          <div v-if="day.length" class="day-items">
            <article
              v-for="(item, i) in day"
              :key="i"
              class="lesson"
              :style="{ borderColor: CATEGORY_COLORS[item.enrollment.club.category].fg }"
            >
              <div class="lesson-time mono">{{ item.slot.start }}–{{ item.slot.end }}</div>
              <RouterLink class="lesson-name" :to="`/club/${item.enrollment.club.id}`">
                {{ item.enrollment.club.name }}
              </RouterLink>
              <div class="lesson-place">{{ item.enrollment.club.format === 'Онлайн' ? 'Онлайн' : item.enrollment.club.address }}</div>
              <button
                class="lesson-cancel"
                type="button"
                :aria-label="`Отменить запись на ${item.enrollment.club.name}`"
                @click="confirmCancel = item.enrollment"
              >
                Отменить запись
              </button>
            </article>
          </div>
          <p v-else class="day-empty">—</p>
        </div>
      </div>

      <div v-else class="card empty">
        <p>У {{ store.childById(selectedChild)?.name }} пока нет записей. Выберите кружок в <RouterLink to="/">каталоге</RouterLink>.</p>
      </div>

      <p v-if="rows.length" class="summary">
        Всего активных кружков: {{ totalClubs }} · занятий в неделю: {{ weekGrid.flat().length }}
      </p>
    </template>

    <div v-else class="card empty">
      <p>Сначала добавьте ребёнка в разделе <RouterLink to="/children">«Мои дети»</RouterLink>.</p>
    </div>

    <!-- Подтверждение отмены -->
    <Transition name="fade">
      <div v-if="confirmCancel" class="backdrop" @mousedown.self="confirmCancel = null">
        <div class="card modal" role="alertdialog" aria-modal="true" aria-label="Подтверждение отмены записи">
          <h2>Отменить запись?</h2>
          <p class="confirm-text">
            Запись {{ store.childById(confirmCancel.childId)?.name }} на «{{ store.clubById(confirmCancel.clubId)?.name }}» будет отменена, место освободится.
          </p>
          <footer class="modal-foot">
            <button class="btn btn-ghost" type="button" @click="confirmCancel = null">Оставить</button>
            <button class="btn btn-danger" type="button" @click="store.cancelEnrollment(confirmCancel.id); confirmCancel = null">Отменить запись</button>
          </footer>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.schedule-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 14.5px;
}

.child-select {
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  background: var(--surface);
  padding: 10px 12px;
  font-size: 14.5px;
  font-weight: 500;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-col {
  padding: 12px 10px;
  min-height: 140px;
}

.day-name {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
  text-align: center;
}

.day-name.empty {
  color: var(--text-faint);
}

.day-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lesson {
  border: 1px solid var(--border);
  border-left: 3px solid;
  border-radius: var(--radius-s);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mono,
.lesson-time {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
}

.lesson-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text);
  text-decoration: none;
}

.lesson-name:hover {
  color: var(--accent-strong);
}

.lesson-place {
  font-size: 11.5px;
  color: var(--text-faint);
}

.lesson-cancel {
  margin-top: 4px;
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--danger);
  font-size: 11.5px;
  font-weight: 600;
  padding: 2px 0;
  opacity: 0.75;
}

.lesson-cancel:hover {
  opacity: 1;
  text-decoration: underline;
}

.day-empty {
  margin: 0;
  text-align: center;
  color: var(--text-faint);
}

.summary {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty {
  padding: 48px 32px;
  text-align: center;
  color: var(--text-secondary);
}

.backdrop {
  position: fixed;
  inset: 0;
  background: oklch(26% 0.03 265 / 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: var(--z-modal);
}

.modal {
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

.modal h2 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
}

.confirm-text {
  margin: 0 0 16px;
  color: var(--text-secondary);
  font-size: 14.5px;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 900px) {
  .week {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
