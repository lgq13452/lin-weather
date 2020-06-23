// pages/forecast/forecast.js
import * as echarts from '../../assets/ec-canvas/echarts';
let app = getApp();
let chart = [];

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '7天趋势预报'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['最高气温', '最低气温'],
      right: '20px'
    },
    xAxis: {
      type: 'category',
      // 不从零开始
      boundaryGap: true,
      data: app.globalData.date
    },
    yAxis: {
      type: 'value',
      max: 40,
      min: 10,
      minInterval: 5,
      interval: 5, //每次增加几个

      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [{
        name: '最高气温',
        type: 'line',
        data: app.globalData.tmp_max,
        itemStyle: {
          normal: {
            label: {
              show: true
            }
          }
        },
      },
      {
        name: '最低气温',
        type: 'line',
        data: app.globalData.tmp_min,
        itemStyle: {
          normal: {
            label: {
              show: true
            }
          }
        },
      }
    ]

  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    forecast: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.date)
    this.setData({
      forecast: app.globalData.forecast
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})