<script setup>
import { ref } from 'vue'

const searchText = ref('')
const emit = defineEmits(['toggle-menu', 'search'])
function submitSearch() {
  if (searchText.value.trim()) emit('search', searchText.value.trim())
}
</script>

<template>
  <header class="topbar">
    <button class="mobile-menu-btn" aria-label="Abrir menu" @click="emit('toggle-menu')"><i class="bi bi-list"></i></button>
    <div class="breadcrumb-line"><span>EducaMZ</span><i class="bi bi-chevron-right"></i><strong><slot>Visão geral</slot></strong></div>
    <form class="top-search" @submit.prevent="submitSearch">
      <i class="bi bi-search"></i>
      <input v-model="searchText" aria-label="Pesquisar escolas" placeholder="Pesquisar instituições..." />
      <kbd>⌘ K</kbd>
    </form>
    <div class="topbar-actions">
      <span class="demo-pill"><span></span> API de escolas</span>
      <div class="profile-avatar">EM</div>
    </div>
  </header>
</template>
