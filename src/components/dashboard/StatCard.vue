<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  tone: { type: String, default: 'green' },
  caption: { type: String, default: 'Dados da API' },
})
</script>

<template>
  <article class="stat-card">
    <div class="stat-top"><span>{{ title }}</span><span class="stat-icon" :class="`tone-${tone}`"><i :class="`bi ${icon}`"></i></span></div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-caption"><i class="bi bi-arrow-up-right"></i> {{ caption }}</div>
  </article>
</template>
