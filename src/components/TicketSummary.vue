<template>
  <router-link
    class="ticket-link"
    :to="{ name: 'ticket-show', params: { id: ticket.id } }"
  >
    <div class="ticket -shadow">
      <span class="eyebrow">{{ ticket.date }}</span>
      <h4 class="title">{{ ticket.title }}</h4>
      <span>{{ ticketPrice }}</span>
      <div v-for="artist in ticket.artist" :key="artist.id">
        {{ artist.name }}
      </div>
      <div v-for="venue in ticket.venue" :key="venue.id">
        {{ venue.name }}
      </div>
      <div v-for="gigtype in ticket.gigtype" :key="gigtype.id">
        {{ gigtype.name }}
      </div>
      <img v-if="ticket.image_sml" :src="ticket.image_sml" />
    </div>
  </router-link>
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
  },
};
</script>

<style lang="scss" scoped>
.ticket {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.ticket:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.ticket > .title {
  margin: 0;
  color: green;
}

.ticket-link {
  color: black;
  text-decoration: none;
  font-weight: 100;
}
</style>
