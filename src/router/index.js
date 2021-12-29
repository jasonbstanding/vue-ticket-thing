import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ticket-list",
    props: true,
    component: () =>
      import(/* webpackChunkName: "list" */ "../views/TicketList.vue"),
  },
  {
    path: "/ticket/:id",
    name: "ticket-show",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TicketShow.vue"),
  },
  {
    path: "/stats",
    name: "ticket-stats",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TicketStats.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
