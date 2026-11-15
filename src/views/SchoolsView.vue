<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '../components/schools/SearchBar.vue'
import FilterPanel from '../components/schools/FilterPanel.vue'
import SchoolCard from '../components/schools/SchoolCard.vue'
import { useSchoolFilters } from '../composables/useSchoolFilters'
import { useSchoolsData } from '../composables/useSchoolsData'

const route = useRoute()
const { schools, loading, error, loadSchools } = useSchoolsData()
const filters = useSchoolFilters(schools, 6)
const provinceOptions = computed(() => [...new Set(schools.value.map((school) => school.province))]
  .filter((province) => province !== 'Não indicada')
  .sort()
  .map((name) => ({ name })))

watch(() => route.query.q, (query) => {
  filters.search.value = typeof query === 'string' ? query : ''
  filters.page.value = 1
}, { immediate: true })
watch(() => route.query.provincia, (province) => {
  filters.setProvince(typeof province === 'string' && provinceOptions.value.some((item) => item.name === province) ? province : '')
}, { immediate: true })

void loadSchools().catch((cause) => console.error('Falha ao carregar o catálogo de escolas:', cause))
</script>

<template>
  <div class="inner-page">
    <section class="page-intro"><div><span class="eyebrow">CATÁLOGO DE INSTITUIÇÕES</span><h1>Encontre a escola certa.</h1><p>Pesquise as instituições devolvidas pela API de escolas de Moçambique.</p></div><span class="data-badge"><i class="bi bi-cloud-check"></i> Dados da API</span></section>
    <div v-if="loading && !schools.length" class="api-state"><div class="spinner-border spinner-border-sm text-success" role="status"></div><span>A carregar instituições...</span></div>
    <div v-else-if="error && !schools.length" class="api-state api-error"><i class="bi bi-cloud-slash"></i><div><strong>Não foi possível carregar as escolas</strong><p>{{ error }}</p><button class="btn-outline-custom" @click="loadSchools({ refresh: true }).catch((cause) => console.error('Falha ao actualizar o catálogo:', cause))">Tentar novamente</button></div></div>
    <div v-else class="school-explorer">
      <aside class="filters-column"><FilterPanel :provinces="provinceOptions" :districts="filters.districts.value" :province="filters.province.value" :district="filters.district.value" :level="filters.level.value" @update:province="filters.setProvince" @update:district="filters.district.value = $event; filters.page.value = 1" @update:level="filters.level.value = $event; filters.page.value = 1" @reset="filters.resetFilters" /></aside>
      <section class="results-column">
        <SearchBar v-model="filters.search.value" placeholder="Pesquisar pelo nome, distrito ou província..." />
        <div class="results-meta"><span><strong>{{ filters.filteredSchools.value.length }}</strong> instituições na API</span><span>Ordenação: <strong>Relevância</strong> <i class="bi bi-chevron-down"></i></span></div>
        <div v-if="filters.paginatedSchools.value.length" class="schools-grid">
          <SchoolCard v-for="school in filters.paginatedSchools.value" :key="school.id" :school="school" />
        </div>
        <div v-else class="empty-state"><span><i class="bi bi-search"></i></span><h3>Nenhuma instituição encontrada</h3><p>Tente alterar os filtros ou pesquisar por outro termo.</p><button class="btn-outline-custom" @click="filters.resetFilters">Limpar filtros</button></div>
        <div v-if="filters.filteredSchools.value.length" class="pagination-row">
          <span>A mostrar {{ (filters.page.value - 1) * 6 + 1 }}–{{ Math.min(filters.page.value * 6, filters.filteredSchools.value.length) }} de {{ filters.filteredSchools.value.length }}</span>
          <div class="pagination-controls"><button aria-label="Página anterior" :disabled="filters.page.value === 1" @click="filters.page.value--"><i class="bi bi-chevron-left"></i></button><button v-for="number in filters.pageCount.value" :key="number" :class="{ active: filters.page.value === number }" @click="filters.page.value = number">{{ number }}</button><button aria-label="Página seguinte" :disabled="filters.page.value === filters.pageCount.value" @click="filters.page.value++"><i class="bi bi-chevron-right"></i></button></div>
        </div>
        <p v-if="error" class="inline-api-error"><i class="bi bi-exclamation-circle"></i>{{ error }} A mostrar os dados carregados anteriormente.</p>
        <p class="api-attribution">Fonte: API de escolas de Moçambique.</p>
      </section>
    </div>
  </div>
</template>
