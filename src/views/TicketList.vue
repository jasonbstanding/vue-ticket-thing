<template>
  <div>
    <h1>Ticket Listing</h1>
    <TicketSummary
      v-for="ticket in tickets"
      :key="ticket.id"
      :ticket="ticket"
    />
  </div>
</template>

<script>
import TicketSummary from "@/components/TicketSummary.vue";
import TicketService from "@/services/TicketService.js";

export default {
  components: {
    TicketSummary,
  },
  data() {
    return {
      tickets: [],
    };
  },
  created() {
    TicketService.getTickets()
      .then((response) => {
        this.tickets = response.data;
      })
      .catch((error) => {
        console.log("There was an error:", error.response);
      });
  },
};
</script>
