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
    return new Promise((resolve, reject) => {
      apiClient.get("/tickets").then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
    });
  },
  // getTicket(id) {
  //   return apiClient.get("/tickets/" + id);
  // },
};
