import { get_couplet,pay_redPacket } from "../../url.js"
var utils = require("../../utils/util.js")
const app = getApp();
var sessionKey = '';
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    isHasVioce:false,
    coupletId:'',
    coupletText:''
  },

  onLoad: function (options) {
    utils.getSessionKey(utils.getSetting);
    sessionKey = wx.getStorageSync("sessionKey");
    this.getCouplet(sessionKey);//获取对联

  },

  getCouplet: function (sessionKey){
    var that = this;

    wx.getStorage({
      key: 'coupletId',
      success: function (res) {
        that.setData({
          "coupletId": res
        })
      }
    });
    
    let requestParams = JSON.stringify({
      OpenId: app.globalData.openId,
      Pager: {
        PageSize: 1,
        PageIndex: 0
      }
    });
    utils.requestLoading(get_couplet + "?sessionKey=" + sessionKey, "post", requestParams, "加载数据中...",
      function (res) {
        if (res.Status == 3 || res.Status == 5) {
          setTimeout(function () {
            wx.removeStorageSync("sessionKey");
            let curpage = getCurrentPages()[0];
            wx.reLaunch({
              url: "/" + curpage.route
            })
          }, 1000)
        }
        console.log(res);
        that.setData({
          coupletText: res[0],
          coupletId: res[0].ID
        })
      }, function (res) {
        console.log(res);
      }
    )
  },

  sendFun: function (sessionKey){
    var that = this;
    let requestParams = JSON.stringify({
      BonusId: "aaa-bbb-ccc",
      BonusMoney: 200,
      ServiceCharge: 1,
      BonusCount: 10,
      BonusVoiceUrl: that.tempFilePath,
      CoupletId: that.data.coupletId
    });

    utils.requestLoading(pay_redPacket + "?sessionKey=" + sessionKey, post, requestParams)
  },

  //开始录音
  touchdown:function(){
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //停止录音
  touchup:function(){
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      this.setData({
        isHasVioce:true
      });
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },

  //播放录音
  playvoice:function(){
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.obeyMuteSwitch = false
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  //重置录音
  resetvoice:function(){
    this.setData({
      isHasVioce: false
    });
  },

  //选择对联
  chooseCouplet:function(){
    wx.navigateTo({
      url: '/pages/custom_couplet/custom_couplet'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})