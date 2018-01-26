var sessionKey = wx.getStorageSync("sessionKey");
const api_host = "https://www.xinwangai.com.cn/toutiao/api/";
let get_openid = api_host + "applogin/login";
let article_list = api_host + "ApiArticle/list?sessionKey=" + sessionKey;
let article_detail = api_host + "ApiArticle/detail?sessionKey=" + sessionKey;
let comment_list = api_host + "ApiMessage/list?sessionKey=" + sessionKey;
let comment_creat = api_host + "ApiMessage/CreateComment?sessionKey=" + sessionKey;
let comment_delete = api_host + "ApiMessage/DelComment?sessionKey=" + sessionKey;
let comment_operation = api_host + "Praise/PraiseOperation?sessionKey=" + sessionKey;
export { 
  //获取openId
  get_openid,
  //文章列表
  article_list, 
  //文章详情
  article_detail, 
  //评论列表
  comment_list, 
  //发表评论
  comment_creat,
  //删除评论
  comment_delete,
  //评论点赞、取消点赞
  comment_operation
  }