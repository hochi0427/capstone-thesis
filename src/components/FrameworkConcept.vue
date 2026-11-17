<script setup>
import { ref } from 'vue'
const pinned = ref(false)
const hovered = ref(false)
defineProps({ title: String, explanation: String })
</script>

<template>
  <details class="framework-concept" :open="pinned || hovered"
    @pointerenter="hovered = $event.pointerType === 'mouse'" @pointerleave="hovered = false">
    <summary @click.prevent="pinned = !pinned">{{ title }}</summary>
    <p>{{ explanation }}</p>
  </details>
</template>

<style scoped>
.framework-concept { min-width: 0; border: 1px solid #ded2c3; border-radius: 10px; background: #fffdf9; padding: 10px 12px; }
summary { cursor: pointer; font-size: 12px; line-height: 1.5; font-weight: 500; }
p { margin: 9px 0 0; font-size: 12px; line-height: 1.65; }
summary:focus-visible { outline: 2px solid #9d4b34; outline-offset: 3px; }
</style>
