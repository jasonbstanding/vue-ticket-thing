import Vue from "vue";
import Vuex from "vuex";
import TicketService from "@/services/TicketService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tickets: [],
    filteredTickets: [],
    ticketsYearMonth: [],
    ticketsTypeYear: [],
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
    getYearMonthCount: (state) => {
            // [
    // {
    //     "id": 7447,
    //     "date": "2016-05-24",
    //     "title": "Gary Delaney",
    //     "price": "15",
    //     "venue": [
    //     {
    //         "term_id": 982,
    //         "name": "The Lantern at Colston Hall (Bristol)"
    //     }
    //     ],
    //     "artist": [
    //     {
    //         "term_id": 992,
    //         "name": "Gary Delaney"
    //     }
    //     ],
    //     "gigtype": [
    //     {
    //         "term_id": 454,
    //         "name": "Comedy"
    //     }
    //     ],
    //     "image_sml": "https://www.jasonbstanding.com/blogparts/2016/05/IMG_0241-300x214.jpg",
    //     "image_lg": "https://www.jasonbstanding.com/blogparts/2016/05/IMG_0241.jpg"
    // },
    // {
    //     "id": 7443,
    //     "date": "2016-04-06",
    //     "title": "Gregory Porter",
    //     "price": "30",
    //     "venue": [
    //     {
    //         "term_id": 959,
    //         "name": "Colston Hall Bristol"
    //     }
    //     ],
    //     "artist": [
    //     {
    //         "term_id": 990,
    //         "name": "Gregory Porter"
    //     }
    //     ],
    //     "gigtype": [
    //     {
    //         "term_id": 461,
    //         "name": "Gig/Concert"
    //     }
    //     ],
    //     "image_sml": "https://www.jasonbstanding.com/blogparts/2016/05/IMG_0237-300x205.jpg",
    //     "image_lg": "https://www.jasonbstanding.com/blogparts/2016/05/IMG_0237.jpg"
    // },        
    // ... ]
      // {
      //  series: [
      //   {
      //     name: "2016",
      //     data: [
      //        { x: 'Apr', y: 1 }, 
      //        { x: 'May', y: 1 }, 
      //     ] 
      //   },
      // ]
      // }
    //   debugger; // eslint-disable-line no-debugger
      let dataOut = [];
      const aMonths = Array.from({length: 12}, (v, k) => k+1); 
      const dTo = new Date(state.tickets[0].date);
      const dFrom = new Date(state.tickets[state.tickets.length -1].date);
      const mthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      for (var i=dFrom.getFullYear(); i <= dTo.getFullYear(); i++) {
        let aYearTotals = [];
        let yearTotal = 0;
        aMonths.map(function(item) {
          let events = state.tickets.filter(t => {
            var [tYear, tMonth] = t.date.split('-');
            return (item === +tMonth) && (i == tYear);
          });
          aYearTotals.push({x: mthLabels[item-1], y: events.length});
          yearTotal+= events.length;
        });
        aYearTotals.push({x: 'Total', y: yearTotal});
        dataOut.push({name: i, data: aYearTotals});
      }

      state.ticketsYearMonth = dataOut;
      return state.ticketsYearMonth;
    },
    getYearTypeCount: (state) => {
      // var arrTix = Array.from(document.querySelectorAll('*')).find(e => e.__vue__).__vue__.$store.state.tickets      let dataOut = [];
      const gigTypes = [
        'Comedy', 
        'Film', 
        'Gig/Concert', 
        'Spoken Word', 
        'Musical Comedy', 
        'Sport', 
        'Whisky Festival', 
        'Musical', 
        'Art', 
        'Museum or Tour', 
        'Musical Revue', 
        'Play', 
        'Choral or Classical', 
        'Festival', 
        'Beer Festival', 
        'Radio/TV Recording', 
        'Ballet', 
        'Theatre', 
        'Cabaret', 
        'Opera', 
        'Debate', 
        'Dog Show'
      ];
      let dataOut = [];
      const dTo = new Date(state.tickets[0].date);
      const dFrom = new Date(state.tickets[state.tickets.length -1].date);
      console.log(gigTypes);

      gigTypes.map(function(gigType) {
        let aTypeTotals = [];
        for (var i=dFrom.getFullYear(); i <= dTo.getFullYear(); i++) {
          let events = state.tickets.filter(t => {
            var [tYear] = t.date.split('-');
            return (t => t.gigtype.includes[gigType] ) && (i == tYear);
          });
          aTypeTotals.push({x: i, y: events.length});
        }
        dataOut.push({name: gigType, data: aTypeTotals});
      });

      state.ticketsTypeYear = dataOut;
      return state.ticketsTypeYear;

//       arrDataOut = [];
//       const gigType = "Comedy";
//         let aTypeTotals = [];
//         for (var i=dFrom.getFullYear(); i <= dTo.getFullYear(); i++) {
//            let events = arrTix.filter(t => {
//               var [tYear] = t.date.split('-');
//               return (i == tYear);
//             })
// //          let events = arrTix.filter(t => {
// //            var [tYear] = t.date.split('-');
// //            return (t => t.gigtype.name.includes[gigType] ) && (i == tYear);
// //          });
//           console.log(gigType);
//           console.log(i);
//           console.log(events);
//           aTypeTotals.push({x: i, y: events.length});
//         }
//         arrDataOut.push({name: gigType, data: aTypeTotals});      
    },
  },
});
