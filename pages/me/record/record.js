const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      success(res){
        console.log(res.code)
        that.setData({
          code:res.code
        })
      },
      fail(){

      }
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
    
  },
  getID: function () {
    console.log(app.globalData.code)
    wx.request({
      url: 'http://140.143.91.27:8080/UserLogin',
      method: 'POST',
      data: {
        "code": this.data.code,
        "name": app.globalData.userInfo.nickName,
        "portrait_url": app.globalData.userInfo.avatarUrl
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success (res){
        console.log(res)
        // this.setData({
        //   'userID': res.data.uniqueId,
        //   'hasID': true
        // })
        // app.globalData.hasID = true
        // app.globalData.userID = res.data.uniqueId
      }
    })
  },
})