<template>
    <div class="filters">
      <button @click="$emit('clear-all')">Clear All</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FiltersComponent',
    props: {
      filters: Object
    }
  };
  </script>
  
  <style scoped>
  .filters {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
  }
  </style>
  