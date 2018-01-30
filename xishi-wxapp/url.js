const api_host = "https://toutiao.goldensoftcn.com/api/";
let get_sessionKey = api_host + "applogin/login";
let article_list = api_host + "ApiArticle/list";
let article_detail = api_host + "ApiArticle/detail";
let comment_list = api_host + "ApiMessage/list";
let comment_creat = api_host + "ApiMessage/CreateComment";
let comment_delete = api_host + "ApiMessage/DelComment";
let comment_operation = api_host + "Praise/PraiseOperation";
let get_coupletType = api_host + "Couplet/typelist";
let get_couplet = api_host + "Couplet/list";
let pay_redPacket = api_host + "Pay/DownOrder";
export { 
  get_sessionKey,//获取sessionKey
  article_list,  //文章列表
  article_detail,  //文章详情
  comment_list, //评论列表
  comment_creat,//发表评论
  comment_delete,//删除评论
  comment_operation,//评论点赞、取消点赞
  get_coupletType,//获取对联类型
  get_couplet,//获取对联列表
  pay_redPacket//生成并发送红包
  }