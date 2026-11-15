<script setup>
defineProps({ province: { type: Object, required: true } })
defineEmits(['explore'])
</script>

<template>
  <article class="province-card">
    <span class="province-illustration" :style="{ backgroundColor: province.color || '#edf8ef' }"><i :class="`bi ${province.icon || 'bi-geo-alt'}`"></i></span>
    <h3>{{ province.name }}</h3>
    <p><strong>{{ province.institutions }}</strong> registos <span>· da API</span></p>
    <button @click="$emit('explore', province.name)">Explorar escolas <i class="bi bi-arrow-right"></i></button>
  </article>
</template>
