// pages/detail/detail.js
var network = require("../../utils/util.js")
import { index_newsList } from '../../url.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaildata:{},
    showView:false
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
    });
    showView: (options.showView == "true" ? true : false);
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '冬季恋歌',
      path: '/pages/index/index?id=123',
      success: function (res) {
        // 转发成功
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /*生成分享朋友圈图片*/
  onSharetap:function(){
    var ctx = wx.createCanvasContext('myCanvas2');
    ctx.drawImage("/images/authorimg.jpg", 0, 0, 400, 400);
    ctx.draw();
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    }); 
    console.log(that.data.showView);
  }
})