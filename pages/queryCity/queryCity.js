// pages/queryCity/queryCity.js
let app = getApp();
const {
  $Toast
} = require('../../assets/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val: "",
    topCity: [],
    // 聚焦
    showAdministration: true,
    showHot: false,
    city: {},
    cityList: [],
    targetCity: '',
    // 是否删除城市
    isShowTip: false,
    lock: false
  },
  // 聚焦
  showAdmin() {
    // 设置管理城市列表不可见
    // 设置热门城市可见
    this.setData({
      showAdministration: false,
      showHot: true
    })

  },
  // 获取热门城市
  getHotCity() {
    let params = {
      lang: 'zh',
      number: 12,
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://search.heweather.net/top?group=cn',
      data: params,
      method: "GET",
      success: (response) => {
        wx.setStorage({
          key: "_topCity",
          data: JSON.stringify(response.data.HeWeather6[0].basic)
        })
        this.setData({
          topCity: response.data.HeWeather6[0].basic
        })
      }
    })
  },

  // 获取城市天气
  getCity(e) {
    let params = {
      lang: 'zh',
      location: e.detail.value,
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://search.heweather.net/find',
      data: params,
      method: "GET",
      success: (response) => {
        if (response.data.HeWeather6[0].status !== 'ok') {
          return
        }
        this.setData({
          city: response.data.HeWeather6[0].basic[0]
        })
      },
      complete: (res) => {
        // 去往天气详情页 (传递地理位置)
        if (res.data.HeWeather6[0].status !== 'ok') {
          $Toast({
            content: '没有这个城市'
          });
          this.setData({
            val: ''
          })
          return
        }
        wx.navigateTo({
          url: '../home/home',
          success: (response) => {
            app.globalData.city = this.data.city
            this.setData({
              val: ''
            })
          }
        })

      }
    })
  },
  clickValue(e) {
    console.log(e.target.dataset.location)
    let params = {
      lang: 'zh',
      location: e.target.dataset.location,
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://search.heweather.net/find',
      data: params,
      method: "GET",
      success: (response) => {
        console.log(response.data)
        this.setData({
          city: response.data.HeWeather6[0].basic[0]
        })
      },
      complete: () => {
        // 去往天气详情页 (传递地理位置)
        app.globalData.isSearch = true;
        wx.navigateTo({
          url: '../home/home',
          success: (response) => {
            app.globalData.city = this.data.city
          }
        })

      }
    })
  },

  // 获取已添加的城市列表
  getcollect() {
    wx.getStorage({
      key: '_cityList',
      success: (res) => {
        console.log(res)
        this.setData({
          cityList: JSON.parse(res.data).data
        })
      }
    })
  },

  // 选择要删除城市
  deleCity(e) {
    this.setData({
      targetCity: e.currentTarget.dataset.city,
      isShowTip: true
    })
    this.setData({
      lock: true
    });
  },
  // 确定删除城市
  sureDele() {
    // 找出要删除的城市
    console.log(this.data.cityList)
    let cList = [...this.data.cityList];
    cList.forEach((item, index) => {
      if (item.data.city == this.data.targetCity) {
        console.log(index, '是否删除当前城市')
        cList.splice(index, 1)
      };
    })
    this.setData({
      cityList: cList,
      isShowTip: false
    })
    console.log(this.data.cityList)

    wx.setStorage({
      key: "_cityList",
      data: JSON.stringify({
        expires: Date.now() + 1000 * 60 * 30,
        data: cList
      })
    })
  },
  // 不删除
  noDele() {
    this.setData({
      isShowTip: false
    })
  },
  // 取消
  cancel(e) {
    if (this.data.lock) {
      return;
    }
    if (e.detail.x > 308 || e.detail.y < 233 || e.detail.x < 63 || e.detail.y > 386) {
      this.setData({
        isShowTip: false
      })
    }
    // 设置城市列表可见
    this.setData({
      showAdministration: true,
      showHot: false
    })
  },
  // 当手指从屏幕上离开的时候触发
  touchend() {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({
          lock: false
        });
      }, 100);
    }
  },
  //去到点击的城市
  currentCity(e) {
    console.log(e.currentTarget.dataset.city);
    let params = {
      lang: 'zh',
      location: e.currentTarget.dataset.city,
      key: 'd9900c9db707486d9a5603ef6348db66'
    }
    wx.request({
      url: 'https://search.heweather.net/find',
      data: params,
      method: "GET",
      success: (response) => {
        console.log(response.data)
        this.setData({
          city: response.data.HeWeather6[0].basic[0]
        })
      },
      complete: () => {
        // 去往天气详情页 (传递地理位置)
        app.globalData.isSearch = true;
        wx.navigateTo({
          url: '../home/home',
          success: (response) => {
            app.globalData.city = this.data.city
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: '_topCity',
      success: (res) => {
        // console.log(JSON.parse(res.data))
        this.setData({
          topCity: JSON.parse(res.data)
        })
      },
      fail: (res) => {
        this.getHotCity()
      }
    })
    this.getcollect()
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