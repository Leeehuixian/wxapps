import { get_couplet,get_coupletType } from "../../url.js"
var utils = require("../../utils/util.js")
const app = getApp();
var sessionKey = '';
Page({
  data: {
    coupletList:[],
    radioCheckVal:0
  },

  onLoad: function (options) {
    utils.getSessionKey(utils.getSetting);
    sessionKey = wx.getStorageSync("sessionKey");
    var that = this;
    //获取对联类型
    utils.requestLoading(get_coupletType + "?sessionKey=" + sessionKey, "get", requestParams, "加载数据中...",
      function (res) {
        if (res.Status == 3 || res.Status == 5) {
          setTimeout(function () {
            wx.removeStorageSync("sessionKey");
            let curpage = getCurrentPages()[0];
            wx.reLaunch({
              url: "/" + curpage.route
            })
          }, 1000)
        }
        console.log(res);
      }, function (res) {
        console.log(res);
      }
    )
    //获取对联列表
    let requestParams = JSON.stringify({
      OpenId: app.globalData.openId,
    })
    utils.requestLoading(get_couplet+"?sessionKey="+sessionKey, "post", requestParams,"加载数据中...",
      function(res){
        if (res.Status == 3 || res.Status == 5) {
          setTimeout(function () {
            wx.removeStorageSync("sessionKey");
            let curpage = getCurrentPages()[0];
            wx.reLaunch({
              url: "/" + curpage.route
            })
          }, 1000)
        }

        that.setData({
          coupletList:res
        })
      },function(res){
        console.log(res);
      }
    )
  },

  /*选择对联*/
  radioCheckedChange:function(e){
    this.setData({
      radioCheckVal: e.currentTarget.dataset.checkindex
    })
    
    var pages = getCurrentPages();
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
      prePage.changeCouplet(e.currentTarget.dataset.couplettext, e.currentTarget.dataset.coupletid);
    }
  },  

  /*确定使用*/
  backToSend:function(){
    wx.navigateBack({
      delta: 1
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