<template>
  <div id="app">
    <div class="titletext">
      <router-link :to="{ name: 'GigList' }">The Ticket Thing</router-link> (powered by <a href="https://www.jasonbstanding.com">jasonbstanding.com</a>) | <router-link :to="{ name: 'StatsPage' }">Stats</router-link>
    </div>
    <div v-if="loading" class="spinner-container">
      <Spinner />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Spinner from '@/components/SpinnerComponent.vue';
import '@coreui/coreui/dist/css/coreui.min.css';

export default {
  name: 'App',
  components: {
    Spinner
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const gigs = ref([]);
    const filters = ref({
      artist: null,
      venue: null,
      gigtype: null,
      date: null
    });
    const selectedGig = ref(null);
    const loading = ref(false);
    const artistCounts = ref([]);
    const venueCounts = ref([]);
    const yearCounts = ref([]);
    const typeCounts = ref([]);

    const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

    const filteredGigs = computed(() => {
      let filtered = gigs.value;
      for (const [key, value] of Object.entries(filters.value)) {
        if (value) {
          filtered = filtered.filter(gig => {
            if (key === 'date') {
              return gig.date.startsWith(value);
            } else if (Array.isArray(gig[key])) {
              return gig[key].some(item => item.name === value);
            }
            return false;
          });
        }
      }
      return filtered;
    });

    const fetchGigs = async () => {
      loading.value = true;
      try {
        const response = await axios.get(import.meta.env.VITE_APP_API_ENDPOINT);
        gigs.value = response.data;
        processCounts();
        applyQueryParameters();
      } catch (error) {
        console.error('Error fetching gigs data:', error);
      } finally {
        loading.value = false;
      }
    };

    const incrementCount = (counts, key) => {
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    };

    const processCounts = () => {
      gigs.value.forEach(gig => {
        incrementCount(artistCounts.value, gig.artist?.[0]?.name);
        incrementCount(venueCounts.value, gig.venue?.[0]?.name);
        const year = gig.date?.split('-')[0]; // Extract year from date
        incrementCount(yearCounts.value, year);
        incrementCount(typeCounts.value, gig.gigtype?.[0]?.name);
      });
    }

    const applyQueryParameters = () => {
      const { artist, venue, gigtype, date } = route.query;
      filters.value.artist = artist || null;
      filters.value.venue = venue || null;
      filters.value.gigtype = gigtype || null;
      filters.value.date = date || null;
    };

    const updateQueryParameters = () => {
      const query = { ...filters.value };
      Object.keys(query).forEach(key => {
        if (!query[key]) {
          delete query[key];
        }
      });
      router.push({ query });
    };
    
    watch(() => route.query, applyQueryParameters, { immediate: true });

    onMounted(fetchGigs);

    const clearAllFilters = () => {
      filters.value = {
        artist: null,
        venue: null,
        gigtype: null,
        date: null
      };
      updateQueryParameters();
    };

    const removeFilter = (key) => {
      filters.value[key] = null;
      updateQueryParameters();
    };

    const applyFilter = (filter) => {
      filters.value[filter.type] = filter.value;
      updateQueryParameters();
    };

    const selectGig = (gig) => {
      selectedGig.value = gig;
    };

    return {
      gigs,
      filters,
      filteredGigs,
      selectedGig,
      loading,
      clearAllFilters,
      removeFilter,
      applyFilter,
      selectGig,
      items,
      artistCounts,
      venueCounts,
      yearCounts,
      typeCounts
    };
  }
};
</script>

<style>
body {
  font-family: 'Questrial', sans-serif;
}
header {
  top: 0;
  background-color: white;
  z-index: 1000;
}
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
