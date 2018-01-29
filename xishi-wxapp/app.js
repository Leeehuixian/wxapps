var utils = require("utils/util.js");
import { get_sessionKey } from 'url.js';
App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        var sessionKey = wx.getStorageSync("sessionKey");
        let Code = res.code; 
        // if (!sessionKey){
          if (res.code) {
            // 获取用户信息
            
            
          }
        // }
      }
    })
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
  getUserInfo:function(){
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: res => {
            this.globalData.userInfo = res.userInfo
            console.log(res.userInfo);
            // wx.setStorage({
            //   key: 'baseUserInfo',
            //   data: res.userInfo,
            // })
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
                  wx.showToast({
                    title: res.Message,
                    icon: "none"
                  })
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
        // }else{
        //   wx.openSetting({
        //     success: function (data) {
        //       if (data) {
        //         if (data.authSetting["scope.userInfo"] == true) {
        //           loginStatus = true;
        //           wx.getUserInfo({
        //             withCredentials: false,
        //             success: function (data) {
        //               console.info("2成功获取用户返回数据");
        //               console.info(data.userInfo);
        //             },
        //             fail: function () {
        //               console.info("2授权失败返回数据");
        //             }            });
        //         }
        //       }
        //     },
        //     fail: function () {
        //       console.info("设置失败返回数据");
        //     }      });
        // }
      }
    })
  },
  globalData: {
    userInfo: null
  }

})