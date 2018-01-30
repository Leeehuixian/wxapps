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
let get_serviceFee = api_host + "Pay/CaculateServiceFee";
let get_redPacketDetail = api_host + "Bonus/detail";
let get_isOpenRed = api_host + "Bonus/IsOpenRed";
let get_bonusIndexData = api_host + "Bonus/BonusIndex";
let get_bonusDetailList = api_host + "Bonus/BonusDetailList";
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
  pay_redPacket,//生成并发送红包
  get_serviceFee,//获取服务费
  get_redPacketDetail,//获取红包详情
  get_isOpenRed,//验证当前用户是否已经拆过红包
  get_bonusIndexData,//获取拆红包主页的数据
  get_bonusDetailList,//红包已领取记录列表
  }