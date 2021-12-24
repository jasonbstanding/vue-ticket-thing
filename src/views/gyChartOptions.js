const gyChartOptions = {
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
    title: {
      text: 'Tickets by Gig Type / Year'
    },
    xaxis: {
        position: 'top',
        tickPlacement: 'between',
        type: 'category',
        labels: { 
            show: true,
            rotate: 45
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
                    to: 200,
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

export default gyChartOptions;