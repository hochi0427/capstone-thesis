<script setup>
defineProps({ kind: String })
</script>
<template>
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <template v-if="kind === 'power'"><rect x="7" y="6" width="18" height="22" rx="5" fill="currentColor" opacity=".15"/><rect x="12" y="3" width="8" height="4" rx="1" fill="currentColor"/><path d="m18 10-6 8h5l-2 7 7-10h-6z" fill="currentColor"/></template>
    <template v-else-if="kind === 'control'"><rect x="4" y="8" width="24" height="18" rx="6" stroke="currentColor" stroke-width="2"/><path d="M16 8V4M12 4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="17" r="3" fill="currentColor"/><circle cx="21" cy="17" r="3" fill="currentColor"/></template>
    <template v-else-if="kind === 'tools'"><path d="M10 4v9l6 4 6-4V4M6 5v12l10 7 10-7V5M16 24v5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></template>
    <template v-else><rect x="5" y="7" width="22" height="18" rx="7" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="5" stroke="currentColor" stroke-width="2"/><path d="M16 11v10M11 16h10M3 12v8M29 12v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></template>
  </svg>
</template>
