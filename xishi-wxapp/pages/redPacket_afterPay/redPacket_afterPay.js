
Page({
  data: {
    coupletText:{},
    topWordsStyle:"font-size:64rpx;",
    verticalWordsStyle: "font-size:60rpx;",
    share_bgUrl:'',
    wxaCode_url:'',
    hideModalBg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'bonusSend_cacheData',
      success: function(res) {
        console.log(res)
        that.setData({
          coupletText: res.data.coupletTxt,
          share_bgUrl: res.data.shareBgUrl,
          wxaCode_url: res.data.codeUrl
        })
      },
    })
  },

  /*发送好友或群*/
  onShareAppMessage: function (res) {
    this.goTopFun();
    setTimeout(function () {
      if (res.from === 'button') {
        // console.log(res.target)
      }
      return {
        success: function (res) {
          wx.showShareMenu({
            withShareTicket: true
          });
        },
        fail: function (res) {
          console.log(res.shareAppMessage);
        }
      }
    }, 1000);
  },

  //生成临时文件
  bindSaveImageTap: function () {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth: 530,
      destHeight: 752,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '成功保存图片',
              showCancel: false,
              content: '已成功为你保存图片到手机相册，请自行前往朋友圈分享',
              success: function (res) { }
            })
          },
          fail(res) {
            console.log("图片保存失败");
          }
        })
      }
    })
  },

  //收起模态窗口
  bindModalTap: function () {
    this.setData({
      hideModalBg: true
    });
  },
  
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