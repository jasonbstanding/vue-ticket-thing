<template>
  <div class="breadcrumbs">
    <span v-for="(filter, index) in activeFilters" :key="index">
      {{ filter.key }}: {{ filter.value }}
      <button @click="$emit('remove-filter', filter.key)">x</button>
    </span>
    <button v-if="activeFilters.length" @click="$emit('clear-all')">Clear All</button>
  </div>
</template>

<script>
export default {
  name: 'BreadcrumbsComponent',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    activeFilters() {
      return Object.entries(this.filters)
        .filter(([, value]) => value)
        .map(([key, value]) => ({ key, value }));
    }
  }
};
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.breadcrumbs span {
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 4px;
}
.breadcrumbs button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>
