<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)
const pageTitle = computed(() => ({
  dashboard: 'Visão geral', schools: 'Escolas', 'school-detail': 'Detalhes da escola',
  provinces: 'Províncias', map: 'Mapa de instituições', about: 'Sobre o EducaMZ', 'not-found': 'Página não encontrada',
}[route.name] || 'EducaMZ'))

watch(() => route.fullPath, () => { mobileOpen.value = false })
function searchSchools(query) {
  router.push({ name: 'schools', query: { q: query } })
}
</script>

<template>
  <div class="app-shell">
    <Sidebar :mobile-open="mobileOpen" @close="mobileOpen = false" />
    <div class="main-shell">
      <Navbar @toggle-menu="mobileOpen = !mobileOpen" @search="searchSchools"><template>{{ pageTitle }}</template></Navbar>
      <main class="page-content"><RouterView /><Footer /></main>
    </div>
  </div>
</template>
