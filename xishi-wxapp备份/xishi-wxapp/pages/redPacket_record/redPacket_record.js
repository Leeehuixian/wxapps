var utils = require("../../utils/util.js");
import { get_giveOutRecord, get_grabRecord, get_showInfo } from '../../url.js';
var drawText = utils.drawText;
const app = getApp();
var sessionKey = '';
Page({

  data: {
    nickName: '',
    typeTxt:'共发出',
    amountMoney:0,
    bonusCount:0,
    recordList:[],
    currentTab:0,
    hasMore:true,
    loadingTipHide:true,
    pageIndex:0,
    hideWithdraw:true,
    hideModalBg: true,
    share_bgUrl: '',
    wxaCode_url: '',
    avatarUrl:'',
    totalSend: 0,
    totalGet: 0
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }

    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
    })
    this.get_RecordFun(this.data.currentTab, this.data.pageIndex);
    this.getShowInfoFun();//获取晒红包数据
  },

  tapTab:function(e){
    this.setData({
      currentTab: Number(e.currentTarget.dataset.tabindex),
      recordList: [],
      hasMore: true,
      pageIndex: 0,
      loadingTipHide: true,
    });
    this.get_RecordFun(this.data.currentTab);
  },

  getShowInfoFun: function () {
    let that = this;
    utils.requestLoading(get_showInfo + "?sessionKey=" + sessionKey, "post", "", "",
      function (res) {
        if (res.Status == 5) {
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
          return;
        };

        that.setData({
          share_bgUrl: res.BackGroundImgUrl,
          wxaCode_url: res.showcodeurl,
          totalSend: res.totalsend,
          totalGet: res.totalget
        })
      }, function (res) {
        console.log(res)
      }
    )
  },

  get_RecordFun: function (currentTab){
    let that = this;
    let pageIndex = that.data.pageIndex;
    let url = '';
    if (currentTab == 0){
      that.setData({
        typeTxt: '共发出',
      });
      url = get_giveOutRecord;
    } else if (currentTab == 1){
      that.setData({
        typeTxt: '共收到',
      });
      url = get_grabRecord;
    }
    utils.requestLoading(url + "?sessionKey=" + sessionKey, "post", 
      JSON.stringify(
        { 
          Pager: { PageIndex: pageIndex, PageSize: 10 } 
        }
      ),"数据加载中",function(res){
      if(res.Status == 5){
        wx.removeStorageSync("sessionKey");
        utils.getSessionKey(utils.getSetting);
        return;
      };

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      var resData = that.data.recordList.concat(res.DetailList);
      if (res.DetailList.length == 0) {
        if (pageIndex == 0) {
          that.setData({
            loadingTipHide: false,
          });
        };
        that.setData({
          hasMore: false
        });
        console.log(that.data.hasMore);
      } else {
        pageIndex++;
        that.setData({
          loadingTipHide: true,
          pageIndex: pageIndex,
          amountMoney: res.AmountSum,
          bonusCount: res.BonusCount,
          recordList: resData
        });
      }

    },function(res){
      console.log(res);
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({
      recordList: [],
      hasMore: true,
      pageIndex: 0,
      loadingTipHide: true,
    });
    this.get_RecordFun(this.data.currentTab);
  },

  //上拉加载
  onReachBottom: function () {
    let that = this;
    console.log(this.data.hasMore);
    if (that.data.hasMore) {
      that.setData({
        loadingTipHide: true
      });
      that.get_RecordFun(that.data.currentTab);
    } else {
      that.setData({
        loadingTipHide: false
      })
    }
  },

  bindTapWithdraw: function () {
    this.setData({
      hideWithdraw: false,
    });
  },

  bindTapSun: function () {
    this.setData({
      hideModalBg : false,
    });
  },

  bindTapSend: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //收起模态窗口
  bindModalTap: function () {
    this.setData({
      hideModalBg: true,
      hideWithdraw: true,
    });
  },

  //晒红包
  bindTapSun: function () {
    wx.showToast({
      title: '图片生成中',
      icon: 'loading',
      duration: 3000
    })
    var that = this;
    that.setData({
      hideModalBg: false
    });
    var ctx = wx.createCanvasContext('myCanvas');
    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0, 0, 478, 770);
    ctx.setFontSize(15);
    ctx.setFillStyle('#000000');
    drawText("长按扫码发红包", 0, 366, 10, ctx); 
    wx.getImageInfo({
      src: that.data.share_bgUrl,
      success: function (res) {
        ctx.drawImage(res.path, 0, 0, 239, 348);
        ctx.draw(true);
        ctx.setFontSize(25);
        ctx.setFillStyle('#f32a43');
        drawText(that.data.totalGet.toString(), 166, 182, 6, ctx);
        drawText(that.data.totalSend.toString(), 166, 223, 6, ctx); 
        wx.getImageInfo({
          src: that.data.avatarUrl,
          success: function (res) {
            ctx.drawImage(res.path, 19, 40, 201, 129);
            ctx.draw(true);
          },
          fail: function (res) {
            console.log(res);
          }
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
    wx.getImageInfo({
      src: that.data.wxaCode_url,
      success: function (res) {
        ctx.drawImage(res.path, 183, 352, 59, 59);
        ctx.draw(true);
      },
      fail: function (res) {
        console.log(res);
      }
    });
    

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
  } 



  
})