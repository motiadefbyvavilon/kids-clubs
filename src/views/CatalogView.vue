<script setup>
import { computed, reactive, ref } from 'vue'
import { useClubsStore, CATEGORIES, CATEGORY_COLORS } from '../stores/clubs'
import ClubCard from '../components/ClubCard.vue'

const store = useClubsStore()

const query = ref('')
const filters = reactive({
  category: '',
  format: '',
  age: '',
  freeOnly: false,
  favoritesOnly: false,
  seatsOnly: false,
})
const sort = ref('name')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = store.clubs.filter((c) => {
    if (q && !`${c.name} ${c.description} ${c.teacher} ${c.category}`.toLowerCase().includes(q)) return false
    if (filters.category && c.category !== filters.category) return false
    if (filters.format && c.format !== filters.format) return false
    if (filters.age) {
      const a = Number(filters.age)
      if (a < c.ageMin || a > c.ageMax) return false
    }
    if (filters.freeOnly && c.price > 0) return false
    if (filters.favoritesOnly && !store.isFavorite(c.id)) return false
    if (filters.seatsOnly && store.seatsLeft(c) <= 0) return false
    return true
  })
  const by = {
    name: (a, b) => a.name.localeCompare(b.name, 'ru'),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    age: (a, b) => a.ageMin - b.ageMin,
  }
  return [...list].sort(by[sort.value])
})

function resetFilters() {
  query.value = ''
  Object.assign(filters, { category: '', format: '', age: '', freeOnly: false, favoritesOnly: false, seatsOnly: false })
}

const hasActiveFilters = computed(
  () =>
    query.value ||
    filters.category ||
    filters.format ||
    filters.age ||
    filters.freeOnly ||
    filters.favoritesOnly ||
    filters.seatsOnly,
)
</script>

<template>
  <section class="catalog">
    <header class="page-head">
      <h1>Найдите кружок по интересам</h1>
      <p class="subtitle">{{ store.clubs.length }} кружков в каталоге · поиск, фильтры и запись онлайн</p>
    </header>

    <div class="toolbar card">
      <div class="search-row">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.6" />
            <path d="m12.5 12.5 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <input v-model="query" type="search" placeholder="Название, преподаватель, направление…" aria-label="Поиск по кружкам" />
        </div>
        <select v-model="sort" class="sort" aria-label="Сортировка">
          <option value="name">По названию</option>
          <option value="priceAsc">Сначала дешевле</option>
          <option value="priceDesc">Сначала дороже</option>
          <option value="age">По возрасту</option>
        </select>
      </div>

      <div class="chips" role="group" aria-label="Категории">
        <button
          class="chip"
          :class="{ active: filters.category === '' }"
          type="button"
          @click="filters.category = ''"
        >
          Все
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          class="chip"
          :class="{ active: filters.category === cat }"
          :style="filters.category === cat ? { background: CATEGORY_COLORS[cat].fg, borderColor: CATEGORY_COLORS[cat].fg } : {}"
          type="button"
          @click="filters.category = filters.category === cat ? '' : cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="filter-row">
        <select v-model="filters.format" aria-label="Формат">
          <option value="">Любой формат</option>
          <option value="Офлайн">Офлайн</option>
          <option value="Онлайн">Онлайн</option>
        </select>
        <select v-model="filters.age" aria-label="Возраст ребёнка">
          <option value="">Любой возраст</option>
          <option v-for="a in [4,5,6,7,8,9,10,11,12,13,14,15]" :key="a" :value="a">{{ a }} лет</option>
        </select>
        <label class="check">
          <input v-model="filters.seatsOnly" type="checkbox" />
          Есть свободные места
        </label>
        <label class="check">
          <input v-model="filters.freeOnly" type="checkbox" />
          Бесплатные
        </label>
        <label class="check">
          <input v-model="filters.favoritesOnly" type="checkbox" />
          Избранное
        </label>
        <button v-if="hasActiveFilters" class="btn btn-ghost btn-sm reset" type="button" @click="resetFilters">
          Сбросить
        </button>
      </div>
    </div>

    <div v-if="filtered.length" class="grid">
      <ClubCard v-for="club in filtered" :key="club.id" :club="club" />
    </div>

    <div v-else class="card empty">
      <svg width="44" height="44" viewBox="0 0 18 18" fill="none" aria-hidden="true" class="empty-icon">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4" />
        <path d="m12.5 12.5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      </svg>
      <p>По вашему запросу ничего не найдено. Попробуйте смягчить фильтры.</p>
      <button class="btn btn-ghost" type="button" @click="resetFilters">Сбросить фильтры</button>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-head h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 14.5px;
}

.toolbar {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-row {
  display: flex;
  gap: 10px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  background: var(--surface);
  padding: 0 14px;
  color: var(--text-faint);
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 0;
  font-size: 15px;
}

.search-box input:focus {
  outline: none;
}

.sort,
.filter-row select {
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  background: var(--surface);
  padding: 10px 12px;
  font-size: 14.5px;
  font-weight: 500;
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
  transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out;
}

.chip:hover {
  border-color: var(--text-faint);
  color: var(--text);
}

.chip.active {
  background: var(--text);
  border-color: var(--text);
  color: var(--surface);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.check input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
}

.reset {
  margin-left: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
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

.empty-icon {
  color: var(--text-faint);
}
</style>
