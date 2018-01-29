var utils = require("utils/util.js");
import { get_sessionKey } from 'url.js';


function extracted(res) {
    wx.showToast({
        title: res.Message,
        icon: "none"
    })
}

function getSetting(Code){
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        getUserInfo(Code);
      }else{
        wx.showModal({
          title: '提示',
          content: '授权登录失败，部分功能将不能使用，是否重新登录？',
          showCancel: true,
          cancelText: "否",
          confirmText: "是",
          success:function(res){
            if (res.confirm){
              wx.openSetting({
                success: function (data) {
                  if (data) {
                    if (data.authSetting["scope.userInfo"] == true) {
                      getUserInfo(Code);
                    }
                  }
                },
                fail: function () {
                  console.info("设置失败返回数据");
                }
              });
            }
          }
        })  
      }
    }
  })
}

function getUserInfo(Code) {
  wx.getUserInfo({
    success: res => {
      getApp().globalData.userInfo = res.userInfo
      console.log(res.userInfo);
      let requestParams = JSON.stringify({
        code: Code,
        nickname: res.userInfo.nickName,
        sex: res.userInfo.gender,
        headurl: res.userInfo.avatarUrl
      });
      //请求sessionKey
      utils.request(get_sessionKey, "post", requestParams, function (res) {
        console.log(res);
        if (res.Status == 1) {
          wx.setStorageSync("sessionKey", res.SessionKey);
        } else {
          if (res.Message) {
            extracted(res);
          }
        }
      }, function (res) {
        console.log(res);
      });
    },
    fail: res => {
      console.log(res);
    }
  })
}

App({
  onLaunch: function () {
    wx.login({
      success: res => {
        var sessionKey = wx.getStorageSync("sessionKey");
        let Code = res.code;
        // if (!sessionKey){
          if (res.code) {
            getSetting(Code)
          }
        // }
      }
    }),
    //判断网络状况
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