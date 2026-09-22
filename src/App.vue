<script setup>
import { ref } from 'vue'
import { tabs, milestones, m1Content, researchPapers } from './data/thesisData'

const activeTab = ref('repository')
const selectedMilestone = ref(milestones[0])
const conceptMapImage = `${import.meta.env.BASE_URL}images/cps-concept-map.png`

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
            <div
              v-if="selectedMilestone.id === 1"
              class="m1-content"
            >
              <section class="m1-section">
                <p class="content-label">01</p>
                <h4>Project Overview</h4>

                <p v-for="paragraph in m1Content.overview" :key="paragraph">
                  {{ paragraph }}
                </p>
              </section>

              <div class="m1-paired-sections">
                <section class="m1-section concept-map-section">
                  <p class="content-label">02</p>
                  <h4>Concept Map</h4>
                  <p>{{ m1Content.conceptMapIntro }}</p>

                  <div class="concept-map-image-wrapper">
                    <img
                      class="concept-map-image"
                      :src="conceptMapImage"
                      alt="Collaborative Problem Solving concept map"
                    >
                  </div>
                </section>

                <section class="m1-section direction-section">
                  <p class="content-label">03</p>
                  <h4>Current Design Direction</h4>
                  <p class="exploratory-note">Exploratory directions, subject to change as the project develops.</p>

                  <div class="direction-list">
                    <div
                      v-for="(direction, index) in m1Content.directions"
                      :key="direction.label"
                      class="direction-item"
                    >
                      <span class="direction-label">{{ direction.label }}</span>
                      <p
                        v-if="index < 3"
                        class="direction-value"
                      >
                        {{ direction.items[0] }}
                      </p>
                      <div
                        v-else
                        class="direction-items"
                      >
                        <span v-for="item in direction.items" :key="item">{{ item }}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section class="m1-section spice-section">
                <div class="spice-heading">
                  <div>
                    <p class="content-label">04</p>
                    <h4>SPICE Framework</h4>
                  </div>

                  <span class="framework-status">Early Framework</span>
                </div>

                <p>
                  To further narrow down my early idea, I used the SPICE framework to think about the context, players, design intervention, and possible ways of evaluating the project.
                </p>

                <div class="spice-list">
                  <div
                    v-for="item in m1Content.spice"
                    :key="item.letter"
                    class="spice-item"
                  >
                    <span class="spice-letter">{{ item.letter }}</span>
                    <div>
                      <strong>{{ item.category }}</strong>
                      <p>{{ item.description }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div
              v-else
              class="m2-placeholder-body"
            >
              <div>
                <p class="content-label">OVERVIEW</p>

                <p class="detail-text">
                  {{ selectedMilestone.description }}
                </p>
              </div>

              <div class="placeholder">
                <span>✦</span>

                <div>
                  <strong>Content coming soon</strong>

                  <p>
                    This milestone will be documented as the project progresses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Research Notes -->
      <section
        v-else-if="activeTab === 'research'"
        class="research-page"
      >
        <div class="section-heading">
          <div>
            <p class="section-label">THESIS REPOSITORY</p>
            <h2>Research Notes</h2>
          </div>

          <p class="section-description">
            Papers I am reading as I develop the research foundation for my thesis.
          </p>
        </div>

        <div class="research-list">
          <article
            v-for="paper in researchPapers"
            :key="paper.url"
            class="research-card"
          >
            <p class="research-citation">{{ paper.citation }}</p>

            <a
              class="paper-link"
              :href="paper.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Paper <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
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