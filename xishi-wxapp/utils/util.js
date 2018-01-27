import { get_openid } from '../url.js';
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, method, params, success, fail){
  this.requestLoading(url, method, params,'',success, fail)
}
//url：网络请求的url
//params:请求参数
//message:进度条的提示信息
//success:成功的回调函数
//fail:失败的回调
function requestLoading(url, method, params,message,success,fail){
  wx.showNavigationBarLoading()
  if(message != ""){
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url:url,
    data:params,
    header:{
      'content-type':'application/json'
    },
    method: method,
    success:function(res){
      wx.hideNavigationBarLoading()
      if(message != ""){
        wx.hideLoading()
      }
      if(res.statusCode == 200){
        success(res.data)
      }else{
        fail()
      }
    },
    fail:function(res){
      wx.hideNavigationBarLoading()
      if(message != ""){
        wx.hideLoading()
      }
      fail()
    },
    complete:function(res){
      console.log(res);
      if (res.data.Status == 5){
        console.log("调用Login");
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log(res);
            var sessionKey = wx.getStorageSync("sessionKey");
            console.log("sessionKey=" + sessionKey);
            // if (!sessionKey) {
              if (res.code) {
                wx.request({
                  url: get_openid,
                  data: JSON.stringify({ code: res.code }),
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    if (res.StatusCode == "success") {
                      console.log(1);
                      wx.setStorageSync("sessionKey", res.SessionKey);
                      let curpage = getCurrentPages()[0];
                      wx.reLaunch({
                        url: "/" + curpage.route
                      });
                    } else {
                      if (res.Message) {
                        wx.showToast({
                          title: res.Message,
                          icon: "none"
                        })
                      }
                    }
                  },
                  fail:function(res){
                    console.log(res)
                  }
                })
                // this.request(get_openid, "post", JSON.stringify({ code: res.code }), function (res) {
                //   console.log(res);
                //   if (res.StatusCode == "success") {
                //     console.log(1);
                //     wx.setStorageSync("sessionKey", res.SessionKey);
                //     let curpage = getCurrentPages()[0];
                //     wx.reLaunch({
                //       url: "/" + curpage.route
                //     });
                //   } else {
                //     if (res.Message) {
                //       wx.showToast({
                //         title: res.Message,
                //         icon: "none"
                //       })
                //     }
                //   }
                // }, function (res) {
                //   console.log(res);
                // });
              }
            // }
          }
        })
      }
    }
  })
}

/****绘制自动换行的字符串****/
function drawText(t, x, y, w, ctx) {
  var row = [];
  var maxRow = Math.ceil(t.length / w);
  ctx.setTextBaseline = "middle";

  for (var a = 0; a < maxRow; a++) {   
    row.push(t.substr(w * a, w));
  }

  for (var b = 0; b < row.length; b++) {
    ctx.fillText(row[b], x, y + (b + 1) * 20);
  }
}

module.exports = {
  formatTime: formatTime,
  request:request,
  requestLoading:requestLoading,
  drawText: drawText
}
