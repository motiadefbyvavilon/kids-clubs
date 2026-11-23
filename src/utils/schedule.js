export const WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function formatSlot(slot) {
  return `${WEEKDAYS_SHORT[slot.day]} ${slot.start}–${slot.end}`
}

export function formatSchedule(schedule) {
  return schedule.map(formatSlot).join(' · ')
}

/** Возраст ребёнка на сегодня по году рождения */
export function ageFromYear(birthYear) {
  return new Date().getFullYear() - birthYear
}

export function plural(n, one, few, many) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function ageLabel(age) {
  return `${age} ${plural(age, 'год', 'года', 'лет')}`
}

export function priceLabel(price) {
  if (!price) return 'Бесплатно'
  return `${price.toLocaleString('ru-RU')} ₽/мес`
}
