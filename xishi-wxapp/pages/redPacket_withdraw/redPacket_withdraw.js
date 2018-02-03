var utils = require("../../utils/util.js");
import { withdraw_money,get_userBalance } from "../../url.js";
var sessionKey = '';
Page({
  data: {
    balance:0,
    withdrawmoney:0,
    canWithdraw:false,
    initValue:''
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }
    this.getBalance();
  },

  getBalance:function(){
    let that = this;
    utils.requestLoading(get_userBalance+"?sessionKey="+sessionKey,"post","","数据加载中",function(res){
      if(res.Status == 5){
        wx.removeStorageSync("sessionKey");
        utils.getSessionKey(utils.getSetting);
        return;
      }
      that.setData({
        balance:res.money
      })
    },function(res){
      console.log(res);
    });
  },

  bindInput:function(e){
    let that = this;
    if (e.detail.value > 0 && e.detail.value <= that.data.balance){
      that.setData({
        canWithdraw: true
      })
    } else if (e.detail.value > that.data.balance){
      wx.showToast({
        title: '提现金额不得超过余额',
        icon:'none'
      })
    }else{
      that.setData({
        canWithdraw: false
      })
    }
    that.setData({
      withdrawmoney: e.detail.value
    })
  },

  withdrawAll:function(){
    this.setData({
      initValue: this.data.balance,
      withdrawmoney: this.data.balance
    })
  },

  withdrawFun:function(){
    let that = this;
    let isSubmit = true;
    if (isSubmit) {
      isSubmit = false;
      utils.requestLoading(withdraw_money + "?sessionKey=" + sessionKey, "post",
        JSON.stringify({ money: that.data.withdrawmoney }), "数据加载中...",
        function (res) {
          if (res.Status == 1) {
            wx.showToast({
              title: '提现成功',
              icon: 'success'
            })
          } else if (res.Status == 5) {
            wx.removeStorageSync("sessionKey");
            utils.getSessionKey(utils.getSetting);
          } else {
            wx.showToast({
              title: res.Message,
              icon: 'none'
            })
          }
        }
      )
    }
  }

  
})