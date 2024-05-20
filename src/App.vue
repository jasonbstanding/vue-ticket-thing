<template>
  <div id="app">
    <header>
      <FiltersComponent :filters="filters" @clear-all="clearAllFilters" />
    </header>
    <BreadcrumbsComponent :filters="filters" @remove-filter="removeFilter" />
    <div v-if="loading" class="spinner-container">
      <Spinner />
    </div>
    <div v-else>
      <GigList :gigs="filteredGigs" @select-gig="selectGig" />
      <ModalComponent v-if="selectedGig" :gig="selectedGig" @close="selectedGig = null" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from './config';
import FiltersComponent from './components/FiltersComponent.vue';
import BreadcrumbsComponent from './components/BreadcrumbsComponent.vue';
import GigList from './views/GigList.vue';
import ModalComponent from './components/ModalComponent.vue';
import Spinner from './components/SpinnerComponent.vue';

export default {
  name: 'App',
  components: {
    FiltersComponent,
    BreadcrumbsComponent,
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
      loading: false
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
            }
            return gig[key]?.some(item => item.name === value);
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
        const response = await axios.get(config.apiEndpoint);
        this.gigs = response.data;
      } catch (error) {
        console.error('Error fetching gigs data:', error);
      } finally {
        this.loading = false;
      }
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
  position: sticky;
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
