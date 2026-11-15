<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProvinceCard from '../components/provinces/ProvinceCard.vue'
import { useSchoolsData } from '../composables/useSchoolsData'
import { provinceMetadata } from '../data/provinceMetadata'

const router = useRouter()
const search = ref('')
const { schools, loading, error, loadSchools } = useSchoolsData()
const provinceList = computed(() => {
  const counts = schools.value.reduce((result, school) => {
    if (school.province !== 'Não indicada') {
      result[school.province] ??= { institutions: 0, districts: new Set() }
      result[school.province].institutions++
      if (school.district !== 'Não indicado') result[school.province].districts.add(school.district)
    }
    return result
  }, {})

  return Object.entries(counts).map(([name, data]) => ({
    ...provinceMetadata.find((item) => item.name === name),
    name,
    institutions: data.institutions,
    districts: [...data.districts],
  }))
})
const filteredProvinces = computed(() => provinceList.value.filter((province) => province.name.toLocaleLowerCase('pt').includes(search.value.trim().toLocaleLowerCase('pt'))))

function exploreProvince(name) {
  router.push({ name: 'schools', query: { provincia: name } })
}

void loadSchools().catch((cause) => console.error('Falha ao carregar províncias das escolas:', cause))
</script>

<template>
  <div class="inner-page">
    <section class="page-intro"><div><span class="eyebrow">EXPLORE MOÇAMBIQUE</span><h1>Conheça as províncias.</h1><p>Províncias identificadas nos registos de escolas devolvidos pela API.</p></div><span class="data-badge"><i class="bi bi-cloud-check"></i> Dados da API</span></section>
    <div v-if="loading && !schools.length" class="api-state"><div class="spinner-border spinner-border-sm text-success" role="status"></div><span>A carregar províncias...</span></div>
    <div v-else-if="error && !schools.length" class="api-state api-error"><i class="bi bi-cloud-slash"></i><div><strong>Não foi possível carregar as províncias</strong><p>{{ error }}</p><button class="btn-outline-custom" @click="loadSchools({ refresh: true }).catch((cause) => console.error('Falha ao actualizar províncias:', cause))">Tentar novamente</button></div></div>
    <template v-else>
      <div class="province-search"><i class="bi bi-search"></i><input v-model="search" placeholder="Pesquisar província..." aria-label="Pesquisar província" /><span>{{ filteredProvinces.length }} províncias</span></div>
      <section v-if="filteredProvinces.length" class="provinces-grid"><ProvinceCard v-for="province in filteredProvinces" :key="province.name" :province="province" @explore="exploreProvince" /></section>
      <div v-else class="empty-state province-empty"><span><i class="bi bi-geo-alt"></i></span><h3>{{ provinceList.length ? 'Não encontrámos essa província' : 'A API não indicou províncias' }}</h3><p>{{ provinceList.length ? 'Experimente pesquisar por outro nome.' : 'Não há dados de localização disponíveis nos registos carregados.' }}</p></div>
      <div class="province-note"><i class="bi bi-info-circle"></i><span>Os números indicam apenas escolas devolvidas pela API, não o total oficial de instituições da província.</span></div>
    </template>
  </div>
</template>
