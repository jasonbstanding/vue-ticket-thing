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
            // colors: ["#668FFB"],
            title: {
              text: 'Gigs by Year/Month'
            },
            xaxis: {
                type: 'category',
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
            },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    radius: 0,
                    useFillColorAsStroke: true,
                    colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 0,
                            color: '#666666'
                        },
                        {
                            from: 1,
                            to: 4,
                            color: '#128FD9'
                        },
                        {
                            from: 5,
                            to: 8,
                            color: '#00A100'
                        },
                        {
                            from: 9,
                            to: 16,
                            color: '#FFB200'
                        },
                        {
                            from: 17,
                            to: 25,
                            color: '#FF0000'
                        },
                        {
                            from: 26,
                            to: 100,
                            color: '#000000'
                        }
                    ]
                    }
                }
            },
            stroke: {
                width: 1
            },
            legend: {
                show: false
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
#chart {
  max-width: 800px;
  margin: 55px auto;
}
</style>
