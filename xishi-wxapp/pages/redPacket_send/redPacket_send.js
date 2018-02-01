import { get_couplet, pay_redPacket, get_serviceFee } from "../../url.js"
var utils = require("../../utils/util.js")
const app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath = '';
var sessionKey = '';
Page({
  data: {
    isHasVioce:false,
    coupletId:'',
    coupletText:'',
    money:0,
    num:0,
    serviceFee: "0.00"
  },

  onLoad: function (options) {
    sessionKey = wx.getStorageSync("sessionKey");
    if (!sessionKey) {
      utils.getSessionKey(utils.getSetting);
      return;
    }
    this.getCouplet();//获取对联
  },

  getCouplet: function (){
    var that = this;
  
    let requestParams = JSON.stringify({
      OpenId: app.globalData.openId
    });
    utils.requestLoading(get_couplet + "?sessionKey=" + sessionKey, "post", requestParams, "加载数据中...",
      function (res) {
        if (res.Status == 1){
          that.setData({
            coupletText: res[0],
            coupletId: res[0].ID
          })
        }else if (res.Status == 5) {
          wx.removeStorageSync("sessionKey");
          utils.getSessionKey(utils.getSetting);
        }
      }, function (res) {
        console.log(res);
      }
    )
  },

  //更换对联
  changeCouplet:function(coupletxt){
    this.setData({
      coupletText: coupletxt,
      coupletId: coupletxt.ID
    })
  },

  //发送红包
  sendFun: function (){
    let isSubmit = true;
    let that = this;
    if (that.data.money == 0){
      wx.showToast({
        title: '请输入红包金额',
        icon:'none'
      })
    } else if (that.data.num == 0){
      wx.showToast({
        title: '请输入红包数量',
        icon: 'none'
      })
    } else if (!isSubmit){
      wx.showToast({
        title: '请求发送中...',
        icon: 'loading'
      })
    }else{
      // isSubmit = false;
      let requestParams = JSON.stringify({
        BonusMoney: Number(that.data.money),
        ServiceCharge: that.data.serviceFee,
        BonusCount: Number(that.data.num),
        BonusVoiceUrl:tempFilePath,
        CoupletId: that.data.coupletId
      });
      utils.requestLoading(pay_redPacket + "?sessionKey=" + sessionKey, "post", requestParams,'',
        function(res){
          if(res.Msg == ""){
            let share_bgUrl = res.BackGroundImgUrl;
            let wxaCode_url = res.WXACodeUrl;
            let bonusId = res.BonusId; 
            
            /*测试代码*/
            wx.setStorage({
              key: 'bonusSend_cacheData',
              data: {
                "coupletTxt": that.data.coupletText,
                "shareBgUrl": share_bgUrl,
                "codeUrl": wxaCode_url,
                "bonusId": bonusId
              }
            })

            wx.navigateTo({
              url: '/pages/redPacket_afterPay/redPacket_afterPay',
            })
            /*测试代码结束*/

            //调用微信支付
            // wx.requestPayment({
            //   'timeStamp': res.TimeStamp,
            //   'nonceStr': res.NonceStr,
            //   'package': res.Package ,
            //   'signType': res.SignType,
            //   'paySign': res.PaySign,
            //   'success': function (res) {
            //     isSubmit = false;
                
            //     wx.setStorage({
            //       key: 'bonusSend_cacheData',
            //       data: {
            //         "coupletTxt": that.data.coupletText,
            //         "shareBgUrl": share_bgUrl,
            //         "codeUrl": wxaCode_url,
            //         "bonusId":bonusId
            //       }
            //     })

            //     wx.navigateTo({
            //       url: '/pages/redPacket_afterPay/redPacket_afterPay',
            //     })
            //   },
            //   'fail': function (res) {
            //     console.log(res)
            //     console.log("支付失败")
            //   }
            // })
          }else{
            wx.showToast({
              title: res.Msg,
              icon:'none'
            })
          }
        },function(res){
          console.log(res)
        }
      )
    }
  },

  inputMoney:function(e){
    this.setData({
      money:e.detail.value
    })
  },

  inputNum:function(e){
    this.setData({
      num:e.detail.value
    })
  },

  //计算服务费
  CaculateServiceFee:function(){
    let that = this;
    utils.requestLoading(get_serviceFee+"?sessionKey="+sessionKey,"post",JSON.stringify({bonusAmount:Number(this.data.money)}),'',
      function(res){
        that.setData({
          serviceFee:res           
        });
      },function(res){
        console.log(res)
      }
    )
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

  //查看我的记录
  checkRecord:function(){
    wx.navigateTo({
      url: '/pages/redPacket_record/redPacket_record'
    })
  },

  //余额体现
  withdrawTap:function(){
    wx.navigateTo({
      url: '/pages/redPacket_withdraw/redPacket_withdraw'
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