// pages/detail/detail.js
var utils = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
var drawText = utils.drawText;
import { article_detail, comment_list, comment_creat, comment_delete } from '../../url.js';
const app = getApp();
Page({
  data: {
    detaildata:"",
    showView:true,
    inputValue: '',
    placeholderTxt:"写评论...",
    commentNum:2,
    toView:'',
    hideModalBg:true,
    articleId:'',
    commentList:[]
  },
  onLoad: function (options) {
    var articleId = Number(options.id);
    var that = this;
    that.setData({
      articleId: articleId
    });
    //获取文章详情
    utils.requestLoading(article_detail +"?id="+articleId,'get', '', '正在加载数据', function (res) {
      that.setData({
        detaildata: WxParse.wxParse('detaildata', 'html', res, that, 5)
      });
    }, function () {
      wx.showToast({
        icon:none,
        title: '加载数据失败',
      })
    });

    //获取文章评论
    utils.requestLoading(comment_list, 'post', JSON.stringify({ ArticleID : articleId}), '正在加载数据', function (res) {
      console.log(res);
      that.setData({
        commentList:res
      })
    }, function () {
      wx.showToast({
        icon:none,
        title: '加载数据失败',
      })
    });
  },

  //删除评论
  bindDeleteTap:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除这条评论吗？',
      success: function (res) {
        if (res.confirm) {
          utils.requestLoading(comment_delete, 'post', JSON.stringify({ commentid:e.currentTarget.dataset.commentid }), '数据传输中...', function (res) {
            if (res.Message) {
              wx.showToast({
                icon: "none",
                title: res.Message,
              })
            }
          }, function () {
            wx.showToast({
              icon: "none",
              title: '删除失败',
            })
          });

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

  //发表评论
  bindKeyConfirm: function(e){
    this.setData({
      toView: "comment-section"
    });
    utils.requestLoading(comment_creat, 'post', JSON.stringify({ PostMessage: e.detail.value, CreateBy: app.globalData.openId, CreatebyName: app.globalData.userInfo.nickName, ArticleID: this.data.articleId}), '数据传输中...', function (res) {
      if (res.Message){
        wx.showToast({
          icon: "none",
          title: res.Message,
        })
      }
    }, function () {
      wx.showToast({
        icon:"none",
        title: '发表失败',
      })
    });
  },

  bindReadComment:function(){
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
  }

})