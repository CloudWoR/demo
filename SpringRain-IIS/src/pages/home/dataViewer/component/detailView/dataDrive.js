import echarts from 'echarts/lib/echarts'
import moment from 'moment'

const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
const option = {
  backgroundColor: '#fff',
  title: {
    text: '全国6月销售统计',
    textStyle: {
      fontSize: 12,
      fontWeight: 400
    },
    left: 'center',
    top: '5%'
  },
  legend: {
    icon: 'circle',
    top: '5%',
    right: '5%',
    itemWidth: 6,
    itemGap: 20,
    textStyle: {
      color: '#556677'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      label: {
        show: true,
        backgroundColor: '#fff',
        color: '#556677',
        borderColor: 'rgba(0,0,0,0)',
        shadowColor: 'rgba(0,0,0,0)',
        shadowOffsetY: 0
      },
      lineStyle: {
        width: 0
      }
    },
    backgroundColor: '#fff',
    textStyle: {
      color: '#5c6c7c'
    },
    padding: [10, 10],
    extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
  },
  grid: {
    top: '15%'
  },
  xAxis: [{
    type: 'category',
    data: ['登记', '完成检查', '书写报告', '审核报告'],
    axisLine: {
      lineStyle: {
        color: '#DCE2E8'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      textStyle: {
        color: '#556677'
      },
      // 默认x轴字体大小
      fontSize: 12,
      // margin:文字到x轴的距离
      margin: 15
    },
    axisPointer: {
      label: {
        // padding: [11, 5, 7],
        padding: [0, 0, 10, 0],
        /*
除了padding[0]建议必须是0之外，其他三项可随意设置

和CSSpadding相同，[上，右，下，左]

如果需要下边线超出文字，设左右padding即可，注：左右padding最好相同

padding[2]的10:

10 = 文字距下边线的距离 + 下边线的宽度

如：UI图中文字距下边线距离为7 下边线宽度为2

则padding: [0, 0, 9, 0]

        */
        // 这里的margin和axisLabel的margin要一致!
        margin: 15,
        // 移入时的字体大小
        fontSize: 12,
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#fff' // 0% 处的颜色
          }, {
            // offset: 0.9,
            offset: 0.86,
            /*
0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）

            */
            color: '#fff' // 0% 处的颜色
          }, {
            offset: 0.86,
            color: '#33c0cd' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#33c0cd' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    boundaryGap: false
  }],
  yAxis: [{
    type: 'value',
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#DCE2E8'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#556677'
      }
    },
    splitLine: {
      show: false
    }
  }, {
    type: 'value',
    position: 'right',
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#556677'
      },
      formatter: '{value}'
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#DCE2E8'
      }
    },
    splitLine: {
      show: false
    }
  }],
  series: [
    {
      name: 'Adidas',
      type: 'line',
      data: [10, 10, 30, 12, 15, 3, 7, 9, 8],
      symbolSize: 1,
      symbol: 'circle',
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: '#000'
        },
        {
          offset: 1,
          color: '#9E87FF'
        }
        ]),
        shadowColor: 'rgba(158,135,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      },
      itemStyle: {
        normal: {
          color: colorList[0],
          borderColor: colorList[0]
        }
      }
    },
    {
      name: 'Adidas',
      type: 'line',
      data: [100, 10, 30, 12, 15, 3, 7, 9, 8],
      symbolSize: 1,
      symbol: 'circle',
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: '#000'
        },
        {
          offset: 1,
          color: '#9E87FF'
        }
        ]),
        shadowColor: 'rgba(158,135,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      },
      itemStyle: {
        normal: {
          color: colorList[0],
          borderColor: colorList[0]
        }
      }
    },
    {
      name: 'yezz',
      type: 'line',
      data: [5, 12, 11, 14, 25, 16, 10, 19, 25],
      symbolSize: 1,
      symbol: 'circle',
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
          offset: 0,
          color: '#73DD39'
        },
        {
          offset: 1,
          color: '#73DDFF'
        }
        ]),
        shadowColor: 'rgba(115,221,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      },
      itemStyle: {
        normal: {
          color: colorList[1],
          borderColor: colorList[1]
        }
      }
    },
    {
      name: '6号检查室',
      type: 'line',
      data: [150, 120, 170, 140, 500, 160, 110, 95, 165],
      symbolSize: 1,
      yAxisIndex: 1,
      symbol: 'circle',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 5,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: '#37ecba'
        },
        {
          offset: 1,
          color: '#72afd3'
        }
        ]),
        shadowColor: 'rgba(254,154,139, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 20
      },
      itemStyle: {
        normal: {
          color: colorList[2],
          borderColor: colorList[2]
        }
      }
    }
  ]
}

class BaseSeries {
  constructor () {
    this.name = ''
    this.type = 'line'
    this.data = []
    this.symbolSize = 1
    this.yAxisIndex = 1
    this.symbol = 'circle'
    this.smooth = true
    this.showSymbol = false
    this.lineStyle = {
      width: 5,
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        offset: 0,
        color: '#37ecba'
      },
      {
        offset: 1,
        color: '#72afd3'
      }
      ]),
      shadowColor: 'rgba(100,155,139, 0.3)',
      shadowBlur: 10,
      shadowOffsetY: 20
    }
    this.itemStyle = {
      normal: {
        color: colorList[2],
        borderColor: colorList[2]
      }
    }
  }

  update (data) {
    this.name = data.modality
    this.data = data
  }
}

export default class DataDiver {
  constructor () {
    this.backgroundColor = '#fff'
    this.title = option.title
    this.legend = option.legend
    this.tooltip = option.tooltip
    this.grid = { top: '15%' }
    this.xAxis = option.xAxis
    this.yAxis = option.yAxis
    this.series = option.series
  }

  option () {
    return {
      backgroundColor: this.backgroundColor,
      title: this.title,
      legend: this.legend,
      tooltip: this.tooltip,
      grid: this.grid,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      series: this.series
    }
  }

  formatDate (second) {
    return moment.duration(second, 'second').asMinutes().toFixed(2)
  }

  seriesFormat (data) {
    const series = []
    const baseColor = 0x37ecba
    const baseGradualColor = 0x72afd3
    data.forEach((item, index) => {
      const baseSerise = new BaseSeries()
      const avgData = [
        0,
        this.formatDate(item.avgStudyTime),
        this.formatDate(item.avgReportTime),
        this.formatDate(item.avgAuditTime)
      ]
      baseSerise.name = `${item.modality}-${item.patientType}`
      baseSerise.data = avgData
      baseSerise.lineStyle.color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        offset: 0,
        color: `#${(baseColor + (item.avgReportTime * 2 * 30 * index)).toString(16)}`
      },
      {
        offset: 1,
        color: `#${(baseGradualColor + (item.avgReportTime * 2 * 30 * index)).toString(16)}`
      }
      ])
      baseSerise.itemStyle.normal.color = `#${(0xf78ca0 + item.avgReportTime * 10 * index).toString(16)}`
      series.push(baseSerise)
    })
    this.series = series
  }
}
