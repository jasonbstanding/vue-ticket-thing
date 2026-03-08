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

// ── Mode toggle ──────────────────────────────────────────────────────────────
const mode = ref('count') // 'count' | 'spend'

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

// ── Spend grid computation ────────────────────────────────────────────────────
const spendGridData = computed(() => {
  const data = {}
  for (const ticket of store.tickets) {
    const [year, monthStr] = ticket.date.split('-')
    const month = parseInt(monthStr)
    const price = parseFloat(ticket.price)
    if (isNaN(price)) continue
    const types = Array.isArray(ticket.gigtype) ? ticket.gigtype : []
    const matching = types.filter(gt => activeTypes.value.has(gt.name))
    if (matching.length === 0) continue

    if (!data[year]) data[year] = {}
    if (!data[year][month]) data[year][month] = { count: 0, byType: {} }

    data[year][month].count += price
    for (const gt of matching) {
      data[year][month].byType[gt.name] = (data[year][month].byType[gt.name] ?? 0) + price
    }
  }
  // Round values for display
  for (const year of Object.keys(data)) {
    for (const month of Object.keys(data[year])) {
      data[year][month].count = Math.round(data[year][month].count * 100) / 100
      for (const type of Object.keys(data[year][month].byType)) {
        data[year][month].byType[type] = Math.round(data[year][month].byType[type] * 100) / 100
      }
    }
  }
  return data
})

const activeGridData = computed(() => mode.value === 'spend' ? spendGridData.value : gridData.value)

// ── Summary stats ─────────────────────────────────────────────────────────────
const visibleCount = computed(() =>
  store.tickets.filter(t =>
    Array.isArray(t.gigtype) && t.gigtype.some(gt => activeTypes.value.has(gt.name))
  ).length
)

const COUNT_LEVELS = [
  { label: '0',     bg: 'var(--cell-empty)' },
  { label: '1',     bg: '#14532d' },
  { label: '2\u20134',   bg: '#16a34a' },
  { label: '5\u20138',   bg: '#ca8a04' },
  { label: '9\u201314',  bg: '#ea580c' },
  { label: '15\u201320', bg: '#dc2626' },
  { label: '21\u201325', bg: '#7c3aed' },
  { label: '26+',   bg: '#f1f5f9' },
]

const SPEND_LEVELS = [
  { label: '\u00A30',      bg: 'var(--cell-empty)' },
  { label: '\u2264\u00A310',   bg: '#14532d' },
  { label: '\u2264\u00A325',   bg: '#16a34a' },
  { label: '\u2264\u00A350',   bg: '#ca8a04' },
  { label: '\u2264\u00A3100',  bg: '#ea580c' },
  { label: '\u2264\u00A3200',  bg: '#dc2626' },
  { label: '\u2264\u00A3500',  bg: '#7c3aed' },
  { label: '>\u00A3500', bg: '#f1f5f9' },
]

const activeLevels = computed(() => mode.value === 'spend' ? SPEND_LEVELS : COUNT_LEVELS)
</script>

<template>
  <div class="view">

    <header class="view-header">
      <h1 class="view-title">Gig Heatmap</h1>
      <p class="view-subtitle">
        {{ mode === 'spend' ? 'Spend per month' : 'Gigs per month' }}, coloured by intensity.
        Dots show type breakdown. Showing {{ visibleCount }} of {{ store.tickets.length }} gigs.
      </p>
    </header>

    <div v-if="store.loading" class="state-msg">Loading gig data…</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>

      <!-- Mode toggle -->
      <section class="mode-toggle">
        <button
          class="mode-btn"
          :class="{ 'mode-btn--active': mode === 'count' }"
          @click="mode = 'count'"
        >
          Gig Count
        </button>
        <button
          class="mode-btn"
          :class="{ 'mode-btn--active': mode === 'spend' }"
          @click="mode = 'spend'"
        >
          Spend
        </button>
      </section>

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
          <div v-for="level in activeLevels" :key="level.label" class="legend-item">
            <span class="legend-swatch" :style="{ background: level.bg }"></span>
            <span class="legend-label">{{ level.label }}</span>
          </div>
        </div>
      </section>

      <!-- Heatmap -->
      <GigHeatmap
        :grid-data="activeGridData"
        :years="years"
        :gigtype-colors="GIGTYPE_COLORS"
        :mode="mode"
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

/* Mode toggle */
.mode-toggle {
  display: flex;
  gap: 2px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
  width: fit-content;
}

.mode-btn {
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.mode-btn:hover {
  color: var(--text);
}

.mode-btn--active {
  background: var(--surface-2);
  color: var(--text);
}

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
