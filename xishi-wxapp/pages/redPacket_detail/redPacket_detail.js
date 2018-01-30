import { get_redPacketDetail, get_bonusDetailList} from "../../url.js";
var utils = require("../../utils/util.js");
const app = getApp();
var sessionKey = '';
Page({
  data: {
  
  },

  onLoad: function (options) {
    var bounsId = options.id;
    utils.getSessionKey(utils.getSetting);
    sessionKey = wx.getStorageSync("sessionKey");
    utils.requestLoading(get_redPacketDetail+"?sessionKey="+sessionKey + "&bounsld="+bounsId,"get","",
    "数据加载中...",function(res){
        console.log(res)
      },function(res){
        console.log(res)
      }
    );
    utils.requestLoading(get_bonusDetailList + "?sessionKey=" + sessionKey + "&bounsld=" + bounsId, "get", "",
      "数据加载中...", function (res) {
        console.log(res)
      }, function (res) {
        console.log(res)
      }
    )
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