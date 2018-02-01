var utils = require("../../utils/util.js")
import { get_giveOutRecord,get_grabRecord } from '../../url.js'
const app = getApp();
var sessionKey = '';
Page({

  data: {
    headImgUrl: app.globalData.userInfo.avatarUrl,
    nickName: app.globalData.userInfo.nickName,
    typeTxt:'共发出',
    amountMoney:0,
    bonusCount:0
  },

  onLoad: function (options) {
  
  }

  
})