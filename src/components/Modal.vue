<!-- template for the modal component -->
<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <button class="modal-default-button" @click="$emit('modalClose')">
              X
            </button>
            <slot name="header">
              <div>{{ ticketHeading }}</div>
              <div v-if="ticketVenue">{{ ticketVenue }}</div>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="gigtitle" v-if="gigTitle">{{ gigTitle }}</div>
              <div v-if="ticket.image_lg"><img class="ticketimage" :src="ticket.image_lg" /></div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  props: {
    ticket: Object
  },
  computed: {
    ticketArtist() {
      return (this.ticket.artist?.count > 0 ? this.ticket.artist[0].name : '');
    },
    ticketHeading() {
      let arrHead = [];
      console.log(this.ticket);
      if (this.ticket.date) {
        arrHead.push(this.ticket.date);
      }
      if (this.ticket.artist != null) {
        arrHead.push(this.ticket.artist[0].name);
      }
      if (this.ticket.price) {
        arrHead.push('£' + this.ticket.price);
      }

      return arrHead.join(' - ');
    },
    ticketVenue() {
      return (this.ticket.venue != null ? this.ticket.venue[0].name : null);
    },
    gigTitle() {
      if (!this.ticket.artist || (this.ticket.title != this.ticket.artist[0].name)) {
        return this.ticket.title;
      }
      return null;
    }
  }
}
</script>


<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.ticketimage {
  width: 90%;
  padding-top: 1em;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  display: inline;
  float: left;
}

.gigtitle {
  font-size: 2em;
  font-weight: bolder;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>