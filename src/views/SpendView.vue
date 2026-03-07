<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import AnnotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'

import { useTicketsStore } from '../stores/tickets.js'
import { GIGTYPE_COLORS } from '../constants.js'

ChartJS.register(
  TimeScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, AnnotationPlugin,
)

const store = useTicketsStore()
onMounted(() => store.fetchTickets())

// ── Controls ──────────────────────────────────────────────────────────────────
const showBreakdown  = ref(false)
const showAvgPrice   = ref(true)
const showMilestones = ref(true)
const activeTypes    = ref(new Set())

const allGigtypes = computed(() => {
  const names = new Set()
  for (const t of store.tickets) {
    if (Array.isArray(t.gigtype)) t.gigtype.forEach(gt => names.add(gt.name))
  }
  return [...names].sort()
})

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

// ── Data processing ───────────────────────────────────────────────────────────
const pricedTickets = computed(() =>
  [...store.tickets]
    .filter(t => t.price !== '' && t.price != null && !isNaN(parseFloat(t.price)))
    .sort((a, b) => a.date.localeCompare(b.date))
)

// Running cumulative total across all tickets
const cumulativeTotal = computed(() => {
  let total = 0
  return pricedTickets.value.map(t => ({
    x: t.date,
    y: +(total += parseFloat(t.price)).toFixed(2),
  }))
})

// Running cumulative total for a single gigtype
function cumulativeForType(typeName) {
  let total = 0
  return pricedTickets.value
    .filter(t => Array.isArray(t.gigtype) && t.gigtype.some(gt => gt.name === typeName))
    .map(t => ({ x: t.date, y: +(total += parseFloat(t.price)).toFixed(2) }))
}

// Average ticket price per calendar year, plotted at mid-year
const avgPriceByYear = computed(() => {
  const byYear = {}
  for (const t of pricedTickets.value) {
    const y = t.date.slice(0, 4)
    if (!byYear[y]) byYear[y] = { sum: 0, count: 0 }
    byYear[y].sum   += parseFloat(t.price)
    byYear[y].count += 1
  }
  return Object.entries(byYear)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, { sum, count }]) => ({
      x: `${year}-07-01`,
      y: +(sum / count).toFixed(2),
    }))
})

// Dates at which cumulative spend first crosses each £500 threshold
const milestones = computed(() => {
  const hits = []
  let next = 500
  for (const pt of cumulativeTotal.value) {
    while (pt.y >= next) {
      hits.push({ x: pt.x, label: `£${next}` })
      next += 500
    }
  }
  return hits
})

// ── Summary stats ─────────────────────────────────────────────────────────────
const totalSpend = computed(() => cumulativeTotal.value.at(-1)?.y ?? 0)

const avgPrice = computed(() => {
  if (!pricedTickets.value.length) return '0.00'
  return (totalSpend.value / pricedTickets.value.length).toFixed(2)
})

const mostExpensive = computed(() => {
  if (!pricedTickets.value.length) return null
  return pricedTickets.value.reduce((best, t) =>
    parseFloat(t.price) > parseFloat(best.price) ? t : best
  )
})

// ── Chart data ────────────────────────────────────────────────────────────────
const chartData = computed(() => {
  const datasets = []

  datasets.push({
    label: 'Total spend',
    data: cumulativeTotal.value,
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.07)',
    borderWidth: 2.5,
    pointRadius: 0,
    pointHoverRadius: 4,
    tension: 0.3,
    fill: true,
    yAxisID: 'y',
    order: 10,
  })

  if (showBreakdown.value) {
    for (const type of allGigtypes.value) {
      if (!activeTypes.value.has(type)) continue
      datasets.push({
        label: type,
        data: cumulativeForType(type),
        borderColor: GIGTYPE_COLORS[type] ?? '#64748b',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.3,
        yAxisID: 'y',
        order: 20,
      })
    }
  }

  if (showAvgPrice.value) {
    datasets.push({
      label: 'Avg ticket price',
      data: avgPriceByYear.value,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.08)',
      borderWidth: 2,
      borderDash: [5, 4],
      pointRadius: 4,
      pointBackgroundColor: '#f59e0b',
      pointHoverRadius: 6,
      tension: 0.3,
      yAxisID: 'y2',
      order: 5,
    })
  }

  return { datasets }
})

// ── Chart options ─────────────────────────────────────────────────────────────
const chartOptions = computed(() => {
  const annotations = {}
  if (showMilestones.value) {
    for (const { x, label } of milestones.value) {
      annotations[label] = {
        type: 'line',
        xMin: x,
        xMax: x,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderDash: [3, 3],
        label: {
          display: true,
          content: label,
          color: 'rgba(255,255,255,0.3)',
          backgroundColor: 'transparent',
          font: { size: 10, family: 'Inter' },
          position: 'start',
          yAdjust: 8,
        },
      }
    }
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          boxWidth: 12,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: £${ctx.parsed.y.toFixed(2)}`,
        },
      },
      annotation: { annotations },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'year', displayFormats: { year: 'yyyy' } },
        grid: { color: '#1e293b' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: '#1e293b' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          callback: v => `£${v}`,
        },
        title: {
          display: true,
          text: 'Cumulative Spend (£)',
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
        },
      },
      y2: {
        display: showAvgPrice.value,
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f59e0b',
          font: { family: 'Inter', size: 11 },
          callback: v => `£${v}`,
        },
        title: {
          display: true,
          text: 'Avg Ticket Price (£)',
          color: '#f59e0b',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  }
})
</script>

<template>
  <div class="view">

    <header class="view-header">
      <h1 class="view-title">Spend Over Time</h1>
      <p class="view-subtitle">Cumulative ticket spend with optional type breakdown and average price trend.</p>
    </header>

    <div v-if="store.loading" class="state-msg">Loading gig data…</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>

      <!-- Summary stats -->
      <div class="stats-row">
        <div class="stat">
          <div class="stat-value">£{{ totalSpend.toFixed(2) }}</div>
          <div class="stat-label">Total spent</div>
        </div>
        <div class="stat">
          <div class="stat-value">£{{ avgPrice }}</div>
          <div class="stat-label">Avg ticket price</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ pricedTickets.length }}</div>
          <div class="stat-label">Ticketed gigs</div>
        </div>
        <div v-if="mostExpensive" class="stat">
          <div class="stat-value">£{{ parseFloat(mostExpensive.price).toFixed(2) }}</div>
          <div class="stat-label">Most expensive — {{ mostExpensive.title }}</div>
        </div>
      </div>

      <!-- Toggles -->
      <div class="toggles">
        <button
          class="toggle-chip"
          :class="{ 'toggle-chip--on': showBreakdown }"
          @click="showBreakdown = !showBreakdown"
        >Type breakdown</button>
        <button
          class="toggle-chip"
          :class="{ 'toggle-chip--on': showAvgPrice }"
          @click="showAvgPrice = !showAvgPrice"
        >Avg ticket price</button>
        <button
          class="toggle-chip"
          :class="{ 'toggle-chip--on': showMilestones }"
          @click="showMilestones = !showMilestones"
        >£500 milestones</button>
      </div>

      <!-- Gigtype filter (only when breakdown is on) -->
      <div v-if="showBreakdown" class="filter-section">
        <div class="filter-header">
          <span class="filter-label">Filter types</span>
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
            <span class="chip-dot" :style="{ background: GIGTYPE_COLORS[type] ?? '#64748b' }"></span>
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>

    </template>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.view-header { display: flex; flex-direction: column; gap: 6px; }
.view-title  { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
.view-subtitle { font-size: 14px; color: var(--text-muted); }

.state-msg { font-size: 14px; color: var(--text-muted); padding: 32px 0; text-align: center; }
.state-error { color: #f87171; }

/* Stats */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 20px;
  min-width: 140px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Toggles */
.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toggle-chip {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.toggle-chip--on {
  border-color: #6366f1;
  background: rgba(99,102,241,0.12);
  color: #a5b4fc;
}

/* Filter */
.filter-section { display: flex; flex-direction: column; gap: 10px; }
.filter-header  { display: flex; align-items: center; gap: 12px; }

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
  cursor: pointer;
  font-family: inherit;
}
.btn-text:hover { text-decoration: underline; }

.chips { display: flex; flex-wrap: wrap; gap: 6px; }

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
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.chip:hover      { color: var(--text); border-color: var(--text-faint); }
.chip--active    { color: var(--text); }
.chip-dot        { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* Chart */
.chart-container {
  position: relative;
  height: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
</style>
