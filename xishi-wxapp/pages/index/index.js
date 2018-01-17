var network = require("../../utils/util.js")
import { index_newsList } from '../../url.js'
const app = getApp()

Page({
  data: {
    listData:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    flag_icon_url:'',
    articlesHide:false,
    loadingModalHide:true,
    pageIndex: 0,
    pageSize:10,
    calcHeight:260,
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
        var calc = clientHeight * rpxR;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    //初始化默認加載“推薦”數據
    that.getListData(0);
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      articlesHide: true,
      loadingModalHide: false,
      listData: [],
      pageIndex: 0,
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
      });
      this.getListData(this.data.currentTab);
    };
  },

  //加載數據
  getListData: function (currentTab){
    var that = this;
    var resDataLen = 0;
    network.requestLoading(index_newsList, '', '正在加载数据', function (res) {
      console.log(res);
      var listType = '';
      var resData = {};
      switch (currentTab) {
        case 0:
          resData = that.data.listData.concat(res.data.recommendList);
          that.setData({
            listData: resData
          });
          resDataLen = (res.data.recommendList).length;
          break;
        case 1:
          resData = that.data.listData.concat(res.data.videoList);
          that.setData({
            listData: resData
          });
          resDataLen = (res.data.videoList).length;
          break;
        case 2:
          resData = that.data.listData.concat(res.data.localList);
          that.setData({
            listData: resData
          });
          resDataLen = (res.data.localList).length;
          break;

      };
      var pageIndex = that.data.pageIndex += 1;
      var calcHeight = that.data.calcHeight * pageIndex * resDataLen;
      if (calcHeight < that.data.winHeight){
        calcHeight = that.data.winHeight;
      };
      that.setData({
        articlesHide: false,
        loadingModalHide: true,
        pageIndex: pageIndex,
        winHeight: calcHeight
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    });
  },

  //上拉加载
  onReachBottom:function () {
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
