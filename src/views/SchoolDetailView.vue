<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolsData } from '../composables/useSchoolsData'

const route = useRoute()
const { schools, loading, error, loadSchools } = useSchoolsData()
const school = computed(() => schools.value.find((item) => item.id === String(route.params.id)))
const typeClass = (type) => /priv/i.test(type) ? 'type-private' : /p[uú]blic/i.test(type) ? 'type-public' : 'type-unknown'

void loadSchools().catch((cause) => console.error('Falha ao carregar os detalhes da escola:', cause))
</script>

<template>
  <div v-if="school" class="inner-page detail-page">
    <RouterLink to="/escolas" class="back-link"><i class="bi bi-arrow-left"></i> Voltar às instituições</RouterLink>
    <section class="detail-hero">
      <img src="../assets/images/school-campus.svg" alt="Ilustração de uma escola" class="detail-cover" />
      <div class="detail-title"><span class="school-type" :class="typeClass(school.type)">{{ school.type }} <span>·</span> {{ school.level }}</span><h1>{{ school.name }}</h1><p><i class="bi bi-geo-alt"></i> {{ school.district }}<template v-if="school.province !== 'Não indicada'">, {{ school.province }}</template></p></div>
    </section>
    <div class="detail-layout">
      <section class="content-panel detail-description"><span class="eyebrow">INFORMAÇÃO DA API</span><h2>{{ school.name }}</h2><p>{{ school.description || 'A API não forneceu uma descrição para esta instituição.' }}</p><h3>Localização</h3><p><i class="bi bi-geo-alt detail-inline-icon"></i>{{ school.address || 'Endereço não indicado pela API.' }}<br />{{ school.district }}<template v-if="school.province !== 'Não indicada'">, {{ school.province }}</template></p><RouterLink :to="{ name: 'map', query: { school: school.id } }" class="details-link map-detail-link"><i class="bi bi-map"></i> Ver localização no mapa <i class="bi bi-arrow-right"></i></RouterLink></section>
      <aside class="content-panel detail-facts"><h2>Informações gerais</h2><div class="fact-row"><span><i class="bi bi-geo-alt"></i> Província</span><strong>{{ school.province }}</strong></div><div class="fact-row"><span><i class="bi bi-pin-map"></i> Distrito</span><strong>{{ school.district }}</strong></div><div class="fact-row"><span><i class="bi bi-book"></i> Nível de ensino</span><strong>{{ school.level }}</strong></div><div class="fact-row"><span><i class="bi bi-building"></i> Tipo</span><strong>{{ school.type }}</strong></div><div v-if="Number.isFinite(school.latitude) && Number.isFinite(school.longitude)" class="fact-row"><span><i class="bi bi-crosshair"></i> Coordenadas</span><strong>{{ school.latitude.toFixed(5) }}, {{ school.longitude.toFixed(5) }}</strong></div><span class="fact-demo"><i class="bi bi-cloud-check"></i> Dados fornecidos pela API</span></aside>
    </div>
  </div>
  <div v-else-if="loading" class="inner-page api-state"><div class="spinner-border spinner-border-sm text-success" role="status"></div><span>A carregar os detalhes da instituição...</span></div>
  <div v-else-if="error" class="inner-page api-state api-error"><i class="bi bi-cloud-slash"></i><div><strong>Não foi possível carregar esta instituição</strong><p>{{ error }}</p><RouterLink to="/escolas" class="btn-outline-custom">Voltar às escolas</RouterLink></div></div>
  <div v-else class="inner-page not-found-inline"><i class="bi bi-building-exclamation"></i><h1>Instituição não encontrada</h1><p>Não foi encontrada uma instituição com este identificador na API.</p><RouterLink to="/escolas" class="btn-primary-custom">Voltar às escolas</RouterLink></div>
</template>
