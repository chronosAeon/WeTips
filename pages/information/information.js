// pages/information.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.id) {
      // id是空的代表连登陆都没有就必须跳转到登陆授权去
      wx.switchTab({
        url: '/pages/me/me',
      })
    }
    else {
      wx.request({
        url: app.globalData.web_server + 'getAnnouncesById/' + app.globalData.id,
        success: res => {
          //  先反序列化数组,然后处理两种数据类型
          // var res = JSON.parse(res.data)
          var dataObject_array = Array()
          for (var i = 0; i < res.data.length; i++) {
            dataObject_array.push(JSON.parse(res.data[i]))
          }

          var refined_array = this.refined_data(dataObject_array)
          console.log(refined_array)
          this.setData({
            information: refined_array
          })
        }
      })
    }

  },
  refined_data: function (array) {
    // 精炼数据
    var refined_array = Array()
    for (var i = 0; i < array.length; i++) {
      if (array[i].announce_type == 'text') {
        var dict = { time: array[i].valid_time, message: array[i].announce_content, friend: array[i].user_id }
        refined_array.push(dict)
      }
      else {

      }
    }
    return refined_array
  },
  touch_start: function (e) {
    console.log(e)
    this.setData({
      startX: e.touches[0].clientX
    })
  },
  touch_move: function (e) {
    console.log(e)
    if (e.touches[0].clientX-this.data.startX>75) {
      // 执行删除逻辑
      console.log('delete_data')
      //执行删除id操作，然后
    }
    else if (e.touches[0].clientX - this.data.startX < -75){
      //执行添加逻辑
      console.log('add_data')
    }
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