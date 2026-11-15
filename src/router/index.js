import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import SchoolsView from '../views/SchoolsView.vue'
import SchoolDetailView from '../views/SchoolDetailView.vue'
import ProvincesView from '../views/ProvincesView.vue'
import MapView from '../views/MapView.vue'
import AboutView from '../views/AboutView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory('/educamz/'),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/escolas', name: 'schools', component: SchoolsView },
    { path: '/escolas/:id', name: 'school-detail', component: SchoolDetailView },
    { path: '/provincias', name: 'provinces', component: ProvincesView },
    { path: '/mapa', name: 'map', component: MapView },
    { path: '/sobre', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
