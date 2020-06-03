<template>
  <div>
    <div>
      <div class="date">{{ ticket.date }}</div>
      <div class="title">
        {{ ticket.title }}
      </div>
      <div v-if="ifArtist" class="artist" :key="ticket.artist[0].id">
        Artist: {{ ticket.artist[0].name }}
      </div>
      <div class="gigtype" v-for="gigtype in ticket.gigtype" :key="gigtype.id">
        {{ gigtype.name }}
      </div>
      <div class="price">Price: {{ ticketPrice }}</div>
      <div v-if="ifVenue" class="venue" :key="ticket.venue[0].id">
        Venue: {{ ticket.venue[0].name }}
      </div>
    </div>
    <div class="ticket-image">
      <img class="ticket-image" :src="ticket.image_lg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticket: Object,
  },
  computed: {
    ticketPrice: function() {
      if (this.ticket.price > 0) {
        return "£" + this.ticket.price;
      } else {
        return "Free";
      }
    },
    ifArtist: function() {
      if (this.ticket.artist) {
        return true;
      }
      return false;
    },
    ifVenue: function() {
      if (this.ticket.venue) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.ticket-image {
  width: 100%;
}
.title {
  font-size: 1.6em;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
