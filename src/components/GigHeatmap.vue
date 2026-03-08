<script setup>
import { ref, computed } from 'vue'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const props = defineProps({
  // { [year]: { [month 1-12]: { count: Number, byType: { [name]: count } } } }
  gridData:      { type: Object, required: true },
  years:         { type: Array,  required: true },
  gigtypeColors: { type: Object, required: true },
  mode:          { type: String, default: 'count' }, // 'count' | 'spend'
})

// ── Year totals ───────────────────────────────────────────────────────────────
const yearTotals = computed(() => {
  const totals = {}
  for (const year of props.years) {
    const cells = Object.values(props.gridData[year] || {})
    const count = cells.reduce((sum, cell) => sum + cell.count, 0)
    const byType = {}
    for (const cell of cells) {
      for (const [type, n] of Object.entries(cell.byType || {})) {
        byType[type] = (byType[type] ?? 0) + n
      }
    }
    totals[year] = { count, byType }
  }
  return totals
})

// ── Tooltip ───────────────────────────────────────────────────────────────────
const tooltip = ref(null)
const mouseX  = ref(0)
const mouseY  = ref(0)

function onMouseMove(e) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

function onCellEnter(year, monthIndex) {
  const month = monthIndex + 1
  const cell  = props.gridData?.[year]?.[month]
  if (!cell || cell.count === 0) { tooltip.value = null; return }
  tooltip.value = { type: 'month', year, monthLabel: MONTHS[monthIndex], cell }
}

function onYearTotalEnter(year) {
  const total = yearTotals.value[year]
  if (!total || total.count === 0) { tooltip.value = null; return }
  tooltip.value = { type: 'yearTotal', year, total }
}

function onCellLeave() { tooltip.value = null }

// ── Colour scale ──────────────────────────────────────────────────────────────
function countBg(v) {
  if (v === 0)  return 'var(--cell-empty)'
  if (v === 1)  return '#14532d'
  if (v <= 4)   return '#16a34a'
  if (v <= 8)   return '#ca8a04'
  if (v <= 14)  return '#ea580c'
  if (v <= 20)  return '#dc2626'
  if (v <= 25)  return '#7c3aed'
  return '#f1f5f9'
}

function spendBg(v) {
  if (v === 0)    return 'var(--cell-empty)'
  if (v <= 10)    return '#14532d'
  if (v <= 25)    return '#16a34a'
  if (v <= 50)    return '#ca8a04'
  if (v <= 100)   return '#ea580c'
  if (v <= 200)   return '#dc2626'
  if (v <= 500)   return '#7c3aed'
  return '#f1f5f9'
}

function cellBg(value) {
  return props.mode === 'spend' ? spendBg(value) : countBg(value)
}

function cellTextColor(value) {
  const threshold = props.mode === 'spend' ? 500 : 26
  return value > threshold ? '#1e293b' : '#f1f5f9'
}

function formatValue(v) {
  if (props.mode === 'spend') return '\u00A3' + v.toFixed(0)
  return v
}

function dotsForCell(byType) {
  return Object.entries(byType || {})
    .filter(([, c]) => c > 0)
    .map(([type, count]) => ({ type, count, color: props.gigtypeColors[type] ?? '#64748b' }))
}
</script>

<template>
  <div class="heatmap-wrap" @mousemove="onMouseMove">
    <div class="grid">

      <!-- ── Header row ── -->
      <div class="h-corner sticky-header"></div>
      <div class="h-month sticky-header h-total-header">∑</div>
      <div v-for="m in MONTHS" :key="m" class="h-month sticky-header">{{ m }}</div>

      <!-- ── Data rows: one per year ── -->
      <template v-for="year in years" :key="year">
        <div class="h-year">{{ year }}</div>

        <!-- Year total -->
        <div
          class="cell cell--total"
          :style="{ background: cellBg(yearTotals[year]?.count ?? 0) }"
          @mouseenter="onYearTotalEnter(year)"
          @mouseleave="onCellLeave"
        >
          <span
            v-if="yearTotals[year]?.count"
            class="cell-count"
            :style="{ color: cellTextColor(yearTotals[year].count) }"
          >
            {{ formatValue(yearTotals[year].count) }}
          </span>
          <div v-if="yearTotals[year]?.count" class="cell-dots">
            <span
              v-for="d in dotsForCell(yearTotals[year].byType)"
              :key="d.type"
              class="dot"
              :style="{ background: d.color }"
            />
          </div>
        </div>

        <!-- Month cells -->
        <div
          v-for="(_, mi) in MONTHS"
          :key="mi"
          class="cell"
          :style="{ background: cellBg(gridData[year]?.[mi+1]?.count ?? 0) }"
          @mouseenter="onCellEnter(year, mi)"
          @mouseleave="onCellLeave"
        >
          <span
            v-if="gridData[year]?.[mi+1]?.count"
            class="cell-count"
            :style="{ color: cellTextColor(gridData[year][mi+1].count) }"
          >
            {{ formatValue(gridData[year][mi+1].count) }}
          </span>

          <div v-if="gridData[year]?.[mi+1]?.count" class="cell-dots">
            <span
              v-for="d in dotsForCell(gridData[year]?.[mi+1]?.byType)"
              :key="d.type"
              class="dot"
              :style="{ background: d.color }"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        class="tooltip"
        :style="{ left: mouseX + 16 + 'px', top: mouseY + 16 + 'px' }"
      >
        <!-- Year total tooltip -->
        <template v-if="tooltip.type === 'yearTotal'">
          <div class="tt-heading">{{ tooltip.year }}</div>
          <div class="tt-total">{{ formatValue(tooltip.total.count) }}{{ mode === 'count' ? ` gig${tooltip.total.count !== 1 ? 's' : ''} total` : ' total' }}</div>
          <div v-for="(count, type) in tooltip.total.byType" :key="type" class="tt-row">
            <span class="tt-swatch" :style="{ background: gigtypeColors[type] ?? '#64748b' }"></span>
            <span>{{ type }}: <strong>{{ formatValue(count) }}</strong></span>
          </div>
        </template>

        <!-- Month cell tooltip -->
        <template v-else>
          <div class="tt-heading">{{ tooltip.monthLabel }} {{ tooltip.year }}</div>
          <div class="tt-total">{{ formatValue(tooltip.cell.count) }}{{ mode === 'count' ? ` gig${tooltip.cell.count !== 1 ? 's' : ''}` : '' }}</div>
          <div v-for="(count, type) in tooltip.cell.byType" :key="type" class="tt-row">
            <span class="tt-swatch" :style="{ background: gigtypeColors[type] ?? '#64748b' }"></span>
            <span>{{ type }}: <strong>{{ formatValue(count) }}</strong></span>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.heatmap-wrap {
  padding-bottom: 8px;
}

.grid {
  display: grid;
  grid-template-columns: 48px 54px repeat(12, 54px);
  gap: 4px;
  min-width: fit-content;
}

/* ── Sticky header ──────────────────────────────────────────────────────────── */
.sticky-header {
  position: sticky;
  top: 56px; /* clear sticky navbar */
  background: var(--bg);
  z-index: 10;
  padding-bottom: 6px;
}

/* ── Column headers ─────────────────────────────────────────────────────────── */
.h-corner { /* spacer */ }

.h-month {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-align: center;
}

.h-total-header {
  color: var(--text-faint);
  font-size: 13px;
}

.h-year {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
}

/* ── Data cells ──────────────────────────────────────────────────────────────── */
.cell {
  height: 46px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: default;
  transition: filter 0.1s;
  user-select: none;
}

.cell:hover {
  filter: brightness(1.2);
}

/* Year total cell: subtle right separator before January */
.cell--total {
  box-shadow: 3px 0 0 0 var(--border);
  margin-right: 3px;
}

.cell-count {
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}

.cell-dots {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 46px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* ── Tooltip ─────────────────────────────────────────────────────────────────── */
.tooltip {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 14px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.tt-heading {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 2px;
}

.tt-total {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1e293b;
}

.tt-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #cbd5e1;
  margin-top: 4px;
}

.tt-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
</style>
