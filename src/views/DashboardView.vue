<script setup>
import { computed } from 'vue'
import StatCard from '../components/dashboard/StatCard.vue'
import ChartCard from '../components/dashboard/ChartCard.vue'
import { useSchoolsData } from '../composables/useSchoolsData'
import { provinceMetadata } from '../data/provinceMetadata'

const { schools, loading, error, loadSchools } = useSchoolsData()
const countBy = (selector) => schools.value.reduce((counts, school) => {
  const key = selector(school)
  if (key) counts[key] = (counts[key] ?? 0) + 1
  return counts
}, {})
const provinceCounts = computed(() => countBy((school) => school.province !== 'Não indicada' ? school.province : ''))
const levelCounts = computed(() => countBy((school) => school.level !== 'Não especificado' ? school.level : ''))
const primaryCount = computed(() => Object.entries(levelCounts.value).filter(([level]) => /prim/i.test(level)).reduce((sum, [, count]) => sum + count, 0))
const secondaryCount = computed(() => Object.entries(levelCounts.value).filter(([level]) => /secund|high/i.test(level)).reduce((sum, [, count]) => sum + count, 0))
const schoolsValue = computed(() => loading.value && !schools.value.length ? '—' : schools.value.length.toLocaleString('pt'))
const provinceValue = computed(() => Object.keys(provinceCounts.value).length.toLocaleString('pt'))
const barData = computed(() => {
  const entries = Object.entries(provinceCounts.value).sort((a, b) => b[1] - a[1]).slice(0, 8)
  return {
    labels: entries.map(([province]) => province),
    datasets: [{ data: entries.map(([, count]) => count), backgroundColor: ['#16a34a', '#56bd78', '#81d29a', '#a8dfb8', '#bbe7c7', '#c8ebd1', '#d2efda', '#ddf2e2'], borderRadius: 5, maxBarThickness: 26 }],
  }
})
const levelData = computed(() => {
  const entries = Object.entries(levelCounts.value).sort((a, b) => b[1] - a[1]).slice(0, 5)
  return { labels: entries.map(([level]) => level), datasets: [{ data: entries.map(([, count]) => count), backgroundColor: ['#16a34a', '#dcfce7', '#f4c985', '#b9c9f5', '#d9c7ed'], borderWidth: 0, hoverOffset: 4 }] }
})
const recentSchools = computed(() => schools.value.slice(0, 4))
const featuredProvinces = computed(() => Object.entries(provinceCounts.value)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([name, institutions]) => ({
    ...provinceMetadata.find((item) => item.name === name),
    name,
    institutions,
  })))

void loadSchools().catch((cause) => console.error('Falha ao carregar o resumo das escolas:', cause))
</script>

<template>
  <div class="dashboard-page">
    <section class="welcome-banner">
      <div class="welcome-copy">
        <span class="eyebrow"><span class="status-dot"></span> GUIA DE EDUCAÇÃO DE MOÇAMBIQUE</span>
        <h1>Educação mais perto,<br /><span>oportunidades para todos.</span></h1>
        <p>Explore instituições de ensino e descubra o panorama educativo de Moçambique.</p>
        <RouterLink to="/escolas" class="btn-primary-custom">Explorar instituições <i class="bi bi-arrow-right"></i></RouterLink>
      </div>
      <div class="welcome-art" aria-hidden="true">
        <div class="art-sun"></div><div class="art-book"><i class="bi bi-book-half"></i></div>
        <span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✦</span>
        <div class="art-caption"><i class="bi bi-geo-alt-fill"></i> Moçambique, um país de conhecimento</div>
      </div>
      <div class="banner-grain"></div>
    </section>

    <div class="section-heading dashboard-heading"><div><h2>Panorama da API</h2><p>Resumo calculado a partir das instituições carregadas</p></div><span class="data-badge"><i class="bi bi-cloud-check"></i> Dados da API</span></div>
    <div v-if="error && !schools.length" class="api-state api-error"><i class="bi bi-cloud-slash"></i><div><strong>Não foi possível carregar o panorama</strong><p>{{ error }}</p><button class="btn-outline-custom" @click="loadSchools({ refresh: true }).catch((cause) => console.error('Falha ao actualizar o resumo:', cause))">Tentar novamente</button></div></div>
    <div v-else>
      <section class="stats-grid">
        <StatCard title="Instituições na API" :value="schoolsValue" icon="bi-mortarboard" tone="green" caption="Registos carregados" />
        <StatCard title="Províncias" :value="provinceValue" icon="bi-geo-alt" tone="blue" caption="Identificadas na API" />
        <StatCard title="Ensino primário" :value="primaryCount.toLocaleString('pt')" icon="bi-book" tone="orange" caption="Classificados na API" />
        <StatCard title="Ensino secundário" :value="secondaryCount.toLocaleString('pt')" icon="bi-journal-bookmark" tone="purple" caption="Classificados na API" />
      </section>
      <div class="charts-grid">
        <ChartCard title="Distribuição por província" subtitle="Contagem dos registos carregados da API" :chart-data="barData" />
        <ChartCard title="Instituições por nível" subtitle="Distribuição dos níveis identificados na API" :chart-data="levelData" type="doughnut" />
      </div>
      <section class="lower-grid">
        <div class="content-panel">
          <div class="panel-heading"><div><h2>Instituições da API</h2><p>Escolas devolvidas pela fonte de dados</p></div><RouterLink to="/escolas">Ver todas <i class="bi bi-arrow-right"></i></RouterLink></div>
          <div v-if="loading && !schools.length" class="api-state compact-state"><div class="spinner-border spinner-border-sm text-success" role="status"></div><span>A carregar instituições...</span></div>
          <div v-else-if="recentSchools.length" class="recent-list">
            <RouterLink v-for="school in recentSchools" :key="school.id" :to="`/escolas/${encodeURIComponent(school.id)}`" class="recent-school">
              <span class="recent-icon"><i :class="`bi ${school.icon}`"></i></span>
              <span class="recent-name"><strong>{{ school.name }}</strong><small>{{ school.district }}, {{ school.province }}</small></span>
              <span class="recent-level">{{ school.level }}</span><i class="bi bi-chevron-right recent-chevron"></i>
            </RouterLink>
          </div>
          <p v-else class="empty-inline">A API ainda não devolveu instituições.</p>
        </div>
        <div class="content-panel featured-provinces">
          <div class="panel-heading"><div><h2>Províncias em destaque</h2><p>Com base nos registos da API</p></div><RouterLink to="/provincias">Ver todas</RouterLink></div>
          <RouterLink v-for="province in featuredProvinces" :key="province.name" :to="{ name: 'schools', query: { provincia: province.name } }" class="featured-province">
            <span class="mini-province-icon" :style="{ backgroundColor: province.color ?? '#edf8ef' }"><i :class="`bi ${province.icon ?? 'bi-geo-alt'}`"></i></span>
            <span><strong>{{ province.name }}</strong><small>{{ province.institutions }} registos na API</small></span>
            <i class="bi bi-arrow-up-right"></i>
          </RouterLink>
          <p v-if="!featuredProvinces.length" class="empty-inline">As províncias serão apresentadas quando a API estiver disponível.</p>
        </div>
      </section>
      <p class="api-attribution"><i class="bi bi-info-circle"></i> Os totais referem-se apenas aos registos devolvidos pela API; não são estatísticas oficiais do país.</p>
    </div>
  </div>
</template>
