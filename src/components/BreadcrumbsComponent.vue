<template>
    <div class="breadcrumbs">
      <span v-for="(filter, index) in activeFilters" :key="index">
        {{ filter.key }}: {{ filter.value }} <button @click="$emit('remove-filter', filter.key)">x</button>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BreadcrumbsComponent',
    props: {
      filters: Object
    },
    computed: {
      activeFilters() {
        return Object.entries(this.filters)
          .filter(([ value]) => value)
          .map(([key, value]) => ({ key, value }));
      }
    }
  };
  </script>
  
  <style scoped>
  .breadcrumbs {
    display: flex;
    gap: 10px;
    padding: 10px;
  }
  </style>
  