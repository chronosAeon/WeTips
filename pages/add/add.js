const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectYear:'',                            //选择年份
    selectMonth:'',                            //选择月份
    selectDay:'',                             //选择日期
    selectHour:'',                             //选择时
    selectMinute:'',                            //选择分
    selectModel:'',                             //  选择模式
    startImgPath:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1331708838,3257221471&fm=27&gp=0.jpg',
    friendArray:['张三','李四','王五','赵六','周七','James','Paul','Durant'],//朋友列表
    index:0,                                                        //朋友列表的索引


    recordUi: {
      record: "/images/recorder.png",
      recording: "/images/recorder.gif"
    },
    isRecording:false,                      //是否正在录音
    isOthers:'',                             //是否为他人添加
    tempFilePath:'',                          //暂存文件路径
    duration:0,
    playUi: {
      play: "/images/play.png",
      playing: "/images/play.gif"
    },
    isPlaying:false
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
    var date = new Date();
    this.setData({
      selectYear: date.getFullYear(),
      selectMonth: date.getMonth()+1,
      selectDay: date.getDate(),
      selectHour:date.getHours(),
      selectMinute:date.getMinutes()
    })
    
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
  //选择日期
  SelectDate:function (e) {
    var arr = e.detail.value.split("-");
    this.setData({
      selectYear:arr[0],
      selectMonth:arr[1],
      selectDay:arr[2]
    })
  },
  //选择时间
  SelectTime:function(e){
    var arr = e.detail.value.split(":");
    this.setData({
      selectHour: arr[0],
      selectMinute: arr[1]
    })
  },
  //选择语音或者文字模式
  selectmedo:function(e){
    this.setData({
      selectModel: 0
    })
  },
  Selectmedo:function(){
    this.setData({
      selectModel: 1
    })
  },
  //选择朋友
  selectfriend:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  //是否为他人添加
  Others:function(e){
    this.setData({
      isOthers: e.detail.value
    })
  },
  startRecord:function(){
    this.setData({
      isRecording:true
    })
    //获得全局唯一的录音管理器 开始录音
    const recorderManager = wx.getRecorderManager()

    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
    const options = {
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }

    recorderManager.start(options)
  },
  //停止录音
  stopRecord:function(){
    this.setData({
      isRecording: false
    })
    const recorderManager = wx.getRecorderManager()
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      this.setData({
        tempFilePath: res. tempFilePath,
        duration: res.duration
      })
    })
    recorderManager.stop()
  },

  //播放录音
  play:function(){
    this.setData({
      isPlaying: true
    })
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.tempFilePath
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    setTimeout(function () {
      //结束录音  
      this.setData({
        isPlaying: false
      })
    }.bind(this), this.data.duration)
  },
  //获取录音内容
  content:function(e){
    console.log(e.detail.value)
  }
})