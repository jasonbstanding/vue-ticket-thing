<template>
  <div class="masonry-container">
    <div class="controls">
      <label for="sort">Sort by:</label>
      <select id="sort" v-model="sortCriteria">
        <option value="date">Date</option>
        <option value="artist">Artist</option>
      </select>
    </div>
    <Masonry
      :cols="{ default: 4, 1100: 3, 700: 2, 500: 1 }"
      gutter="30px"
    >
      <div v-for="item in sortedAndFilteredItems" :key="item.id" class="masonry-item">
        <img :src="item.image_sml" :alt="item.title" />
        <div class="details">
          <h3 @click="showModal()" class="clickable">{{ item.title }}</h3>
          <modal v-model:visible="isModalVisible" @close="isModalVisible = false">
            <!-- Modal content goes here -->
            <img :src="modalImage" alt="Large Image" />
          </modal>
          <p>{{ item.date }}</p>
          <p>{{ item.price ? item.price : 'Free' }}</p>
          <p v-if="item.artist && item.artist.length">
            Artist:
            <span @click="filterByArtist(item.artist[0].name)" class="clickable">{{ item.artist[0].name }}</span>
          </p>
          <p v-if="item.venue && item.venue.length">
            Venue:
            <span @click="filterByVenue(item.venue[0].name)" class="clickable">{{ item.venue[0].name }}</span>
          </p>
          <p v-if="item.gigtype && item.gigtype.length">
            Type:
            <span @click="filterByGigType(item.gigtype[0].name)" class="clickable">{{ item.gigtype[0].name }}</span>
          </p>
        </div>
      </div>
    </Masonry>
    <div v-if="selectedArtist || selectedVenue || selectedGigType" class="filter-info">
      <span v-if="selectedArtist">Filtered by Artist: {{ selectedArtist }}</span>
      <span v-if="selectedVenue">Filtered by Venue: {{ selectedVenue }}</span>
      <span v-if="selectedGigType">Filtered by Gig Type: {{ selectedGigType }}</span>
      <button @click="clearFilter">Clear Filter</button>
    </div>
    <modal name="image-modal" :width="'80%'" :height="'auto'" :adaptive="true" :scrollable="true">
      <div class="modal-content">
        <img :src="modalImage" alt="Large Image" />
      </div>
    </modal>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Masonry from 'vue-masonry-css';
import { API_URL } from '@/config';
import { Modal } from 'vue3-modal-dialogs';

const items = ref([]);
const selectedArtist = ref(null);
const selectedVenue = ref(null);
const selectedGigType = ref(null);
const sortCriteria = ref('date'); // default sorting criteria
const modalImage = ref(null);
const isModalVisible = ref(false);


const sortedAndFilteredItems = computed(() => {
  let filteredItems = items.value.filter(item => {
    const matchesArtist = selectedArtist.value ? item.artist && item.artist[0].name === selectedArtist.value : true;
    const matchesVenue = selectedVenue.value ? item.venue && item.venue[0].name === selectedVenue.value : true;
    const matchesGigType = selectedGigType.value ? item.gigtype && item.gigtype[0].name === selectedGigType.value : true;
    return matchesArtist && matchesVenue && matchesGigType;
  });

  if (sortCriteria.value === 'date') {
    return filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortCriteria.value === 'artist') {
    return filteredItems.sort((a, b) => {
      const artistA = a.artist ? a.artist[0].name : '';
      const artistB = b.artist ? b.artist[0].name : '';
      return artistA.localeCompare(artistB);
    });
  }
  return filteredItems;
});

const fetchItems = async () => {
  try {
    const response = await axios.get(API_URL); // Use API_URL from config
    items.value = response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

const filterByArtist = (artistName) => {
  selectedArtist.value = artistName;
  selectedVenue.value = null;
  selectedGigType.value = null;
};

const filterByVenue = (venueName) => {
  selectedVenue.value = venueName;
  selectedArtist.value = null;
  selectedGigType.value = null;
};

const filterByGigType = (gigTypeName) => {
  selectedGigType.value = gigTypeName;
  selectedArtist.value = null;
  selectedVenue.value = null;
};

const clearFilter = () => {
  selectedArtist.value = null;
  selectedVenue.value = null;
  selectedGigType.value = null;
};

const showModal = (imageUrl) => {
  modalImage.value = imageUrl;
  isModalVisible.value = true;
};

onMounted(fetchItems);
</script>
