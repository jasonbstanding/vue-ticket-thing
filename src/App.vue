<template>
  <div id="app">
    <div v-if="loading" class="spinner-container">
      <Spinner />
    </div>
    <div v-else>
      <header>
        <MenusComponent :artists="artistCounts" :venues="venueCounts" :years="yearCounts" @filter="applyFilter" />
        <FiltersComponent :filters="filters" @clear-all="clearAllFilters" />
        <BreadcrumbsComponent :filters="filters" @remove-filter="removeFilter" />
      </header>
      <GigList :gigs="filteredGigs" @select-gig="selectGig" @apply-filter="applyFilter" />
      <ModalComponent v-if="selectedGig" :gig="selectedGig" @close="selectedGig = null" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FiltersComponent from './components/FiltersComponent.vue';
import MenusComponent from './components/MenusComponent.vue';
import BreadcrumbsComponent from './components/BreadcrumbsComponent.vue';
import GigList from './views/GigList.vue';
import ModalComponent from './components/ModalComponent.vue';
import Spinner from './components/SpinnerComponent.vue';
import '@coreui/coreui/dist/css/coreui.min.css';

export default {
  name: 'App',
  components: {
    FiltersComponent,
    BreadcrumbsComponent,
    MenusComponent,
    GigList,
    ModalComponent,
    Spinner
  },
  data() {
    return {
      gigs: [],
      filters: {
        artist: null,
        venue: null,
        gigtype: null,
        date: null
      },
      selectedGig: null,
      loading: false,
      artistCounts: {},
      venueCounts: {},
      yearCounts: {}
    };
  },
  computed: {
    filteredGigs() {
      let filtered = this.gigs;

      for (const [key, value] of Object.entries(this.filters)) {
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
    }
  },
  methods: {
    async fetchGigs() {
      this.loading = true;
      try {
        const response = await axios.get(process.env.VUE_APP_API_ENDPOINT);
        this.gigs = response.data;
        this.processCounts();
      } catch (error) {
        console.error('Error fetching gigs data:', error);
      } finally {
        this.loading = false;
      }
    },
    processCounts() {
      const artistMap = {};
      const venueMap = {};
      const yearMap = {};

      this.gigs.forEach(gig => {
        // Count artists
        if (gig.artist) {
          artistMap[gig.artist[0].name] = (artistMap[gig.artist[0].name] || 0) + 1;
        }

        // Count venues
        if (gig.venue) {
          venueMap[gig.venue[0].name] = (venueMap[gig.venue[0].name] || 0) + 1;
        }

        // Count years
        if (gig.date) {
          const year = gig.date.split('-')[0]; // Extract year from date
          yearMap[year] = (yearMap[year] || 0) + 1;
        }
      });

      // Convert back to an array of objects if needed
      this.artistCounts = artistMap;
      this.venueCounts = venueMap;
      this.yearCounts = yearMap;
    },
    clearAllFilters() {
      this.filters = {
        artist: null,
        venue: null,
        gigtype: null,
        date: null
      };
    },
    removeFilter(key) {
      this.filters[key] = null;
    },
    applyFilter(filter) {
      this.filters[filter.type] = filter.value;
    },
    selectGig(gig) {
      this.selectedGig = gig;
    }
  },
  created() {
    this.fetchGigs();
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
