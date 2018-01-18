var network = require("../../utils/util.js")
import { index_newsList } from '../../url.js'
const app = getApp()

Page({
  data: {
    listData:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    flag_icon_url:'',
    articlesHide:true,
    loadingModalHide:false,
    loadingTipHide:true,
    pageIndex: 0,
    pageSize:10,
    calcHeight:260,
    initHeight:0,
    animationData: {}
    // isEmpty: true,
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
      currentTab: e.detail.current,
      articlesHide: true,
      loadingModalHide: false,
      listData: [],
      pageIndex: 0,
      winHeight:this.data.initHeight
    });
    this.getListData(this.data.currentTab);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        listData: [],
        pageIndex: 0,
        currentTab: cur,
        articlesHide: true,
        loadingModalHide: false,
        winHeight: this.data.initHeight
      });
      this.getListData(this.data.currentTab);
    };
  },

  //加载数据
  getListData: function (currentTab){
    var that = this;
    network.requestLoading(index_newsList, '', '', function (res) {
      console.log(res);
      var resData = that.data.listData.concat(res[currentTab]);
      var resDataLen = (res[currentTab]).length;
      var pageIndex = that.data.pageIndex += 1;
      var calcHeight = that.data.calcHeight * pageIndex * resDataLen;
      if (calcHeight < that.data.winHeight){
        calcHeight = that.data.winHeight;
      };
      that.setData({
        articlesHide: false,
        loadingModalHide: true,
        loadingTipHide: true,
        pageIndex: pageIndex,
        winHeight: calcHeight,
        listData: resData
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    });
  },

  //上拉加载
  onReachBottom:function () {
    this.setData({
      // isEmpty:(!this.data.isEmpty)
      loadingTipHide: false
    });
    this.getListData(this.data.currentTab);
  }, 

  //刷新
  onRefresh: function (event) {
    this.setData({
      listData: [],
      pageIndex: 0,
      articlesHide: true,
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
