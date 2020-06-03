<template>
  <div>
    <h1>Ticket Listing</h1>
    <v-toolbar color="deep-purple accent-4" floating>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        label="Public APIs"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        return-object
      ></v-autocomplete>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
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
      entries: [],
      isLoading: false,
      loading: false,
      model: null,
      search: null,
    };
  },
  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((entry) => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + "..."
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    },
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
  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://api.publicapis.org/entries")
        .then((res) => res.json())
        .then((res) => {
          const { count, entries } = res;
          this.count = count;
          this.entries = entries;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
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
