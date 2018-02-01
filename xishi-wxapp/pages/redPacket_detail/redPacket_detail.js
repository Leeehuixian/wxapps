import {get_bonusDetailList} from "../../url.js";
var utils = require("../../utils/util.js");
const app = getApp();
var sessionKey = '';
Page({
  data: {
    hideModalBg:true,
    bonusId:'',
    bonusCount:'',
    openCount:'',
    amountSum:'',
    myMoney:'',
    headImgUrl:'',
    nickName:'',
    detailList:[]
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }
    var bounsId = options.id;
    this.getRecord(bounsId);//获取红包领取结果
    
    
  },

  getRecord: function (bounsId){
    let that = this;
    utils.requestLoading(get_bonusDetailList + "?sessionKey=" + sessionKey, "post",
      JSON.stringify({ bonusId: bounsId }), "数据加载中...",
      function (res) {
        console.log(res)
        if (res.Msg == ""){
          that.setData({
            bonusId: res.BonusId,
            bonusCount: res.BonusCount,
            openCount: res.OpenCount,
            amountSum: res.AmountSum,
            myMoney: res.myMoney,
            headImgUrl: res.HeadImgUrl,
            nickName: res.NickName,
            detailList: res.DetailList
          })
        }else if(res.Status == 5){
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
        }else{
          wx.showToast({
            title: res.Message,
            icon: 'none'
          })
        }
      }, function (res) {
        console.log(res)
      }
    )
  },

  /*发送好友或群*/
  onShareAppMessage: function (res) {
    let that = this;
    this.goTopFun();
    setTimeout(function () {
      if (res.from === 'button') {
        // console.log(res.target)
      }
      return {
        title: '我的心意，请收下',
        path: '/pages/redPacket_index/redPacket_index?bonusId=' + that.data.bonusId,
        success: function (res) {
          wx.showShareMenu({
            withShareTicket: true
          });
        },
        fail: function (res) {
          console.log(res.shareAppMessage);
        }
      }
    }, 1000);
  },

  /*生成分享朋友圈图片*/
  bindShareTap: function () {
    var that = this;
    that.setData({
      hideModalBg: false
    });
    // var ctx = wx.createCanvasContext('myCanvas');
    // ctx.setFillStyle("#ffffff");
    // ctx.fillRect(0, 0, 530, 752);
    // ctx.setFontSize(15);
    // ctx.setFillStyle('#000000');
    // ctx.save();
    // drawText(that.data.detaildata.title.substr(0, 30) + "...", 10, 10, 14, ctx);
    // var publishInfo = that.data.detaildata.author + that.data.detaildata.publish_time;
    // ctx.setFontSize(12);
    // ctx.setFillStyle('#969696');
    // drawText(publishInfo.substr(0, 24), 10, 50, 24, ctx);
    // ctx.restore();
    // ctx.setFontSize(15);
    // ctx.setFillStyle('#000000');
    // drawText(that.data.detaildata.summary.substr(0, 50) + "...", 10, 75, 14, ctx);
    // wx.getImageInfo({
    //   src: that.data.detaildata.thumburl,
    //   success: function (res) {
    //     ctx.drawImage(res.path, 10, 120, 220, 110);
    //     ctx.draw(true);
    //   }
    // });
    // drawText("长按扫码阅读", 10, 260, 6, ctx);
    // wx.getImageInfo({
    //   src: that.data.detaildata.codeurl,
    //   success: function (res) {
    //     ctx.drawImage(res.path, 150, 250, 60, 60);
    //     ctx.draw(true);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // });

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
  bindSaveImageTap: function () {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth: 530,
      destHeight: 752,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '成功保存图片',
              showCancel: false,
              content: '已成功为你保存图片到手机相册，请自行前往朋友圈分享',
              success: function (res) { }
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
  bindModalTap: function () {
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
  }, 

  bindTapWithdraw:function(){
    wx.navigateTo({
      url: '/pages/redPacket_withdraw/redPacket_withdraw',
    })
  },

  bindTapSend: function () {
    wx.navigateTo({
      url: '/pages/redPacket_send/redPacket_send',
    })
  },
})