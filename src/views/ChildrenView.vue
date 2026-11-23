<script setup>
import { computed, reactive, ref } from 'vue'
import { useClubsStore, CATEGORIES } from '../stores/clubs'
import { ageFromYear, ageLabel } from '../utils/schedule'

const store = useClubsStore()

const modalOpen = ref(false)
const editing = ref(null)
const confirmDelete = ref(null)
const form = reactive({ id: null, name: '', birthYear: '', interests: [] })
const error = ref('')

function openCreate() {
  editing.value = null
  Object.assign(form, { id: null, name: '', birthYear: '', interests: [] })
  error.value = ''
  modalOpen.value = true
}

function openEdit(child) {
  editing.value = child
  Object.assign(form, { id: child.id, name: child.name, birthYear: child.birthYear, interests: [...child.interests] })
  error.value = ''
  modalOpen.value = true
}

function toggleInterest(cat) {
  form.interests = form.interests.includes(cat)
    ? form.interests.filter((c) => c !== cat)
    : [...form.interests, cat]
}

function submit() {
  const result = store.saveChild({ ...form })
  if (!result.ok) {
    error.value = result.error
    return
  }
  modalOpen.value = false
}

function enrollmentsOf(childId) {
  return store
    .enrollmentsForChild(childId)
    .map((e) => ({ ...e, club: store.clubById(e.clubId) }))
    .filter((e) => e.club)
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <section class="children-page">
    <header class="page-head">
      <div>
        <h1>Мои дети</h1>
        <p class="subtitle">Профили детей, их интересы и текущие записи в кружки</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">+ Добавить ребёнка</button>
    </header>

    <div v-if="store.children.length" class="list">
      <article v-for="child in store.children" :key="child.id" class="card child-card">
        <div class="child-head">
          <div class="avatar" aria-hidden="true">{{ child.name[0] }}</div>
          <div>
            <h2 class="child-name">{{ child.name }}</h2>
            <p class="child-age">{{ ageLabel(ageFromYear(child.birthYear)) }} · {{ child.birthYear }} г.р.</p>
          </div>
          <div class="child-actions">
            <button class="btn btn-ghost btn-sm" type="button" @click="openEdit(child)">Изменить</button>
            <button class="btn btn-danger btn-sm" type="button" @click="confirmDelete = child">Удалить</button>
          </div>
        </div>

        <div v-if="child.interests.length" class="interests">
          <span v-for="i in child.interests" :key="i" class="badge">{{ i }}</span>
        </div>
        <p v-else class="no-interests">Интересы не указаны</p>

        <div class="enrollments">
          <h3>Записи в кружки</h3>
          <ul v-if="enrollmentsOf(child.id).length">
            <li v-for="e in enrollmentsOf(child.id)" :key="e.id">
              <RouterLink :to="`/club/${e.club.id}`">{{ e.club.name }}</RouterLink>
              <span class="badge">{{ e.club.category }}</span>
            </li>
          </ul>
          <p v-else class="none">Пока нет активных записей — выберите кружок в <RouterLink to="/">каталоге</RouterLink>.</p>
        </div>
      </article>
    </div>

    <div v-else class="card empty">
      <p>Добавьте профиль ребёнка, чтобы записывать его в кружки.</p>
      <button class="btn btn-primary" type="button" @click="openCreate">Добавить ребёнка</button>
    </div>

    <!-- Модалка добавления/редактирования -->
    <Transition name="fade">
      <div v-if="modalOpen" class="backdrop" @mousedown.self="modalOpen = false">
        <div class="card modal" role="dialog" aria-modal="true" :aria-label="editing ? 'Редактирование профиля' : 'Новый ребёнок'">
          <h2>{{ editing ? 'Редактирование профиля' : 'Новый ребёнок' }}</h2>
          <form class="modal-body" @submit.prevent="submit">
            <div v-if="error" class="alert" role="alert">{{ error }}</div>
            <div class="field">
              <label for="cf-name">Имя</label>
              <input id="cf-name" v-model="form.name" type="text" placeholder="Имя ребёнка" required />
            </div>
            <div class="field">
              <label for="cf-year">Год рождения</label>
              <input id="cf-year" v-model="form.birthYear" type="number" :min="currentYear - 17" :max="currentYear - 3" placeholder="Например, 2017" required />
            </div>
            <div class="field">
              <label>Интересы</label>
              <div class="chips">
                <button
                  v-for="cat in CATEGORIES"
                  :key="cat"
                  type="button"
                  class="chip"
                  :class="{ active: form.interests.includes(cat) }"
                  :aria-pressed="form.interests.includes(cat)"
                  @click="toggleInterest(cat)"
                >
                  {{ cat }}
                </button>
              </div>
            </div>
            <footer class="modal-foot">
              <button class="btn btn-ghost" type="button" @click="modalOpen = false">Отмена</button>
              <button class="btn btn-primary" type="submit">{{ editing ? 'Сохранить' : 'Добавить' }}</button>
            </footer>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Подтверждение удаления -->
    <Transition name="fade">
      <div v-if="confirmDelete" class="backdrop" @mousedown.self="confirmDelete = null">
        <div class="card modal" role="alertdialog" aria-modal="true" aria-label="Подтверждение удаления">
          <h2>Удалить профиль?</h2>
          <p class="confirm-text">
            Профиль «{{ confirmDelete.name }}» и все его записи в кружки будут удалены.
          </p>
          <footer class="modal-foot">
            <button class="btn btn-ghost" type="button" @click="confirmDelete = null">Оставить</button>
            <button class="btn btn-danger" type="button" @click="store.deleteChild(confirmDelete.id); confirmDelete = null">Удалить</button>
          </footer>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.children-page {
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

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

.child-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.child-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 800;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.child-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.child-age {
  margin: 2px 0 0;
  font-size: 13.5px;
  color: var(--text-secondary);
}

.child-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.interests {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.no-interests {
  margin: 0;
  font-size: 13.5px;
  color: var(--text-faint);
}

.enrollments h3 {
  margin: 0 0 8px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
}

.enrollments ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.enrollments li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
}

.enrollments a {
  color: var(--accent-strong);
  font-weight: 600;
  text-decoration: none;
}

.enrollments a:hover {
  text-decoration: underline;
}

.none {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty {
  padding: 48px 32px;
  text-align: center;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  max-width: 460px;
  padding: 24px;
}

.modal h2 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 700;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert {
  background: var(--danger-soft);
  border: 1px solid var(--danger);
  color: var(--danger);
  border-radius: var(--radius-m);
  padding: 12px 14px;
  font-size: 14px;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
}

.chip.active {
  background: var(--text);
  border-color: var(--text);
  color: var(--surface);
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
}

.confirm-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14.5px;
}
</style>
