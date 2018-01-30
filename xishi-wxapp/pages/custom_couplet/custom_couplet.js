import { get_couplet } from "../../url.js"
var utils = require("../../utils/util.js")
const app = getApp();
var sessionKey = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupletList:[],
    radioCheckVal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.getSessionKey(utils.getSetting);
    sessionKey = wx.getStorageSync("sessionKey");
    var that = this;
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
        console.log(res);
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
    wx.setStorage({
      key: 'coupletId',
      data: e.currentTarget.dataset.coupletid,
    })
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