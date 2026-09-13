<script setup>
import { ref } from 'vue'
import { tabs, milestones } from './data/thesisData'

const activeTab = ref('repository')
const selectedMilestone = ref(milestones[0])

function selectTab(tab) {
  activeTab.value = tab.id
}

function selectMilestone(milestone) {
  selectedMilestone.value = milestone
}
</script>

<template>
  <div class="site">
    <!-- Header -->
    <header class="hero">
      <div class="hero-inner">
        <div class="eyebrow">
          NYU · GAMES FOR LEARNING · CAPSTONE THESIS
        </div>

        <h1>
          Capstone
          <span>Thesis</span>
        </h1>

        <p class="intro">
          A living archive of my research, design process,
          development, and reflections throughout my capstone project.
        </p>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="tabs-wrapper">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="selectTab(tab)"
        >
          <span>{{ tab.label }}</span>

          <span
            v-if="!tab.available"
            class="soon"
          >
            Coming Soon
          </span>
        </button>
      </div>
    </nav>

    <main>
      <!-- Repository -->
      <section
        v-if="activeTab === 'repository'"
        class="repository"
      >
        <div class="section-heading">
          <div>
            <p class="section-label">THESIS REPOSITORY</p>
            <h2>Project Milestones</h2>
          </div>

          <p class="section-description">
            Follow the development of my thesis from early ideas
            through research, prototyping, testing, and final presentation.
          </p>
        </div>

        <!-- Timeline -->
        <div class="timeline-scroll">
          <div class="timeline">

            <div class="timeline-line"></div>

            <button
              v-for="(milestone, index) in milestones"
              :key="milestone.id"
              class="milestone"
              :class="{
                selected: selectedMilestone.id === milestone.id,
                top: index % 2 === 0,
                bottom: index % 2 !== 0
              }"
              @click="selectMilestone(milestone)"
            >
              <div class="milestone-content">
                <span class="milestone-number">
                  {{ milestone.short }}
                </span>

                <span class="milestone-title">
                  {{ milestone.title }}
                </span>
              </div>

              <div class="connector"></div>
              <div class="dot"></div>
            </button>

          </div>
        </div>

        <!-- Selected milestone -->
        <article class="milestone-detail">
          <div class="detail-top">
            <div>
              <p class="detail-label">
                {{ selectedMilestone.short }} ·
                {{ selectedMilestone.semester }}
              </p>

              <h3>
                {{ selectedMilestone.title }}
              </h3>
            </div>

            <span
              class="status"
              :class="{ current: selectedMilestone.status === 'Current' }"
            >
              {{ selectedMilestone.status }}
            </span>
          </div>

          <div class="divider"></div>

          <div class="detail-body">
            <div>
              <p class="content-label">OVERVIEW</p>

              <p class="detail-text">
                {{ selectedMilestone.description }}
              </p>
            </div>

            <div
              v-if="selectedMilestone.id === 1"
              class="m1-content"
            >
              <p class="content-label">
                CURRENT DIRECTION
              </p>

              <p>
                I’m interested in designing a multiplayer learning game
                that explores how different interaction structures,
                such as cooperation and competition, can shape the way
                players interact, communicate, and learn together.
              </p>

              <p>
                I’m currently considering developing the project in Unity
                and exploring what makes multiplayer cooperation
                meaningful rather than simply having multiple players
                working toward the same goal.
              </p>

              <p class="content-label question-label">
                QUESTIONS I’M EXPLORING
              </p>

              <ul>
                <li>
                  What makes cooperation in a multiplayer game meaningful?
                </li>

                <li>
                  What kinds of game mechanics encourage players to
                  communicate and work together?
                </li>

                <li>
                  How does competition change the way players interact?
                </li>

                <li>
                  Can cooperation and competition exist together in the
                  same learning experience?
                </li>
              </ul>
            </div>

            <div
              v-else
              class="placeholder"
            >
              <span>✦</span>

              <div>
                <strong>Content coming soon</strong>

                <p>
                  This milestone will be documented as the project progresses.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Coming Soon pages -->
      <section
        v-else
        class="coming-soon-page"
      >
        <p class="section-label">
          CAPSTONE THESIS
        </p>

        <h2>
          {{
            tabs.find(tab => tab.id === activeTab)?.label
          }}
        </h2>

        <p>
          This section is still being developed.
          More content will be added as the project evolves.
        </p>

        <span class="large-soon">
          Coming Soon
        </span>
      </section>
    </main>

    <footer>
      <span>Hochi Kao</span>
      <span>NYU Games for Learning · Capstone Thesis</span>
    </footer>
  </div>
</template>