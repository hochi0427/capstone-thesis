<script setup>
defineProps({
  heading: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="m1-section phase-detail-card">
    <h4>{{ heading }}</h4>

    <p v-if="text" class="phase-detail-text">
      {{ text }}
    </p>

    <ul v-else class="phase-detail-list">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
