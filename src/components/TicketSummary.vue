<template>
  <div class="ticket -shadow">
    <div class="gigtype" v-for="gigtype in ticket.gigtype" :key="gigtype.id">
      {{ gigtype.name }}
    </div>
    <div
      class="ticketbody"
      :style="{ backgroundImage: `url(${ticket.image_sml})` }"
    >
      <div class="overlay">
        <router-link
          class="ticket-link"
          :to="{ name: 'ticket-show', params: { id: ticket.id } }"
        >
          <div class="date">{{ ticket.date }}</div>
        </router-link>
        <div class="title" v-if="titleIfNotArtist">
          <router-link
            class="ticket-link"
            :to="{ name: 'ticket-show', params: { id: ticket.id } }"
          >
            {{ ticket.title }}
          </router-link>
        </div>
        <div class="artist title" v-else :key="ticket.artist[0].id">
          {{ ticket.artist[0].name }}
        </div>
        <div v-if="titleIfNotArtist" class="artist" :key="ticket.artist[0].id">
          {{ ticket.artist[0].name }}
        </div>
        <div class="details">
          <span class="price">{{ ticketPrice }}</span>
          <span class="venue" :key="ticket.venue[0].id">{{
            ticket.venue[0].name
          }}</span>
        </div>
      </div>
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
    titleIfNotArtist: function() {
      if (this.ticket.title === this.ticket.artist[0].name) {
        return null;
      }
      return this.ticket.title;
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket {
  padding-bottom: 20px;
  padding-right: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
  width: 400px;
  display: flex;
  position: relative;
}

.ticketbody:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}

.ticket-link {
  color: white;
  text-decoration: none;
}

.gigtype {
  display: inline-block;
  font-size: 0.8em;
  color: black;
  text-transform: uppercase;
  letter-spacing: 3px;
  writing-mode: vertical-rl;
  position: relative;
  left: 0;
  padding-right: 1em;
}

.ticketbody {
  display: inline-block;
  position: relative;
  width: 100%;
}

.ticketbody img {
  width: 100%;
}

.overlay {
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.5); /* Black see-through */
  color: #f1f1f1;
  width: 100%;
  transition: 0.5s ease;
  opacity: 1;
  text-align: center;
  height: 100%;
}

.details {
  padding-bottom: 10px;
}

.date {
  font-size: 1em;
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
.title {
  font-size: 1.6em;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
.artist {
  font-size: 1.2em;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.price,
.venue {
  font-size: 0.9em;
  margin: 10px;
}
</style>
