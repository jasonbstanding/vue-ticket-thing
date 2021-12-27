<template>
    <div>
        <div id="yearmonth-chart">
            <VueApexCharts type="heatmap" height="350" :options="ymChartOptions" :series="yearMonthStats"></VueApexCharts>
        </div>
        <div id="genreyear-chart">
            <VueApexCharts type="heatmap" height="350" :options="gyChartOptions" :series="genreYearStats"></VueApexCharts>
        </div>
        <!-- <div id="yearmonthtot-chart">
            <VueApexCharts type="heatmap" height="350" :options="ymTotChartOptions" :series="getYearMonthTotals"></VueApexCharts>
        </div> -->
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import ymChartOptions from "@/views/ymChartOptions" 
import ymTotChartOptions from "@/views/ymTotChartOptions" 
import gyChartOptions from "@/views/gyChartOptions" 

export default {
  name: "ticket-stats",
  components: {
    VueApexCharts,
  },
  data() {
      return { 
          ymChartOptions: ymChartOptions,
          gyChartOptions: gyChartOptions,
          ymTotChartOptions: ymTotChartOptions
      } 
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTickets");
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets"]),
    ...mapGetters(["getYearMonthCount", "getTicketsTotal", "getYearTypeCount", "getYearMonthTotals"]),
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
#yearmonth-chart, #genreyear-chart, #yearmonthtot-chart {
  max-width: 800px;
  margin: 55px auto;
}
</style>
