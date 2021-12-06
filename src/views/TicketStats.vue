<template>
    <div>
        <div id="yearmonth-chart">
            <VueApexCharts type="heatmap" height="350" :options="ymChartOptions" :series="getYearMonthCount"></VueApexCharts>
        </div>
        <div id="genreyear-chart">
            <VueApexCharts type="heatmap" height="350" :options="gyChartOptions" :series="getYearTypeCount"></VueApexCharts>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import ymChartOptions from "@/views/ymChartOptions" 
import gyChartOptions from "@/views/gyChartOptions" 

export default {
  name: "ticket-stats",
  components: {
    VueApexCharts,
  },
  data() {
      return { 
          ymChartOptions: ymChartOptions,
          gyChartOptions: gyChartOptions
      } 
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTickets");
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets"]),
    ...mapGetters(["getYearMonthCount", "getTicketsTotal", "getYearTypeCount"]),
    yearMonthStats: function() {
        return this.getYearMonthCount;
    }, 
    genreYearStats: function() {
        return this.getYearTypeCount;
    } 
  }
};
</script>

<style scoped>
#yearmonth-chart {
  max-width: 800px;
  margin: 55px auto;
}
</style>
