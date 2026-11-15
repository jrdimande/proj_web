<script setup>
defineProps({
  provinces: { type: Array, required: true },
  districts: { type: Array, required: true },
  province: { type: String, default: '' },
  district: { type: String, default: '' },
  level: { type: String, default: '' },
})
defineEmits(['update:province', 'update:district', 'update:level', 'reset'])
</script>

<template>
  <div class="filter-panel">
    <div class="filter-label"><i class="bi bi-sliders2"></i> FILTRAR POR</div>
    <label class="filter-field"><span>Província</span><select :value="province" @change="$emit('update:province', $event.target.value)"><option value="">Todas as províncias</option><option v-for="item in provinces" :key="item.name" :value="item.name">{{ item.name }}</option></select></label>
    <label class="filter-field"><span>Distrito</span><select :value="district" @change="$emit('update:district', $event.target.value)"><option value="">Todos os distritos</option><option v-for="item in districts" :key="item" :value="item">{{ item }}</option></select></label>
    <label class="filter-field"><span>Nível de ensino</span><select :value="level" @change="$emit('update:level', $event.target.value)"><option value="">Todos os níveis</option><option value="Primário">Primário</option><option value="Secundário">Secundário</option></select></label>
    <button class="reset-filters" @click="$emit('reset')"><i class="bi bi-arrow-counterclockwise"></i> Limpar filtros</button>
  </div>
</template>
