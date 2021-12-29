<template>
  <div>
    <h1>Ticket Listing</h1>
    <semipolar-spinner
      v-if="this.loading"
      class="spinner"
      :animation-duration="2000"      
      :size="255"
      :color="'orange'"
    />
    <div v-else>
      <div class="filterlist">
        <div v-if="this.filters.length > 0" class="clear">
          <div @click="clearFilters" class="clear">Clear</div>
        </div>
        <div v-for="filter in this.filters" :key="filter.type">
          <div>{{ filter.type }} : {{ filter.filterText }}</div>
        </div>
      </div>
      <div class="ticketlist">
        <TicketSummary
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          :ticket="ticket"
          @filterList="filterList"
          @showModal="modalShow"
        />
      </div>
      <!-- use the modal component, pass in the prop -->
      <transition name="modal">
      <Modal v-if="showModal"
        :ticket="selectedTicket"
        @modalClose="modalClose"
      />
      </transition>
    </div>
  </div>
</template>

<script>
import TicketSummary from "@/components/TicketSummary.vue";
import { mapState, mapGetters } from "vuex";
import Modal from "@/components/Modal.vue";
import {SemipolarSpinner} from 'epic-spinners'

export default {
  name: "ticket-list",
  components: {
    TicketSummary,
    SemipolarSpinner,
    Modal,
  },
  data() {
    return {
      filters: [],
      showModal: false,
      selectedTicket: {},
      loadingState: true
    };
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTicketData").then(() => {
        this.loadingState = false;
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      this.loadingState = false;
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets"]),
    ...mapGetters(["getTicketsTotal", "getTicketsByGigType"]),
    loading() {
      return this.loadingState;
    }
  },
  methods: {
    filterList(filter) {
      this.filters.push(filter);
      this.$store.dispatch("setFilteredTicketList", filter);
    },
    clearFilters() {
      this.$store.dispatch("clearFilters");
      this.filters = [];
    },
    modalShow(ticket) {
      this.selectedTicket = ticket;
      this.showModal=true;
    },
    modalClose() {
      this.showModal=false;
    }
  },
};
</script>

<style lang="scss" scoped>
.filterlist {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  div {
    background-color: #999999; /* Green */
    border: none;
    color: white;
    padding: 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
  }

  .clear {
    background-color: #4caf50; /* Green */
  }
}
.ticketlist {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
