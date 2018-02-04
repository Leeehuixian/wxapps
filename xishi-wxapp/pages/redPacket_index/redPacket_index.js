import { get_isOpenRed, get_bonusIndexData, grab_redPacket} from "../../url.js";
var utils = require("../../utils/util.js");
var sessionKey = "";
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    topWordsStyle: "font-size:64rpx;",
    verticalWordsStyle: "font-size:60rpx;",
    topWords: '',
    leftWords: '',
    rightWords: '',
    voiceUrl:'',
    headImgUrl:'',
    bonusId:''
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }

    var bounsId = options.bonusId;
    console.log(bounsId);
    this.verifyOpen(bounsId);//验证用户是否已经拆过红包
  },

  verifyOpen: function (bounsId){
    let that = this;
    utils.requestLoading(get_isOpenRed + "?sessionKey=" + sessionKey, "post",
      JSON.stringify({ bonusId: bounsId }),"数据加载中...", 
    function (res) {
        console.log(res)
        if (res.Status == 5) {
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
        } else if (res.IsOpenRed == false && res.Msg == "") {
          that.getBonusIndexData(bounsId);//获取拆红包主页数据
        } else if (res.IsOpenRed == true && res.Msg == "") {
          wx.navigateTo({
            url: '/pages/redPacket_detail/redPacket_detail?id=' + bounsId,
          })
        } else {
          console.log("验证拆包权限出错");
          wx.showToast({
            title: res.Msg,
            icon: 'none'
          })
        }
      }, function (res) {
        console.log(res)
      }
    )  
  },

  getBonusIndexData: function (bounsId) {
    let that = this;
    utils.requestLoading(get_bonusIndexData + "?sessionKey=" + sessionKey, "post",
      JSON.stringify({ bonusId: bounsId }), "数据加载中...",
      function (res) {
        console.log(res)
        if (res.Msg == "") {
          if (res.TopWords.length < 4) {
            that.setData({
              topWordsStyle: "font-size:90rpx;"
            })
          }

          if (res.LeftWords.length > 7) {
            that.setData({
              verticalWordsStyle: "font-size:50rpx;line-height:1.1;"
            })
          }

          that.setData({
            topWords: res.TopWords,
            leftWords: res.LeftWords,
            rightWords: res.RightWords,
            bonusId: res.BonusId,
            voiceUrl: res.BonusVoiceUrl,
            headImgUrl: res.HeadImgUrl,
          });
          innerAudioContext.src = res.BonusVoiceUrl;
        } else if (res.Status == 5) {
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
        } else {
          console.log("请求主页数据出错了");
          wx.showToast({
            title: res.Msg,
            icon: 'none'
          })
        }
      }, function (res) {
        console.log(res)
      })
  },

  bindTapBtn:function(){
    console.log(this.data.bonusId);
    this.grabRedPacket(this.data.bonusId);
    
  },

  /*拆红包*/
  grabRedPacket: function (bonusId) {
    utils.requestLoading(grab_redPacket + "?sessionKey=" + sessionKey, "post",
      JSON.stringify({ bonusId: bonusId }), "数据加载中...",
      function (res) {
        console.log(res.Status);
        switch (res.Status){
          case 1:case 2:
            wx.navigateTo({
              url: '/pages/redPacket_detail/redPacket_detail?id=' + bonusId,
            });
            break;
          case 5:
            wx.removeStorageSync("sessionKey");
            utils.getSessionKey(utils.getSetting);
            break;
          default:
            wx.showToast({
              title: res.Msg,
              icon: 'none'
            });
            break;
        }
      }, function (res) {
        console.log(res)
      }
    );
  },

  /*播放语音*/
  tapPlayVoice:function(){
    innerAudioContext.autoplay = true;
    innerAudioContext.play()
  }

})