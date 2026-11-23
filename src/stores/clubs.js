import { defineStore } from 'pinia'
import { ageFromYear } from '../utils/schedule'

const STORAGE_KEY = 'kruzhokryadom-state-v1'

export const CATEGORIES = ['Спорт', 'Творчество', 'Техника', 'Музыка', 'Языки', 'Танцы']

export const CATEGORY_COLORS = {
  'Спорт': { fg: 'var(--p-teal-600)', bg: 'var(--p-teal-100)' },
  'Творчество': { fg: 'var(--p-coral-600)', bg: 'var(--p-coral-100)' },
  'Техника': { fg: 'var(--p-blue-600)', bg: 'var(--p-blue-100)' },
  'Музыка': { fg: 'var(--p-violet-600)', bg: 'var(--p-violet-100)' },
  'Языки': { fg: 'var(--p-amber-600)', bg: 'var(--p-amber-100)' },
  'Танцы': { fg: 'var(--p-coral-700)', bg: 'var(--p-coral-100)' },
}

let idSeq = 100
function nextId(prefix) {
  idSeq += 1
  return `${prefix}-${idSeq}`
}

function seedClubs() {
  return [
    {
      id: 'c-1', name: 'Юный робототехник', category: 'Техника',
      description: 'Сборка и программирование роботов на Arduino и LEGO Mindstorms. От простых схем до участия в городских соревнованиях.',
      ageMin: 8, ageMax: 14, teacher: 'Сергей Воронцов', format: 'Офлайн',
      address: 'ул. Ленина, 12, каб. 204', price: 3500,
      schedule: [{ day: 1, start: '17:00', end: '18:30' }, { day: 4, start: '17:00', end: '18:30' }],
      seatsTotal: 12, seatsTaken: 9,
    },
    {
      id: 'c-2', name: 'Акварельная студия', category: 'Творчество',
      description: 'Живопись акварелью и гуашью: композиция, цветоведение, пленэры. Выставка работ в конце каждого модуля.',
      ageMin: 6, ageMax: 12, teacher: 'Елена Морозова', format: 'Офлайн',
      address: 'пр. Мира, 45, Дом творчества', price: 2800,
      schedule: [{ day: 2, start: '16:00', end: '17:30' }, { day: 5, start: '16:00', end: '17:30' }],
      seatsTotal: 15, seatsTaken: 6,
    },
    {
      id: 'c-3', name: 'Детский футбол', category: 'Спорт',
      description: 'Тренировки по футболу для начинающих: техника владения мячом, командная игра, участие в детской лиге района.',
      ageMin: 7, ageMax: 13, teacher: 'Андрей Ковалёв', format: 'Офлайн',
      address: 'Стадион «Труд», поле 2', price: 3000,
      schedule: [{ day: 0, start: '18:00', end: '19:30' }, { day: 3, start: '18:00', end: '19:30' }],
      seatsTotal: 20, seatsTaken: 17,
    },
    {
      id: 'c-4', name: 'Скрипка с нуля', category: 'Музыка',
      description: 'Индивидуально-групповые занятия скрипкой: постановка рук, нотная грамота, ансамблевое музицирование.',
      ageMin: 5, ageMax: 10, teacher: 'Ольга Штерн', format: 'Офлайн',
      address: 'ул. Гагарина, 8, музшкола №2', price: 4200,
      schedule: [{ day: 1, start: '15:30', end: '16:30' }, { day: 4, start: '15:30', end: '16:30' }],
      seatsTotal: 8, seatsTaken: 8,
    },
    {
      id: 'c-5', name: 'Английский через игру', category: 'Языки',
      description: 'Разговорный английский в игровом формате: ролевые игры, песни, мультфильмы. Группы по уровню владения.',
      ageMin: 6, ageMax: 11, teacher: 'Марина Фёдорова', format: 'Онлайн',
      address: 'Zoom', price: 3200,
      schedule: [{ day: 2, start: '17:30', end: '18:30' }, { day: 5, start: '17:30', end: '18:30' }],
      seatsTotal: 10, seatsTaken: 4,
    },
    {
      id: 'c-6', name: 'Хип-хоп для детей', category: 'Танцы',
      description: 'Современная хореография: база хип-хопа, связки, баттлы. Съёмка танцевального клипа в конце сезона.',
      ageMin: 8, ageMax: 15, teacher: 'Дмитрий «Дым» Орлов', format: 'Офлайн',
      address: 'ул. Советская, 21, студия Move', price: 2700,
      schedule: [{ day: 0, start: '19:00', end: '20:00' }, { day: 2, start: '19:00', end: '20:00' }],
      seatsTotal: 16, seatsTaken: 11,
    },
    {
      id: 'c-7', name: 'Программирование на Python', category: 'Техника',
      description: 'Первые шаги в коде: игры на Python, черепашья графика, свои чат-боты. Онлайн с живым преподавателем.',
      ageMin: 10, ageMax: 15, teacher: 'Игорь Савельев', format: 'Онлайн',
      address: 'Zoom', price: 4500,
      schedule: [{ day: 3, start: '18:00', end: '19:30' }, { day: 6, start: '11:00', end: '12:30' }],
      seatsTotal: 10, seatsTaken: 7,
    },
    {
      id: 'c-8', name: 'Гимнастика художественная', category: 'Спорт',
      description: 'Гибкость, координация, работа с предметами. Подготовка к городским турнирам по художественной гимнастике.',
      ageMin: 5, ageMax: 9, teacher: 'Наталья Белова', format: 'Офлайн',
      address: 'ФОК «Олимп», зал 3', price: 3800,
      schedule: [{ day: 0, start: '16:00', end: '17:30' }, { day: 2, start: '16:00', end: '17:30' }, { day: 4, start: '16:00', end: '17:30' }],
      seatsTotal: 12, seatsTaken: 12,
    },
    {
      id: 'c-9', name: 'Лепка и керамика', category: 'Творчество',
      description: 'Работа с глиной: лепка, гончарный круг, обжиг и роспись изделий. Каждое изделие ребёнок забирает домой.',
      ageMin: 4, ageMax: 9, teacher: 'Анна Глинкина', format: 'Офлайн',
      address: 'ул. Ленина, 12, мастерская 1', price: 3300,
      schedule: [{ day: 6, start: '10:00', end: '11:30' }],
      seatsTotal: 10, seatsTaken: 3,
    },
    {
      id: 'c-10', name: 'Хор «Солнышко»', category: 'Музыка',
      description: 'Хоровое пение: дыхание, слух, репертуар от народных песен до саундтреков. Концерты дважды в сезон.',
      ageMin: 6, ageMax: 12, teacher: 'Пётр Звонарёв', format: 'Офлайн',
      address: 'ул. Гагарина, 8, музшкола №2', price: 0,
      schedule: [{ day: 1, start: '18:00', end: '19:00' }, { day: 4, start: '18:00', end: '19:00' }],
      seatsTotal: 25, seatsTaken: 14,
    },
    {
      id: 'c-11', name: 'Китайский для малышей', category: 'Языки',
      description: 'Погружение в китайский язык через иероглифические игры, песни и поделки. Без домашних заданий.',
      ageMin: 7, ageMax: 12, teacher: 'Ли Вэй', format: 'Онлайн',
      address: 'Zoom', price: 3900,
      schedule: [{ day: 2, start: '18:30', end: '19:30' }],
      seatsTotal: 8, seatsTaken: 2,
    },
    {
      id: 'c-12', name: 'Бальный зал', category: 'Танцы',
      description: 'Бальные танцы: вальс, полькa, ча-ча-ча. Постановка пары к выпускному балу школы.',
      ageMin: 9, ageMax: 14, teacher: 'Екатерина Ланская', format: 'Офлайн',
      address: 'ДК «Юность», большой зал', price: 2500,
      schedule: [{ day: 5, start: '18:00', end: '19:30' }, { day: 6, start: '12:00', end: '13:30' }],
      seatsTotal: 20, seatsTaken: 9,
    },
  ]
}

function seedChildren() {
  return [
    { id: 'ch-1', name: 'Миша', birthYear: new Date().getFullYear() - 9, interests: ['Техника', 'Спорт'] },
    { id: 'ch-2', name: 'Алиса', birthYear: new Date().getFullYear() - 6, interests: ['Творчество', 'Музыка'] },
  ]
}

function load() {
  const fallback = { clubs: seedClubs(), children: seedChildren(), enrollments: [], favorites: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.clubs)) return fallback
    return { enrollments: [], favorites: [], children: seedChildren(), ...parsed }
  } catch {
    return fallback
  }
}

export const useClubsStore = defineStore('clubs', {
  state: () => ({
    ...load(),
    toasts: [],
  }),

  getters: {
    clubById: (s) => (id) => s.clubs.find((c) => c.id === id) || null,
    childById: (s) => (id) => s.children.find((c) => c.id === id) || null,

    seatsLeft: () => (club) => club.seatsTotal - club.seatsTaken,

    enrollmentsForChild: (s) => (childId) =>
      s.enrollments.filter((e) => e.childId === childId && e.status === 'active'),

    isFavorite: (s) => (clubId) => s.favorites.includes(clubId),
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          clubs: this.clubs,
          children: this.children,
          enrollments: this.enrollments,
          favorites: this.favorites,
        }),
      )
    },

    /** Записать ребёнка на кружок. Возвращает { ok, error? } */
    enroll(clubId, childId) {
      const club = this.clubById(clubId)
      const child = this.childById(childId)
      if (!club || !child) return { ok: false, error: 'Кружок или ребёнок не найден' }

      const age = ageFromYear(child.birthYear)
      if (age < club.ageMin || age > club.ageMax) {
        return { ok: false, error: `Возраст не подходит: кружок для детей ${club.ageMin}–${club.ageMax} лет, ребёнку ${age}` }
      }
      if (this.seatsLeft(club) <= 0) {
        return { ok: false, error: 'Свободных мест не осталось' }
      }
      const duplicate = this.enrollments.find(
        (e) => e.clubId === clubId && e.childId === childId && e.status === 'active',
      )
      if (duplicate) {
        return { ok: false, error: `${child.name} уже записан(а) на этот кружок` }
      }
      // Проверка пересечения по расписанию с другими кружками ребёнка
      const busy = this.enrollmentsForChild(childId)
        .map((e) => this.clubById(e.clubId))
        .filter(Boolean)
      for (const other of busy) {
        for (const s1 of club.schedule) {
          for (const s2 of other.schedule) {
            if (s1.day === s2.day && s1.start < s2.end && s2.start < s1.end) {
              return {
                ok: false,
                error: `Пересечение по времени с «${other.name}» (${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][s1.day]} ${s2.start}–${s2.end})`,
              }
            }
          }
        }
      }

      this.enrollments.push({
        id: nextId('e'),
        clubId,
        childId,
        status: 'active',
        createdAt: new Date().toISOString(),
      })
      club.seatsTaken += 1
      this.persist()
      this.pushToast(`${child.name} записан(а) на «${club.name}»`, 'success')
      return { ok: true }
    },

    cancelEnrollment(enrollmentId) {
      const e = this.enrollments.find((x) => x.id === enrollmentId)
      if (!e) return
      const club = this.clubById(e.clubId)
      const child = this.childById(e.childId)
      e.status = 'cancelled'
      if (club) club.seatsTaken = Math.max(0, club.seatsTaken - 1)
      this.persist()
      this.pushToast(`Запись ${child ? child.name : ''} на «${club ? club.name : ''}» отменена`, 'success')
    },

    toggleFavorite(clubId) {
      if (this.favorites.includes(clubId)) {
        this.favorites = this.favorites.filter((id) => id !== clubId)
      } else {
        this.favorites.push(clubId)
      }
      this.persist()
    },

    saveChild(payload) {
      if (!payload.name?.trim()) return { ok: false, error: 'Укажите имя ребёнка' }
      const year = Number(payload.birthYear)
      const now = new Date().getFullYear()
      if (!year || year < now - 17 || year > now - 3) {
        return { ok: false, error: 'Укажите год рождения (возраст от 3 до 17 лет)' }
      }
      if (payload.id) {
        const idx = this.children.findIndex((c) => c.id === payload.id)
        if (idx === -1) return { ok: false, error: 'Ребёнок не найден' }
        this.children[idx] = { ...this.children[idx], ...payload, birthYear: year, name: payload.name.trim() }
        this.pushToast('Профиль ребёнка обновлён', 'success')
      } else {
        this.children.push({
          id: nextId('ch'),
          interests: [],
          ...payload,
          birthYear: year,
          name: payload.name.trim(),
        })
        this.pushToast('Ребёнок добавлен', 'success')
      }
      this.persist()
      return { ok: true }
    },

    deleteChild(childId) {
      this.enrollmentsForChild(childId).forEach((e) => this.cancelEnrollment(e.id))
      this.children = this.children.filter((c) => c.id !== childId)
      this.persist()
    },

    pushToast(text, tone = 'info') {
      const id = nextId('t')
      this.toasts.push({ id, text, tone })
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id)
      }, 4200)
    },
  },
})
