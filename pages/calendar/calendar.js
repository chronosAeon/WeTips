//morningf@foxmail.com
// const app = getApp()
var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();

//月份天数表
var DAY_OF_MONTH = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

//判断当前年是否闰年
var isLeapYear = function(year){
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        return 1
    else
        return 0
};

//获取当月有多少天
var getDayCount = function(year, month){
    return DAY_OF_MONTH[isLeapYear(year)][month];
};

//获取当前索引下是几号
var getDay = function(index) {
    return index - curDayOffset;
};

var pageData = {
    date: "",                //当前日期字符串

    //arr数据是与索引对应的数据信息
    arrIsShow: [],          //是否显示此日期
    arrDays: [],            //关于几号的信息
    arrInfoEx: [],          //农历节假日等扩展信息
    arrInfoExShow: [],      //处理后用于显示的扩展信息

    //选择一天时显示的信息
    detailData: {
        curDay: "",         //detail中显示的日信息
        curInfo1: "",
        curInfo2: "",
    },
    information:[],
  WeeklyThing : true,
}

//设置当前详细信息的索引，前台的详细信息会被更新
var setCurDetailIndex = function(index){
    var curEx = pageData.arrInfoEx[index];
    curDay = curEx.sDay;
    pageData.detailData.curDay = curEx.sDay;
}

//刷新全部数据
var refreshPageData = function(year, month, day){
    pageData.date = year+'年'+(month+1)+'月';

    var offset = new Date(year, month, 1).getDay();

    for (var i = 0; i < 42; ++i)
    {
        pageData.arrIsShow[i] = i < offset || i >= getDayCount(year, month) + offset ? false : true;
        pageData.arrDays[i] = i - offset+1 ;
        var d = new Date(year, month, i - offset+1 );
        var dEx = calendarConverter.solar2lunar(d);
        pageData.arrInfoEx[i] = dEx;
        if ("" != dEx.lunarFestival)
        {
            pageData.arrInfoExShow[i] = dEx.lunarFestival;
        }
        else if ("初一" === dEx.lunarDay)
        {
            pageData.arrInfoExShow[i] = dEx.lunarMonth + "月";
        }
        else
        {
            pageData.arrInfoExShow[i] = dEx.lunarDay;
        }
    }

    setCurDetailIndex(offset + day-1);
};

var curDate = new Date();
var curMonth = curDate.getMonth();
var curYear = curDate.getFullYear();
var curDay = curDate.getDate();
refreshPageData(curYear, curMonth, curDay);
const app = getApp()
Page({
    data:pageData,

    onLoad: function(options){
      this.setData({
        calendar_img: app.globalData.web_server_img + 'calendar-img1.png'
      })
      if (!app.globalData.id)
      {
        // id是空的代表连登陆都没有就必须跳转到登陆授权去
        wx.switchTab({
          url: '/pages/me/me',
        })
      }
        
    },
    onShow:function(options){
      if (app.globalData.id) {
        wx.request({
          url: app.globalData.web_server + 'getAnnouncesById/' + app.globalData.id,
          success: res => {
            //  先反序列化数组,然后处理两种数据类型
            // console.log(res)
            var dataObject_array = Array()
            for (var i = 0; i < res.data.length; i++) {
              dataObject_array.push(JSON.parse(res.data[i]))
            }

            var refined_array = this.refined_data(dataObject_array)
            // console.log(refined_array)
            this.setData({
              information: refined_array
            })
            console.log(this.data.information)
          }
        })
      }
      
    },
    refined_data: function (array) {
      // 精炼数据
      var refined_array = Array()
      for (var i = 0; i < array.length; i++) {
        if (array[i].announce_type == 'text') {
          var dict = { time: array[i].valid_time, message: array[i].announce_content }
          refined_array.push(dict)
        }
        else {

        }
      }
      return refined_array
    },
    
//跳转到今天
    goToday: function(e){
        curDate = new Date();
        curMonth = curDate.getMonth();
        curYear = curDate.getFullYear();
        curDay = curDate.getDate();
        refreshPageData(curYear, curMonth, curDay);
        this.setData(pageData);
    },
//返回上个月
    goLastMonth: function(e){
        if (0 == curMonth)
        {
            curMonth = 11;
            --curYear
        }
        else
        {
            --curMonth;
        }
        refreshPageData(curYear, curMonth, 1);
        this.setData(pageData);
    },
//去下个月
    goNextMonth: function(e){
        if (11 == curMonth)
        {
            curMonth = 0;
            ++curYear
        }
        else
        {
            ++curMonth;
        }
        refreshPageData(curYear, curMonth, 1);
        this.setData(pageData);
    },
//选择本月日期
    selectDay: function(e){
        setCurDetailIndex(e.currentTarget.dataset.dayIndex);
        this.setData({
            detailData: pageData.detailData,
        })
    },
//跳转年月日
    bindDateChange: function(e){
      var arr = e.detail.value.split("-");
      refreshPageData(arr[0], arr[1]-1, arr[2]-1);
      pageData.detailData.curDay++;
      this.setData(pageData);
    },
//展示这周待办事项
    showWeeklyThing:function(){
      this.setData({
        WeeklyThing: !this.data.WeeklyThing
      })
    }
})