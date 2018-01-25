var network = require("../../utils/util.js")
import { article_list } from '../../url.js'
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

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
    var that = this;
    //  高度自适应
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

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      listData: [],
      hasMore:true,
      currentTab: e.detail.current,
      pageIndex: 0,
      total:0,
      loadingModalHide: false,
      winHeight:this.data.initHeight
    });
    this.getListData(this.data.currentTab);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        listData: [],
        hasMore: true,
        currentTab: cur,
        pageIndex: 0,
        total: 0,
        loadingModalHide: false,
        winHeight: this.data.initHeight
      });
      this.getListData(this.data.currentTab);
    };
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
    network.requestLoading(article_list, 'post',  requestParams, '',
    function (res) {
      console.log(res);
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
