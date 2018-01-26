var utils = require("utils/util.js");
import { get_openid } from 'url.js';
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        var sessionKey = wx.getStorageSync("sessionKey");
        console.log("sessionKey=" + sessionKey);
        if (!sessionKey){
          if (res.code) {
            utils.request(get_openid, "post", JSON.stringify({ code: res.code }), function (res){
              console.log(res);
              if (res.StatusCode == "success"){
                console.log(1);
                wx.setStorageSync("sessionKey", res.SessionKey);
              }else{
                if (res.Message){
                  wx.showToast({
                    title: res.Message,
                    icon:"none"
                  })
                }
              }            
            },function(res){
              console.log(res);
            });
          }
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }),
    wx.onNetworkStatusChange(res => {
      if (res.isConnected) {
        let curpage = getCurrentPages()[0];
        wx.reLaunch({
          url: "/" + curpage.route
        })
      } else {
        wx.showToast({
          title: '网络异常',
          icon: "none",
          duration: 2000
        });
      }
    })
  },
  globalData: {
    userInfo: null
  }

})