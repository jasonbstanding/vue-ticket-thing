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
  // getTicket(id) {
  //   return apiClient.get("/tickets/" + id);
  // },
};
