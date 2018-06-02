// pages/me/myfriend/myfriend.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasID: true,
    userID: '',
    friend: ['张三', '李四', '王五', '赵六', '周七', 'James', 'Paul', 'Durant'],
    isshowfriend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.id)
    this.setData({
      userID: app.globalData.userID
    })
    wx.request({
      url: app.globalData.web_server + 'getMyFriendsList/' + app.globalData.id,
      method: 'GET',
      success: res => {
        console.log(res)
        var object_array = Array()
        for (var i = 0; i < res.data.length; i++) {
          object_array.push(JSON.parse(res.data[i]))
        }
        var friend_list = this.refinded_array(object_array)
        // console.log(friend_list)
        this.setData({
          friend: friend_list
        })
      }
    })

  },
  refinded_array: function (object_arrays) {
    // console.log(object_arrays)
    var refined_array = Array()
    var dict = { avatarUrl: '', name: '' }
    for (var i = 0; i < object_arrays.length; i++) {
      dict['avatarUrl'] = object_arrays[i]['portrait_url']
      dict['name'] = object_arrays[i]['name']
      refined_array.push(dict)
    }
    // console.log(refined_array)
    return refined_array
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
  showfriend: function () {
    this.setData({
      isshowfriend: !this.data.isshowfriend
    })
  },
  NTdetail: function (event) {
    var url = event.currentTarget.dataset.avatarUrl
    var name = '蒋波'
    var avatarUrl = '123456789'
    wx.navigateTo({
      url: '/pages/me/myfriend/detail/detail?url=' + avatarUrl + '&name=' + name,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})