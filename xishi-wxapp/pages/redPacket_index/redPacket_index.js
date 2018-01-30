import { get_isOpenRed,get_bonusIndexData} from "../../url.js";
var utils = require("../../utils/util.js");
var sessionKey = "";
Page({
  data: {
  
  },

  onLoad: function (options) {
    var bounsId = options.id;
    utils.getSessionKey(utils.getSetting);
    sessionKey = wx.getStorageSync("sessionKey");
    utils.requestLoading(get_isOpenRed + "?sessionKey=" + sessionKey + "&bounsld=" + bounsId, "get", "",
      "数据加载中...", function (res) {
        console.log(res)
        if(res.isOpenRed == false && res.Msg == ""){
          utils.requestLoading(get_bonusIndexData + "?sessionKey="+sessionKey+"&bonusId="+bounsId,"get","",
          "",function(res){
            console.log(res)
          },function(res){
            console.log(res)
          })
        } else if (res.isOpenRed == true && res.Msg == ""){
          wx.navigateTo({
            url: '/pages/redPacket_detail/redPacket_detail?id=' + bounsId,
          })
        }
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