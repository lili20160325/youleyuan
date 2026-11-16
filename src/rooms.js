/*ROOMS-START*/
(function(G){
'use strict';
function R(x,y,w,h,f,rx,ex){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"'+(rx?' rx="'+rx+'"':'')+(ex||'')+'/>';}
function T(x,y,s,ch,ex){return '<text x="'+x+'" y="'+y+'" font-size="'+s+'" text-anchor="middle" dominant-baseline="central"'+(ex||'')+'>'+ch+'</text>';}
function P(d,f,ex){return '<path d="'+d+'" fill="'+f+'"'+(ex||'')+'/>';}
function C(x,y,r,f,ex){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"'+(ex||'')+'/>';}
function El(cx,cy,rx,ry,f,ex){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"'+(ex||'')+'/>';}
var SK=' stroke="#1a1020" stroke-width="2.2" stroke-linejoin="round"';
function g(id,inner){return '<g class="obj" data-obj="'+id+'">'+inner+'</g>';}
function sky(f){
  var on=!!f.power_on;
  var s=R(0,0,400,300,on?'#1a1448':'#0b0818');
  s+=R(0,0,400,86,on?'#2a1860':'#120c28');
  s+=C(332,40,22,on?'#ffe9a8':'#c8bdd8');
  s+=C(324,36,8,on?'#1a1448':'#0b0818');
  var stars=[[20,18],[50,40],[80,16],[110,36],[160,22],[200,14],[240,30],[280,18],[310,48],[370,24],[40,70],[90,58],[140,66],[220,55],[360,70],[185,44],[15,95],[395,90]];
  for(var i=0;i<stars.length;i++)s+=C(stars[i][0],stars[i][1],i%3===0?1.7:1,i%4===0?'#ffd166':(i%4===1?'#ffb3d9':'#fff'));
  s+='<path d="M8 64 Q100 82 200 64 T392 72" fill="none" stroke="'+(on?'#ffd166':'#5a4060')+'" stroke-width="1.5"/>';
  var bulbs=[[30,68,'#ff7ab6'],[70,76,'#ffd166'],[110,70,'#6ee0ff'],[150,76,'#c48bff'],[190,66,'#5ee0c4'],[230,74,'#ff7ab6'],[270,68,'#ffd166'],[310,74,'#6ee0ff'],[350,70,'#c48bff']];
  for(var j=0;j<bulbs.length;j++)s+=C(bulbs[j][0],bulbs[j][1],3.3,on?bulbs[j][2]:'#3a3040')+C(bulbs[j][0],bulbs[j][1]-1.1,1.2,on?'#fff':'#555');
  s+=R(0,230,400,70,on?'#2a1a38':'#161022');
  s+=R(0,228,400,4,on?'#ff7ab6':'#2a2030');
  return s;
}

var ITEMS={
  glow:{name:"荧光棒",icon:"🌟",glow:1,desc:"淡淡的绿光，能照亮暗处的门闩。"},
  map_a:{name:"园图西半",icon:"🗺️",desc:"游乐园地图的西半边，缺了一角。"},
  map_b:{name:"园图东半",icon:"🗾",desc:"游乐园地图的东半边。"},
  map_full:{name:"完整园图",icon:"🗺️",glow:1,desc:"拼好的园图。旁边有手写：许愿牌别信最大的数字。兑奖屋后台有保险柜。"},
  brass_key:{name:"黄铜小钥匙",icon:"🔑",desc:"从售票亭盆栽里找到的小钥匙。"},
  handbook1:{name:"手册残页",icon:"📄",desc:"夜航条例：星灯记号会按 蓝→黄→红 的顺序亮起。切勿相信墙上乱涂的数字。"},
  carousel_key:{name:"木马控制室钥匙",icon:"🔑",glow:1,desc:"能打开旋转木马旁的小控制室。"},
  winder:{name:"发条钥匙",icon:"⚙️",desc:"能给木马或风车的齿轮上发条。"},
  badge:{name:"阿乔的工作证",icon:"🪪",desc:"电工阿乔的工作证，有油渍。他今夜值班？"},
  token:{name:"许愿代币",icon:"🪙",glow:1,desc:"从喷泉里捞到的闪亮代币，兑奖屋抓娃娃也许能用。"},
  hook:{name:"安全钩",icon:"🪝",desc:"过山车站台储物柜里的小钩，能钩住远处的东西。"},
  fuse:{name:"保险丝",icon:"🔌",glow:1,desc:"标签写着「夜航备用」。电源室也许用得上。"},
  car_key:{name:"座舱钥匙",icon:"🔑",desc:"打开过山车座舱的钥匙。"},
  star_blue:{name:"星灯拓印·蓝",icon:"🔵",glow:1,desc:"从过山车座舱底下拓下的蓝色星灯记号。"},
  star_yellow:{name:"星灯拓印·黄",icon:"🟡",glow:1,desc:"从风车叶片上拓下的黄色星灯记号。叶片上还画着数字 6。"},
  star_red:{name:"星灯拓印·红",icon:"🔴",glow:1,desc:"从鬼屋最里面那盏灯下拓下的红色星灯记号。"},
  star_by:{name:"蓝黄拓印",icon:"🟢",glow:1,desc:"蓝记和黄记叠在一起了，还缺红记。"},
  star_br:{name:"蓝红拓印",icon:"🟣",glow:1,desc:"蓝记和红记叠在一起了，还缺黄记。"},
  star_yr:{name:"黄红拓印",icon:"🟠",glow:1,desc:"黄记和红记叠在一起了，还缺蓝记。"},
  star_card:{name:"三色星卡",icon:"💠",glow:1,desc:"三枚星灯拓印叠成的卡片，能插入对照板或电源卡槽。"},
  cotton_key:{name:"棉糖摊钥匙",icon:"🔑",desc:"木马转过一圈后，从座位底下掉出来的钥匙。"},
  magnet:{name:"小磁铁",icon:"🧲",desc:"能吸出金属柜后面的东西。"},
  prize_key:{name:"兑奖屋后门钥匙",icon:"🔑",glow:1,desc:"棉糖摊抽屉里找到的，通往兑奖屋后台。"},
  safe_key:{name:"小保险柜钥匙",icon:"🔑",glow:1,desc:"抓娃娃抓到的小钥匙，像是保险柜用的。"},
  office_key:{name:"管理室钥匙",icon:"🗝️",glow:1,desc:"兑奖屋保险柜里的管理室钥匙。"},
  mirror_stamp:{name:"镜宫入场戳",icon:"🎟️",glow:1,desc:"风车小屋里的检修印章，能进镜宫。"},
  haunt_ticket:{name:"悄悄话门票",icon:"🎫",glow:1,desc:"镜宫机关打开后拿到的鬼屋门票。票面画着一只害羞的小幽灵。"},
  ticket:{name:"兑奖券",icon:"🎀",glow:1,desc:"你掉的那张兑奖券！背面盖着一颗星，还写着「欢迎回家」。另有一行小字：晨门的转盘，转到我走丢的那个月。"},
  power_card:{name:"电源室门禁卡",icon:"💳",glow:1,desc:"星灯对照板打开暗格后拿到的门禁卡。"},
  gate_remote:{name:"大门遥控",icon:"📡",glow:1,desc:"总闸打开后弹出的遥控。出口大门的电子锁会认它。"},
  letter:{name:"林晚的信",icon:"✉️",desc:"写给走完夜航的小朋友的信。"}
};
G.PZ_ITEMS=ITEMS;

var COMBOS=[
  {a:"map_a",b:"map_b",give:["map_full"],set:["map_ready"],text:"两半园图对上了！手写标注：许愿牌别信最大的数字。兑奖屋后台有保险柜。"},
  {a:"star_blue",b:"star_yellow",give:["star_by"],text:"蓝记和黄记叠在一起，还缺红记才能合成三色星卡。"},
  {a:"star_blue",b:"star_red",give:["star_br"],text:"蓝记和红记叠在一起，还缺黄记才能合成三色星卡。"},
  {a:"star_yellow",b:"star_red",give:["star_yr"],text:"黄记和红记叠在一起，还缺蓝记才能合成三色星卡。"},
  {a:"star_by",b:"star_red",give:["star_card"],set:["got_star_card"],text:"三枚拓印严丝合缝，变成一张三色星卡。该去管理室的对照板看看。"},
  {a:"star_br",b:"star_yellow",give:["star_card"],set:["got_star_card"],text:"三枚拓印严丝合缝，变成一张三色星卡。该去管理室的对照板看看。"},
  {a:"star_yr",b:"star_blue",give:["star_card"],set:["got_star_card"],text:"三枚拓印严丝合缝，变成一张三色星卡。该去管理室的对照板看看。"}
];
G.PZ_COMBOS=COMBOS;

G.PZ_JOURNAL=[
  {id:"j0",if:["seen_gate"],title:"闭园之夜",text:"家庭日结束了。你回来找掉了的兑奖券，大门锁上，灯一盏盏灭掉。"},
  {id:"j1",if:["read_schedule"],title:"值班便签",text:"售票亭便签：今夜值班电工阿乔。写着「有人滞留就走夜航」。夜航是什么？"},
  {id:"j2",if:["got_badge"],title:"工作证",text:"在旋转木马旁捡到电工阿乔的工作证，有油渍。会是他关的电吗？"},
  {id:"j3",if:["heard_radio"],title:"对讲机",text:"控制室对讲机里，阿乔说：检测到滞留访客，夜航已启动，请沿星灯走，不要怕。听起来不像坏人。"},
  {id:"j4",if:["saw_drawing"],title:"小孩的画",text:"喷泉石椅上有幅画：夜里的游乐园，星星路标，一个提工具箱的大人对孩子笑。「乔叔叔带我走星星。」"},
  {id:"j5",if:["got_nav_note"],title:"夜航三记",text:"喷泉里捞出的塑封笔记：蓝记在过山车座舱，黄记在风车叶片，红记在鬼屋最里的灯。集齐三记才能开电源室。"},
  {id:"j6",if:["read_photo"],title:"相框背面",text:"管理室照片：小女孩在夜里走丢。背面写着——寻星夜航，是为了让每个走丢的孩子都有路回家。照片注记：10 月。"},
  {id:"j7",if:["saw_monitor"],title:"监控回放",text:"应急屏幕里，阿乔关下一片灯，画上星灯记号，对着镜头挥手：看到的话，别怕，顺着走。"},
  {id:"j8",if:["got_letter"],title:"林晚的信",text:"园长林晚小时候在这里走丢。她把星灯记号和夜航协议留给了每一个可能被反锁的孩子。关电的人是阿乔，他在护送你回家。"}
];

G.PZ_STORY_HOME=[
  "家庭日的烟花散了很久。你们已经出了星灯游乐园，你这才发现口袋里的兑奖券不见了——一定是掉在园里了。",
  "你悄悄折回去找。刚走到售票亭，「咔哒」，入口大门在身后锁上。彩灯一盏盏熄灭，只剩月亮和几颗星。",
  "广播里没有人说话。天亮以前，你得找到电源、打开大门，还要弄清楚：到底是谁关了电，为什么？",
  "先别慌。四处看看，也许有路。"
];

G.PZ_ENDING=[
  "总闸合上的时候，整座园子像被轻轻唤醒：过山车轨道、木马棚顶、喷泉边的小灯，一串串重新亮起来。",
  "出口大门的电子锁「滴」地一声开了。长椅上放着还温热的可可，和你掉的那张兑奖券——原来它一直被收在管理室，等你走完这条路。",
  "电工阿乔从门边探出头，有点不好意思地挥手：「吓到你了吧？夜航是园长小时候设计的。有人闭园后还在里面，灯就会一区区暗下去，只留下星灯记号，把人安全带到办公室，而不是让人在黑夜里乱跑。」",
  "信是园长林晚写的。她说，她十岁那年的 10 月，也曾被反锁在园里，又怕又冻。后来她把秘密记号画遍了游乐设施，又请阿乔建成「寻星夜航」。今晚你走完了她小时候没走完的那条路。",
  "天快亮了。大门敞开着，可可是甜的。兑奖券背面盖着一颗星：欢迎回家。"
];

G.PZ_EXPLAIN=[
  "售票亭闭园告示背面夹子上是 208（墙上 666 是后涂的假密码），打开失物箱。",
  "盆栽里的黄铜钥匙开售票抽屉，读到星灯顺序：蓝→黄→红。荧光棒照开侧门闩。",
  "木马控制室里，按亮着的蓝马 3、黄马 1、红马 5，密码 315 打开发条盒（黑马 777 是假的）。",
  "两半园图拼起来；发条钥匙让木马再转一圈，座位下掉出棉糖摊钥匙。",
  "许愿牌不要看最大的 9999，最小三块从左到右是 427，打开过山车站台储物柜。",
  "座舱下拓下蓝记；检修门取项目英文名 STAR。安全钩捞出喷泉里的夜航三记。",
  "发条钥匙转动风车，黄记叶片上写着 6；小屋拿到镜宫入场戳。",
  "棉糖糖浆阀门转 6 圈，抽屉里有磁铁和兑奖屋后门钥匙。",
  "代币玩抓娃娃：海报要戴星星围巾的蓝熊。钥匙打开保险柜，取得管理室钥匙。",
  "镜宫找三处不同，拿到鬼屋门票。鬼屋并不吓人，最里面的红灯下有红记。",
  "三枚拓印叠成三色星卡，插进管理室对照板，得到电源室门禁卡。暗号是园长小名「晚晚」的拼音写两遍：WANWAN（不是姓 LINWAN）。",
  "电源室装上保险丝和星卡，输入 WANWAN 启动总闸。出口大门转盘转到她走丢的月份 10（门上 1998 是建园年份，是干扰）。"
];

var ROOMS=[];

ROOMS.push({
  id:"gate",title:"入口大门",emoji:"🎪",sub:"序章 · 灯一盏盏灭掉",
  story:[
    "你刚走进售票亭前的小广场，身后的铁门「咔哒」锁死。彩灯一排排熄灭，只剩月亮还亮着。",
    "兑奖券一定还在园里。可现在正门出不去了。",
    "售票窗口、告示牌、盆栽和失物箱都还在。先四处看看吧。"
  ],
  exits:[
    {to:"carousel",label:"侧门去旋转木马",emoji:"🎠",if:["side_open"],text:"荧光棒照出侧门闩。你走进安静的木马广场。",locked:"侧门黑乎乎的，门闩看不清。也许要先找个能发光的东西。"}
  ],
  objects:[
    {id:"irongate",name:"入口铁门",box:[18,70,110,160],views:[
      {if:["!power_on"],text:"沉重的铁门从里面锁死了。门楣锈着一行小字：「寻星的人，先从售票亭开始。」缝隙外只剩停车场的夜灯。现在出不去。"},
      {if:["power_on"],text:"电回来了，门楣的小灯亮起。可这扇门还是要从出口大门那边的总控打开——那边才是夜航的终点。"}
    ]},
    {id:"sign",name:"闭园告示",box:[140,28,110,70],views:[
      {text:"告示正面写着「今日已闭园」。你把它轻轻翻过来——夹子上用旧油漆写着 2、0、8。旁边被人用记号笔涂了 666，墨迹还是湿的，像故意误导。",note:"【线索】夹子上的旧数字是 208。\n【干扰】湿墨 666 不像原来的密码。",set:["seen_208"]}
    ]},
    {id:"poster",name:"本周海报",box:[150,105,90,55],views:[
      {text:"海报：本周明星项目——过山车「星轨」、鬼屋「悄悄话」、兑奖屋。右下角印着：夜间禁止入内。角落被人写了「园长偷走了电，找 404」。字很新，也很难让人相信。",note:"【干扰】404 和「园长偷走了电」像乱涂的，不一定是密码。"}
    ]},
    {id:"booth",name:"售票窗口",box:[250,80,140,130],views:[
      {if:["!booth_open"],text:"卷帘放下，只留一条缝。值班表用磁贴按着：开放 09:00–18:00。一张便签写着：「今夜值班：阿乔（电工）。有人滞留就走夜航。」抽屉上有个小小的钥匙孔。",note:"【线索】今夜值班的人叫阿乔，还提到「夜航」。",set:["read_schedule"],
        use:[{item:"brass_key",set:["booth_open"],text:"黄铜钥匙转了一下，售票抽屉弹开。"}],
        wrong:"抽屉锁着，也许附近有小钥匙。"},
      {if:["booth_open","!got_handbook"],text:"抽屉开了。里面有一页员工手册残页，还有几张过期的家庭日门票。",
        take:{give:["handbook1"],set:["got_handbook"],text:"你拿起手册残页。上面写：夜航条例——星灯记号会按 蓝→黄→红 的顺序亮起。切勿相信墙上乱涂的数字。"}},
      {if:["got_handbook"],text:"空抽屉。值班表和那张「阿乔 / 夜航」的便签还在。手册残页已经在你手上。"}
    ]},
    {id:"lostbox",name:"失物招领箱",box:[150,165,90,70],views:[
      {if:["!box_open"],text:"绿色的失物箱上挂着一把三位密码锁。箱盖贴纸写着「默认 666」，墨水和告示背面那笔湿的一样新。",
        lock:{kind:"num",len:3,answer:"208",prompt:"失物箱的三位密码",
          bad:"不对。箱盖上的 666 墨迹还是湿的，也许是后来才写上去的。再看看别处有没有更旧的数字。",
          ok:{set:["box_open"],text:"咔嗒！失物箱开了。里面有一根还在发光的荧光棒，半张被撕开的园图，还有一把标着「木马控制室」的钥匙。"}}},
      {if:["box_open","!got_box"],text:"失物箱开着。荧光棒还在淡淡发光，旁边是园图西半和木马控制室钥匙。",
        take:{give:["glow","map_a","carousel_key"],set:["got_box"],text:"你收下荧光棒、园图西半，和木马控制室的钥匙。"}},
      {if:["got_box"],text:"空的失物箱。箱盖上那张假贴纸 666 在夜风里轻轻翘起。"}
    ]},
    {id:"mat",name:"欢迎垫",box:[250,220,90,28],views:[
      {text:"欢迎垫写着「星灯游乐园」。你把它掀起来——下面没有钥匙，只有一只受潮的说明书：「盆栽里有备用。」"}
    ]},
    {id:"pot",name:"小盆栽",box:[345,195,48,55],views:[
      {if:["!got_brass"],text:"一盆还挺精神的小绿植，土是松的。",
        take:{give:["brass_key"],set:["got_brass"],text:"你轻轻挖了挖土，摸到一把黄铜小钥匙。"}},
      {if:["got_brass"],text:"盆栽的土被挖过一个小坑，钥匙已经不在了。"}
    ]},
    {id:"sidedoor",name:"园区侧门",box:[20,225,70,40],views:[
      {if:["!side_open"],text:"铁栅侧门关着，门闩藏在暗处，眼睛看不太清。",
        use:[{item:"glow",set:["side_open"],text:"荧光棒一照，门闩的位置就清楚了。你把它拨开——通往旋转木马的路出现了。"}],
        wrong:"门闩在暗处。先找个能发光的东西照一照。"},
      {if:["side_open"],text:"侧门已经打开。木马广场那边偶尔传来一声轻轻的风响。"}
    ]}
  ],
  hints:[
    {until:"seen_208",obj:"sign",tiers:["先看看门口的闭园告示。","把它翻到背面。","夹子上的旧数字是 208，666 是后涂的。"]},
    {until:"box_open",obj:"lostbox",tiers:["失物箱有一把三位锁。","别信箱盖上新写的 666。","用 208。"]},
    {until:"got_box",obj:"lostbox",tiers:["失物箱开了，把里面的东西拿走。","点失物箱，再按「拿起」。","荧光棒、园图和钥匙都要带走。"]},
    {until:"got_brass",obj:"pot",tiers:["欢迎垫下面写着备用在盆栽里。","去翻翻那盆小绿植。","拿起黄铜小钥匙。"]},
    {until:"got_handbook",obj:"booth",tiers:["售票抽屉锁着。","用黄铜小钥匙。先在物品栏选中钥匙，再点售票窗口。","拿起手册残页，记得星灯顺序是蓝→黄→红。"]},
    {until:"side_open",obj:"sidedoor",tiers:["侧门的门闩看不清。","用荧光棒去照侧门。","选中荧光棒，再点园区侧门。"]}
  ]
});

ROOMS.push({
  id:"carousel",title:"旋转木马",emoji:"🎠",sub:"广场 · 还在亮的三匹马",
  story:[
    "木马广场安静得能听见旗子在响。棚顶的彩灯大多灭了，只有三匹马还各自亮着一盏小灯：蓝的、黄的、红的。",
    "旁边有一间小小的控制室。地上好像掉了什么东西。"
  ],
  exits:[
    {to:"gate",label:"回入口大门",emoji:"🎪",text:"你沿着侧门走回售票亭前。"},
    {to:"fountain",label:"去幸运喷泉",emoji:"⛲",text:"穿过花坛小径，来到夜里的许愿喷泉。"},
    {to:"cotton",label:"去棉花糖摊",emoji:"🍭",text:"糖霜的香气还淡淡留着，你走到棉糖摊前。"}
  ],
  objects:[
    {id:"bluehorse",name:"蓝马",box:[40,130,70,90],views:[
      {text:"这匹蓝马的小灯还亮着。鞍下的号牌写着 3。手册残页说过，星灯按 蓝→黄→红 的顺序亮。",note:"【线索】蓝马号牌：3（顺序里的第一个）。"}
    ]},
    {id:"yellowhorse",name:"黄马",box:[120,140,70,90],views:[
      {text:"黄马的小灯暖暖的。号牌写着 1。",note:"【线索】黄马号牌：1（顺序里的第二个）。"}
    ]},
    {id:"redhorse",name:"红马",box:[200,132,70,90],views:[
      {text:"红马的小灯像一颗小草莓。号牌写着 5。",note:"【线索】红马号牌：5（顺序里的第三个）。"}
    ]},
    {id:"blackhorse",name:"黑马",box:[280,148,60,80],views:[
      {text:"这匹黑马的灯是灭的。肚子上用粉笔新写了「777」，字粉还掉在地上。不太像原来就有的记号。",note:"【干扰】777 是新写上去的，黑马的灯也没亮。"}
    ]},
    {id:"boothdoor",name:"控制室门",box:[330,90,62,120],views:[
      {if:["!booth2_open"],text:"小控制室的门锁着，铭牌写着「旋转木马控制」。",
        use:[{item:"carousel_key",set:["booth2_open"],text:"钥匙对上了。控制室的门开了一条缝，里面有对讲机和一只发条音乐盒。"}],
        wrong:"门锁着。失物箱里好像有一把标着「木马控制室」的钥匙。"},
      {if:["booth2_open"],text:"控制室的门开着。可以对讲机、看看音乐盒。"}
    ]},
    {id:"radio",name:"对讲机",box:[338,100,50,40],views:[
      {if:["!booth2_open"],text:"隔着门上的小窗，能看见对讲机的红灯在闪。先把门打开。"},
      {if:["booth2_open"],text:"你按下收听。沙沙的电流声后，一个温和的声音说：「阿乔呼叫……检测到滞留访客，夜航已启动。请沿星灯走。不要怕。按蓝、黄、红的顺序。」然后只剩电流声。",note:"【线索】阿乔让你沿星灯走，顺序是蓝、黄、红。听起来不像要害人。",set:["heard_radio"]}
    ]},
    {id:"musicbox",name:"发条音乐盒",box:[338,145,50,45],views:[
      {if:["!booth2_open"],text:"门还锁着，看不清里面的音乐盒。"},
      {if:["booth2_open","!box2_open"],text:"一只旧木音乐盒，侧面有三格数字盘。说明书残页贴在盖子里：「按仍在亮灯的颜色顺序，记下号牌。」旁边一行原子笔：「默认 1234 / 试过 777 都不对。」",
        lock:{kind:"num",len:3,answer:"315",prompt:"音乐盒三格数字（亮灯颜色顺序）",
          bad:"不对。说明书让你按仍在亮灯的颜色顺序看号牌。黑马没亮，777 和 1234 都被人试过了。",
          ok:{set:["box2_open"],text:"音乐盒叮叮地打开。里面是园图的东半边，和一把齿痕发亮的发条钥匙。"}}},
      {if:["box2_open","!got_music"],text:"音乐盒开着。园图东半和发条钥匙还在绒垫上。",
        take:{give:["map_b","winder"],set:["got_music"],text:"你收下园图东半和发条钥匙。两半园图也许可以拼在一起。"}},
      {if:["got_music"],text:"空的音乐盒。曲调已经停了。"}
    ]},
    {id:"horses",name:"木马转盘",box:[70,115,200,30],views:[
      {if:["!car_wound"],text:"木马停着。转轴中央有一个发条孔，大小和你那把发条钥匙很像。",
        use:[{item:"winder",set:["car_wound"],text:"你给转盘上紧发条。木马慢慢转过一圈，一匹马的座位下「当啷」掉出一把小钥匙，标签是「棉糖摊」。"}],
        wrong:"转轴上有发条孔，也许需要钥匙一样的东西。"},
      {if:["car_wound","!got_cotton_key"],text:"木马停稳了。座位下掉出一把「棉糖摊」钥匙。",
        take:{give:["cotton_key"],set:["got_cotton_key"],text:"你捡起棉糖摊钥匙。"}},
      {if:["got_cotton_key"],text:"木马又安静下来。三匹亮着灯的马像在守夜。"}
    ]},
    {id:"badgeobj",name:"掉落的工作证",box:[160,245,50,28],views:[
      {if:["!got_badge"],text:"地上一张塑封工作证，沾着油渍：电工 阿乔。照片里的人笑起来有点腼腆。",
        take:{give:["badge"],set:["got_badge"],text:"你捡起阿乔的工作证。他今夜值班，会是他关的电吗？"}},
      {if:["got_badge"],text:"工作证已经在你身上。地面上只剩一点油渍印。"}
    ]}
  ],
  hints:[
    {until:"booth2_open",obj:"boothdoor",tiers:["先打开旁边的小控制室。","用失物箱里那把「木马控制室」钥匙。","选中钥匙，再点控制室门。"]},
    {until:"heard_radio",obj:"radio",tiers:["控制室里的对讲机在闪红灯。","点对讲机听一听。","阿乔说按蓝、黄、红的顺序走，叫你不要怕。"]},
    {until:"box2_open",obj:"musicbox",tiers:["音乐盒要按亮着的马的颜色顺序。","蓝马 3、黄马 1、红马 5。黑马没亮，777 是假的。","输入 315。"]},
    {until:"got_music",obj:"musicbox",tiers:["把音乐盒里的东西拿走。","点音乐盒，再按「拿起」。","园图东半和发条钥匙。"]},
    {until:"got_cotton_key",obj:"horses",tiers:["发条钥匙还能用在木马转盘上。","选中发条钥匙，点木马转盘。","转完一圈，拿起掉下来的棉糖摊钥匙。"]},
    {until:"got_badge",obj:"badgeobj",if:["booth2_open"],tiers:["地上好像掉了工作证。","点那张工作证并拿走。","这是电工阿乔的。"]}
  ]
});

ROOMS.push({
  id:"fountain",title:"幸运喷泉",emoji:"⛲",sub:"许愿 · 别信最大的数字",
  story:[
    "喷泉还在轻轻吐着最后几串水珠。许愿牌挂了整整一圈，最大的那块特别显眼。",
    "石椅上放着一幅小孩的画。喷口里好像卡着什么东西，手够不着。"
  ],
  exits:[
    {to:"carousel",label:"回旋转木马",emoji:"🎠",text:"你沿花坛走回木马广场。"},
    {to:"coaster",label:"去过山车站",emoji:"🎢",text:"顺着园路的星轨路标，你来到过山车的站台。"},
    {to:"prize",label:"去兑奖屋方向",emoji:"🧸",text:"你朝兑奖屋走去，橱窗里的娃娃还坐在黑暗里。"}
  ],
  objects:[
    {id:"pool",name:"许愿池",box:[110,130,180,90],views:[
      {if:["!got_token"],text:"池水浅浅的，底部闪过一枚代币。你伸手就可以捞上来——还是干的，像刚放进去不久。",
        take:{give:["token"],set:["got_token"],text:"你得到一枚许愿代币。兑奖屋的抓娃娃机也许收这个。"}},
      {if:["got_token"],text:"许愿池安静地闪着月亮的光。代币已经在你口袋里。"}
    ]},
    {id:"plaques",name:"许愿牌",box:[80,85,240,45],views:[
      {text:"许愿牌挂了一圈。最大的一块赫然写着 9999，牌子背面还涂了「密码就是最大的」。另外三块最小的木牌并排放着，从左到右是 4、2、7，字迹旧而工整。完整园图的手写边注也说过：别信最大的数字。",note:"【线索】最小的三块从左到右：427。\n【干扰】最大的 9999，还有「密码就是最大的」。",set:["read_plaques"]}
    ]},
    {id:"drawing",name:"石椅上的画",box:[20,170,80,70],views:[
      {text:"蜡笔画：夜里的游乐园，一路小小的星灯，一个提工具箱的大人对着孩子笑。下方歪歪扭扭写着：「乔叔叔带我走星星。」看起来一点也不像坏事。",set:["saw_drawing"]}
    ]},
    {id:"spout",name:"堵塞的喷口",box:[175,115,50,30],views:[
      {if:["!got_nav_note"],text:"喷口卡住一张塑封卡片，水面晃着，手指够不着。若有小钩子就好了。",
        use:[{item:"hook",set:["got_nav_note"],text:"安全钩把塑封卡片钓了上来。上面是夜航三记：蓝在座舱，黄在风车叶片，红在鬼屋最里的灯。集齐三记才能开电源室。"}],
        wrong:"够不着。也许过山车站台有可以钩东西的工具。"},
      {if:["got_nav_note"],text:"喷口通了。夜航三记已经记下：蓝在座舱，黄在风车，红在鬼屋。"}
    ]}
  ],
  hints:[
    {until:"got_token",obj:"pool",tiers:["许愿池里闪着一枚代币。","点许愿池，把它捞起来。","代币以后在兑奖屋用得上。"]},
    {until:"read_plaques",obj:"plaques",tiers:["把许愿牌都看一遍。","别被最大的 9999 骗到。","最小的三块从左到右是 427。"]},
    {until:"saw_drawing",obj:"drawing",tiers:["石椅上有一幅画。","点开看看。","乔叔叔带着孩子走星星，不像坏人。"]},
    {until:"got_nav_note",obj:"spout",tiers:["喷口里卡着一张卡片。","去过山车站找可以钩东西的工具，再回来用。","选中安全钩，点堵塞的喷口。"]}
  ]
});

ROOMS.push({
  id:"coaster",title:"过山车轨道站",emoji:"🎢",sub:"星轨号 · 座舱下的蓝记",
  story:[
    "「星轨」过山车像一条睡着的龙。站台储物柜还锁着，控制台全黑，只有轨道在月光下发亮。",
    "检票牌上写着项目的英文名。角落有一扇维修小门。"
  ],
  exits:[
    {to:"fountain",label:"回幸运喷泉",emoji:"⛲",text:"你沿星轨路标走回喷泉。"},
    {to:"windmill",label:"维修通道去风车",emoji:"🌬️",if:["hatch_open"],text:"检修门后是一条窄窄的维修廊，直通园边的大风车。",locked:"检修门关着，上面有字母转盘。也许要先弄清项目的英文名。"}
  ],
  objects:[
    {id:"signboard",name:"星轨号牌",box:[40,40,160,55],views:[
      {text:"巨大的号牌写着：过山车「星轨」STAR-RAIL。下方一行旧油漆：「检修门禁，取项目英文名的前四个字母。」有人用记号笔在旁边写了 FAST、RAIL，笔迹很新。",note:"【线索】项目英文名 STAR-RAIL，前四个字母是 STAR。\n【干扰】FAST、RAIL 是后写的。",set:["read_star_sign"]}
    ]},
    {id:"locker",name:"站台储物柜",box:[30,130,80,110],views:[
      {if:["!locker_open"],text:"储物柜门上贴着「员工用品」。锁是三位数字。柜门贴纸写着：密码＝过山车最高时速 88。字迹和新涂鸦差不多。",
        lock:{kind:"num",len:3,answer:"427",prompt:"储物柜三位密码",
          bad:"88 不太对。想想喷泉边那些许愿牌——园图还提醒过，别信最大的数字。",
          ok:{set:["locker_open"],text:"储物柜开了。里面有安全钩、一枚标着「夜航备用」的保险丝，还有一把座舱钥匙。"}}},
      {if:["locker_open","!got_locker"],text:"柜门开着。安全钩、保险丝和座舱钥匙还在。",
        take:{give:["hook","fuse","car_key"],set:["got_locker"],text:"你收下安全钩、夜航备用保险丝，和座舱钥匙。"}},
      {if:["got_locker"],text:"空储物柜。那张「时速 88」的假贴纸还贴在门上。"}
    ]},
    {id:"car",name:"过山车座舱",box:[130,150,160,90],views:[
      {if:["!car_open"],text:"第一节座舱锁着安全带闸。需要座舱钥匙。",
        use:[{item:"car_key",set:["car_open"],text:"座舱打开。座位底下用蓝漆画着一颗小星星，旁边有一行字：蓝记已检查。下一站风车。——乔"}],
        wrong:"座舱锁着。储物柜里也许有钥匙。"},
      {if:["car_open","!got_star_blue"],text:"座位底下的蓝色星灯记号在月光里微微发亮。你可以把它拓在一张卡片上。",
        take:{give:["star_blue"],set:["got_star_blue"],text:"你小心拓下蓝色星灯记号。夜航的第一记，在这里。"}},
      {if:["got_star_blue"],text:"座舱还敞着。蓝记已经拓走，便条仍写着：下一站风车。——乔"}
    ]},
    {id:"panel",name:"控制台",box:[300,130,85,90],views:[
      {text:"控制台没有电，按钮全是死的。屏幕上贴着一张刺眼的黄标签：「启动码 0000」。边角卷起，下面露出旧字：已作废。",note:"【干扰】0000 是作废的启动码。"}
    ]},
    {id:"hatch",name:"维修检修门",box:[300,40,85,80],views:[
      {if:["!hatch_open"],text:"检修门通往园边的大风车。门上是四位字母转盘，铭牌几乎褪色。",
        lock:{kind:"alpha",len:4,answer:"STAR",prompt:"检修门禁（四个字母）",
          bad:"不对。号牌上写着取项目英文名的前四个字母。FAST 和 RAIL 是后写的。",
          ok:{set:["hatch_open"],text:"检修门开了。风从通道里吹过来，带着一点草木和机油的味道。"}}},
      {if:["hatch_open"],text:"检修门开着，通道通向园边的大风车。"}
    ]}
  ],
  hints:[
    {until:"locker_open",obj:"locker",tiers:["先开站台储物柜。","别信柜门上的时速 88。回想喷泉的许愿牌。","最小的三块牌子从左到右是 427。"]},
    {until:"got_locker",obj:"locker",tiers:["把柜子里的东西都拿走。","点储物柜，按「拿起」。","安全钩、保险丝、座舱钥匙都要。"]},
    {until:"got_star_blue",obj:"car",tiers:["用座舱钥匙打开过山车。","选中座舱钥匙，点座舱，再把蓝记拓下来。","蓝记是夜航的第一记。"]},
    {until:"hatch_open",obj:"hatch",tiers:["检修门是四个字母。","看看「星轨」号牌上的英文名。","前四个字母是 STAR，不是 RAIL 或 FAST。"]}
  ]
});

ROOMS.push({
  id:"windmill",title:"园边大风车",emoji:"🌬️",sub:"叶片 · 黄记和数字",
  story:[
    "园边立着一座拍照用的大风车，叶片高高停着。小屋的门虚掩着。",
    "齿轮旁有一个眼熟的发条孔。"
  ],
  exits:[
    {to:"coaster",label:"回过山车站",emoji:"🎢",text:"你沿维修廊走回过山车站台。"},
    {to:"mirror",label:"去镜宫",emoji:"🪞",text:"风车小径通向镜宫门口，玻璃在夜里闪着碎光。"}
  ],
  objects:[
    {id:"blades",name:"风车叶片",box:[80,20,160,140],views:[
      {if:["!mill_wound"],text:"四片叶片停在高处。你隐约看见其中一片涂着黄漆，但看不清细节。底部齿轮有发条孔。",
        use:[{item:"winder",set:["mill_wound"],text:"发条钥匙咬合齿轮，风车慢慢转过四分之一圈。那片黄叶子落到眼前：一颗黄星，旁边工整地写着 6。另几片上分别是 8、2、9，笔画却很草。"}],
        wrong:"叶片太高了。也许那把发条钥匙也能转这个齿轮。"},
      {if:["mill_wound","!got_star_yellow"],text:"黄叶片就在眼前：星灯记号，和数字 6。8、2、9 写在别的叶片上，笔画很新很草。",note:"【线索】黄记叶片上的数字是 6。\n【干扰】8、2、9 写得很草，不像原来的。",
        take:{give:["star_yellow"],set:["got_star_yellow"],text:"你拓下黄色星灯记号。叶片上的 6 也记在心里了。"}},
      {if:["got_star_yellow"],text:"黄叶片停在低处。黄记已经拓走，数字 6 还在。"}
    ]},
    {id:"gear",name:"风车齿轮",box:[130,160,70,50],views:[
      {if:["!mill_wound"],text:"巨大的木齿轮，正中有一个发条孔，大小和木马转盘上的一样。",
        use:[{item:"winder",set:["mill_wound"],text:"齿轮咬合，风车转过四分之一圈。黄叶片带着一颗星星落到你面前。"}],
        wrong:"需要能上发条的东西。"},
      {if:["mill_wound"],text:"齿轮还微微发热。叶片已经转到能看清的位置。"}
    ]},
    {id:"hut",name:"风车小屋",box:[270,120,110,110],views:[
      {if:["!got_stamp"],text:"小屋门虚掩着。桌上放着一枚「镜宫检修」入场戳，便签写着：镜宫今晚做找不同检修，印章放小屋。——乔",
        take:{give:["mirror_stamp"],set:["got_stamp"],text:"你拿起镜宫入场戳。有了它，镜宫的闸机才会放行。"}},
      {if:["got_stamp"],text:"空桌子。窗向外望去，鬼屋门口还亮着一盏红灯，像在等人。"}
    ]},
    {id:"scope",name:"观光望远镜",box:[20,150,60,80],views:[
      {text:"你凑到望远镜前。远处鬼屋门口的灯还亮着一盏红的，像在轻轻招手。兑奖屋的橱窗黑着，管理室的小窗有一点应急光。"}
    ]}
  ],
  hints:[
    {until:"mill_wound",obj:"gear",tiers:["叶片太高，先让风车转起来。","用从音乐盒拿到的发条钥匙。","选中发条钥匙，点齿轮或叶片。"]},
    {until:"got_star_yellow",obj:"blades",tiers:["黄叶片转到眼前了，把它拓下来。","点风车叶片，按「拿起」。","记住叶片上的数字 6，别被 8、2、9 骗到。"]},
    {until:"got_stamp",obj:"hut",tiers:["小屋门是虚掩的。","进去看看桌子。","拿走镜宫入场戳。"]}
  ]
});

ROOMS.push({
  id:"cotton",title:"棉花糖操作台",emoji:"🍭",sub:"糖霜 · 阀门上的圈数",
  story:[
    "棉花糖摊的彩条棚布在夜风里轻轻鼓。铁卷帘关着，空气里还留着一点甜味。",
    "棚柱上贴着今晚的菜单，字写得很大。"
  ],
  exits:[
    {to:"carousel",label:"回旋转木马",emoji:"🎠",text:"你带着一点糖香走回木马广场。"},
    {to:"prize",label:"去兑奖屋",emoji:"🧸",text:"棉糖摊旁边就是兑奖屋的后门小巷。"}
  ],
  objects:[
    {id:"shutter",name:"铁卷帘",box:[80,50,200,120],views:[
      {if:["!cotton_open"],text:"铁卷帘锁着，锁孔小小的。标签写着棉花糖操作台。",
        use:[{item:"cotton_key",set:["cotton_open"],text:"棉糖摊钥匙打开了卷帘。里面露出糖浆阀门、一只抽屉，和一页员工留言。"}],
        wrong:"卷帘锁着。旋转木马转过一圈后，座位下也许掉过钥匙。"},
      {if:["cotton_open"],text:"卷帘已经打开。可以去转阀门、读留言。"}
    ]},
    {id:"valve",name:"糖浆阀门",box:[130,80,90,70],views:[
      {if:["!cotton_open"],text:"隔着卷帘的缝，隐约看见一只阀门。先把卷帘打开。"},
      {if:["cotton_open","!valve_open"],text:"阀门上有刻度 1 到 9。说明写着：按正确圈数转，抽屉会弹开。旁边的配方卡却写着：加热 180 度，搅拌 12 下。",
        lock:{kind:"num",len:1,answer:"6",prompt:"阀门要转几圈？",
          bad:"12 和 180 都写在配方卡上，不像阀门圈数。再想想风车黄叶片上的数字。",
          ok:{set:["valve_open"],text:"阀门转到第 6 格，抽屉「啪」地弹开。里面有一块小磁铁，和一把兑奖屋后门钥匙。"}}},
      {if:["valve_open","!got_valve"],text:"抽屉开着。小磁铁和兑奖屋后门钥匙还在。",
        take:{give:["magnet","prize_key"],set:["got_valve"],text:"你收下小磁铁和兑奖屋后门钥匙。"}},
      {if:["got_valve"],text:"空抽屉。阀门停在刻度 6。"}
    ]},
    {id:"menu",name:"菜单板",box:[20,60,70,110],views:[
      {text:"经典棉花糖 12 元，彩虹 18 元。边角有人写「密码 12」。笔迹和新涂鸦一样草。",note:"【干扰】12 和 18 只是价格，不太像阀门圈数。"}
    ]},
    {id:"note",name:"员工留言",box:[260,80,110,70],views:[
      {if:["!cotton_open"],text:"卷帘后面好像夹着一张纸，看不清。"},
      {if:["cotton_open"],text:"留言：「阿乔把夜航备用保险丝放在过山车站台储物柜了。兑奖屋保险柜的钥匙，在今晚头奖娃娃身上。——晚」"}
    ]}
  ],
  hints:[
    {until:"cotton_open",obj:"shutter",tiers:["先打开铁卷帘。","用木马座位下掉出的棉糖摊钥匙。","选中钥匙，再点铁卷帘。"]},
    {until:"valve_open",obj:"valve",tiers:["糖浆阀门要转到正确的圈数。","别信菜单上的 12 或配方卡的 180。","风车黄叶片上写的是 6。"]},
    {until:"got_valve",obj:"valve",tiers:["抽屉开了，把东西拿走。","点阀门，按「拿起」。","磁铁和兑奖屋后门钥匙都要。"]}
  ]
});

ROOMS.push({
  id:"prize",title:"兑奖屋",emoji:"🧸",sub:"后台 · 抓娃娃和保险柜",
  story:[
    "兑奖屋的橱窗里，娃娃们在暗处安静坐着。正门关死了，后门在小巷里。",
    "柜台有一张便签。角落里，抓娃娃机的彩灯还剩一点点电。"
  ],
  exits:[
    {to:"fountain",label:"回幸运喷泉",emoji:"⛲",text:"你穿过小广场走回喷泉。"},
    {to:"cotton",label:"回棉花糖摊",emoji:"🍭",text:"你走回还留着甜味的棉糖摊。"},
    {to:"haunted",label:"去鬼屋「悄悄话」",emoji:"👻",text:"沿着红灯的方向，你走到鬼屋门口。"},
    {to:"office",label:"去管理室",emoji:"📋",if:["got_office_key"],text:"你用管理室钥匙打开员工通道，走进园长的办公室。",locked:"员工通道锁着，需要管理室的钥匙。"}
  ],
  objects:[
    {id:"backdoor",name:"兑奖屋后门",box:[20,80,70,150],views:[
      {if:["!prize_open"],text:"后门挂着一把普通的锁。里面隐约看得见抓娃娃机。",
        use:[{item:"prize_key",set:["prize_open"],text:"后门开了。屋里有抓娃娃机、奖品柜，和一只小保险柜。"}],
        wrong:"门锁着。棉糖摊的抽屉里好像有后门钥匙。"},
      {if:["prize_open"],text:"后门开着，屋里安静而拥挤。"}
    ]},
    {id:"claw",name:"抓娃娃机",box:[110,80,140,140],views:[
      {if:["!prize_open"],text:"隔着门玻璃能看见抓娃娃机，灯还在轻轻闪。先开门。"},
      {if:["prize_open","!token_in","!claw_ok"],text:"机台还亮着。顶部海报写着：「本周头奖是戴星星围巾的蓝熊」。投币口正好适合许愿代币。",
        use:[{item:"token",take:["token"],set:["token_in"],text:"代币「叮」地投了进去，爪子可以启动了。请选出海报上的那只娃娃。"}],
        wrong:"这台机子要投币。许愿池里捞到的代币也许能用。"},
      {if:["prize_open","token_in","!claw_ok"],text:"代币已经投进去。海报写着：「本周头奖是戴星星围巾的蓝熊」。选对那一只！",
        game:{id:"claw",ok:{set:["claw_ok"],text:"爪子稳稳抓住那只戴星星围巾的蓝熊！它口袋里掉出一把小小的保险柜钥匙。"}}},
      {if:["claw_ok","!got_safe_key"],text:"蓝熊躺在出奖口，口袋里有一把小钥匙。",
        take:{give:["safe_key"],set:["got_safe_key"],text:"你拿走保险柜小钥匙，并把蓝熊轻轻放回柜台上——它该在这儿等真正的兑奖。"}},
      {if:["got_safe_key"],text:"抓娃娃机安静下来。头奖已经找到了。"}
    ]},
    {id:"cabinet",name:"奖品柜",box:[270,70,110,100],views:[
      {if:["!prize_open"],text:"隔着玻璃看见满柜娃娃。"},
      {if:["prize_open","!got_slip"],text:"奖品柜靠墙。柜脚缝里像夹着一张金属边的纸条，手指拿不到。",
        use:[{item:"magnet",set:["got_slip"],text:"磁铁把纸条吸了出来。上面写着：保险柜只用钥匙，没有密码。柜门上的 0000 是防小孩子乱转的假盘。"}],
        wrong:"缝太窄了。一块小磁铁也许能把纸条吸出来。"},
      {if:["got_slip"],text:"纸条已经在你手里：保险柜只用钥匙，0000 是假盘。"}
    ]},
    {id:"safe",name:"小保险柜",box:[280,175,95,70],views:[
      {if:["!prize_open"],text:"屋里角落好像有一只小保险柜。先开门。"},
      {if:["prize_open","!safe_open"],text:"小保险柜的转盘写着 0000，旁边还有一个钥匙孔。",
        use:[{item:"safe_key",set:["safe_open"],text:"钥匙一转，柜门开了。里面是管理室钥匙，和一页手册：「电源总闸需要三色星卡。假密码 0000 和 1234 是防误触的。园长的暗号不是她的姓，是她小时候的昵称。」"}],
        wrong:"也许需要一把很小的钥匙。抓娃娃机的头奖身上会不会有？"},
      {if:["safe_open","!got_office_key"],text:"保险柜开着。管理室钥匙和手册残页还在。",
        take:{give:["office_key"],set:["got_office_key","got_handbook2"],text:"你收下管理室钥匙。手册写着：总闸需要三色星卡；园长的暗号不是她的姓，是她小时候的昵称。"}},
      {if:["got_office_key"],text:"空保险柜。假转盘 0000 还停在原处。"}
    ]},
    {id:"counter",name:"柜台便签",box:[110,225,150,30],views:[
      {if:["!prize_open"],text:"隔着门，柜台隐约有一张黄便签。"},
      {if:["prize_open"],text:"便签：「有小朋友掉了兑奖券，先放在管理室抽屉。可可我搁在电源室加热器上了。——晚」你的心跳快了一拍：券在管理室！"}
    ]}
  ],
  hints:[
    {until:"prize_open",obj:"backdoor",tiers:["先打开兑奖屋后门。","用棉糖摊抽屉里的后门钥匙。","选中钥匙，点后门。"]},
    {until:"claw_ok",obj:"claw",tiers:["抓娃娃机要先投币。","用许愿代币，再按海报选「戴星星围巾的蓝熊」。","不是蓝猫，也不是没围巾的蓝熊。"]},
    {until:"got_safe_key",obj:"claw",tiers:["把蓝熊口袋里的小钥匙拿走。","点抓娃娃机，按「拿起」。","这是保险柜的钥匙。"]},
    {until:"safe_open",obj:"safe",tiers:["去开小保险柜。","柜上的 0000 是假盘，用钥匙开。","选中小钥匙，点保险柜。"]},
    {until:"got_office_key",obj:"safe",tiers:["把管理室钥匙拿走。","点保险柜，按「拿起」。","手册提醒：园长的暗号是小名，不是姓。"]}
  ]
});

ROOMS.push({
  id:"mirror",title:"镜宫迷宫",emoji:"🪞",sub:"找不同 · 两幅夜游图",
  story:[
    "镜宫门口的闸机还亮着一盏小灯。里面的镜子把月光折成许多碎片，并不吓人，反而有点像万花筒。",
    "最里面立着两幅几乎一样的「夜游园」壁画，下面写着：找出三处不同，中央台座就会打开。"
  ],
  exits:[
    {to:"windmill",label:"回园边风车",emoji:"🌬️",text:"你走出镜宫，风车的叶片在夜里慢慢黑着。"},
    {to:"haunted",label:"去鬼屋「悄悄话」",emoji:"👻",text:"镜宫的侧门通向鬼屋前的小道。"}
  ],
  objects:[
    {id:"mirrorgate",name:"镜宫闸机",box:[20,80,70,150],views:[
      {if:["!mirror_open"],text:"闸机要盖一个「镜宫检修」的戳才会抬杆。",
        use:[{item:"mirror_stamp",set:["mirror_open"],text:"盖上入场戳，闸机轻轻抬起。镜子里出现了好多你。"}],
        wrong:"需要入场戳。风车小屋的桌子上好像放过一枚。"},
      {if:["mirror_open"],text:"闸机已经抬起。可以进到找不同的壁画前。"}
    ]},
    {id:"mirrors",name:"哈哈镜",box:[110,50,80,120],views:[
      {if:["!mirror_open"],text:"门口的镜子里，你的脸被拉得长长的，有点好笑。先过闸机吧。"},
      {if:["mirror_open"],text:"哈哈镜里的你拿着荧光棒，头上冒出两只棉花糖似的耳朵。一点也不可怕，倒像在给你打气。"}
    ]},
    {id:"mural",name:"夜游园壁画",box:[200,50,180,150],views:[
      {if:["!mirror_open"],text:"里面好像有两幅大壁画，得先过闸机。"},
      {if:["mirror_open","!diff_ok"],text:"左右两幅「夜游园」几乎一模一样。说明写着：找出三处不同，台座就会打开。仔细比对灯、人物和钟。",
        game:{id:"diff",ok:{set:["diff_ok"],text:"三处不同都找到了！中央台座轻轻升起，里面是一张画着害羞小幽灵的门票，还有一行字：灯上星星较少的那边才是原来的数目。"}}},
      {if:["diff_ok","!got_haunt"],text:"台座开着。悄悄话门票还在软垫上。",
        take:{give:["haunt_ticket"],set:["got_haunt"],text:"你拿起鬼屋「悄悄话」的门票。票面的小幽灵用手挡住眼睛，从指缝里笑。"}},
      {if:["got_haunt"],text:"两幅壁画还亮着。你已经找出过不同：左边灯上 5 颗星、右边 6 颗；右边的工作人员少了徽章；右边的钟是 9 点，左边是 8 点。"}
    ]},
    {id:"fake",name:"墙上纸条",box:[120,200,90,40],views:[
      {text:"有人贴了一张纸条：「密码 888，走左边。」箭头却指进一面实心镜墙。你伸手一碰，只碰到自己的手指。",note:"【干扰】888 和「走左边」是假线索。"}
    ]}
  ],
  hints:[
    {until:"mirror_open",obj:"mirrorgate",tiers:["先过镜宫闸机。","用风车小屋拿到的入场戳。","选中入场戳，点闸机。"]},
    {until:"diff_ok",obj:"mural",tiers:["两幅夜游园壁画有三处不同，都点出来。","比一比灯上的星星、工作人员的徽章，还有钟点。","左边 5 颗星、有徽章、钟是 8 点；右边少了徽章、6 颗星、钟是 9 点。"]},
    {until:"got_haunt",obj:"mural",tiers:["台座开了，把门票拿走。","点壁画，按「拿起」。","这是鬼屋「悄悄话」的门票。"]}
  ]
});

ROOMS.push({
  id:"haunted",title:"鬼屋「悄悄话」",emoji:"👻",sub:"惊喜 · 并不吓人的红灯",
  story:[
    "牌子上画着一只捂眼睛的小幽灵，店名是「悄悄话」，不是「鬼哭狼嚎」。门口的红灯像一颗糖果。",
    "只要有门票，就可以进去。里面也许有第三记星灯。"
  ],
  exits:[
    {to:"prize",label:"回兑奖屋",emoji:"🧸",text:"你沿着小道走回兑奖屋。"},
    {to:"mirror",label:"回镜宫",emoji:"🪞",text:"你回到镜子折光的走廊。"},
    {to:"office",label:"去管理室",emoji:"📋",if:["got_office_key"],text:"红灯走廊的尽头连着员工通道，你走进管理室。",locked:"往管理室的门还锁着，需要钥匙。"}
  ],
  objects:[
    {id:"hauntdoor",name:"鬼屋大门",box:[20,70,80,160],views:[
      {if:["!haunt_open"],text:"门上画着害羞的小幽灵。检票口需要「悄悄话」门票。",
        use:[{item:"haunt_ticket",set:["haunt_open"],text:"门票对上了。门后没有鬼叫，只落下轻轻的风铃声，像有人在对你说：欢迎。"}],
        wrong:"需要门票。镜宫的找不同机关打开后，台座里也许有。"},
      {if:["haunt_open"],text:"门开着，风铃还在轻轻响。"}
    ]},
    {id:"skel",name:"塑料骷髅",box:[120,110,80,110],views:[
      {if:["!haunt_open"],text:"门缝里隐约看见一具装饰用的骷髅，挂着微笑。先入场吧。"},
      {if:["haunt_open"],text:"塑料骷髅胸前挂着卡片：「我的骨头是塑料的，别怕。真正要找的，是最里面那盏红灯。」它的下巴还装了弹簧，一点也不可怕。"}
    ]},
    {id:"pipe",name:"悄悄话管道",box:[210,70,80,70],views:[
      {if:["!haunt_open"],text:"门口的管道口用布盖着，要进去才能听。"},
      {if:["haunt_open"],text:"你把耳朵凑过去。管道里传来有点回音、却很温和的声音：「别跑。顺着红灯走。我在最里面等你。——不是鬼，是乔。」你忍不住笑了一下。",set:["heard_whisper"]}
    ]},
    {id:"redlamp",name:"最里面的红灯",box:[300,80,85,120],views:[
      {if:["!haunt_open"],text:"隔着门，最里面有一点红光。"},
      {if:["haunt_open","!got_star_red"],text:"走廊尽头的红灯下，画着一颗红星。灯座旁还有一个害羞的小幽灵模型，举着牌子：「吓到你了吗？来管理室喝可可。」",
        take:{give:["star_red"],set:["got_star_red"],text:"你拓下红色星灯记号。三记都齐了的话，可以把拓印叠在一起。"}},
      {if:["got_star_red"],text:"红灯还亮着。小幽灵的牌子仍写着：来管理室喝可可。"}
    ]},
    {id:"graffiti",name:"涂鸦墙",box:[120,225,160,35],views:[
      {text:"有人用彩笔写「这里闹鬼，园长是吸血鬼」，还画了一颗长牙的草莓。怎么看都像小朋友的恶作剧。",note:"【干扰】「园长是吸血鬼」只是玩笑涂鸦。"}
    ]}
  ],
  hints:[
    {until:"haunt_open",obj:"hauntdoor",tiers:["先用门票进鬼屋。","门票在镜宫找不同的台座里。","选中门票，点鬼屋大门。"]},
    {until:"heard_whisper",obj:"pipe",tiers:["里面有一根悄悄话管道。","把耳朵凑过去听。","说话的人是乔，不是鬼。"]},
    {until:"got_star_red",obj:"redlamp",tiers:["顺着红灯走到最里面。","把红记拓下来。","三枚拓印可以在物品栏里叠在一起。"]}
  ]
});

ROOMS.push({
  id:"office",title:"管理室",emoji:"📋",sub:"园长室 · 走丢的那晚",
  story:[
    "管理室比外面暖一点点。书桌上有一盏应急台灯，照着一张旧照片，和一只没上锁的抽屉。",
    "墙上挂着星灯对照板，三枚凹槽正等着什么东西嵌进去。"
  ],
  exits:[
    {to:"prize",label:"回兑奖屋",emoji:"🧸",text:"你沿员工通道走回兑奖屋。"},
    {to:"haunted",label:"回鬼屋",emoji:"👻",text:"你走回还亮着红灯的走廊。"},
    {to:"power",label:"去电源室",emoji:"⚡",if:["got_power_card"],text:"门禁卡贴上去，电源室的铁门滑开。",locked:"通往电源室的门禁还亮着红灯，需要门禁卡。"}
  ],
  objects:[
    {id:"photo",name:"旧照片",box:[30,40,100,90],views:[
      {text:"相框里是一个十岁左右的女孩，夜里站在木马旁，手里攥着荧光棒。注记写着：「10 月，晚晚走丢的那晚。」你把相框翻过来，背面是钢笔字：寻星夜航，是为了让每个走丢的孩子都有路回家。——林晚",note:"【线索】园长小名晚晚。她走丢的月份是 10 月。",set:["read_photo"]}
    ]},
    {id:"desk",name:"书桌抽屉",box:[40,140,160,80],views:[
      {if:["!got_ticket"],text:"抽屉没有锁。里面正放着你掉的那张兑奖券，还有一张便条：「券我收好了。可可在电源室。走完夜航再开大门。——晚」",
        take:{give:["ticket"],set:["got_ticket"],text:"你拿回自己的兑奖券。背面盖着一颗星，写着「欢迎回家」，还有一行小字：晨门的转盘，转到我走丢的那个月。"}},
      {if:["got_ticket"],text:"空抽屉。兑奖券已经回到你手上。窗外，园子还是暗的。"}
    ]},
    {id:"files",name:"员工档案",box:[220,40,80,90],views:[
      {text:"薄薄一册：夜班电工 阿乔。评语只写「负责夜航演练。人很可靠。」夹页里有他和几个小朋友的合影，大家都在笑。"}
    ]},
    {id:"board",name:"星灯对照板",box:[220,140,160,90],views:[
      {if:["!board_ok"],text:"对照板上有三个星形凹槽，和三色星卡的尺寸正好。旁边的说明：插入三色星卡，暗格会打开。",
        use:[{item:"star_card",set:["board_ok"],text:"三色星卡嵌进去，对照板亮起蓝、黄、红三道光。暗格打开：电源室门禁卡，以及一张纸条——暗号不是她的姓，是她小时候的昵称。拼音三个字母，要写两遍。"}],
        wrong:"需要把三枚星灯拓印叠成三色星卡，再插到这里。蓝+黄，再加红。"},
      {if:["board_ok","!got_power_card"],text:"暗格开着。电源室门禁卡还在软垫上。",
        take:{give:["power_card"],set:["got_power_card"],text:"你收下电源室门禁卡。纸条还在：昵称的拼音写两遍。照片上她叫晚晚。"}},
      {if:["got_power_card"],text:"对照板安静地亮着三色光。门禁卡已经在你手上。"}
    ]},
    {id:"monitor",name:"应急屏幕",box:[310,40,75,85],views:[
      {if:["!board_ok"],text:"屏幕黑着，贴着「对照板点亮后可回放」。"},
      {if:["board_ok"],text:"屏幕忽然亮了。录像里，一个提工具箱的人把一片灯区关掉，在过山车座舱下描上一颗星，又对着镜头轻轻挥手：「看到的话，别怕，顺着走。」正是工作证上的阿乔。",set:["saw_monitor"]}
    ]}
  ],
  hints:[
    {until:"read_photo",obj:"photo",tiers:["先看看书桌上的旧照片。","把相框翻到背面。","她小名叫晚晚，走丢的月份是 10 月。"]},
    {until:"got_ticket",obj:"desk",tiers:["抽屉没有锁。","点书桌抽屉，把兑奖券拿回来。","券的背面还有一句关于晨门转盘的话。"]},
    {until:"board_ok",obj:"board",tiers:["把三色星卡插进对照板。","如果还没有星卡：先把蓝记和黄记叠在一起，再叠上红记。","选中三色星卡，点对照板。"]},
    {until:"got_power_card",obj:"board",tiers:["暗格开了，把门禁卡拿走。","点对照板，按「拿起」。","记得纸条：昵称拼音写两遍。"]}
  ]
});

ROOMS.push({
  id:"power",title:"电源室",emoji:"⚡",sub:"总闸 · 把灯重新点亮",
  story:[
    "电源室里有一排冷冷的开关，和一台还带着余温的小加热器。加热器上果然放着可可。",
    "总闸还是落下的。保险丝座是空的，旁边有一个三色卡槽，和一块字母密码盘。"
  ],
  exits:[
    {to:"office",label:"回管理室",emoji:"📋",text:"你走回还亮着台灯的管理室。"},
    {to:"exit",label:"去出口大门",emoji:"🌅",if:["power_on"],text:"应急通道的指示灯全部转绿。你走向园子最外的出口大门。",locked:"总闸还没合上，通往出口的应急通道是暗的。"}
  ],
  objects:[
    {id:"powerdoor",name:"电源室门禁",box:[10,80,55,150],views:[
      {text:"门已经用门禁卡打开了。你就站在电源室里。"}
    ]},
    {id:"fusebox",name:"保险丝座",box:[80,80,90,90],views:[
      {if:["!fuse_ok"],text:"保险丝座是空的，旁边画着一个小小的星形标记。标签：夜航备用。",
        use:[{item:"fuse",take:["fuse"],set:["fuse_ok"],text:"保险丝咔地一声就位。第一道准备工作完成了。"}],
        wrong:"这里缺一枚保险丝。过山车站台的储物柜里放过夜航备用。"},
      {if:["fuse_ok"],text:"保险丝已经装好，指示灯变成小小的绿色。"}
    ]},
    {id:"starslot",name:"三色卡槽",box:[190,80,90,90],views:[
      {if:["!stars_ok"],text:"卡槽的形状和三色星卡一模一样。",
        use:[{item:"star_card",set:["stars_ok"],text:"星卡插入，三道彩光在柜面上走了一圈。还差总闸的暗号。"}],
        wrong:"需要三色星卡。如果已经插在管理室对照板上，把它取下来用在这里。——等等，对照板还亮着，卡应该还在你手里吗？"},
      {if:["stars_ok"],text:"星卡已经就位，彩光稳定地亮着。"}
    ]},
    {id:"main",name:"总闸密码盘",box:[290,70,100,110],views:[
      {if:["!fuse_ok"],text:"总闸还锁着。旁白贴纸写着：请先装好保险丝。另一张更旧的贴纸写着 0000、LINWAN、QIAO，都被人用红笔划掉，注：防误触。",note:"【干扰】0000、LINWAN、QIAO 都被划掉了。"},
      {if:["fuse_ok","!stars_ok"],text:"保险丝好了，可卡槽还是空的。总闸暂时不会理你。"},
      {if:["fuse_ok","stars_ok","!power_on"],text:"保险丝和星卡都已就位。密码盘是六个字母。说明：园长的暗号。不是她的姓，是她小时候的昵称；拼音三个字母，写两遍。",
        lock:{kind:"alpha",len:6,answer:"WANWAN",prompt:"园长的暗号（六个字母）",
          bad:"不是姓，也不是 0000 或 QIAO。想想照片上那个女孩的小名，拼音三个字母，写两遍。",
          ok:{set:["power_on"],text:"你按下确认。总闸沉重地合上，整座园子像被轻轻唤醒：轨道、棚顶、喷泉边的小灯，一串串重新亮起来。加热器「叮」了一声，遥控和一封信从暗格里滑出。"}}},
      {if:["power_on","!got_remote"],text:"总闸已经合上，园子在窗外亮着。暗格里还有大门遥控，和一封给夜航小朋友的信。",
        take:{give:["gate_remote","letter"],set:["got_remote","got_letter"],text:"你收下大门遥控和林晚的信。信里把夜航的来历写得很清楚。现在，去出口大门吧。"}},
      {if:["got_remote"],text:"电源室充满稳定的嗡嗡声。灯都回来了。"}
    ]},
    {id:"cocoa",name:"加热器上的可可",box:[80,190,120,50],views:[
      {text:"纸杯上画着一颗星，可可还是温的。你喝了一小口，甜甜的。杯垫上写：走完再喝也来得及。阿乔。"}
    ]},
    {id:"helmet",name:"阿乔的安全帽",box:[230,190,90,50],views:[
      {text:"安全帽内沿夹着一张夜航记录：「今晚启动因售票亭侧门感应到一名小朋友。我在出口大门等你。走之前记得开总闸。」"}
    ]}
  ],
  hints:[
    {until:"fuse_ok",obj:"fusebox",tiers:["先把保险丝装上。","过山车站台储物柜里的那枚夜航备用。","选中保险丝，点保险丝座。"]},
    {until:"stars_ok",obj:"starslot",tiers:["把三色星卡插入卡槽。","星卡是三枚拓印叠成的。","选中三色星卡，点三色卡槽。"]},
    {until:"power_on",obj:"main",tiers:["该开总闸了。","暗号是园长小名的拼音写两遍。她叫晚晚。","输入 WANWAN。"]},
    {until:"got_remote",obj:"main",tiers:["把大门遥控和信拿走。","点总闸密码盘，按「拿起」。","然后去出口大门。"]}
  ]
});

ROOMS.push({
  id:"exit",title:"出口大门",emoji:"🌅",sub:"终章 · 天亮以前",
  story:[
    "园子重新亮起来了。出口大门像两扇被彩灯镶边的翅膀，晨光刚刚碰到最高的那一串灯。",
    "门边有一把长椅，电子锁的指示灯在闪。还有一个小小的月份转盘。"
  ],
  exits:[
    {to:"power",label:"回电源室",emoji:"⚡",text:"你走回还响着嗡嗡声的电源室。"}
  ],
  objects:[
    {id:"dawn",name:"晨光和彩灯",box:[20,20,360,70],views:[
      {text:"天快亮了。重新点亮的彩灯和天边的颜色碰到一起，整座星灯游乐园像刚醒过来。你忽然觉得，这条路其实一直是为你亮着的。"}
    ]},
    {id:"bench",name:"门边长椅",box:[20,200,130,70],views:[
      {text:"长椅上放着第二杯可可，还温着。像是有人刚刚离开，又像是故意留位置给你。远处隐约有人朝这边挥了挥手。"}
    ]},
    {id:"plaque1998",name:"建园铭牌",box:[20,100,90,80],views:[
      {text:"门柱上的铭牌：星灯游乐园，建立于 1998 年。数字很大，很容易让人以为是密码。",note:"【干扰】1998 是建园年份，不是晨门转盘要的数字。"}
    ]},
    {id:"gatectrl",name:"大门电子锁",box:[160,100,90,100],views:[
      {if:["!remote_ok"],text:"电子锁在闪绿灯，却还差一步。面板写着：请使用总闸弹出的遥控。",
        use:[{item:"gate_remote",set:["remote_ok"],text:"遥控对上了，电子锁「滴」地打开。还剩门闩上的月份转盘。"}],
        wrong:"需要电源室拿到的大门遥控。"},
      {if:["remote_ok","!escaped"],text:"电子锁已经打开。还剩下面的月份转盘。"}
    ]},
    {id:"boltdial",name:"月份转盘",box:[270,100,110,120],views:[
      {if:["!remote_ok"],text:"转盘暂时转不动。也许要先用遥控解开电子锁。"},
      {if:["remote_ok","!escaped"],text:"转盘上是 1 到 12，像一座小小的年历。兑奖券背面写过：晨门的转盘，转到我走丢的那个月。管理室的照片注记是 10 月。门柱上的 1998 只是建园年份。",
        lock:{kind:"num",len:2,answer:"10",prompt:"转到园长走丢的月份",
          bad:"1998 是建园年份。再看看管理室照片上的注记，还有兑奖券背面的那句话。",
          ok:{win:true,set:["escaped"],text:"转盘停在 10。大门向两边缓缓打开，晨风和可可的甜味一起涌进来。阿乔在门外不好意思地挥手。你走完了林晚小时候没走完的那条路。欢迎回家。"}}},
      {if:["escaped"],text:"大门已经打开。外面是清晨，和一条熟悉的路。"}
    ]}
  ],
  hints:[
    {until:"remote_ok",obj:"gatectrl",tiers:["先用遥控解电子锁。","遥控在电源室总闸的暗格里。","选中大门遥控，点电子锁。"]},
    {until:"escaped",obj:"boltdial",tiers:["最后是月份转盘。","别看门柱上的 1998。想想照片：晚晚走丢的那晚。","转到 10 月，输入 10。"]}
  ]
});

function findRoom(id){for(var i=0;i<ROOMS.length;i++)if(ROOMS[i].id===id)return ROOMS[i];return null;}
function horse(x,y,col,lit,label){
  var s=El(x,y+18,22,16,col,SK)+C(x+20,y,10,col,SK)+C(x+26,y-2,2.2,'#1a1020')+R(x-6,y+28,10,22,col,3,SK)+R(x+10,y+28,10,22,col,3,SK);
  if(lit)s+=C(x+4,y-16,5,lit)+C(x+4,y-16,2,'#fff');
  s+=T(x,y+18,10,label,' fill="#fff" font-weight="700"');
  return s;
}

findRoom('gate').art=function(f){
  var s=sky(f),on=!!f.power_on;
  s+=g('irongate',R(18,78,118,152,'#2c3448',6,SK)+R(26,88,46,70,'#0b0e18',2)+R(80,88,46,70,'#0b0e18',2)+R(26,166,100,18,'#3a4558',2)+R(26,198,100,18,'#3a4558',2)+T(77,120,14,'铁门',' fill="#c5d0e0"')+(on?C(77,70,6,'#ffd166'):C(77,70,5,'#4a5060')));
  s+=g('sign',R(142,28,108,64,'#f3e3b0',6,SK)+T(196,48,11,'今日已闭园',' fill="#5a3020" font-weight="700"')+T(196,68,9,'CLOSED',' fill="#8a5040"'));
  s+=g('poster',R(150,100,92,58,'#5a1a40',6,SK)+T(196,122,10,'本周明星',' fill="#ffd166"')+T(196,140,9,'星轨 / 悄悄话',' fill="#ffb3d9"'));
  s+=g('booth',R(252,78,138,128,'#7a2a4a',8,SK)+R(262,98,118,70,f.booth_open?'#3a2030':'#2a1018',4)+T(321,90,11,'售票亭',' fill="#ffd166"')+T(321,133,12,f.booth_open?'抽屉开':'窗口',' fill="#f8d0e0"'));
  s+=g('lostbox',R(150,168,92,68,f.box_open?'#2a6a4a':'#1e6b46',8,SK)+T(196,200,11,'失物箱',' fill="#d8ffe8"'));
  s+=g('mat',R(252,222,96,26,'#6a3040',4,SK)+T(300,235,9,'欢迎光临',' fill="#ffd0da"'));
  s+=g('pot',El(368,230,16,10,'#3a6a3a',SK)+R(360,228,16,22,'#8a5040',3,SK)+T(368,268,8,'盆栽',' fill="#c9a8c0"'));
  s+=g('sidedoor',R(20,226,72,36,f.side_open?'#2a6a4a':'#2a3040',6,SK)+T(56,244,10,f.side_open?'侧门开':'侧门',' fill="#e8e0f0"'));
  return s;
};

findRoom('carousel').art=function(f){
  var s=sky(f);
  s+=El(170,128,150,28,'#8a2048',SK)+R(155,86,30,40,'#6a1838',4,SK)+El(170,86,120,22,f.power_on?'#ff7ab6':'#4a2038',SK)+T(170,84,12,'旋转木马',' fill="#ffd166"');
  s+=g('horses',R(70,118,210,26,'#4a3048',8,SK)+T(175,131,9,'转盘',' fill="#e8d0f0"'));
  s+=g('bluehorse',horse(70,150,'#3a6aaa',f.power_on?'#8ad0ff':'#6ec8ff','3'));
  s+=g('yellowhorse',horse(150,158,'#c9a020',f.power_on?'#ffe08a':'#ffd166','1'));
  s+=g('redhorse',horse(230,152,'#c04050',f.power_on?'#ff8a9a':'#ff6b7a','5'));
  s+=g('blackhorse',horse(305,165,'#3a3a48',0,'777'));
  s+=g('boothdoor',R(332,88,62,122,f.booth2_open?'#3a6a4a':'#3a2a48',8,SK)+T(363,150,10,f.booth2_open?'控制开':'控制室',' fill="#e8e0f0"'));
  s+=g('radio',R(340,100,46,28,f.booth2_open?'#5a3a30':'#2a2030',4,SK)+C(363,114,5,f.booth2_open?'#ff5a5a':'#5a2020')+T(363,108,8,'对讲',' fill="#ffd0d0"'));
  s+=g('musicbox',R(340,148,46,36,f.box2_open?'#8a6a30':'#5a3a20',4,SK)+T(363,166,8,'音乐盒',' fill="#ffe9a8"'));
  s+=g('badgeobj',R(155,248,54,22,f.got_badge?'#2a2030':'#4a3a20',4,SK)+T(182,259,8,f.got_badge?' ':'工作证',' fill="#ffd166"'));
  return s;
};

findRoom('fountain').art=function(f){
  var s=sky(f);
  s+=g('plaques',R(80,82,240,44,'#c9a878',8,SK)+T(140,104,11,'4',' fill="#4a3020" font-weight="700"')+T(200,104,11,'2',' fill="#4a3020" font-weight="700"')+T(260,104,11,'7',' fill="#4a3020" font-weight="700"')+T(330,104,11,'9999',' fill="#8a2020"'));
  s+=g('spout',C(200,128,10,f.got_nav_note?'#6ee0ff':'#4a80a0',SK)+R(196,118,8,16,'#8aa0b0',2));
  s+=g('pool',El(200,180,100,48,f.power_on?'#3a80b8':'#1a4060',SK)+El(200,176,70,28,'#2a6088')+C(180,176,4,'#ffd166')+C(220,184,3,'#ffe9a8')+T(200,208,11,'许愿池',' fill="#d0e8ff"'));
  s+=g('drawing',R(18,168,84,72,'#f3e3b0',6,SK)+T(60,200,10,'蜡笔画',' fill="#5a3020"')+T(60,218,8,'乔叔叔',' fill="#8a5040"'));
  return s;
};

findRoom('coaster').art=function(f){
  var s=sky(f);
  s+=g('signboard',R(36,28,180,58,'#2a1850',8,SK)+T(126,48,14,'星轨 STAR-RAIL',' fill="#ffd166" font-weight="700"')+T(126,68,9,'检修取前四字母',' fill="#c9a8c0"'));
  s+=g('hatch',R(300,30,90,78,f.hatch_open?'#2a6a4a':'#3a3048',8,SK)+T(345,70,11,f.hatch_open?'通道开':'检修门',' fill="#e8e0f0"'));
  s+=g('locker',R(28,130,84,108,f.locker_open?'#3a6a4a':'#3a4558',8,SK)+T(70,184,11,'储物柜',' fill="#d0d8e8"'));
  s+=P('M120 230 Q200 80 290 150 T400 120','none',' stroke="'+(f.power_on?'#ff7ab6':'#4a4060')+'" stroke-width="6" fill="none"');
  s+=g('car',R(130,158,165,88,f.car_open?'#5a2a60':'#3a2048',10,SK)+R(145,172,50,44,'#1a1028',6)+R(205,172,50,44,'#1a1028',6)+C(160,248,12,'#2a2a38',SK)+C(260,248,12,'#2a2a38',SK)+T(212,200,12,f.got_star_blue?'座舱':'座舱锁',' fill="#ffd166"'));
  s+=g('panel',R(304,136,86,86,'#242030',8,SK)+R(314,150,66,36,'#0e0818',4)+T(347,200,10,'控制台',' fill="#c5d0e0"'));
  return s;
};

findRoom('windmill').art=function(f){
  var s=sky(f);
  var cx=160,cy=88;
  s+=g('blades',C(cx,cy,10,'#8a6a40',SK)+
    R(cx-8,cy-80,16,70,f.mill_wound?'#e0b030':'#6a6040',4,SK)+
    R(cx-8,cy+10,16,70,'#6a6040',4,SK)+
    R(cx-80,cy-8,70,16,'#6a6040',4,SK)+
    R(cx+10,cy-8,70,16,'#6a6040',4,SK)+
    (f.mill_wound?T(cx,cy-48,12,'6',' fill="#3a2000" font-weight="700"'):T(cx,cy-48,10,'?',' fill="#fff'))+
    T(cx,18,10,'叶片',' fill="#ffd166"'));
  s+=P('M120 170 L200 170 L220 250 L100 250 Z','#8a5040',SK);
  s+=g('gear',C(165,184,22,'#5a4a38',SK)+C(165,184,8,'#2a2018')+T(165,214,9,'齿轮',' fill="#e8d0b0"'));
  s+=g('hut',R(270,120,114,112,'#7a3a30',8,SK)+R(300,170,40,62,f.got_stamp?'#2a1820':'#3a2020',4,SK)+T(327,150,12,'小屋',' fill="#ffd166"'));
  s+=g('scope',R(22,150,58,80,'#2a3048',8,SK)+C(51,175,16,'#1a2030',SK)+C(51,175,8,'#6ee0ff')+T(51,220,8,'望远镜',' fill="#c5d0e0"'));
  return s;
};

findRoom('cotton').art=function(f){
  var s=sky(f);
  s+=g('menu',R(16,58,76,120,'#f3e3b0',8,SK)+T(54,90,11,'菜单',' fill="#5a3020"')+T(54,112,10,'12 元',' fill="#8a2020"')+T(54,132,10,'18 元',' fill="#8a2020"'));
  s+=g('shutter',R(100,48,200,130,f.cotton_open?'#4a3040':'#5a6a78',8,SK)+(f.cotton_open?'':R(110,70,180,12,'#2a3040')+R(110,100,180,12,'#2a3040')+R(110,130,180,12,'#2a3040'))+T(200,110,14,f.cotton_open?'操作台':'铁卷帘',' fill="#ffd166"'));
  s+=g('valve',C(180,120,28,f.valve_open?'#3a8a60':'#8a3040',SK)+C(180,120,10,'#1a1020')+T(180,164,10,'阀门',' fill="#ffd0da"'));
  s+=g('note',R(260,80,116,70,'#f8e8a0',8,SK)+T(318,115,11,'员工留言',' fill="#5a3020"'));
  return s;
};

findRoom('prize').art=function(f){
  var s=sky(f);
  s+=g('backdoor',R(18,80,70,152,f.prize_open?'#3a6a4a':'#4a2038',8,SK)+T(53,155,11,f.prize_open?'后门开':'后门',' fill="#ffe0f0"'));
  s+=g('claw',R(108,70,150,155,f.claw_ok?'#2a4a68':'#1a3050',10,SK)+R(120,92,126,90,'#0e1830',6)+T(183,108,11,'抓娃娃机',' fill="#6ee0ff"')+T(183,200,20,'🧸',' fill="#000"')+T(183,230,10,f.got_safe_key?'已抓到':'投币处',' fill="#ffd166"'));
  s+=g('cabinet',R(270,68,116,100,'#6a2a50',8,SK)+T(328,100,20,'🐻🐰',' fill="#000"')+T(328,140,11,'奖品柜',' fill="#ffd166"'));
  s+=g('safe',R(278,175,100,70,f.safe_open?'#3a6a4a':'#3a3a48',8,SK)+T(328,210,11,'保险柜',' fill="#d0d8e8"'));
  s+=g('counter',R(108,228,154,30,'#f8e8a0',6,SK)+T(185,243,10,'柜台便签',' fill="#5a3020"'));
  return s;
};

findRoom('mirror').art=function(f){
  var s=sky(f);
  s+=g('mirrorgate',R(16,78,76,154,f.mirror_open?'#3a6a4a':'#3a3048',8,SK)+T(54,155,11,f.mirror_open?'闸机开':'闸机',' fill="#e8e0f0"'));
  s+=g('mirrors',P('M120 60 L185 80 L185 200 L120 220 Z','#8ad0e8',SK)+P('M128 80 L175 92 L175 190 L128 200 Z','#d8f4ff')+T(152,140,10,'哈哈镜',' fill="#245"'));
  s+=g('mural',R(200,48,184,160,'#2a1850',8,SK)+R(210,62,78,120,'#1a1040',6)+R(296,62,78,120,'#1a1040',6)+T(249,122,11,'左图',' fill="#ffd166"')+T(335,122,11,'右图',' fill="#ffd166"')+T(292,195,11,f.diff_ok?'已打开':'找不同',' fill="#ffb3d9"'));
  s+=g('fake',R(118,214,120,40,'#f8e8a0',6,SK)+T(178,234,10,'888 纸条',' fill="#8a2020"'));
  return s;
};

findRoom('haunted').art=function(f){
  var s=sky(f);
  s+=g('hauntdoor',R(16,68,90,164,f.haunt_open?'#4a3a68':'#2a2040',8,SK)+T(61,130,28,'👻',' fill="#000"')+T(61,170,11,f.haunt_open?'请进':'大门',' fill="#e0d0ff"'));
  s+=g('skel',R(120,110,84,114,'#e8e0d8',10,SK)+C(162,140,16,'#f0e8e0',SK)+T(162,175,11,'塑料',' fill="#5a3020"')+T(162,192,11,'骷髅',' fill="#5a3020"'));
  s+=g('pipe',El(250,105,42,30,'#6a7080',SK)+R(230,105,40,20,'#5a6070')+T(250,105,10,'管道',' fill="#fff"'));
  s+=g('redlamp',R(300,78,90,130,'#4a1028',8,SK)+C(345,120,20,f.power_on?'#ff6b7a':'#c04050')+C(345,120,8,'#ffd0d0')+T(345,170,11,'红灯',' fill="#ffd166"')+(f.got_star_red?'':T(345,188,16,'★',' fill="#ff7a7a"')));
  s+=g('graffiti',R(120,226,170,36,'#2a2038',6,SK)+T(205,244,10,'涂鸦墙',' fill="#c9a8c0"'));
  return s;
};

findRoom('office').art=function(f){
  var s=sky(f);
  s+=R(0,70,400,160,'#2a1a30');
  s+=g('photo',R(28,38,110,96,'#f3e3b0',6,SK)+R(38,48,90,58,'#7a9a70')+T(83,80,10,'晚晚',' fill="#fff"')+T(83,122,10,'10 月',' fill="#5a3020"'));
  s+=g('files',R(220,38,84,94,'#5a3a28',8,SK)+T(262,85,11,'档案',' fill="#ffd166"'));
  s+=g('monitor',R(312,38,76,90,'#1a2030',8,SK)+R(322,50,56,44,f.board_ok?'#2a4a3a':'#0a0e18',4)+T(350,108,9,'屏幕',' fill="#8ad0a0"'));
  s+=g('desk',R(36,140,170,88,'#6a4030',8,SK)+R(50,154,142,50,f.got_ticket?'#3a2818':'#4a3020',4)+T(121,180,12,'抽屉',' fill="#ffd166"'));
  s+=g('board',R(220,138,166,96,f.board_ok?'#2a3068':'#201838',8,SK)+C(260,180,12,f.board_ok?'#6ec8ff':'#3a4060')+C(303,180,12,f.board_ok?'#ffd166':'#3a4060')+C(346,180,12,f.board_ok?'#ff6b7a':'#3a4060')+T(303,215,10,'对照板',' fill="#e0d0ff"'));
  return s;
};

findRoom('power').art=function(f){
  var s=sky(f);
  s+=R(0,70,400,180,f.power_on?'#1a2a38':'#141018');
  s+=g('powerdoor',R(8,80,58,152,'#3a6a4a',8,SK)+T(37,155,10,'门禁',' fill="#e8ffe8"'));
  s+=g('fusebox',R(78,78,96,96,f.fuse_ok?'#1a4a30':'#3a2020',8,SK)+T(126,126,11,'保险丝座',' fill="#ffd166"'));
  s+=g('starslot',R(188,78,96,96,f.stars_ok?'#2a2060':'#201828',8,SK)+C(216,126,10,f.stars_ok?'#6ec8ff':'#3a4060')+C(236,126,10,f.stars_ok?'#ffd166':'#3a4060')+C(256,126,10,f.stars_ok?'#ff6b7a':'#3a4060')+T(236,155,10,'卡槽',' fill="#e0d0ff"'));
  s+=g('main',R(292,68,102,116,f.power_on?'#2a6a4a':'#3a2040',8,SK)+R(308,88,70,50,'#0e0818',4)+T(343,160,11,f.power_on?'总闸开':'总闸',' fill="#ffd166"'));
  s+=g('cocoa',R(80,190,124,52,'#6a3a28',10,SK)+C(110,216,12,'#c06040')+T(148,216,11,'可可',' fill="#ffd166"'));
  s+=g('helmet',R(230,190,100,52,'#e0b030',10,SK)+T(280,216,11,'安全帽',' fill="#3a2000"'));
  return s;
};

findRoom('exit').art=function(f){
  var s=sky(f);
  // dawn wash
  s=R(0,0,400,300,'#2a1858')+R(0,0,400,90,'#ff9a70')+R(0,70,400,50,'#ffc08a')+C(70,48,28,'#ffe9a8');
  var bulbs=[[30,70,'#ff7ab6'],[80,78,'#ffd166'],[130,70,'#6ee0ff'],[180,78,'#c48bff'],[230,70,'#5ee0c4'],[280,78,'#ff7ab6'],[330,70,'#ffd166'],[370,74,'#6ee0ff']];
  for(var i=0;i<bulbs.length;i++)s+=C(bulbs[i][0],bulbs[i][1],4,bulbs[i][2]);
  s+=R(0,228,400,72,'#2a1a38')+R(0,226,400,4,'#ff7ab6');
  s+=g('dawn',R(20,20,360,55,'transparent')+T(200,44,16,'晨光和彩灯',' fill="#5a2010" font-weight="700"'));
  s+=g('plaque1998',R(16,100,96,84,'#c9a878',8,SK)+T(64,132,12,'建于',' fill="#4a3020"')+T(64,154,16,'1998',' fill="#8a2020" font-weight="700"'));
  s+=g('gatectrl',R(160,100,96,108,f.remote_ok?'#2a6a4a':'#2a3048',8,SK)+T(208,154,11,'电子锁',' fill="#e8e0f0"'));
  s+=g('boltdial',R(270,100,116,124,f.escaped?'#2a6a4a':'#3a2050',8,SK)+C(328,150,28,'#1a1028',SK)+T(328,150,16,f.escaped?'开':'10?',' fill="#ffd166"')+T(328,200,11,'转盘',' fill="#e0d0ff"'));
  s+=g('bench',R(16,204,140,68,'#6a4030',8,SK)+T(86,238,12,'长椅 · 可可',' fill="#ffd166"'));
  return s;
};

G.PZ_ROOMS=ROOMS;

/* 完整通关步骤：供测试走一遍 */
G.PZ_SOLUTION=[
  ["look","sign"],
  ["code","lostbox","208"],
  ["take","lostbox"],
  ["take","pot"],
  ["use","booth","brass_key"],
  ["take","booth"],
  ["use","sidedoor","glow"],
  ["go","carousel"],
  ["use","boothdoor","carousel_key"],
  ["look","radio"],
  ["look","bluehorse"],
  ["code","musicbox","315"],
  ["take","musicbox"],
  ["combine","map_a","map_b"],
  ["use","horses","winder"],
  ["take","horses"],
  ["take","badgeobj"],
  ["go","fountain"],
  ["take","pool"],
  ["look","plaques"],
  ["look","drawing"],
  ["go","coaster"],
  ["look","signboard"],
  ["code","locker","427"],
  ["take","locker"],
  ["use","car","car_key"],
  ["take","car"],
  ["code","hatch","STAR"],
  ["go","fountain"],
  ["use","spout","hook"],
  ["go","coaster"],
  ["go","windmill"],
  ["use","gear","winder"],
  ["take","blades"],
  ["take","hut"],
  ["go","coaster"],
  ["go","fountain"],
  ["go","carousel"],
  ["go","cotton"],
  ["use","shutter","cotton_key"],
  ["code","valve","6"],
  ["take","valve"],
  ["go","prize"],
  ["use","backdoor","prize_key"],
  ["use","claw","token"],
  ["game","claw"],
  ["take","claw"],
  ["use","cabinet","magnet"],
  ["use","safe","safe_key"],
  ["take","safe"],
  ["go","fountain"],
  ["go","coaster"],
  ["go","windmill"],
  ["go","mirror"],
  ["use","mirrorgate","mirror_stamp"],
  ["game","mural"],
  ["take","mural"],
  ["go","haunted"],
  ["use","hauntdoor","haunt_ticket"],
  ["look","pipe"],
  ["take","redlamp"],
  ["combine","star_blue","star_yellow"],
  ["combine","star_by","star_red"],
  ["go","prize"],
  ["go","office"],
  ["look","photo"],
  ["take","desk"],
  ["use","board","star_card"],
  ["take","board"],
  ["look","monitor"],
  ["go","power"],
  ["use","fusebox","fuse"],
  ["use","starslot","star_card"],
  ["code","main","WANWAN"],
  ["take","main"],
  ["go","exit"],
  ["use","gatectrl","gate_remote"],
  ["code","boltdial","10"]
];
})(typeof window!=='undefined'?window:globalThis);
/*ROOMS-END*/
