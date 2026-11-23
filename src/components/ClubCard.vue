<script setup>
import { computed } from 'vue'
import { useClubsStore, CATEGORY_COLORS } from '../stores/clubs'
import { formatSchedule, priceLabel, plural } from '../utils/schedule'

const props = defineProps({
  club: { type: Object, required: true },
})

const store = useClubsStore()

const catStyle = computed(() => CATEGORY_COLORS[props.club.category] || {})
const left = computed(() => store.seatsLeft(props.club))
const isFav = computed(() => store.isFavorite(props.club.id))
</script>

<template>
  <article class="card club-card">
    <div class="club-top">
      <span class="badge cat" :style="{ color: catStyle.fg, background: catStyle.bg }">{{ club.category }}</span>
      <button
        class="fav"
        type="button"
        :aria-pressed="isFav"
        :aria-label="isFav ? 'Убрать из избранного' : 'В избранное'"
        @click="store.toggleFavorite(club.id)"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" :fill="isFav ? 'currentColor' : 'none'" aria-hidden="true">
          <path
            d="M10 17.2s-6.4-3.9-7.9-8.1C.9 5.9 2.9 3 5.9 3c1.7 0 3.2.9 4.1 2.3C10.9 3.9 12.4 3 14.1 3c3 0 5 2.9 3.8 6.1-1.5 4.2-7.9 8.1-7.9 8.1Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <h3 class="club-name">
      <RouterLink :to="`/club/${club.id}`">{{ club.name }}</RouterLink>
    </h3>

    <p class="club-desc">{{ club.description }}</p>

    <dl class="club-meta">
      <div><dt>Возраст</dt><dd>{{ club.ageMin }}–{{ club.ageMax }} лет</dd></div>
      <div><dt>Формат</dt><dd>{{ club.format }}</dd></div>
      <div><dt>Цена</dt><dd>{{ priceLabel(club.price) }}</dd></div>
    </dl>

    <p class="club-schedule">{{ formatSchedule(club.schedule) }}</p>

    <footer class="club-foot">
      <span class="seats" :class="{ few: left <= 2, none: left === 0 }">
        {{ left === 0 ? 'Мест нет' : `Осталось ${left} ${plural(left, 'место', 'места', 'мест')}` }}
      </span>
      <RouterLink class="btn btn-primary btn-sm" :to="`/club/${club.id}`">Подробнее</RouterLink>
    </footer>
  </article>
</template>

<style scoped>
.club-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
}

.club-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-pop);
}

.club-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.fav:hover {
  color: var(--accent);
  transform: scale(1.12);
}

.fav[aria-pressed='true'] {
  color: var(--accent);
}

.club-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.club-name a {
  color: inherit;
  text-decoration: none;
}

.club-name a:hover {
  color: var(--accent-strong);
}

.club-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.club-meta {
  display: flex;
  gap: 18px;
  margin: 0;
  flex-wrap: wrap;
}

.club-meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  font-weight: 600;
}

.club-meta dd {
  margin: 1px 0 0;
  font-size: 13.5px;
  font-weight: 600;
}

.club-schedule {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-secondary);
}

.club-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 6px;
}

.seats {
  font-size: 13px;
  font-weight: 600;
  color: var(--p-teal-600);
}

.seats.few {
  color: var(--p-amber-600);
}

.seats.none {
  color: var(--danger);
}
</style>
