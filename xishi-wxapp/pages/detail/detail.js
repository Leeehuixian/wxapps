var utils = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
var drawText = utils.drawText;
import { article_detail, comment_list, comment_creat, comment_delete, comment_operation } from '../../url.js';
const app = getApp();
Page({
  data: {
    detaildata:"",
    articleContent:"",
    showView:true,
    inputValue: '',
    placeholderTxt:"写评论...",
    commentNum:0,
    toView:'',
    hideModalBg:true,
    articleId:'',
    commentList:[],
    scroll_top:0,
    loadingModalHide:false
  },
  onLoad: function (options) {
    var articleId = Number(options.id);
    var that = this;
    that.setData({
      articleId: articleId
    });
    //获取文章详情
    utils.requestLoading(article_detail +"&id="+articleId,'get', '', '正在加载数据', function (res) {
      console.log(res);
      that.setData({
        detaildata:res,
        articleContent: WxParse.wxParse('articleContent', 'html', res.articlecontent, that, 5),
        loadingModalHide:true
      });
    }, function () {
      wx.showToast({
        icon:none,
        title: '加载数据失败',
      })
    });

    that.getComment_list(that.data.articleId);
  },

  //获取文章评论
  getComment_list: function (articleId){
    var that = this;
    utils.requestLoading(comment_list, 'post', JSON.stringify({ ArticleID: articleId, OpenId: app.globalData.openId }), '正在加载数据', function (res) {
      that.setData({
        commentList: res
      })
    }, function () {
      wx.showToast({
        icon: none,
        title: '加载数据失败',
      })
    })
  },
  
  //删除评论
  bindDeleteTap:function(e){
    var that = this;
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
              });
              setTimeout(function () {
                that.getComment_list(that.data.articleId);
              }, 1000);
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
    var that = this;
    this.setData({
      toView: "comment-section"
    });
    utils.requestLoading(comment_creat, 'post', JSON.stringify({ PostMessage: e.detail.value, CreateBy: app.globalData.openId, CreatebyName: app.globalData.userInfo.nickName, ArticleID: this.data.articleId, HeadImgUrl: app.globalData.userInfo.avatarUrl}), '数据传输中...', function (res) {
      if (res.Message){
        wx.showToast({
          icon: "none",
          title: res.Message,
        });
        setTimeout(function(){
          that.getComment_list(that.data.articleId);
        },1000);
      }
    }, function () {
      wx.showToast({
        icon:"none",
        title: '发表失败',
      })
    });
  },

  /*查看评论*/
  bindReadComment:function(){
    this.setData({
      toView: "comment-section"
    })
  },

  /*评论点赞*/
  bindLikeTap:function(e){
    var that = this;
    utils.requestLoading(comment_operation, 'post', JSON.stringify({ MessageID: e.currentTarget.dataset.commentid, OpenId: app.globalData.openId, NickName: app.globalData.userInfo.nickName, ArticleID: this.data.articleId, OperateType: !e.currentTarget.dataset.ismylike }), '数据传输中...', function (res) {
      if (res.Message) {
        wx.showToast({
          icon: "none",
          title: res.Message,
        });
        setTimeout(function () {
          that.getComment_list(that.data.articleId);
        }, 1000);
      }
    }, function () {
      wx.showToast({
        icon: 'none',
        title: '操作失败',
      })
    });
  },
 
  /*发送好友或群*/
  onShareAppMessage: function (res) {
    this.goTopFun();
    setTimeout(function(){
      if (res.from === 'button') {
        // console.log(res.target)
      }
      return {
        success: function (res) {
          wx.showShareMenu({
            withShareTicket: true
          });
        },
        fail: function (res) {
          console.log(res.shareAppMessage);
        }
      }
    },1000);
  },

  /*生成分享朋友圈图片*/
  bindShareTap:function(){
    var that = this;
    that.setData({
      hideModalBg: false
    });
    var ctx = wx.createCanvasContext('myCanvas');
    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0, 0, 530, 752);
    ctx.setFontSize(15);
    ctx.setFillStyle('#000000');
    ctx.save(); 
    drawText(that.data.detaildata.title.substr(0, 30) + "...", 10, 10, 14, ctx);
    var publishInfo = that.data.detaildata.author + that.data.detaildata.publish_time;
    ctx.setFontSize(12);
    ctx.setFillStyle('#969696');
    drawText(publishInfo.substr(0,24), 10, 50, 24, ctx);
    ctx.restore();
    ctx.setFontSize(15);
    ctx.setFillStyle('#000000');
    drawText(that.data.detaildata.summary.substr(0,50)+"...", 10, 75, 14, ctx);  
    wx.getImageInfo({
      src: that.data.detaildata.thumburl,
      success: function (res) {
        ctx.drawImage(res.path, 10, 120, 220, 110);
        ctx.draw(true);
      }
    });
    drawText("长按扫码阅读", 10, 260, 6, ctx); 
    wx.getImageInfo({
      src: that.data.detaildata.codeurl,
      success: function (res) {
        ctx.drawImage(res.path, 150, 250, 60, 60);
        ctx.draw(true);
      },
      fail:function(res){
        console.log(res);
      }
    }); 
    // wx.downloadFile({
    //   url: that.data.detaildata.codeurl, 
    //   success: function (res) {
    //     if (res.statusCode === 200) {
    //       ctx.drawImage(res.path, 150, 250, 60, 60);
    //       ctx.draw(true);
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  },

  //生成临时文件
  bindSaveImageTap:function(){
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth:530,
      destHeight:752,
      success: function (res) {
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

  //返回顶部
  goTopFun: function (e) {
    var _top = this.data.scroll_top;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scroll_top': _top
    });
  } 

})