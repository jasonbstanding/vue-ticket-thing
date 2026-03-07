<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTicketsStore } from '../stores/tickets.js'
import GigHeatmap from '../components/GigHeatmap.vue'
import { GIGTYPE_COLORS } from '../constants.js'

const store = useTicketsStore()

onMounted(() => store.fetchTickets())

// ── Derived data ──────────────────────────────────────────────────────────────

// All gigtype names present in the dataset, sorted
const allGigtypes = computed(() => {
  const names = new Set()
  for (const ticket of store.tickets) {
    if (Array.isArray(ticket.gigtype)) {
      for (const gt of ticket.gigtype) names.add(gt.name)
    }
  }
  return [...names].sort()
})

// All years present, sorted ascending
const years = computed(() =>
  [...new Set(store.tickets.map(t => t.date.slice(0, 4)))].sort().reverse()
)

// ── Filter state ──────────────────────────────────────────────────────────────
const activeTypes = ref(new Set())

// Initialise activeTypes once data loads
watch(allGigtypes, types => {
  if (activeTypes.value.size === 0) activeTypes.value = new Set(types)
}, { immediate: true })

function toggleType(name) {
  const next = new Set(activeTypes.value)
  next.has(name) ? next.delete(name) : next.add(name)
  activeTypes.value = next
}

function selectAll()  { activeTypes.value = new Set(allGigtypes.value) }
function selectNone() { activeTypes.value = new Set() }

// ── Grid computation ──────────────────────────────────────────────────────────
const gridData = computed(() => {
  const data = {}
  for (const ticket of store.tickets) {
    const [year, monthStr] = ticket.date.split('-')
    const month = parseInt(monthStr)
    const types = Array.isArray(ticket.gigtype) ? ticket.gigtype : []
    const matching = types.filter(gt => activeTypes.value.has(gt.name))
    if (matching.length === 0) continue

    if (!data[year]) data[year] = {}
    if (!data[year][month]) data[year][month] = { count: 0, byType: {} }

    data[year][month].count++
    for (const gt of matching) {
      data[year][month].byType[gt.name] = (data[year][month].byType[gt.name] ?? 0) + 1
    }
  }
  return data
})

// ── Summary stats ─────────────────────────────────────────────────────────────
const visibleCount = computed(() =>
  store.tickets.filter(t =>
    Array.isArray(t.gigtype) && t.gigtype.some(gt => activeTypes.value.has(gt.name))
  ).length
)

const INTENSITY_LEVELS = [
  { label: '0',     bg: 'var(--cell-empty)' },
  { label: '1',     bg: '#14532d' },
  { label: '2–4',   bg: '#16a34a' },
  { label: '5–8',   bg: '#ca8a04' },
  { label: '9–14',  bg: '#ea580c' },
  { label: '15–20', bg: '#dc2626' },
  { label: '21–25', bg: '#7c3aed' },
  { label: '26+',   bg: '#f1f5f9' },
]
</script>

<template>
  <div class="view">

    <header class="view-header">
      <h1 class="view-title">Gig Heatmap</h1>
      <p class="view-subtitle">
        Gigs per month, coloured by intensity.
        Dots show type breakdown. Showing {{ visibleCount }} of {{ store.tickets.length }} gigs.
      </p>
    </header>

    <div v-if="store.loading" class="state-msg">Loading gig data…</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>

      <!-- Filter chips -->
      <section class="filter-section">
        <div class="filter-header">
          <span class="filter-label">Filter by type</span>
          <button class="btn-text" @click="selectAll">All</button>
          <button class="btn-text" @click="selectNone">None</button>
        </div>
        <div class="chips">
          <button
            v-for="type in allGigtypes"
            :key="type"
            class="chip"
            :class="{ 'chip--active': activeTypes.has(type) }"
            :style="activeTypes.has(type)
              ? { borderColor: GIGTYPE_COLORS[type] ?? '#64748b', background: (GIGTYPE_COLORS[type] ?? '#64748b') + '22' }
              : {}"
            @click="toggleType(type)"
          >
            <span
              class="chip-dot"
              :style="{ background: GIGTYPE_COLORS[type] ?? '#64748b' }"
            ></span>
            {{ type }}
          </button>
        </div>
      </section>

      <!-- Intensity legend -->
      <section class="legend">
        <span class="filter-label">Intensity</span>
        <div class="legend-items">
          <div v-for="level in INTENSITY_LEVELS" :key="level.label" class="legend-item">
            <span class="legend-swatch" :style="{ background: level.bg }"></span>
            <span class="legend-label">{{ level.label }}</span>
          </div>
        </div>
      </section>

      <!-- Heatmap -->
      <GigHeatmap
        :grid-data="gridData"
        :years="years"
        :gigtype-colors="GIGTYPE_COLORS"
      />

    </template>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.view-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.view-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.view-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.state-msg {
  font-size: 14px;
  color: var(--text-muted);
  padding: 32px 0;
  text-align: center;
}

.state-error { color: #f87171; }

/* Filter */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.btn-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
}

.btn-text:hover { text-decoration: underline; }

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.chip:hover {
  color: var(--text);
  border-color: var(--text-faint);
}

.chip--active {
  color: var(--text);
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 14px;
}

.legend-items {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-swatch {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
}

.legend-label {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
