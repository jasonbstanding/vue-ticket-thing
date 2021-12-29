<template>
    <div>
      <ScaleLoader v-if="this.loading" color="orange" />
      <div v-else>
          <div id="yearmonth-chart">
              <VueApexCharts type="heatmap" height="350" :options="ymChartOptions" :series="yearMonthStats"></VueApexCharts>
          </div>
          <div id="yearmonthtot-chart">
              <VueApexCharts type="heatmap" height="350" :options="ymTotChartOptions" :series="yearMonthTotals"></VueApexCharts>
          </div>
          <div id="genreyear-chart">
              <VueApexCharts type="heatmap" height="350" :options="gyChartOptions" :series="genreYearStats"></VueApexCharts>
          </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import ymChartOptions from "@/views/ymChartOptions" 
import ymTotChartOptions from "@/views/ymTotChartOptions" 
import gyChartOptions from "@/views/gyChartOptions" 
import { ScaleLoader } from "@saeris/vue-spinners";

export default {
  name: "ticket-stats",
  components: {
    VueApexCharts,
    ScaleLoader
  },
  data() {
      return { 
        ymChartOptions: ymChartOptions,
        gyChartOptions: gyChartOptions,
        ymTotChartOptions: ymTotChartOptions,
        loadingState: true
      } 
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTicketData").then(() => {
        this.loadingState = false;
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      this.loadingState = false;
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets", "ticketsYearMonth"]),
    ...mapGetters(["getYearMonthCount", "getTicketsTotal", "getYearTypeCount", "getYearMonthTotals"]),
    yearMonthStats: function() {
        return this.getYearMonthCount;
    }, 
    genreYearStats: function() {
        return this.getYearTypeCount;
    },
    yearMonthTotals: function() {
        if (this.ticketsYearMonth.count == 0) {
          return this.getYearMonthTotals;
        } else {
          return this.ticketsYearMonth;
        }
    },
    loading() {
      return this.loadingState;
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
