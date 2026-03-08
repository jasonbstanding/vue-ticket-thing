<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useTicketsStore } from '../stores/tickets.js'
import { GIGTYPE_COLORS } from '../constants.js'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { SunburstChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([CanvasRenderer, SunburstChart, TooltipComponent])

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
  artist:  { label: 'Artist',    extract: t => (Array.isArray(t.artist)  ? t.artist.map(a => a.name)  : ['Unknown']) },
  venue:   { label: 'Venue',     extract: t => (Array.isArray(t.venue)   ? t.venue.map(v => v.name)   : ['Unknown']) },
  gigtype: { label: 'Gig Type',  extract: t => (Array.isArray(t.gigtype) ? t.gigtype.map(g => g.name) : ['Unknown']) },
  year:    { label: 'Year',      extract: t => [t.date?.slice(0, 4) || 'Unknown'] },
  value:   { label: 'Value Band', extract: t => [getValueBand(t.price)] },
}

const DIMENSION_OPTIONS = Object.entries(DIMENSIONS).map(([k, v]) => ({ key: k, label: v.label }))

// ── Controls ─────────────────────────────────────────────────────────────────

const innerDim = ref('gigtype')
const outerDim = ref('venue')

// ── Chart data ───────────────────────────────────────────────────────────────

// Palette for non-gigtype dimensions
const PALETTE = [
  '#818cf8', '#fbbf24', '#f87171', '#34d399', '#60a5fa',
  '#d97706', '#fb923c', '#c084fc', '#38bdf8', '#f472b6',
  '#a3e635', '#2dd4bf', '#f9a8d4', '#e879f9', '#4ade80',
  '#94a3b8', '#a78bfa', '#fca5a5', '#6ee7b7', '#93c5fd',
]

function colorFor(name, dimKey) {
  if (dimKey === 'gigtype' && GIGTYPE_COLORS[name]) return GIGTYPE_COLORS[name]
  return null // let echarts auto-assign
}

const chartOption = computed(() => {
  const tickets = store.tickets
  if (!tickets.length) return {}

  const innerKey = innerDim.value
  const outerKey = outerDim.value
  const innerExtract = DIMENSIONS[innerKey].extract
  const outerExtract = DIMENSIONS[outerKey].extract

  // Build nested: inner -> outer -> count
  const nested = {}
  for (const t of tickets) {
    const innerVals = innerExtract(t)
    const outerVals = outerExtract(t)
    for (const iv of innerVals) {
      if (!nested[iv]) nested[iv] = {}
      for (const ov of outerVals) {
        nested[iv][ov] = (nested[iv][ov] || 0) + 1
      }
    }
  }

  // Sort inner groups by total count descending
  const innerEntries = Object.entries(nested)
    .map(([name, children]) => ({
      name,
      total: Object.values(children).reduce((s, c) => s + c, 0),
      children,
    }))
    .sort((a, b) => b.total - a.total)

  // Assign palette colors for inner ring
  const innerColorMap = {}
  innerEntries.forEach((entry, i) => {
    innerColorMap[entry.name] = colorFor(entry.name, innerKey) || PALETTE[i % PALETTE.length]
  })

  // Build echarts sunburst data
  const data = innerEntries.map(entry => {
    const baseColor = innerColorMap[entry.name]
    const outerEntries = Object.entries(entry.children)
      .sort((a, b) => b[1] - a[1])

    return {
      name: entry.name,
      value: entry.total,
      itemStyle: { color: baseColor },
      children: outerEntries.map(([name, count]) => ({
        name,
        value: count,
        itemStyle: {
          color: colorFor(name, outerKey) || undefined,
        },
      })),
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: ({ name, value, treePathInfo }) => {
        if (treePathInfo && treePathInfo.length > 1) {
          const parent = treePathInfo[treePathInfo.length - 2].name
          return `<strong>${parent}</strong><br/>${name}: ${value}`
        }
        return `<strong>${name}</strong>: ${value}`
      },
    },
    series: [{
      type: 'sunburst',
      data,
      radius: ['15%', '90%'],
      sort: 'desc',
      emphasis: { focus: 'ancestor' },
      levels: [
        {},
        {
          r0: '15%',
          r: '50%',
          label: {
            show: true,
            rotate: 'tangential',
            fontSize: 12,
            color: '#e2e8f0',
            overflow: 'truncate',
            width: 80,
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#0f172a',
          },
        },
        {
          r0: '50%',
          r: '90%',
          label: {
            show: true,
            rotate: 'tangential',
            fontSize: 10,
            color: '#cbd5e1',
            overflow: 'truncate',
            width: 70,
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#0f172a',
          },
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
      <h1 class="view-title">Starburst</h1>
      <p class="view-subtitle">
        Sunburst breakdown of {{ totalGigs }} gigs. Inner ring splits by one dimension, outer ring by another.
      </p>
    </header>

    <div v-if="store.loading" class="state-msg">Loading gig data...</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>
      <div class="controls">
        <div class="control-group">
          <label class="control-label" for="inner-dim">Inner ring</label>
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

        <div class="control-group">
          <label class="control-label" for="outer-dim">Outer ring</label>
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

/* Chart */
.chart-container {
  width: 100%;
  height: 700px;
}
</style>
