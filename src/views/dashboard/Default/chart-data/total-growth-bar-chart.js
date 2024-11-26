const getChartData = (salesData, soldQuantities, value, currencySymbol) => {
  let data = [];
  let name = '';
  let color = '#673ab7';
  let yAxisLabel = '';

  if (value === 'sales_amount') {
    data = salesData;
    name = 'Sales Amount';
    color = '#1e88e5';
    yAxisLabel = `Amount (${currencySymbol})`;
  } else if (value === 'sold_quantity') {
    data = soldQuantities;
    name = 'Sold Quantity';
    color = '#673ab7';
    yAxisLabel = 'Quantity';
  }

  return {
    height: 480,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        title: {
          text: yAxisLabel
        }
      },
      legend: {
        show: true,
        fontSize: '14px',
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        }
      },
      fill: {
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      },
      colors: [color]
    },
    tooltip: {
      y: {
        formatter: (val) => {
          if (value === 'sales_amount') {
            return `${currencySymbol}${val.toLocaleString()}`; 
          } else if (value === 'sold_quantity') {
            return `${val.toLocaleString()} units`; 
          }
        }
      }
    },
    series: [
      {
        name: name,
        data: data,
      }
    ]
  };
};

export default getChartData;
