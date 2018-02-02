var utils = require("../../utils/util.js")
import { article_list } from '../../url.js'
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var sessionKey ='';
Page({
  data: {
    listData:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    flag_icon_url:'',
    loadingModalHide:false,
    loadingTipHide:true,
    pageIndex: 0,
    calcHeight:300,
    initHeight:0,
    animationData: {},
    hasMore:true,
    total:0,//当前tab下文章数量
    userCity:'',
    loadingTipText:"加载中..."
  },
  
  onLoad: function () {
    sessionKey = wx.getStorageSync("sessionKey");
    if(!sessionKey){
      utils.getSessionKey(utils.getSetting);
      return;
    }
    
    var that = this;
    that.getLocation();//获取地理位置
    //高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR + 100;
        that.setData({
          winHeight: calc,
          initHeight:calc
        });
      }
    });
    
    //初始化默认加载“推荐”数据
    that.getListData(0);
  },

  onShow:function(){
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 2000,
      timingFunction: "ease",
      delay: 0
    });
    this.animation = animation;
    animation.rotate(360).step()
    this.setData({
      animationData: animation.export()
    })
  },

  // 滚动切换tab
  switchTab: function (e) {
    let that = this;
    let cur = e.detail.current;
    if (cur == 2 && that.data.userCity == '') {
      if (that.data.userCity == '') {
        that.getSetting();
      } 
    }
    this.setData({
      listData: [],
      hasMore:true,
      currentTab: cur,
      pageIndex: 0,
      total:0,
      loadingModalHide: false,
      winHeight:this.data.initHeight
    });
    this.getListData(this.data.currentTab);
  },
  
  // 点击切换tab
  bindTapTab: function (e) {
    let that = this;
    let cur = Number(e.target.dataset.current);
    if (that.data.currentTab == cur) { return false; }
    else if (cur == 2) {
      if (that.data.userCity == ''){
        that.getSetting(
          that.setData({
            currentTab: cur,
          })
        );
      }else{
        that.setData({
          currentTab: cur,
        })
      }
    }else {
      that.setData({
        currentTab: cur,
      });
    };
  },

  /*判断用户是否授权获取地理位置*/
  getSetting:function(cb){
    let that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          that.getLocation();
          cb();
        } else {
          wx.showModal({
            title: '提示',
            content: '授权获取地理位置失败，无法查看本地资讯，是否重新授权？',
            showCancel: true,
            cancelText: "否",
            confirmText: "是",
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data) {
                      if (data.authSetting["scope.userLocation"] == true) {
                        let curpage = getCurrentPages()[0];
                        wx.reLaunch({
                          url: "/" + curpage.route
                        });
                      }
                    }
                  },
                  fail: function () {
                    console.info("设置失败返回数据");
                  }
                });
              } else if (res.cancel) {
                console.info("用户拒绝授权");
              }
            }
          })
        }
      }
    })
  },

  /*获取地理位置*/
  getLocation:function(){
    let that = this;
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: "BQCBZ-ZJ4WD-XEA4W-HCNO5-6BTW3-KMFQQ"
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var cityName = addressRes.result.address_component.city;
            that.setData({
              userCity: cityName
            })
          }
        })
      }
    });
  },

  //加载数据
  getListData: function (currentTab){
    var that = this;
    var pageIndex = that.data.pageIndex;
    var requestParams = '';
    switch (currentTab){
      case 0:
        requestParams = JSON.stringify({ 
          "AppNavigation": Number(currentTab) + 2, 
          Pager: { PageIndex: pageIndex, PageSize: 10 }
          });
        that.setData({
          calcHeight: 300
        });
        break;
      case 1:
        requestParams = JSON.stringify({
          "AppNavigation": Number(currentTab) + 2,
          Pager: { PageIndex: pageIndex, PageSize: 10 }
        });
        that.setData({
          calcHeight:500
        });
        break;
      case 2:
        requestParams = JSON.stringify({
          "AppNavigation": Number(currentTab) + 2,
          Pager: { PageIndex: pageIndex, PageSize: 10 },
          cityName: that.data.userCity
        });
        that.setData({
          calcHeight: 300
        });
        break;
    } 
    utils.requestLoading(article_list + "?sessionKey=" + sessionKey, 'post',  requestParams, '',
    function (res) {
      if (res.Status == 5){
        wx.removeStorageSync("sessionKey");
        utils.getSessionKey(utils.getSetting);
        return;
      }
      
      var resData = that.data.listData.concat(res);
      if(res.length == 0){
        if (pageIndex == 0){
          that.setData({
            loadingModalHide: false,
          });
        };
        that.setData({
          hasMore: false
        });       
      }else{
        pageIndex++;
        //重新计算scroll-view长度
        var total = that.data.total;
        total += res.length;
        var calcHeight = that.data.calcHeight * total;
        if (calcHeight < that.data.winHeight) {
          calcHeight = that.data.winHeight;
        }
        that.setData({
          loadingModalHide: true,
          winHeight: calcHeight,
          total: total
        });
      }      
      that.setData({
        loadingTipHide: true,
        pageIndex: pageIndex,       
        listData: resData
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon:"none",
      });
      that.setData({
        hasMore: false
      });
    });
  },

  //上拉加载
  onReachBottom:function () {    
    if(this.data.hasMore){
      this.getListData(this.data.currentTab);
      this.setData({
        loadingTipHide: false
      });
    }else{
      this.setData({
        loadingTipHide:false,
        loadingTipText:"没有更多数据"
      })
    }
  }, 

  //刷新
  onRefresh: function (event) {
    this.setData({
      listData: [],
      hasMore: true,
      pageIndex: 0,
      loadingModalHide: false,
    });
    this.getListData(this.data.currentTab);
    wx.showNavigationBarLoading();
    // 动画效果
    this.animation.rotate(360).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  //查看文章详情
  onArticleTap: function (event) {
    var articleid = event.currentTarget.dataset.articleid;
    var articleType = event.currentTarget.dataset.articletype;
    wx.navigateTo({
      url: '../detail/detail?id=' + articleid + "&type=" + articleType
    });
  }

})
