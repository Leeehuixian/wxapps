// pages/index2/index2.js
//获取应用实例
var app = getApp()
var latitude,longitude
Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: 39.923701,
    longitude: 116.462568,
    lockhidden: true,
    markers:[{
      //摩拜单车位置
        iconPath:"/images/bike@red.png",
        id: 1,
        latitude: 39.930694,
        longitude: 116.461463,
        width:40,
        height:40
    },{
        iconPath: "/images/bike@red.png",
        id: 2,
        latitude: 39.930094,
        longitude: 116.462583,
        width: 40,
        height: 40
    },{
        iconPath: "/images/bike@red.png",
        id: 3,
        latitude: 39.923791,
        longitude: 116.462528,
        width: 40,
        height: 40
    },{
      //离我最近
      iconPath:"/images/tome.png",
      id: 4,
      latitude: 39.923701,
      longitude: 116.462568,
      width: 70,
      height: 30
    },{
      //红包车
      iconPath: "/images/hongbao.png",
      id: 5,
      latitude: 39.933701,
      longitude: 116.466468,
      width: 40,
      height: 40
    },{
      //我的位置
      iconPath: "/images/lable@icon.png",
      id: 0,
      latitude: 39.923791,
      longitude: 116.462598,
      width: 40,
      height: 40
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用wx.getLocation系统API，获取并设置当前位置经纬度
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: (res)=> {//es6箭头函数,可以解绑当前作用域的this指向，使得下面的this可以绑定到Page对象
    //     this.setData({//为data对象里定义的经纬度默认值设置成获取到的真实经纬度以在地图上显示我们的真实位置
    //       latitude : res.latitude,
    //       longitude : res.longitude
    //     })
    //   }
    // })
  },
  //地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function(e){
    let _markers = this.data.markers;//拿到标记数组
    let markerId = e.markerId;//获取点击的标记id
    let currMarker = _markers[markerId];//用过id,获取当前点击的标记
    console.log(markerId);
    console.log(currMarker.longitude);
    this.setData({
      polyline:[{
        points:[{// 连线起点
          longitude: this.data.longitude,
          latitude: this.data.latitude
        },{// 连线终点（当前点击的标记）
          longitude: currMarker.longitude,
          latitude: currMarker.latitude
        }],
        color: "#FF0000DD",//连线颜色
        width: 10, // 连线
      }],
      scale: 18
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1、创建地图上下文，移动当前位置到地图中心
    // this.mapCtx = wx.createMapContext("mbMap");//地图组件的id
    // this.movetoPosition()
  },
  //定位函数，移动位置到地图中心
  // movetoPosition: function(){
  //   this.mapCtx.moveToLocation();
  // },
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