<template>
    <div class="gig-box">
      <img :src="gig.image_sml" alt="Gig Image" @click="showDetails" />
      <h3 @click="showDetails">{{ gig.title }}</h3>
      <p>{{ gig.date }}</p>
      <p v-if="gig.price > 0">£{{ gig.price }}</p>
      <p v-else>Free</p>
      <p v-if="gig.venue">Venue: {{ gig.venue[0]?.name }}</p>
      <p v-if="gig.artist">Artist: {{ gig.artist[0]?.name }}</p>
      <p v-if="gig.gigtype">Type: {{ gig.gigtype[0]?.name }}</p>
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
      }
    }
  };
  </script>
  
  <style scoped>
  .gig-box {
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
  }
  .gig-box img {
    width: 100%;
  }
  </style>
  