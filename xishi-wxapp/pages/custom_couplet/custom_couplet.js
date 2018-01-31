import { get_couplet,get_coupletType } from "../../url.js"
var utils = require("../../utils/util.js")
const app = getApp();
var sessionKey = '';
Page({
  data: {
    coupletList:[],
    radioCheckVal:0,
    hideCustom:true,
    topWords:'',
    leftWords:'',
    rightWords:''
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }
    
    this.getCoupletList();//获取对联列表

  },

  /*选择自定义*/
  bindTapCustom:function(){
    this.setData({
      hideCustom: !this.data.hideCustom
    })
  },

  /*监听自定义编辑*/
  inputTopWords:function(e){
    this.setData({
      topWords: e.detail.value,
      radioCheckVal: false
    })
  },

  inputLeftWords: function (e) {
    this.setData({
      leftWords: e.detail.value,
      radioCheckVal: false
    })
  },

  inputRightWords: function (e) {
    this.setData({
      rightWords: e.detail.value,
      radioCheckVal: false
    })
  },

  /*获取对联列表*/
  getCoupletList:function(){
    let that = this;
    let requestParams = JSON.stringify({
      OpenId: app.globalData.openId,
    })
    utils.requestLoading(get_couplet + "?sessionKey=" + sessionKey, "post", requestParams, "加载数据中...",
      function (res) {
        if (res.Status == 5) {
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
        }

        that.setData({
          coupletList: res
        })
      }, function (res) {
        console.log(res);
      }
    )
  },

  /*选择对联*/
  radioCheckedChange:function(e){
    console.log(e.currentTarget.dataset.couplettext);
    this.setData({
      radioCheckVal: e.currentTarget.dataset.checkindex
    })
    
    var pages = getCurrentPages();
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
      prePage.changeCouplet(e.currentTarget.dataset.couplettext);
    }
  },  

  /*确定使用*/
  backToSend:function(){
    let that = this;
    if (this.data.radioCheckVal == false){
      var pages = getCurrentPages();
      if (pages.length > 1) {
        var prePage = pages[pages.length - 2];
        prePage.changeCouplet({ "TopWords": that.data.topWords,"LeftWords":that.data.leftWords,"RightWords":that.data.rightWords,"ID":res.Id});
      }
    }
    wx.navigateBack({
      delta: 1
    })
  }

})