<template>
    <div>
      <div class="sort-options">
        <button @click="sort('artist', 'asc')">Sort Artist Asc</button>
        <button @click="sort('artist', 'desc')">Sort Artist Desc</button>
        <button @click="sort('date', 'asc')">Sort Date Asc</button>
        <button @click="sort('date', 'desc')">Sort Date Desc</button>
      </div>x
      <masonry
        :cols="{ default: 4, 1100: 3, 700: 2, 500: 1 }"
        gutter="20px"
      >
        <GigBox
          v-for="gig in sortedGigs"
          :key="gig.id"
          :gig="gig"
          @click="selectGig(gig)"
        />
      </masonry>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import Masonry from 'vue-masonry-css';
  import GigBox from '../components/GigBox.vue';
  
  export default {
    name: 'GigList',
    components: {
      Masonry,
      GigBox
    },
    props: {
      gigs: {
        type: Array,
        required: true
      }
    },
    setup(props, { emit }) {
      const sortKey = ref(null);
      const sortOrder = ref(null);
  
      const sortedGigs = computed(() => {
        if (!sortKey.value) return props.gigs;
  
        return [...props.gigs].sort((a, b) => {
          let valA = a[sortKey.value]?.[0]?.name || '';
          let valB = b[sortKey.value]?.[0]?.name || '';
  
          if (sortKey.value === 'date') {
            valA = a.date;
            valB = b.date;
          }
  
          if (sortOrder.value === 'asc') {
            return valA.localeCompare(valB);
          } else {
            return valB.localeCompare(valA);
          }
        });
      });
  
      const sort = (key, order) => {
        sortKey.value = key;
        sortOrder.value = order;
      };
  
      const selectGig = (gig) => {
        emit('select-gig', gig);
      };
  
      return {
        sortedGigs,
        sort,
        selectGig
      };
    }
  };
  </script>
  
  <style scoped>
  .sort-options {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  </style>
  