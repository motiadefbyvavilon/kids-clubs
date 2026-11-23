import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'
import ClubDetailView from '../views/ClubDetailView.vue'
import ChildrenView from '../views/ChildrenView.vue'
import ScheduleView from '../views/ScheduleView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'catalog', component: CatalogView, meta: { title: 'Каталог кружков' } },
    { path: '/club/:id', name: 'club', component: ClubDetailView, meta: { title: 'Кружок' } },
    { path: '/children', name: 'children', component: ChildrenView, meta: { title: 'Мои дети' } },
    { path: '/schedule', name: 'schedule', component: ScheduleView, meta: { title: 'Расписание' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title} — КружокРядом`
})
