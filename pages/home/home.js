// pages/home/home.js
let app = getApp();
const {
  $Toast
} = require('../../assets/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '0',
    latitude: '0',
    nation: '',
    province: '',
    city: '',
    district: '',
    street: '',
    // 常规天气数据
    weather: {},
    // 空气质量
    air: {},
    // 天气预报
    forecast: [],
    // 三天天气预报
    tempForecast: [],
    // 空气质量预报
    airForecast: [],
    // 三天空气质量预报
    tempAirForecast: [],
    // 逐小时天气预报
    hourly: [],
    // 当天
    dailyForecast: [],
    // 生活指数
    lifestyle: [],

    tip: {},
    // 显示提示
    isShowTip: false,
    // 是否查看更多
    isSeeMore: false,

    // 是否处于搜索
    isSearch: false,

    spinShow: true,
  },

  /**
   * 获取地理位置信息详情
   */
  getAddressDetail: function () {
    let that = this;

    wx.getLocation({
      type: 'wgs84', // 参考系
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        // console.log("纬度=" + latitude + " 经度=" + longitude);
        // console.log(app.globalData.city)
        if (app.globalData.city) {
          latitude = app.globalData.city.lat;
          longitude = app.globalData.city.lon;
        }

        that.setData({
          latitude: latitude,
          longitude: longitude
        });

        // 构建请求地址
        let qqMapApi = 'https://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
          longitude + "&key=" + 'M4TBZ-L32W6-DYSSP-MS2UE-M26AZ-ANB52' + "&get_poi=1";

        that.sendRequest(qqMapApi);
      },
      fail: function () {
        console.log("没有定位权限，无法服务");
        wx.showModal({
          title: '提示',
          content: '若点击不授权，无法提供天气服务',
          cancelText: '不授权',
          cancelColor: '#999',
          confirmText: '授权',
          confirmColor: '#f94218',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                  that.onLoad();
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    })
  },

  /**
   * 发送请求获取地图接口的返回值
   */
  sendRequest: function (qqMapApi) {
    let that = this;
    // 调用请求
    wx.request({
      url: qqMapApi,
      data: {},
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200 && res.data.status == 0) {
          // 从返回值中提取需要的业务地理信息数据
          that.setData({
            nation: res.data.result.address_component.nation,
            province: res.data.result.address_component.province,
            city: res.data.result.address_component.city,
            district: res.data.result.address_component.district,
            street: res.data.result.address_component.street
          });
          that.init()
          console.log(this.data.latitude, this.data.longitude)
        }
      },
      complete: () => {

        that.setData({
          spinShow: false,
        })
      }
    })
  },

  // 初始化
  init() {
    // 查询天气
    this.getWeather(this.data.latitude, this.data.longitude)
  },

  // 获取天气信息
  getWeather(latitude, longitude) {

    let params = {
      location: longitude + ',' + latitude,
      lang: 'zh',
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://api.heweather.net/s6/weather',
      data: params,
      method: 'GET',
      success: (response) => {

        // console.log(response.data.HeWeather6[0])
        this.setData({
          weather: response.data.HeWeather6[0].now,
          lifestyle: this.findIndex(response.data.HeWeather6[0].lifestyle)
        })

        let date = response.data.HeWeather6[0].daily_forecast;
        let week = [];
        let tmp_max = [];
        let tmp_min = [];

        date.forEach((item) => {
          item.week = this.dealTime(item.date);
          week.push(item.week);
          tmp_max.push(item.tmp_max);
          tmp_min.push(item.tmp_min);
          return item
        })

        this.setData({
          forecast: date,
          dailyForecast: response.data.HeWeather6[0].daily_forecast[0]
        })
        app.globalData.date = [...week];
        app.globalData.tmp_max = [...tmp_max];
        app.globalData.tmp_min = [...tmp_min];
        app.globalData.forecast = [...date];
        // console.log(app.globalData.forecast)



        this.setData({
          tempForecast: date.slice(0, 3)
        })

        let hour = response.data.HeWeather6[0].hourly
        hour.forEach((item) => {
          item.time = this.dealHour(item.time);
          return item
        })
        this.setData({
          hourly: hour
        })

      },
      fail: () => {},
      complete: () => {
        this.getAir(latitude, longitude)
      }
    })
  },

  // 获取空气质量信息
  getAir(latitude, longitude) {
    let params = {
      location: longitude + ',' + latitude,
      lang: 'zh',
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://api.heweather.net/s6/air',
      data: params,
      method: 'GET',
      success: (response) => {
        this.setData({
          air: response.data.HeWeather6[0].air_now_city
        })

        this.setData({
          airForecast: response.data.HeWeather6[0].air_forecast,
          tempAirForecast: response.data.HeWeather6[0].air_forecast.slice(0, 3),
        })
      },
      fail: () => {},
      complete: () => {
        //整合空气质量和天气预报
        this.dealData()
      }
    })
  },


  //整合空气质量和天气预报
  dealData() {
    let forecast = [...this.data.forecast];

    let newArr = [];

    forecast.forEach((item, index) => {
      let obj = this.data.airForecast[index];
      let newObj = {
        ...item,
        ...obj
      }
      newArr = [...newArr, newObj]
    })
    // console.log(newArr)
    this.setData({
      forecast: newArr
    })
    this.setData({
      tempForecast: newArr.slice(0, 3)
    })
  },


  // 处理时间方法
  dealTime(time) {
    // 取当前时间：
    let newdate = new Date();
    // 传入时间
    let end_date = new Date(time.replace(/-/g, "/"))
    //计算相差毫秒数
    let it_msec = end_date.getTime() - newdate.getTime();
    //计算相差分钟数
    let Minute = parseInt(it_msec / (1000 * 60));

    let today = newdate.getDate();
    let inputday = end_date.getDate();
    //计算相差天数
    let it_day = inputday - today;
    //星期X(0-6,0代表星期天)
    let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let week = end_date.getDay();
    if (it_day == 0) {
      return '今天';
    }
    if (it_day == 1) {
      return '明天';
    }
    if (it_day > 1) {
      return weekday[week];
    }

  },

  // 处理每小时方法
  dealHour(hour) {
    // 传入时间  2020-06-16 18:00
    return hour.split(' ')[1]
  },
  // 查找生活指数
  findIndex(arr) {
    let newArr = []
    arr.map((item) => {
      if (item.type == "drsg" || item.type == "uv" || item.type == "sport" || item.type == "cw" || item.type == "trav" || item.type == "ptfc") {
        newArr.push(item)
      }
    })
    return newArr
  },
  // 获取提示
  getTips(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      tip: e.currentTarget.dataset.tip
    })
    // 显示提示
    this.setData({
      isShowTip: true
    })
  },
  // 隐藏提示
  noShow(e) {
    // console.log(e.target.offsetTop)
    if (e.target.offsetTop < 931) {
      this.setData({
        isShowTip: false
      })
    }

  },

  // 查看近7日天气
  getMore() {

    wx.navigateTo({
      url: '/pages/forecast/forecast',
    })
  },

  // 查询城市天气
  queryCity() {
    wx.navigateTo({
      url: '/pages/queryCity/queryCity',
    })
  },

  addCity() {
    let cityList = [];
    wx.getStorage({
      key: '_cityList',
      success: (res) => {
        cityList = JSON.parse(res.data)
        console.log(cityList)
      },
      fail: (res) => {},
      complete: () => {
        // 判断城市是否已经存在
        // cityList.some((item) => {
        //   if (item.data[0].city == this.data.city) {
        //     console.log(item.data[0].city, this.data.city)
        //   }
        // })

        if (cityList && cityList.expires > Date.now()) {
          console.log(cityList.data, this.data.city)
          let isExist = cityList.data.some(item => item.data.city == this.data.city);

          if (!isExist) {
            let dataCity = {
              ...this.data.forecast[0],
              city: this.data.city
            }
            let setdata = [...cityList.data, {
              data: dataCity,
              tmp: this.data.weather.tmp
            }]

            wx.setStorage({
              key: "_cityList",
              data: JSON.stringify({
                expires: Date.now() + 1000 * 60 * 30,
                data: setdata
              })
            })
            $Toast({
              content: '已添加到我的城市'
            });

          } else {
            $Toast({
              content: '已添加到我的城市'
            });
            return
          }
        } else {
          let dataCity = {
            ...this.data.forecast[0],
            city: this.data.city
          }
          let setdata = [{
            data: dataCity,
            tmp: this.data.weather.tmp
          }]
          wx.setStorage({
            key: "_cityList",
            data: JSON.stringify({
              expires: Date.now() + 1000 * 60 * 30,
              data: setdata
            })
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.stopPullDownRefresh();
    // if (app.globalData.userInfo) {}
    if (app.globalData.isSearch == true) {
      this.setData({
        isSearch: true
      })
    }
    this.getAddressDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    app.globalData.city = {}
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
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