<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  chartData: { type: Object, required: true },
  type: { type: String, default: 'bar' },
})
const chartTotal = computed(() => (props.chartData.datasets?.[0]?.data ?? []).reduce((total, value) => total + Number(value || 0), 0).toLocaleString('pt'))
const chartLegend = computed(() => {
  const values = props.chartData.datasets?.[0]?.data ?? []
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0)
  return (props.chartData.labels ?? []).map((label, index) => ({
    label,
    percentage: total ? Math.round((Number(values[index] || 0) / total) * 100) : 0,
    color: props.chartData.datasets?.[0]?.backgroundColor?.[index] ?? '#16a34a',
  }))
})

const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#153b2a', padding: 12, displayColors: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#82908a', font: { family: 'Inter, sans-serif', size: 10 } } },
    y: { grid: { color: '#edf1ee', drawTicks: false }, border: { display: false, dash: [4, 4] }, ticks: { color: '#82908a', padding: 10, font: { size: 10 } } },
  },
}
const doughnutOptions = {
  responsive: true, maintainAspectRatio: false, cutout: '72%',
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#153b2a', padding: 12 } },
}
</script>

<template>
  <section class="chart-card">
    <div class="chart-heading"><div><h2>{{ title }}</h2><p>{{ subtitle }}</p></div><button class="chart-more" aria-label="Mais opções"><i class="bi bi-three-dots"></i></button></div>
    <div class="chart-body" :class="{ 'chart-doughnut': type === 'doughnut' }">
      <Bar v-if="type === 'bar'" :data="chartData" :options="barOptions" />
      <Doughnut v-else :data="chartData" :options="doughnutOptions" />
      <div v-if="type === 'doughnut'" class="doughnut-center"><strong>{{ chartTotal }}</strong><span>instituições</span></div>
    </div>
    <div v-if="type === 'doughnut'" class="chart-legend">
      <span v-for="item in chartLegend" :key="item.label"><i class="legend-dot" :style="{ backgroundColor: item.color }"></i> {{ item.label }} <b>{{ item.percentage }}%</b></span>
    </div>
  </section>
</template>
