<script setup>
defineProps({ school: { type: Object, required: true } })

function typeClass(type) {
  if (/priv/i.test(type)) return 'type-private'
  if (/p[uú]blic/i.test(type)) return 'type-public'
  return 'type-unknown'
}
</script>

<template>
  <article class="school-card">
    <div class="school-card-top">
      <span class="school-emblem"><i :class="`bi ${school.icon}`"></i></span>
      <span class="school-type" :class="typeClass(school.type)">{{ school.type }}</span>
    </div>
    <h3>{{ school.name }}</h3>
    <div class="school-location"><i class="bi bi-geo-alt"></i> {{ school.district }}<template v-if="school.province !== 'Não indicada'">, {{ school.province }}</template></div>
    <div class="school-card-bottom"><span><i class="bi bi-book"></i> {{ school.level }}</span><RouterLink :to="`/escolas/${encodeURIComponent(school.id)}`" class="details-link">Ver detalhes <i class="bi bi-arrow-right"></i></RouterLink></div>
  </article>
</template>
