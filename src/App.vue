<template>
  <div id="app">
    <header>
      <FiltersComponent :filters="filters" @clear-all="clearAllFilters" />
    </header>
    <BreadcrumbsComponent :filters="filters" @remove-filter="removeFilter" />
    <GigList :gigs="filteredGigs" @sort="sortGigs" @select-gig="selectGig" />
    <ModalComponent v-if="selectedGig" :gig="selectedGig" @close="selectedGig = null" />
  </div>
</template>

<script>
import axios from 'axios';
import config from './config';
import FiltersComponent from './components/FiltersComponent.vue';
import BreadcrumbsComponent from './components/BreadcrumbsComponent.vue';
import GigList from './views/GigList.vue';
import ModalComponent from './components/ModalComponent.vue';

export default {
  name: 'App',
  components: {
    FiltersComponent,
    BreadcrumbsComponent,
    GigList,
    ModalComponent
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
      selectedGig: null
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
    fetchGigs() {
      axios.get(config.apiEndpoint)
        .then(response => {
          this.gigs = response.data;
        })
        .catch(error => {
          console.error(error);
        });
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
</style>
