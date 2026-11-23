<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClubsStore, CATEGORY_COLORS } from '../stores/clubs'
import { WEEKDAYS, priceLabel, ageFromYear, ageLabel, plural } from '../utils/schedule'

const route = useRoute()
const router = useRouter()
const store = useClubsStore()

const club = computed(() => store.clubById(route.params.id))
const catStyle = computed(() => (club.value ? CATEGORY_COLORS[club.value.category] : {}))
const left = computed(() => (club.value ? store.seatsLeft(club.value) : 0))
const isFav = computed(() => club.value && store.isFavorite(club.value.id))

const selectedChild = ref('')
const enrollError = ref('')

const childFit = computed(() => {
  if (!club.value || !selectedChild.value) return null
  const child = store.childById(selectedChild.value)
  const age = ageFromYear(child.birthYear)
  return {
    child,
    age,
    fits: age >= club.value.ageMin && age <= club.value.ageMax,
    already: store.enrollments.some(
      (e) => e.clubId === club.value.id && e.childId === child.id && e.status === 'active',
    ),
  }
})

function enroll() {
  enrollError.value = ''
  if (!selectedChild.value) {
    enrollError.value = 'Выберите ребёнка'
    return
  }
  const result = store.enroll(club.value.id, selectedChild.value)
  if (!result.ok) {
    enrollError.value = result.error
    return
  }
  router.push('/schedule')
}

const sortedSchedule = computed(() =>
  club.value ? [...club.value.schedule].sort((a, b) => a.day - b.day || a.start.localeCompare(b.start)) : [],
)
</script>

<template>
  <section v-if="club" class="club-page">
    <button class="back" type="button" @click="router.back()">← Назад к каталогу</button>

    <div class="card hero">
      <div class="hero-head">
        <span class="badge cat" :style="{ color: catStyle.fg, background: catStyle.bg }">{{ club.category }}</span>
        <button
          class="fav"
          type="button"
          :aria-pressed="isFav"
          :aria-label="isFav ? 'Убрать из избранного' : 'В избранное'"
          @click="store.toggleFavorite(club.id)"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" :fill="isFav ? 'currentColor' : 'none'" aria-hidden="true">
            <path
              d="M10 17.2s-6.4-3.9-7.9-8.1C.9 5.9 2.9 3 5.9 3c1.7 0 3.2.9 4.1 2.3C10.9 3.9 12.4 3 14.1 3c3 0 5 2.9 3.8 6.1-1.5 4.2-7.9 8.1-7.9 8.1Z"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <h1>{{ club.name }}</h1>
      <p class="desc">{{ club.description }}</p>

      <dl class="facts">
        <div><dt>Возраст</dt><dd>{{ club.ageMin }}–{{ club.ageMax }} лет</dd></div>
        <div><dt>Преподаватель</dt><dd>{{ club.teacher }}</dd></div>
        <div><dt>Формат</dt><dd>{{ club.format }}</dd></div>
        <div><dt>Адрес</dt><dd>{{ club.address }}</dd></div>
        <div><dt>Стоимость</dt><dd>{{ priceLabel(club.price) }}</dd></div>
        <div>
          <dt>Свободные места</dt>
          <dd :class="{ warn: left <= 2, none: left === 0 }">
            {{ left === 0 ? 'нет' : `${left} из ${club.seatsTotal}` }}
          </dd>
        </div>
      </dl>

      <h2 class="h2">Расписание занятий</h2>
      <table class="schedule-table">
        <thead>
          <tr><th>День недели</th><th>Время</th></tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in sortedSchedule" :key="i">
            <td>{{ WEEKDAYS[s.day] }}</td>
            <td class="mono">{{ s.start }}–{{ s.end }}</td>
          </tr>
        </tbody>
      </table>

      <div class="enroll-box">
        <h2 class="h2">Записать ребёнка</h2>

        <template v-if="store.children.length">
          <div class="enroll-row">
            <select v-model="selectedChild" class="child-select" aria-label="Выберите ребёнка">
              <option value="" disabled>Выберите ребёнка</option>
              <option v-for="ch in store.children" :key="ch.id" :value="ch.id">
                {{ ch.name }}, {{ ageLabel(ageFromYear(ch.birthYear)) }}
              </option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              :disabled="left === 0 || (childFit && (childFit.already || !childFit.fits))"
              @click="enroll"
            >
              Записать
            </button>
          </div>

          <p v-if="childFit && !childFit.fits" class="hint warn-text">
            {{ childFit.child.name }} ({{ ageLabel(childFit.age) }}) не подходит по возрасту: кружок для {{ club.ageMin }}–{{ club.ageMax }} лет.
          </p>
          <p v-else-if="childFit && childFit.already" class="hint">
            {{ childFit.child.name }} уже записан(а) на этот кружок.
          </p>
          <p v-if="enrollError" class="hint error-text" role="alert">{{ enrollError }}</p>
          <p v-if="left === 0" class="hint error-text">Свободных мест нет — посмотрите другие кружки категории «{{ club.category }}».</p>
        </template>

        <p v-else class="hint">
          Сначала добавьте ребёнка в разделе
          <RouterLink to="/children">«Мои дети»</RouterLink>.
        </p>
      </div>
    </div>
  </section>

  <section v-else class="card empty">
    <p>Кружок не найден.</p>
    <RouterLink class="btn btn-ghost" to="/">Вернуться в каталог</RouterLink>
  </section>
</template>

<style scoped>
.club-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 760px;
}

.back {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14.5px;
  padding: 6px 0;
}

.back:hover {
  color: var(--accent-strong);
}

.hero {
  padding: 24px 28px 28px;
}

.hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.fav {
  border: none;
  background: transparent;
  color: var(--text-faint);
  padding: 4px;
  border-radius: 999px;
  display: inline-flex;
  transition: color 0.15s ease-out, transform 0.15s ease-out;
}

.fav:hover,
.fav[aria-pressed='true'] {
  color: var(--accent);
}

.fav:hover {
  transform: scale(1.12);
}

h1 {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 800;
}

.desc {
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 15.5px;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px 24px;
  margin: 0 0 24px;
}

.facts dt {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  font-weight: 600;
}

.facts dd {
  margin: 2px 0 0;
  font-size: 15px;
  font-weight: 600;
}

.facts dd.warn {
  color: var(--p-amber-600);
}

.facts dd.none {
  color: var(--danger);
}

.h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.schedule-table th,
.schedule-table td {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14.5px;
}

.schedule-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
}

.mono {
  font-family: var(--mono);
  font-size: 13px;
}

.enroll-box {
  background: var(--surface-2);
  border-radius: var(--radius-m);
  padding: 18px;
}

.enroll-row {
  display: flex;
  gap: 10px;
}

.child-select {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: var(--radius-s);
  background: var(--surface);
  padding: 10px 12px;
  font-size: 15px;
}

.hint {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.warn-text {
  color: var(--p-amber-600);
}

.error-text {
  color: var(--danger);
  font-weight: 500;
}

.empty {
  padding: 48px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
