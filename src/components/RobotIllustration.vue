<script setup>
defineProps({ assembly: Object, activated: Boolean })
</script>
<template>
  <svg class="lab-robot" :class="{ activated }" viewBox="0 0 440 440" role="img" :aria-label="activated ? 'Your activated robot holding the fragile cargo' : 'Robot chassis showing installed and empty modules'">
    <defs>
      <pattern id="lab-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#a7b5ab" opacity=".3"/></pattern>
      <linearGradient id="lab-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffcf0"/><stop offset="1" stop-color="#e9e3cd"/></linearGradient>
    </defs>
    <rect width="440" height="440" fill="url(#lab-grid)"/>
    <ellipse cx="220" cy="399" rx="116" ry="14" fill="#466b6114"/>
    <circle class="activation-ring" cx="220" cy="220" r="158" fill="none" stroke="#568477" stroke-width="2" stroke-dasharray="5 10" opacity=".2"/>
    <g class="robot-figure">
      <!-- A prebuilt structural chassis; functional modules are added by the players. -->
      <path d="M203 162v20h34v-20" fill="#b7c5ba" stroke="#527269" stroke-width="3"/>
      <rect x="145" y="178" width="150" height="152" rx="38" fill="url(#lab-body)" stroke="#527269" stroke-width="3"/>
      <path d="M163 205h114M163 306h114" stroke="#d0d4c3" stroke-width="2"/>
      <circle cx="162" cy="219" r="3" fill="#afbeaf"/><circle cx="278" cy="219" r="3" fill="#afbeaf"/>
      <circle cx="163" cy="292" r="3" fill="#afbeaf"/><circle cx="277" cy="292" r="3" fill="#afbeaf"/>
      <g v-if="assembly.body">
        <rect x="183" y="219" width="74" height="66" rx="15" fill="#eed283" stroke="#ba9653" stroke-width="2"/>
        <rect x="202" y="212" width="36" height="8" rx="3" fill="#ba9653"/>
        <path d="m226 232-17 23h14l-8 20 22-28h-15z" fill="#896d34"/>
        <circle class="power-light" cx="220" cy="302" r="4" fill="#679283"/>
      </g>
      <g v-else class="ghost-module"><rect x="183" y="219" width="74" height="66" rx="15"/><path d="M210 252h20M220 242v20"/></g>
      <!-- Control module -->
      <g v-if="assembly.head">
        <path d="M220 77V58" stroke="#527269" stroke-width="4"/><circle cx="220" cy="53" r="7" fill="#d19a67"/>
        <rect x="157" y="78" width="126" height="89" rx="30" fill="#83a99b" stroke="#527269" stroke-width="3"/>
        <rect x="174" y="96" width="92" height="45" rx="17" fill="#294d46"/>
        <g class="robot-eyes" fill="#f7e8ad"><circle cx="199" cy="118" r="7"/><circle cx="241" cy="118" r="7"/></g>
        <path d="M207 151q13 10 26 0" stroke="#486c60" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="149" cy="119" r="9" fill="#d8ae75" stroke="#527269" stroke-width="2"/><circle cx="291" cy="119" r="9" fill="#d8ae75" stroke="#527269" stroke-width="2"/>
      </g>
      <g v-else class="ghost-module"><rect x="157" y="78" width="126" height="89" rx="30"/><path d="M210 122h20M220 112v20"/></g>
      <!-- Tool arms and the fragile demonstration cargo -->
      <g v-if="assembly.arms">
        <path d="M148 220c-32-9-46 17-38 42l19 34M292 220c32-9 46 17 38 42l-19 34" fill="none" stroke="#527269" stroke-width="22" stroke-linecap="round"/>
        <path d="M148 220c-32-9-46 17-38 42l19 34M292 220c32-9 46 17 38 42l-19 34" fill="none" stroke="#d49d7c" stroke-width="15" stroke-linecap="round"/>
        <path d="M127 282v25h25M313 282v25h-25" fill="none" stroke="#527269" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="robot-cargo"><rect x="174" y="304" width="92" height="43" rx="8" fill="#f8efd4" stroke="#b99d66" stroke-width="2"/><path d="M187 324h66" stroke="#d9c594" stroke-width="2"/><path d="m214 310 7 8-6 8 9 9" fill="none" stroke="#c59b61" stroke-width="2"/><path d="M166 341h108" stroke="#527269" stroke-width="6" stroke-linecap="round"/></g>
      </g>
      <g v-else class="ghost-module"><path d="M143 220c-41-2-50 26-32 64M297 220c41-2 50 26 32 64"/><circle cx="113" cy="300" r="14"/><circle cx="327" cy="300" r="14"/></g>
      <!-- Movement module -->
      <g v-if="assembly.legs">
        <path d="M183 330v35M257 330v35" stroke="#527269" stroke-width="19"/>
        <rect x="161" y="357" width="47" height="39" rx="17" fill="#53796c" stroke="#34594e" stroke-width="3"/>
        <rect x="232" y="357" width="47" height="39" rx="17" fill="#53796c" stroke="#34594e" stroke-width="3"/>
        <path d="M171 370v14M183 369v16M195 370v14M242 370v14M254 369v16M266 370v14" stroke="#9bb3a2" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g v-else class="ghost-module"><rect x="161" y="348" width="47" height="48" rx="17"/><rect x="232" y="348" width="47" height="48" rx="17"/></g>
    </g>
    <g v-if="activated" class="activation-spark" stroke="#c09b43" stroke-width="3" stroke-linecap="round"><path d="M98 94v14M91 101h14M341 153v14M334 160h14M328 69v10M323 74h10"/></g>
  </svg>
</template>
<style scoped>
.lab-robot { width: 100%; height: 100%; display: block; }
.ghost-module { fill: #e9eee452; stroke: #9fae9f; stroke-width: 2; stroke-dasharray: 5 6; }
.ghost-module path { fill: none; }
.activated .robot-figure { animation: lab-wake 1s ease-in-out; }
.activated .robot-eyes { animation: lab-blink 4s ease-in-out infinite; transform-origin: 220px 118px; }
.activated .activation-ring { stroke-dasharray: 4 6; opacity: .5; }
.activated .power-light { animation: lab-pulse 1.8s ease-in-out infinite; }
.activation-spark { animation: lab-spark .8s ease-out; }
@keyframes lab-wake { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } 65% { transform: translateY(2px); } }
@keyframes lab-blink { 0%, 44%, 48%, 100% { transform: scaleY(1); } 46% { transform: scaleY(.12); } }
@keyframes lab-pulse { 50% { opacity: .4; } }
@keyframes lab-spark { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .activated .robot-figure, .activated .robot-eyes, .activated .power-light, .activation-spark { animation: none; } }
</style>
