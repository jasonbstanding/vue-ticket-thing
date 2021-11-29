<template>
  <div>
    <h1>Ticket Listing</h1>
    <ScaleLoader v-if="this.loading" color="orange" />
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
          @showModal="modalShow(true)"
        />
      </div>
      <!-- use the modal component, pass in the prop -->
      <transition name="modal">
      <Modal v-if="showModal"
          @modalClose="modalShow(false)"
      >
        <!--
          you can use custom content here to overwrite
          default content
        -->
        <template v-slot:header>
          <h3></h3>
        </template>
      </Modal>
      </transition>
    </div>
  </div>
</template>

<script>
import TicketSummary from "@/components/TicketSummary.vue";
import { ScaleLoader } from "@saeris/vue-spinners";
import { mapState, mapGetters } from "vuex";
import Modal from "@/components/Modal.vue";

export default {
  name: "ticket-list",
  components: {
    TicketSummary,
    ScaleLoader,
    Modal,
  },
  data() {
    return {
      filters: [],
      showModal: false
    };
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTickets");
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets"]),
    ...mapGetters(["getTicketsTotal", "getTicketsByGigType"]),
  },
  methods: {
    filterList(filter) {
      // debugger; // eslint-disable-line no-debugger
      // console.log(filter.type);
      // console.log(filter.id);
      this.filters.push(filter);
      this.$store.dispatch("setFilteredTicketList", filter);
      //        return obj.gigtype[0].term_id === filter.id;
    },
    clearFilters() {
      this.$store.dispatch("clearFilters");
      this.filters = [];
    },
    modalShow(modalVisible) {
      this.showModal=modalVisible;
      console.log('xxx'+this.showModal);
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
</style>
