import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ticket-list",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TicketList.vue"),
  },
  // {
  //   path: "/ticket/:id",
  //   name: "ticket-show",
  //   props: true,
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/TicketShow.vue"),
  // },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
