<script setup>
defineProps({ modelValue: { type: String, default: '' }, placeholder: { type: String, default: 'Pesquisar pelo nome da instituição...' } })
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search-bar"><i class="bi bi-search"></i><input :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" /><span class="search-shortcut">ESCOLAS</span></label>
</template>
