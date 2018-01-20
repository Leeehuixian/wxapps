// pages/detail/detail.js
var utils = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
var drawText = utils.drawText;
import { article_detail } from '../../url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaildata:"",
    showView:true,
    inputValue: '',
    placeholderTxt:"写评论...",
    commentNum:2,
    toView:'',
    hideModalBg:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var article = '<div>我是HTML代码</div>';
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // var that = this;
    // WxParse.wxParse('article', 'html', article, that, 5);


    var articleId = Number(options.id);
    // var articleType = Number(options.type);
    var that = this;
    utils.requestLoading(article_detail +"?id="+articleId,'get', '', '正在加载数据', function (res) {
      // var detailsData = res[articleType];
      console.log(res);
      // var detaildata = res[articleId];
      that.setData({
        detaildata: WxParse.wxParse('detaildata', 'html', res, that, 5)
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    });

    this.getCommentData();
  },

  //删除评论
  bindDeleteTap:function(){
    wx.showModal({
      title: '提示',
      content: '确定要删除这条评论吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindInputFocus:function(){
    this.setData({
      placeholderTxt: "优质评论优先展示"
    })
  },

  bindKeyConfirm: function(e){
    
  },

  bindReadComment:function(){
    console.log(1);
    this.setData({
      toView: "comment-section"
    })
  },
 
  /*发送好友或群*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '冬季恋歌',
      path: '/pages/index/index?id=123',
      success: function (res) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail: function (res) {
        console.log(res.shareAppMessage);
      }
    }
  },

  /*生成分享朋友圈图片*/
  bindShareTap:function(){
    console.log("生成分享朋友圈图片");
    var that = this;
    that.setData({
      hideModalBg: false
    });
    var ctx = wx.createCanvasContext('myCanvas');
    ctx.setFontSize(15);
    ctx.save(); 
    drawText(that.data.detaildata.title.substr(0, 30) + "...", 10, 10, 14, ctx);
    var publishInfo = that.data.detaildata.author + that.data.detaildata.publish_time;
    ctx.setFontSize(12);
    ctx.setFillStyle('#969696');
    drawText(publishInfo, 10, 50, 24, ctx);
    ctx.restore();
    drawText(that.data.detaildata.content.substr(0,50)+"...", 10, 75, 14, ctx);   
    wx.getImageInfo({
      src: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
      success: function (res) {
        console.log(res.path);
        // ctx.drawImage(res.path, 0, 0, 25, 25);
        ctx.draw(true);
      }
    });
    // wx.downloadFile({
    //   url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
    //   success: function (res) {
    //     ctx.drawImage(res.tempFilePath, 25, 25);
        
    //   }
    // })
  },

  //生成临时文件
  bindSaveImageTap:function(){
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth:265,
      destHeight:376,
      success: function (res) {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '成功保存图片',
              showCancel:false,
              content: '已成功为你保存图片到手机相册，请自行前往朋友圈分享',
              success: function (res) {}
            })
          },
          fail(res) {
            console.log("图片保存失败");
          }
        })
      }
    })
  },

  //收起模态窗口
  bindModalTap:function(){
    this.setData({
      hideModalBg: true
    });
  },

  //获取评论
  getCommentData:function(){
    // wx.request({
    //   url: 'http://www.xinwangai.com.cn/wx.toutiao.web/api/ApiMessage/list', //仅为示例，并非真实的接口地址
    //   data: {
    //     ArticleID:'20180119'
    //   },
    //   method:"post",
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  }

  
})