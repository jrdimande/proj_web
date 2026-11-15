<script setup>
const technologies = [
  { name: 'Vue 3', icon: 'bi-code-slash' }, { name: 'Vite', icon: 'bi-lightning-charge' },
  { name: 'Bootstrap 5', icon: 'bi-bootstrap' }, { name: 'Chart.js', icon: 'bi-bar-chart' },
  { name: 'JavaScript', icon: 'bi-braces' }, { name: 'Vue Router', icon: 'bi-signpost-split' },
]
</script>

<template>
  <div class="inner-page about-page">
    <section class="about-hero"><span class="eyebrow"><i class="bi bi-mortarboard"></i> EDUCAÇÃO PARA TODOS</span><h1>Um país que aprende,<br /><span>um futuro que cresce.</span></h1><p>O EducaMZ é um projecto académico que imagina uma forma mais simples de descobrir e conhecer instituições de ensino em Moçambique.</p><div class="about-hero-decoration"><i class="bi bi-book-half"></i><span></span><span></span><span></span></div></section>
    <section class="about-intro content-panel"><div class="about-intro-icon"><i class="bi bi-lightbulb"></i></div><div><span class="eyebrow">A IDEIA</span><h2>O que é o EducaMZ?</h2><p>Uma plataforma conceptual para reunir informação educativa num só lugar. A experiência foi pensada para ajudar estudantes, famílias e comunidades a explorar escolas, regiões e diferentes níveis de ensino através de uma interface acessível.</p></div></section>
    <div class="about-cards">
      <article class="about-info-card"><span class="about-card-icon icon-coral"><i class="bi bi-compass"></i></span><span class="eyebrow">O DESAFIO</span><h2>Informação dispersa</h2><p>Encontrar dados sobre escolas e opções educativas pode ser difícil quando a informação está espalhada por diferentes fontes e regiões.</p></article>
      <article class="about-info-card"><span class="about-card-icon icon-green"><i class="bi bi-bullseye"></i></span><span class="eyebrow">A NOSSA VISÃO</span><h2>Descobrir com facilidade</h2><p>O projecto demonstra como uma experiência clara de pesquisa e exploração pode tornar o panorama educativo mais fácil de consultar.</p></article>
      <article class="about-info-card"><span class="about-card-icon icon-blue"><i class="bi bi-globe-africa"></i></span><span class="eyebrow">O CONTEXTO</span><h2>Educação em Moçambique</h2><p>A educação é essencial para o desenvolvimento das comunidades. Valorizar o acesso à informação é um passo para aproximar oportunidades.</p></article>
    </div>
    <section class="about-objectives content-panel"><div><span class="eyebrow">PARA ESTA DEMONSTRAÇÃO</span><h2>O que queremos mostrar</h2><p>Uma experiência de consulta moderna, inclusiva e adaptada a diferentes dispositivos.</p></div><ul><li><i class="bi bi-check-circle-fill"></i> Explorar instituições por nome, região e nível de ensino.</li><li><i class="bi bi-check-circle-fill"></i> Visualizar informação institucional de forma organizada.</li><li><i class="bi bi-check-circle-fill"></i> Conhecer a distribuição geográfica através de uma representação visual.</li><li><i class="bi bi-check-circle-fill"></i> Apresentar um conceito académico sem recolher dados pessoais.</li></ul></section>
    <section class="tech-section"><div class="panel-heading"><div><span class="eyebrow">FEITO COM</span><h2>Tecnologias utilizadas</h2></div><p>Interface construída com ferramentas web modernas</p></div><div class="tech-grid"><span v-for="technology in technologies" :key="technology.name"><i :class="`bi ${technology.icon}`"></i>{{ technology.name }}</span></div></section>
    <div class="about-demo-note"><i class="bi bi-info-circle"></i><span><strong>Um frontend académico.</strong> As escolas e os indicadores são carregados da API de escolas de Moçambique. O mapa utiliza OpenStreetMap e pesquisa geográfica externa. Este projecto não implementa backend, autenticação ou operações institucionais.</span></div>
  </div>
</template>
