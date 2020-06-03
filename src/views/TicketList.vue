<template>
  <div>
    <h1>Ticket Listing</h1>
    <ScaleLoader v-if="this.loading" color="orange" />
    <div v-else class="ticketlist">
      <TicketSummary
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
      />
    </div>
  </div>
</template>

<script>
import TicketSummary from "@/components/TicketSummary.vue";
import TicketService from "@/services/TicketService.js";
import { ScaleLoader } from "@saeris/vue-spinners";

export default {
  components: {
    TicketSummary,
    ScaleLoader,
  },
  data() {
    return {
      tickets: [],
      loading: false,
    };
  },
  created() {
    this.loading = true;
    TicketService.getTickets()
      .then((response) => {
        this.tickets = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log("There was an error:", error.response);
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.ticketlist {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
