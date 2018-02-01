var utils = require("../../utils/util.js");
import { withdraw_money } from "../../url.js";
var sessionKey = '';
Page({
  data: {
    withdrawmoney:0
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }
  },

  bindInput:function(e){
    let isSubmit = true;
    if(isSubmit){
      isSubmit = false;
      utils.requestLoading(withdraw_money+"?sessionKey="+sessionKey,"post",
      JSON.stringify({money:e.detail.value}),"数据加载中...",
        function(res){
          if(res.Status == 1){
            wx.showToast({
              title: '提现成功',
              icon:'success'
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
        }
      )
    }
  }

  
})