<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useSchoolsData } from '../composables/useSchoolsData'
import { findSchoolCoordinates } from '../services/geocodingApi'

const route = useRoute()
const { schools, loading, error, loadSchools } = useSchoolsData()
const mapElement = ref(null)
const locatedSchools = ref([])
const selectedSchool = ref(null)
const locating = ref(false)
const geocodingError = ref('')
const apiSchool = computed(() => schools.value.find((school) => school.id === String(route.query.school)))
let map
let markerLayer

function createPopup(school) {
  const content = document.createElement('div')
  content.className = 'school-map-popup'
  const name = document.createElement('strong')
  name.textContent = school.name
  const place = document.createElement('span')
  place.textContent = [school.district, school.province].filter((value) => value && value !== 'Não indicada' && value !== 'Não indicado').join(', ')
  const link = document.createElement('a')
  link.href = `#/escolas/${encodeURIComponent(school.id)}`
  link.textContent = 'Ver instituição'
  content.append(name, place, link)
  return content
}

function drawMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()
  for (const school of locatedSchools.value) {
    const marker = L.marker([school.latitude, school.longitude], {
      icon: L.divIcon({
        className: 'school-marker-wrap',
        html: '<span class="school-map-marker"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
      title: school.name,
    })
    marker.bindPopup(createPopup(school))
    marker.on('click', () => { selectedSchool.value = school })
    marker.addTo(markerLayer)
  }
}

function selectSchool(school) {
  selectedSchool.value = school
  map?.setView([school.latitude, school.longitude], 12, { animate: true })
  markerLayer?.eachLayer((marker) => {
    if (marker.options.title === school.name) marker.openPopup()
  })
}

async function prepareLocations() {
  if (schools.value.length === 0) return
  locating.value = true
  geocodingError.value = ''
  const records = [...schools.value].sort((a, b) => Number(Boolean(b.latitude && b.longitude)) - Number(Boolean(a.latitude && a.longitude)))
  const candidates = [
    ...records.filter((school) => Number.isFinite(school.latitude) && Number.isFinite(school.longitude)).slice(0, 40),
    ...records.filter((school) => !Number.isFinite(school.latitude) || !Number.isFinite(school.longitude)).slice(0, 15),
  ]
  const locations = []

  for (const school of candidates) {
    try {
      const coordinates = await findSchoolCoordinates(school)
      if (coordinates) locations.push({ ...school, ...coordinates })
    } catch (cause) {
      geocodingError.value = cause instanceof Error ? cause.message : 'A pesquisa geográfica falhou.'
      console.error(`Não foi possível localizar "${school.name}" no mapa:`, cause)
    }
    if (!school.latitude && !school.longitude) {
      await new Promise((resolve) => window.setTimeout(resolve, 300))
    }
  }

  locatedSchools.value = locations
  locating.value = false
  drawMarkers()

  const requestedSchool = schools.value.find((school) => school.id === String(route.query.school))
  const locatedRequestedSchool = locations.find((school) => school.id === requestedSchool?.id)
  if (locatedRequestedSchool) selectSchool(locatedRequestedSchool)
  else if (locations.length) {
    const bounds = L.latLngBounds(locations.map((school) => [school.latitude, school.longitude]))
    map?.fitBounds(bounds, { padding: [34, 34], maxZoom: 8 })
  }
}

onMounted(async () => {
  map = L.map(mapElement.value, { scrollWheelZoom: false }).setView([-18.6, 35.5], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  try {
    await loadSchools()
    await nextTick()
    map.invalidateSize()
    await prepareLocations()
  } catch (cause) {
    console.error('Não foi possível carregar as escolas para o mapa:', cause)
  }
})

watch(apiSchool, (school) => {
  if (!school) return
  const located = locatedSchools.value.find((item) => item.id === school.id)
  if (located) selectSchool(located)
})

onBeforeUnmount(() => {
  map?.remove()
  map = undefined
})
</script>

<template>
  <div class="inner-page">
    <section class="page-intro"><div><span class="eyebrow">DISTRIBUIÇÃO GEOGRÁFICA</span><h1>Encontre escolas no mapa.</h1><p>Localizações provenientes dos dados da API e do OpenStreetMap.</p></div><span class="data-badge"><i class="bi bi-geo-alt"></i> Mapa real</span></section>
    <div class="map-layout">
      <section class="map-panel">
        <div class="map-panel-heading"><div><h2>Moçambique</h2><p>{{ locatedSchools.length }} localizações confirmadas <span v-if="locating">· a pesquisar...</span></p></div><span class="map-legend"><i></i> Escolas identificadas</span></div>
        <div ref="mapElement" class="leaflet-map" aria-label="Mapa interactivo das escolas em Moçambique"></div>
        <div v-if="error && !schools.length" class="map-progress map-api-error"><i class="bi bi-cloud-slash"></i><span>{{ error }}</span><button class="btn-outline-custom" @click="loadSchools({ refresh: true }).then(prepareLocations).catch((cause) => console.error('Falha ao actualizar o mapa:', cause))">Tentar novamente</button></div>
        <div v-if="loading || locating" class="map-progress"><span class="spinner-border spinner-border-sm text-success" role="status"></span>{{ locating ? 'A procurar escolas no mapa...' : 'A carregar escolas...' }}</div>
        <div v-else-if="!locatedSchools.length && !error" class="map-progress"><i class="bi bi-geo-alt"></i> Não foram encontradas coordenadas para as escolas devolvidas pela API.</div>
        <p v-if="geocodingError" class="map-disclaimer"><i class="bi bi-exclamation-circle"></i> Algumas localizações não puderam ser pesquisadas. {{ geocodingError }}</p>
        <p class="map-disclaimer"><i class="bi bi-info-circle"></i> As coordenadas fornecidas pela API têm prioridade; as restantes são pesquisadas pelo nome da instituição. Mapa © OpenStreetMap.</p>
      </section>
      <aside class="map-side-panel">
        <div v-if="selectedSchool" class="selected-school">
          <div class="map-detail-icon"><i class="bi bi-mortarboard"></i></div><span class="eyebrow">INSTITUIÇÃO SELECCIONADA</span><h2>{{ selectedSchool.name }}</h2>
          <p class="map-school-location"><i class="bi bi-geo-alt"></i> {{ selectedSchool.district }}<template v-if="selectedSchool.province !== 'Não indicada'">, {{ selectedSchool.province }}</template></p>
          <div class="map-coordinate-card"><span>Latitude</span><strong>{{ selectedSchool.latitude.toFixed(5) }}</strong><span>Longitude</span><strong>{{ selectedSchool.longitude.toFixed(5) }}</strong><small>Localização {{ selectedSchool.source === 'api' ? 'da API' : 'pesquisada no OpenStreetMap' }}</small></div>
          <RouterLink :to="`/escolas/${encodeURIComponent(selectedSchool.id)}`" class="btn-primary-custom">Ver instituição <i class="bi bi-arrow-right"></i></RouterLink>
        </div>
        <div v-else class="map-side-empty"><span class="map-empty-icon"><i class="bi bi-cursor"></i></span><h2>Seleccione uma escola</h2><p>Clique num marcador no mapa ou numa instituição da lista para consultar a localização real.</p><div v-if="locatedSchools.length" class="map-school-list"><button v-for="school in locatedSchools.slice(0, 8)" :key="school.id" @click="selectSchool(school)"><i class="bi bi-geo-alt"></i><span>{{ school.name }}</span><i class="bi bi-chevron-right"></i></button></div><div v-else-if="loading" class="map-tiny-stat"><span class="spinner-border spinner-border-sm text-success" role="status"></span><span>A aguardar escolas da API</span></div></div>
      </aside>
    </div>
  </div>
</template>
