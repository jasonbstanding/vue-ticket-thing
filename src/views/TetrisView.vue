<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketsStore } from '../stores/tickets.js'
import { GIGTYPE_COLORS } from '../constants.js'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { TreemapChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([CanvasRenderer, TreemapChart, TooltipComponent])

const store = useTicketsStore()
onMounted(() => store.fetchTickets())

// ── Dimension definitions ────────────────────────────────────────────────────

const VALUE_BANDS = [
  { label: 'Free',      min: 0,      max: 0 },
  { label: '<= \u00A310',   min: 0.01,   max: 10 },
  { label: '<= \u00A320',   min: 10.01,  max: 20 },
  { label: '<= \u00A335',   min: 20.01,  max: 35 },
  { label: '<= \u00A350',   min: 35.01,  max: 50 },
  { label: '<= \u00A3100',  min: 50.01,  max: 100 },
  { label: '> \u00A3100',   min: 100.01, max: Infinity },
]

function getValueBand(price) {
  const p = parseFloat(price)
  if (isNaN(p)) return 'Unknown'
  for (const band of VALUE_BANDS) {
    if (p >= band.min && p <= band.max) return band.label
  }
  return 'Unknown'
}

const DIMENSIONS = {
  artist:  { label: 'Artist',     extract: t => (Array.isArray(t.artist)  ? t.artist.map(a => a.name)  : ['Unknown']) },
  venue:   { label: 'Venue',      extract: t => (Array.isArray(t.venue)   ? t.venue.map(v => v.name)   : ['Unknown']) },
  gigtype: { label: 'Gig Type',   extract: t => (Array.isArray(t.gigtype) ? t.gigtype.map(g => g.name) : ['Unknown']) },
  year:    { label: 'Year',       extract: t => [t.date?.slice(0, 4) || 'Unknown'] },
  value:   { label: 'Value Band', extract: t => [getValueBand(t.price)] },
}

const DIMENSION_OPTIONS = Object.entries(DIMENSIONS).map(([k, v]) => ({ key: k, label: v.label }))

// ── Controls ─────────────────────────────────────────────────────────────────

const outerDim = ref('gigtype')
const innerDim = ref('venue')

// ── Chart data ───────────────────────────────────────────────────────────────

const PALETTE = [
  '#818cf8', '#fbbf24', '#f87171', '#34d399', '#60a5fa',
  '#d97706', '#fb923c', '#c084fc', '#38bdf8', '#f472b6',
  '#a3e635', '#2dd4bf', '#f9a8d4', '#e879f9', '#4ade80',
  '#94a3b8', '#a78bfa', '#fca5a5', '#6ee7b7', '#93c5fd',
]

function colorFor(name, dimKey) {
  if (dimKey === 'gigtype' && GIGTYPE_COLORS[name]) return GIGTYPE_COLORS[name]
  return null
}

const chartOption = computed(() => {
  const tickets = store.tickets
  if (!tickets.length) return {}

  const outerKey = outerDim.value
  const innerKey = innerDim.value
  const outerExtract = DIMENSIONS[outerKey].extract
  const innerExtract = DIMENSIONS[innerKey].extract

  // Build nested: outer -> inner -> count
  const nested = {}
  for (const t of tickets) {
    const outerVals = outerExtract(t)
    const innerVals = innerExtract(t)
    for (const ov of outerVals) {
      if (!nested[ov]) nested[ov] = {}
      for (const iv of innerVals) {
        nested[ov][iv] = (nested[ov][iv] || 0) + 1
      }
    }
  }

  // Sort outer groups by total count descending
  const outerEntries = Object.entries(nested)
    .map(([name, children]) => ({
      name,
      total: Object.values(children).reduce((s, c) => s + c, 0),
      children,
    }))
    .sort((a, b) => b.total - a.total)

  // Assign palette colors for outer groups
  const outerColorMap = {}
  outerEntries.forEach((entry, i) => {
    outerColorMap[entry.name] = colorFor(entry.name, outerKey) || PALETTE[i % PALETTE.length]
  })

  const data = outerEntries.map(entry => {
    const baseColor = outerColorMap[entry.name]
    const innerEntries = Object.entries(entry.children)
      .sort((a, b) => b[1] - a[1])

    return {
      name: entry.name,
      value: entry.total,
      itemStyle: { color: baseColor },
      children: innerEntries.map(([name, count]) => ({
        name,
        value: count,
      })),
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: ({ data: d, treePathInfo }) => {
        if (treePathInfo && treePathInfo.length > 2) {
          const parent = treePathInfo[treePathInfo.length - 2].name
          return `<strong>${parent}</strong><br/>${d.name}: ${d.value}`
        }
        return `<strong>${d.name}</strong>: ${d.value}`
      },
    },
    series: [{
      type: 'treemap',
      data,
      width: '100%',
      height: '100%',
      roam: false,
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: true,
        bottom: 10,
        left: 10,
        itemStyle: {
          color: '#1e293b',
          borderColor: '#334155',
          textStyle: { color: '#e2e8f0' },
        },
        emphasis: {
          itemStyle: {
            color: '#334155',
          },
        },
      },
      levels: [
        {
          // Outer level (groups)
          itemStyle: {
            borderColor: '#0f172a',
            borderWidth: 3,
            gapWidth: 3,
          },
          upperLabel: {
            show: true,
            height: 28,
            fontSize: 13,
            fontWeight: 600,
            color: '#f1f5f9',
            overflow: 'truncate',
          },
        },
        {
          // Inner level (children)
          itemStyle: {
            borderColor: '#0f172a',
            borderWidth: 1,
            gapWidth: 1,
          },
          label: {
            show: true,
            fontSize: 11,
            color: '#e2e8f0',
            overflow: 'truncate',
            formatter: '{b}\n{c}',
          },
          colorSaturation: [0.3, 0.7],
          colorMappingBy: 'value',
        },
      ],
    }],
  }
})

const totalGigs = computed(() => store.tickets.length)
</script>

<template>
  <div class="view">
    <header class="view-header">
      <h1 class="view-title">Gig Tetris</h1>
      <p class="view-subtitle">
        Treemap breakdown of {{ totalGigs }} gigs. Click a group to zoom in, use the breadcrumb to zoom back out.
      </p>
    </header>

    <div v-if="store.loading" class="state-msg">Loading gig data...</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>
      <div class="controls">
        <div class="control-group">
          <label class="control-label" for="outer-dim">Group by</label>
          <select id="outer-dim" v-model="outerDim" class="control-select">
            <option
              v-for="opt in DIMENSION_OPTIONS"
              :key="opt.key"
              :value="opt.key"
              :disabled="opt.key === innerDim"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label" for="inner-dim">Then by</label>
          <select id="inner-dim" v-model="innerDim" class="control-select">
            <option
              v-for="opt in DIMENSION_OPTIONS"
              :key="opt.key"
              :value="opt.key"
              :disabled="opt.key === outerDim"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="chart-container">
        <v-chart :option="chartOption" autoresize />
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

/* Controls */
.controls {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  white-space: nowrap;
}

.control-select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
}

.control-select option:disabled {
  color: var(--text-faint);
}

/* Chart — break out of the 1100px page-content constraint */
.chart-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  height: calc(100vh - 56px - 140px);
  min-height: 500px;
}
</style>
