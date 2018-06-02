// pages/me/change/change.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  changeID:function(e){
    var inputid = e.detail.value
    this.setData({
      inputID:inputid
    })
  },
  //改变ID
  change:function(){
    var new_id = this.data.inputID
    //提示框 是否改变
    wx.showModal({
      title: '你确定将ID改为',
      content: new_id ,
      success: function (res) {
        //点击确定
        if (res.confirm) {
          //检测输入的id是否可用
          wx.request({
            url: 'http://140.143.91.27:8080/check_my_UniqueId/' + new_id,
            method: 'GET',
            success: res => {
              console.log(res)
              //如果可用 就进行修改
              if("success".localeCompare(res.data.res_msg) == 0){
                var last_id = app.globalData.userID
                wx.request({
                  url: 'http://140.143.91.27:8080/change_my_UniqueId/' + last_id + '/' + new_id,
                  method: 'GET',
                  success: res => {
                    //如果修改成功
                    if ("success".localeCompare(res.data.res_msg) == 0){
                      app.globalData.userID = new_id
                      wx.showToast({
                        title: '修改成功！',
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      //未成功的话
                      app.globalData.userID = ''
                      wx.showToast({
                        title: '修改失败！',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }else{
                wx.showToast({
                  title: '修改失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })

  }
})