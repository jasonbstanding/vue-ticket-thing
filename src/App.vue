<!-- src/App.vue -->
<template>
  <div id="app">
    <TicketGallery />
  </div>
</template>

<script>
import TicketGallery from './components/TicketGallery.vue';

export default {
  components: {
    TicketGallery,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
