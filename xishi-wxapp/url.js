const api_host = "https://www.muyutoutiao.com/TouTiao/admin/";
let article_list = api_host +  "ApiArticle/list";
let article_detail = api_host + "ApiArticle/detail";
let comment_list = api_host + "ApiMessage/list";
let comment_creat = api_host + "ApiMessage/CreateComment";
let comment_delete = api_host + "ApiMessage/DelComment";
let comment_operation = api_host + "Praise/PraiseOperation";
export { 
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