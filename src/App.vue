<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useTicketsStore } from './stores/tickets.js'
import AppSpinner from './components/AppSpinner.vue'

const store = useTicketsStore()

const navItems = [
  { to: '/gigs',    label: 'Gigs' },
  { to: '/heatmap', label: 'Heatmap' },
  { to: '/spend',     label: 'Spendy Trendy' },
  { to: '/gig-tetris', label: 'Gig Tetris' },
]
</script>

<template>
  <div id="layout">
    <nav class="navbar">
      <div class="brand-group">
        <span class="brand">The Ticket Thing</span>
        <span class="brand-sub">Powered by <a href="https://www.jasonbstanding.com" target="_blank" rel="noopener">jasonbstanding.com</a></span>
      </div>
      <div class="nav-links">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>

    <main class="page-content">
      <RouterView />
    </main>

    <!-- Global loading overlay -->
    <Teleport to="body">
      <div v-if="store.loading" class="loading-overlay">
        <AppSpinner />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
#layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 24px;
  height: 56px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.brand-group {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  letter-spacing: -0.01em;
}

.brand-sub {
  font-size: 10px;
  color: var(--text-faint);
}

.brand-sub a {
  color: #f59e0b;
  text-decoration: none;
}
.brand-sub a:hover { text-decoration: underline; }

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover {
  color: var(--text);
  background: var(--surface-2);
}

.nav-link--active {
  color: var(--text);
  background: var(--surface-2);
}

.page-content {
  flex: 1;
  padding: 32px 24px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
}
</style>
