<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useTicketsStore } from '../stores/tickets.js'
import { GIGTYPE_COLORS } from '../constants.js'

const store = useTicketsStore()
onMounted(() => store.fetchTickets())

// ── Filters ───────────────────────────────────────────────────────────────────
const filters = reactive({ artist: null, venue: null, year: null, gigtype: null })

const hasFilters = computed(() => Object.values(filters).some(v => v))

const activeFilters = computed(() =>
  Object.entries(filters).filter(([, v]) => v)
)

function setFilter(key, value) {
  filters[key] = value
  openDropdown.value = null
}

function clearFilter(key) {
  filters[key] = null
}

function clearFilters() {
  filters.artist = null
  filters.venue  = null
  filters.year   = null
  filters.gigtype = null
}

// ── Sorting ───────────────────────────────────────────────────────────────────
const sortKey = ref('date')
const sortDir = ref('desc')
const listSort = ref('freq') // for filter dropdown lists: 'freq' | 'asc' | 'desc'

const SORT_LABELS = {
  'date-desc':   'Date: newest first',
  'date-asc':    'Date: oldest first',
  'artist-asc':  'Artist: A → Z',
  'artist-desc': 'Artist: Z → A',
}

const currentSortLabel = computed(() => SORT_LABELS[`${sortKey.value}-${sortDir.value}`])

function setSort(key, dir) {
  sortKey.value = key
  sortDir.value = dir
  openDropdown.value = null
}

// ── Dropdown state ────────────────────────────────────────────────────────────
const openDropdown = ref(null)

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function onDocumentClick(e) {
  if (!e.target.closest('.dropdown')) openDropdown.value = null
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

// ── Counts for filter dropdowns ───────────────────────────────────────────────
function buildCounts(field) {
  const counts = {}
  for (const t of store.tickets) {
    if (field === 'year') {
      const y = t.date?.slice(0, 4)
      if (y) counts[y] = (counts[y] ?? 0) + 1
    } else if (Array.isArray(t[field])) {
      for (const item of t[field]) {
        if (item.name) counts[item.name] = (counts[item.name] ?? 0) + 1
      }
    }
  }
  return counts
}

const artistCounts = computed(() => buildCounts('artist'))
const venueCounts  = computed(() => buildCounts('venue'))
const yearCounts   = computed(() => buildCounts('year'))
const typeCounts   = computed(() => buildCounts('gigtype'))

function sortedEntries(counts) {
  const entries = Object.entries(counts)
  if (listSort.value === 'asc')  return entries.sort(([a], [b]) => a.localeCompare(b))
  if (listSort.value === 'desc') return entries.sort(([a], [b]) => b.localeCompare(a))
  return entries.sort(([, a], [, b]) => b - a) // freq
}

// ── Filtered + sorted gigs ────────────────────────────────────────────────────
const filteredGigs = computed(() =>
  store.tickets.filter(t => {
    if (filters.artist  && !(Array.isArray(t.artist)  && t.artist.some(a => a.name === filters.artist)))   return false
    if (filters.venue   && !(Array.isArray(t.venue)   && t.venue.some(v => v.name === filters.venue)))     return false
    if (filters.gigtype && !(Array.isArray(t.gigtype) && t.gigtype.some(g => g.name === filters.gigtype))) return false
    if (filters.year    && !t.date?.startsWith(filters.year))                 return false
    return true
  })
)

const sortedGigs = computed(() => {
  const gigs = [...filteredGigs.value]
  return gigs.sort((a, b) => {
    const va = sortKey.value === 'date' ? (a.date ?? '') : (a.artist?.[0]?.name ?? '')
    const vb = sortKey.value === 'date' ? (b.date ?? '') : (b.artist?.[0]?.name ?? '')
    const cmp = va.localeCompare(vb)
    return sortDir.value === 'asc' ? cmp : -cmp
  })
})

// ── Modal ─────────────────────────────────────────────────────────────────────
const selectedGig = ref(null)

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function gigtypeColor(gig) {
  return GIGTYPE_COLORS[gig.gigtype?.[0]?.name] ?? '#475569'
}
</script>

<template>
  <div class="view">

    <div v-if="store.loading" class="state-msg">Loading gig data…</div>
    <div v-else-if="store.error" class="state-msg state-error">Error: {{ store.error }}</div>

    <template v-else>

      <!-- Toolbar -->
      <div class="toolbar">

        <!-- Filter dropdowns -->
        <div class="dropdown" v-for="{ key, label, counts } in [
          { key: 'artist',  label: 'Artists',   counts: artistCounts },
          { key: 'venue',   label: 'Venues',    counts: venueCounts },
          { key: 'year',    label: 'Years',     counts: yearCounts },
          { key: 'gigtype', label: 'Types',     counts: typeCounts },
        ]" :key="key">
          <button
            class="dropdown-btn"
            :class="{ 'dropdown-btn--active': filters[key] }"
            @click.stop="toggleDropdown(key)"
          >
            {{ filters[key] ? `${label}: ${filters[key]}` : label }}
            <span class="caret">▾</span>
          </button>
          <div v-if="openDropdown === key" class="dropdown-menu">
            <button
              v-if="filters[key]"
              class="dropdown-item dropdown-item--clear"
              @click="clearFilter(key)"
            >Clear filter ×</button>
            <button
              v-for="[name, count] in sortedEntries(counts)"
              :key="name"
              class="dropdown-item"
              :class="{ 'dropdown-item--active': filters[key] === name }"
              @click="setFilter(key, name)"
            >
              <span v-if="key === 'gigtype'" class="item-dot" :style="{ background: GIGTYPE_COLORS[name] ?? '#64748b' }"></span>
              {{ name }}
              <span class="item-count">{{ count }}</span>
            </button>
          </div>
        </div>

        <!-- Sort gigs dropdown -->
        <div class="dropdown">
          <button class="dropdown-btn" @click.stop="toggleDropdown('sort')">
            {{ currentSortLabel }} <span class="caret">▾</span>
          </button>
          <div v-if="openDropdown === 'sort'" class="dropdown-menu">
            <button v-for="[sk, sd] in [['date','desc'],['date','asc'],['artist','asc'],['artist','desc']]"
              :key="`${sk}-${sd}`"
              class="dropdown-item"
              :class="{ 'dropdown-item--active': sortKey === sk && sortDir === sd }"
              @click="setSort(sk, sd)"
            >{{ SORT_LABELS[`${sk}-${sd}`] }}</button>
          </div>
        </div>

        <!-- List sort toggle -->
        <div class="list-sort">
          <span class="list-sort-label">Lists:</span>
          <button :class="{ active: listSort === 'freq' }" @click="listSort = 'freq'">↓ freq</button>
          <button :class="{ active: listSort === 'asc'  }" @click="listSort = 'asc'">A–Z</button>
          <button :class="{ active: listSort === 'desc' }" @click="listSort = 'desc'">Z–A</button>
        </div>

        <div class="toolbar-right">
          <button v-if="hasFilters" class="btn-clear-all" @click="clearFilters">Clear all</button>
          <span class="gig-count">{{ sortedGigs.length }} gigs</span>
        </div>
      </div>

      <!-- Active filter pills -->
      <div v-if="hasFilters" class="active-filters">
        <span
          v-for="[key, val] in activeFilters"
          :key="key"
          class="filter-pill"
        >
          {{ key }}: {{ val }}
          <button class="pill-remove" @click="clearFilter(key)">×</button>
        </span>
      </div>

      <!-- Gig grid -->
      <div class="gig-grid">
        <div v-for="gig in sortedGigs" :key="gig.id" class="gig-card">
          <div
            class="card-type"
            :style="{ background: gigtypeColor(gig) }"
            @click="setFilter('gigtype', gig.gigtype?.[0]?.name)"
          >{{ gig.gigtype?.[0]?.name }}</div>

          <img :src="gig.image_sml" :alt="gig.title" @click="selectedGig = gig" />

          <div class="card-body">
            <h3 class="card-title" @click="selectedGig = gig">{{ gig.title }}</h3>
            <p class="card-date" @click="setFilter('year', gig.date.slice(0,4))">
              {{ formatDate(gig.date) }}
            </p>
            <p class="card-price">{{ gig.price ? `£${parseFloat(gig.price).toFixed(2)}` : 'Free' }}</p>
            <p
              v-if="gig.artist?.[0]?.name"
              class="card-artist"
              @click="setFilter('artist', gig.artist[0].name)"
            >{{ gig.artist[0].name }}</p>
            <p
              v-if="gig.venue?.[0]?.name"
              class="card-venue"
              @click="setFilter('venue', gig.venue[0].name)"
            >{{ gig.venue[0].name }}</p>
          </div>
        </div>
      </div>

    </template>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="selectedGig" class="modal-backdrop" @click.self="selectedGig = null">
        <div class="modal">
          <button class="modal-close" @click="selectedGig = null">×</button>
          <div class="modal-inner">
            <img :src="selectedGig.image_lg" :alt="selectedGig.title" />
            <div class="modal-info">
              <div
                class="modal-type"
                :style="{ background: gigtypeColor(selectedGig) }"
              >{{ selectedGig.gigtype?.[0]?.name }}</div>
              <h2>{{ selectedGig.title }}</h2>
              <p class="modal-date">{{ formatDate(selectedGig.date) }}</p>
              <p class="modal-price">{{ selectedGig.price ? `£${parseFloat(selectedGig.price).toFixed(2)}` : 'Free' }}</p>
              <p v-if="selectedGig.artist?.[0]?.name" class="modal-artist">
                {{ selectedGig.artist[0].name }}
              </p>
              <p v-if="selectedGig.venue?.[0]?.name" class="modal-venue">
                {{ selectedGig.venue[0].name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.view { display: flex; flex-direction: column; gap: 16px; }

.state-msg { font-size: 14px; color: var(--text-muted); padding: 32px 0; text-align: center; }
.state-error { color: #f87171; }

/* ── Toolbar ──────────────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gig-count {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
}

.btn-clear-all {
  font-size: 12px;
  font-weight: 500;
  color: #f87171;
  background: none;
  border: 1px solid #f8717133;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: inherit;
}
.btn-clear-all:hover { background: #f8717111; }

/* ── Dropdowns ────────────────────────────────────────────────────────────── */
.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
.dropdown-btn:hover { color: var(--text); border-color: var(--text-faint); }
.dropdown-btn--active { color: var(--text); border-color: var(--accent); background: rgba(99,102,241,0.1); }
.caret { font-size: 10px; opacity: 0.6; }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 200;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  min-width: 200px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 5px;
  background: none;
  color: var(--text-muted);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s, color 0.1s;
}
.dropdown-item:hover { background: var(--surface-2); color: var(--text); }
.dropdown-item--active { color: var(--text); background: rgba(99,102,241,0.12); }
.dropdown-item--clear { color: #f87171; font-style: italic; }

.item-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-faint);
}

/* ── List sort ────────────────────────────────────────────────────────────── */
.list-sort {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.list-sort-label {
  font-size: 11px;
  color: var(--text-faint);
  margin-right: 2px;
}

.list-sort button {
  font-size: 11px;
  padding: 2px 7px;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
}
.list-sort button.active { background: var(--surface-2); color: var(--text); }
.list-sort button:hover  { color: var(--text); }

/* ── Active filter pills ──────────────────────────────────────────────────── */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(99,102,241,0.12);
  border: 1px solid #6366f1;
  border-radius: 999px;
  font-size: 12px;
  color: #a5b4fc;
}

.pill-remove {
  background: none;
  border: none;
  color: #a5b4fc;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  font-family: inherit;
}
.pill-remove:hover { opacity: 1; }

/* ── Gig grid ─────────────────────────────────────────────────────────────── */
.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.gig-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s, transform 0.15s;
}
.gig-card:hover { border-color: var(--text-faint); transform: translateY(-2px); }

.card-type {
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  cursor: pointer;
  opacity: 0.9;
}
.card-type:hover { opacity: 1; }

.gig-card img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  line-height: 1.3;
  margin: 0 0 4px;
}
.card-title:hover { color: #a5b4fc; }

.card-date   { font-size: 12px; color: var(--text-muted); cursor: pointer; }
.card-date:hover { color: var(--text); }

.card-price  { font-size: 13px; font-weight: 600; color: #34d399; }

.card-artist {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
}
.card-artist:hover { color: #a5b4fc; }

.card-venue  { font-size: 12px; color: var(--text-muted); cursor: pointer; }
.card-venue:hover  { color: var(--text); }

/* ── Modal ────────────────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover { background: rgba(0,0,0,0.8); }

.modal-inner {
  display: grid;
  grid-template-columns: 1fr auto;
}

.modal-inner img {
  width: 100%;
  object-fit: contain;
  display: block;
  max-height: 70vh;
}

.modal-info {
  width: 200px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid var(--border);
}

.modal-type {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  align-self: flex-start;
}

.modal-info h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  margin: 0;
}

.modal-date   { font-size: 13px; color: var(--text-muted); }
.modal-price  { font-size: 15px; font-weight: 700; color: #34d399; }
.modal-artist { font-size: 13px; font-weight: 600; color: var(--text); }
.modal-venue  { font-size: 12px; color: var(--text-muted); }

@media (max-width: 600px) {
  .modal-inner { grid-template-columns: 1fr; }
  .modal-info  { width: auto; border-left: none; border-top: 1px solid var(--border); }
}
</style>
