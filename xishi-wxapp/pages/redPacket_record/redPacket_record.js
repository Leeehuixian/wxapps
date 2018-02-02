var utils = require("../../utils/util.js")
import { get_giveOutRecord,get_grabRecord } from '../../url.js'
const app = getApp();
var sessionKey = '';
Page({

  data: {
    headImgUrl: '',
    nickName: '',
    typeTxt:'共发出',
    amountMoney:0,
    bonusCount:0,
    recordList:[],
    currentTab:0,
    hasMore:true,
    loadingTipHide:true,
    pageIndex:0
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }

    this.setData({
      headImgUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
    })
    this.get_RecordFun(this.data.currentTab, this.data.pageIndex);
  },

  tapTab:function(e){
    this.setData({
      currentTab: Number(e.currentTarget.dataset.tabindex),
      recordList: [],
      hasMore: true,
      pageIndex: 0,
      loadingTipHide: false,
    });
    this.get_RecordFun(this.data.currentTab);
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
      } else {
        pageIndex++;
        that.setData({
          loadingTipHide: true,
          pageIndex: pageIndex,
          amountMoney: res.AmountSum,
          bonusCount: res.BonusCount,
          recordList: res.DetailList
        });
      }

    },function(res){
      console.log(res);
    });
  },

  bindTapWithdraw: function () {
    wx.navigateTo({
      url: '/pages/redPacket_withdraw/redPacket_withdraw',
    })
  },

  bindTapSend: function () {
    wx.navigateTo({
      url: '/pages/redPacket_send/redPacket_send',
    })
  },

  //上拉加载
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.get_RecordFun(this.data.currentTab);
      this.setData({
        loadingTipHide: false
      });
    } else {
      this.setData({
        loadingTipHide: false
      })
    }
  }
  
})