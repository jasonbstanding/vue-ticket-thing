import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://www.jasonbstanding.com/wp-json/jbs/v2",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getTickets() {
    return apiClient.get("/tickets");
  },
  getTicketsProm() {
    return new Promise((resolve, reject) => {
      console.log('API call');
      apiClient.get("/tickets").then((data) => {
        console.log('API works');
        resolve(data);
      })
      .catch((err) => {
        console.log('No API');
        reject(err);
      })
    });
  },
  // getTicket(id) {
  //   return apiClient.get("/tickets/" + id);
  // },
};
