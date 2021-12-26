import Vue from "vue";
import Vuex from "vuex";
import TicketService from "@/services/TicketService.js";

Vue.use(Vuex);

Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

function filterByGigtype(array, value){
  var filtered = [];
  for(var i = 0; i < array.length; i++){
      var obj = array[i];
        if (typeof(obj) === "object") {
            var item = obj['name'];
            if(item == value){
                filtered.push(item);
            }
        }
  }    
  return filtered;
}

// function filterByProperty(array, prop, value){
//   var filtered = [];
//   for(var i = 0; i < array.length; i++){
//       var obj = array[i];
//       for (var key in obj) {
//           if (typeof(obj[key]) === "object") {
//               var item = obj[key];
//               if(item[prop] == value){
//                   filtered.push(item);
//               }
//           }
//       }
//   }    
//   return filtered;
// }


// function filterByYear(array, prop, value){
//   var filtered = [];
//   for(var i = 0; i < array.length; i++){

//       var obj = array[i];

//       for(var key in obj){
//           if(typeof(obj[key] == "object")){
//               var item = obj[key];
//               if(item[prop] == value){
//                   filtered.push(item);
//               }
//           }
//       }

//   }    

//   return filtered;
// }

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
        'Gig/Concert', 
        'Comedy', 
        'Film', 
        'Play', 
        'Musical', 
        'Spoken Word', 
        'Museum or Tour', 
        'Theatre', 
        'Radio/TV Recording', 
        'Choral or Classical', 
        'Musical Comedy', 
        'Art', 
        'Opera', 
        'Sport', 
        'Musical Revue', 
        'Ballet', 
        'Beer Festival', 
        'Whisky Festival', 
        'Festival', 
        'Cabaret', 
        'Debate', 
        'Dog Show'
      ];
      gigTypes.reverse();
      let dataOut = [];
      const dTo = new Date(state.tickets[0].date);
      const dFrom = new Date(state.tickets[state.tickets.length -1].date);

      gigTypes.map(function(gigType) {
        let aTypeTotals = [];
        let typeTotal = 0;
        for (var i=dFrom.getFullYear(); i <= dTo.getFullYear(); i++) {
          let events = state.tickets.filter(t => {
            var [tYear] = t.date.split('-');
            let filterList = filterByGigtype(t.gigtype, gigType);
            return (filterList.length > 0) && (i == tYear);
          });
          aTypeTotals.push({x: i, y: events.length});
          typeTotal+= events.length;
        }
        aTypeTotals.push({x: 'Total', y: typeTotal});
        dataOut.push({name: gigType, data: aTypeTotals});
      });

      state.ticketsTypeYear = dataOut;
      return state.ticketsTypeYear; 
    },
    getYearMonthTotals: (state) => {
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

          let sum = events.reduce(function(prev, cur) {
            return prev + (cur.price ? Number(cur.price).round(2) : 0);
          }, 0);     

          sum = sum || 0;

          aYearTotals.push({x: mthLabels[item-1], y: Number(sum).round(2).toFixed(2)});
          yearTotal+= Number(sum).round(2);
        });
        aYearTotals.push({x: 'Total', y: Number(yearTotal).round(2).toFixed(2)});
        dataOut.push({name: i, data: aYearTotals});
      }

      state.ticketsYearMonth = dataOut;
      return state.ticketsYearMonth;
    },
  },
});
