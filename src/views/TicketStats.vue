<template>
    <div>
        <div id="chart">
            <VueApexCharts type="heatmap" height="350" :options="chartOptions" :series="getYearMonthCount"></VueApexCharts>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
 
export default {
  name: "ticket-stats",
  components: {
    VueApexCharts,
  },
  data() {
      return { 
          chartOptions: {
            chart: {
              height: 350,
              type: 'heatmap',
              toolbar: {
                  show: false
              }
            },
            dataLabels: {
              enabled: true
            },
            colors: ["#668FFB"],
            title: {
              text: 'HeatMap Chart (Single color)'
            },
            xaxis: {
                type: 'category',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                tickPlacement: 'between',
                position: 'top',
                labels: {
                    show: true
                }
            },
            yaxis: {
                labels: {
                    show: true,
                    formatter: function (value) {
                        return value;
                    }
                },
            }
          }
      }
  },
  created() {
    if (!this.getTicketsTotal) {
      this.$store.dispatch("fetchTickets");
    }
  },
  computed: {
    ...mapState(["tickets", "ticket", "loading", "filteredTickets"]),
    ...mapGetters(["getYearMonthCount", "getTicketsTotal"]),
    yearMonthStats: function() {
        return this.getYearMonthCount;
    } 
  }
};
</script>

<style scoped>
</style>
