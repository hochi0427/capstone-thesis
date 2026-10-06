<script setup>
import { computed, ref, useId, watch } from 'vue'

const props = defineProps({
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

const accordionId = useId()
const openMethodIndex = ref(null)
const hasExpandableItems = computed(() =>
  props.items.some((item) => item && typeof item === 'object' && Array.isArray(item.details))
)

function isExpandableMethod(item) {
  return item && typeof item === 'object' && Array.isArray(item.details)
}

function methodDetailsId(index) {
  return `method-details-${accordionId}-${index}`
}

function toggleMethod(index) {
  openMethodIndex.value = openMethodIndex.value === index ? null : index
}

watch(() => props.items, () => {
  openMethodIndex.value = null
})
</script>

<template>
  <section class="m1-section phase-detail-card">
    <h4>{{ heading }}</h4>

    <p v-if="text" class="phase-detail-text">
      {{ text }}
    </p>

    <div v-else-if="hasExpandableItems" class="phase-method-accordion">
      <div
        v-for="(item, index) in items"
        :key="isExpandableMethod(item) ? item.title : item"
        class="phase-method-item"
      >
        <template v-if="isExpandableMethod(item)">
          <button
            class="phase-method-toggle"
            type="button"
            :aria-expanded="openMethodIndex === index"
            :aria-controls="methodDetailsId(index)"
            @click="toggleMethod(index)"
          >
            <span>{{ item.title }}</span>
            <span class="phase-method-indicator" aria-hidden="true">
              {{ openMethodIndex === index ? '−' : '+' }}
            </span>
          </button>

          <Transition name="method-details">
            <ul
              v-show="openMethodIndex === index"
              :id="methodDetailsId(index)"
              class="phase-method-details"
            >
              <li v-for="detail in item.details" :key="detail">{{ detail }}</li>
            </ul>
          </Transition>
        </template>
        <p v-else class="phase-method-plain">{{ item }}</p>
      </div>
    </div>

    <ul v-else class="phase-detail-list">
      <li v-for="(item, index) in items" :key="typeof item === 'string' ? item : item.title ?? index">
        {{ typeof item === 'string' ? item : item.title }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.phase-method-item {
  border-bottom: 1px solid #eadbcd;
}

.phase-method-item:first-child {
  border-top: 1px solid #eadbcd;
}

.phase-method-toggle {
  width: 100%;
  min-height: 48px;
  padding: 11px 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 0;
  background: transparent;
  color: #554138;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  text-align: left;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.phase-method-toggle:hover {
  color: #9d4b34;
  background: rgba(241, 229, 216, 0.55);
}

.phase-method-toggle:focus-visible {
  outline: 2px solid #9d4b34;
  outline-offset: 2px;
  border-radius: 4px;
}

.phase-method-indicator {
  flex: 0 0 18px;
  color: #a6543a;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
}

.phase-method-details {
  margin: 0;
  padding: 0 8px 13px 22px;
  color: #7b665a;
  font-size: 13px;
  line-height: 1.6;
}

.phase-method-details li + li {
  margin-top: 6px;
}

.phase-method-plain {
  margin: 0;
  padding: 11px 2px;
  color: #665249;
  font-size: 14px;
  line-height: 1.55;
}

.method-details-enter-active,
.method-details-leave-active {
  overflow: hidden;
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.method-details-enter-from,
.method-details-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .phase-method-toggle,
  .method-details-enter-active,
  .method-details-leave-active {
    transition: none;
  }
}
</style>
