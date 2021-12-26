const ymTotChartOptions = {
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
      text: 'Totals by Year/Month'
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
                    to: 50,
                    color: '#128FD9'
                },
                {
                    from: 51,
                    to: 150,
                    color: '#00A100'
                },
                {
                    from: 151,
                    to: 250,
                    color: '#FFB200'
                },
                {
                    from: 251,
                    to: 450,
                    color: '#FF0000'
                },
                {
                    from: 451,
                    to: 3000,
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

export default ymTotChartOptions;