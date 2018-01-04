// pages/detail/detail.js
var network = require("../../utils/util.js")
import { index_newsList } from '../../url.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaildata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var articleId = options.id;
    var that = this;
    network.requestLoading(index_newsList, '', '正在加载数据', function (res) {
      console.log(res)
      var detailsData = res.data[0];
      var detaildata = detailsData[articleId];
      console.log(detaildata);
      that.setData({
        detaildata:detaildata
      })

    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
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