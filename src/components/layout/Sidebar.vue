<script setup>
defineProps({ mobileOpen: { type: Boolean, default: false } })
defineEmits(['close'])

const navigation = [
  { label: 'Visão geral', to: '/', icon: 'bi-grid-1x2' },
  { label: 'Escolas', to: '/escolas', icon: 'bi-mortarboard' },
  { label: 'Províncias', to: '/provincias', icon: 'bi-geo-alt' },
  { label: 'Mapa', to: '/mapa', icon: 'bi-map' },
]
</script>

<template>
  <div v-if="mobileOpen" class="sidebar-backdrop d-lg-none" @click="$emit('close')"></div>
  <aside class="sidebar" :class="{ 'sidebar-open': mobileOpen }">
    <RouterLink to="/" class="brand" @click="$emit('close')">
      <span class="brand-mark"><i class="bi bi-mortarboard-fill"></i></span>
      <span>Educa<span class="brand-light">MZ</span><small>GUIA DE EDUCAÇÃO</small></span>
    </RouterLink>
    <div class="sidebar-label">MENU PRINCIPAL</div>
    <nav class="side-nav">
      <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="side-link" @click="$emit('close')">
        <i :class="`bi ${item.icon}`"></i><span>{{ item.label }}</span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-note">
        <span class="note-icon"><i class="bi bi-lightbulb"></i></span>
        <strong>Conhecimento abre caminhos.</strong>
        <p>Descubra oportunidades de aprendizagem em Moçambique.</p>
        <RouterLink to="/sobre" @click="$emit('close')">Sobre o projecto <i class="bi bi-arrow-up-right"></i></RouterLink>
      </div>
      <div class="sidebar-credit"><span class="status-dot"></span> Projecto académico demonstrativo</div>
    </div>
  </aside>
</template>
