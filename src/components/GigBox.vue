<template>
    <div class="gig-box">
      <div class="gigtype" @click="filterBy('gigtype')">{{ gig.gigtype[0]?.name }}</div>
      <img :src="gig.image_sml" alt="Gig Image" @click="selectGig(gig)">
      <h2 @click="selectGig(gig)">{{ gig.title }}</h2>
      <p @click="filterBy('date')">{{ gig.date }}</p>
      <p>{{ gig.price > 0 ? `£${gig.price}` : 'Free' }}</p>
      <p v-if="gig.artist" @click="filterBy('artist')" class="artist">{{ gig.artist[0]?.name }}</p>
      <p v-if="gig.venue" @click="filterBy('venue')">{{ gig.venue[0]?.name }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GigBox',
    props: {
      gig: {
        type: Object,
        required: true
      }
    },
    methods: {
      showDetails() {
        this.$emit('click');
      },
      filterBy(type) {
        const value = type === 'date' ? this.gig.date.split('-')[0] : this.gig[type][0]?.name;
        this.$emit('filter', { type, value });
      },
      selectGig(gig) {
        this.$emit('select-gig', gig);
      }
    }
  };
  </script>
  
  <style scoped>
  .gig-box {
    border: 1px solid #ddd;
    padding: 10px;
  }
  .gig-box img {
    width: 100%;
    cursor: pointer;
  }
  .gig-box h2, .gig-box p {
    cursor: pointer;
  }
  .gigtype {
    top:0px;
    background-color: black;
    color: white;
    font-weight: bold;
    padding:1em
  }
  .artist {
    font-weight: bold;
  }
  </style>
  