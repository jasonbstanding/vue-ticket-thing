<template>
    <div>
      <semipolar-spinner
        v-if="this.loading"
        class="spinner"
        :animation-duration="2000"      
        :size="255"
        :color="'orange'"
      />
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
import {SemipolarSpinner} from 'epic-spinners'

export default {
  name: "ticket-stats",
  components: {
    VueApexCharts,
    SemipolarSpinner
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
    ...mapState(["tickets", "ticket", "loading", "filteredTickets", "totalsYearMonth"]),
    ...mapGetters(["getYearMonthCount", "getTicketsTotal", "getYearTypeCount", "getYearMonthTotals"]),
    yearMonthStats: function() {
      return this.getYearMonthCount;
    }, 
    genreYearStats: function() {
      return this.getYearTypeCount;
    },
    yearMonthTotals: function() {
      return this.getYearMonthTotals;
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
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
