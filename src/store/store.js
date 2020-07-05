import Vue from "vue";
import Vuex from "vuex";
import TicketService from "@/services/TicketService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tickets: [],
    filteredTickets: [],
    ticketsTotal: 0,
    ticket: {},
    loading: true,
  },
  mutations: {
    SET_TICKETS(state, tickets) {
      state.tickets = tickets;
    },
    SET_TICKET(state, ticket) {
      state.ticket = ticket;
    },
    SET_FILTERED_TICKETS(state, filteredTickets) {
      state.filteredTickets = filteredTickets;
    },
  },
  actions: {
    fetchTickets({ commit, state }) {
      state.loading = true;
      TicketService.getTickets()
        .then((response) => {
          commit("SET_TICKETS", response.data);
          state.filteredTickets = state.tickets;
          state.loading = false;
        })
        .catch((error) => {
          console.log("There was an error:", error.response);
          state.loading = false;
        });
    },
    fetchTicket({ commit, getters }, id) {
      var ticket = getters.getTicketById(id);

      if (ticket) {
        commit("SET_TICKET", ticket);
      } else {
        TicketService.getTicket(id)
          .then((response) => {
            commit("SET_TICKET", response.data);
          })
          .catch((error) => {
            console.log("There was an error:", error.response);
          });
      }
    },
    setFilteredTicketList({ commit, state }, filter) {
      //   debugger; // eslint-disable-line no-debugger
      let filteredTickets = state.filteredTickets;
      filteredTickets = state.filteredTickets.filter((obj) => {
        switch (filter.type) {
          case "gigtype":
            return obj.gigtype === null
              ? false
              : obj.gigtype[0].term_id === filter.filterVal;
          case "venue":
            return obj.venue === null
              ? false
              : obj.venue[0].term_id === filter.filterVal;
          case "artist":
            return obj.artist === null
              ? false
              : obj.artist[0].term_id === filter.filterVal;
          case "date":
            return parseInt(obj.date) === filter.filterVal;
          default:
            return false;
        }
      });
      commit("SET_FILTERED_TICKETS", filteredTickets);
    },
    clearFilters({ commit, state }) {
      this.loading = true;
      commit("SET_FILTERED_TICKETS", state.tickets);
      this.loading = false;
    },
  },
  getters: {
    getTicketById: (state) => (id) => {
      return state.tickets.find((ticket) => ticket.id === id);
    },
    getTicketsByGigType: (state) => (id) => {
      state.filteredTickets = state.tickets.find(
        (ticket) => ticket.gigtype.type_id === id
      );
    },
    getTicketsTotal: (state) => {
      return state.tickets.length;
    },
  },
});
