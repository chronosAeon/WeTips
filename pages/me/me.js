//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    id:'',
    userID:'',
    info_completed:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  onLoad: function () {
    console.log(app.globalData.id)
    console.log(app.globalData.userID)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code
        console.log('code:' + app.globalData.code)
        var nick_name = ''
        if (app.globalData.userInfo) {
          // 如果已经回调成功
          nick_name = app.globalData.userInfo.nickName
        }
        else {
          nick_name = ''
        }
        wx.request({
          url: 'http://140.143.91.27:8080/UserLogin',
          method: 'POST',

          data: {
            "code": app.globalData.code,
          },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: res => {
            console.log(res.data.uniqueId)
            // this.globalData.hasID = true
            app.globalData.userID = res.data.uniqueId
            app.globalData.id = res.data.id
            wx.request({
              url: 'http://140.143.91.27:8080/checkinfoCompleted/' + app.globalData.id,
              method: 'GET',
              success: res => {
                console.log(res)
                if (res.data.res_code == '200') {
                  app.globalData.info_completed = true
                  console.log(app.globalData.userID)
                  wx.request({
                    url: 'http://140.143.91.27:8080/getUserInfo/' + app.globalData.id,
                    method: 'GET',
                    success: res => {
                      if (res.data.res_code == 200)
                      {
                        var dic = {
                          avatarUrl: res.data.portrait_url,
                          nickName: res.data.name
                        }
                        console.log(dic)
                        this.setData({
                          userInfo: dic,
                    hasUserInfo: true,
                  })
                      }
                    }
                  })
                  this.setData({
                    info_completed: true,
                    id: app.globalData.id,
                    userID: app.globalData.userID
                  })

                  // this.setData({
                  //   userInfo: e.detail.userInfo,
                  //   hasUserInfo: true,
                  // })
                }
                else {
                  app.globalData.info_completed = false
                  console.log(app.globalData.userID)
                  this.setData({
                    info_completed: false,
                    id: app.globalData.id,
                    userID: app.globalData.userID
                  })
                }
              }
            })
          }
        })
      }
    })

    
  },
  //显示页面
  onShow: function () {
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
    var nick_name = ''
    if (app.globalData.userInfo.nickName)
    {
      nick_name = app.globalData.userInfo.nickName
    }
    else{
      nick_name = ''
    }
    //获取使用id
    if (!this.data.info_completed) {
      wx.login({
        success: res => {
        wx.request({
          url: 'http://140.143.91.27:8080/completeUserInfo/'+app.globalData.id,
          method: 'POST',
          data: {
            name: e.detail.userInfo.nickName,
            portrait_url: e.detail.userInfo.avatarUrl
          },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: res => {
              console.log(res)
              this.setData({
                info_completed: true,
              })
              app.globalData.info_completed = true
            }
          })
        }
      })
    }
  },
  myfriend:function(){
   wx.navigateTo({
      url: '../me/myfriend/myfriend',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  record:function(){
   wx.navigateTo({
      url: '../me/record/record',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  change: function () {
    wx.navigateTo({
      url: '../me/change/change',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  quit:function(){
    if (this.data.info_completed){
      wx.request({
        url: 'http://140.143.91.27:8080/Logout/' + this.data.id,
        method: 'GET',
        success: res => {
          console.log(res)
        }
      })
    
      this.setData({
        hasUserInfo: false,
        info_completed: false
      })
      app.globalData.info_completed = false
  
    }
  },
})
