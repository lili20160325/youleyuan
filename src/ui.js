/*UI-START*/
(function(){
'use strict';
var E=window.PZE,ROOMS=window.PZ_ROOMS,ITEMS=window.PZ_ITEMS,JOURNAL=window.PZ_JOURNAL||[];
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function roomById(id){for(var i=0;i<ROOMS.length;i++)if(ROOMS[i].id===id)return ROOMS[i];return ROOMS[0];}
var QS=new URLSearchParams(location.search);
var KEY='youleyuan_midnight_v1';
function defStore(){return {v:1,sound:true,hints:0,stage:{},st:null,won:false,bestStars:0};}
var store;try{if(QS.has('reset'))localStorage.removeItem(KEY);store=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){store=null;}
if(!store||store.v!==1)store=defStore();
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}

var actx=null;
function ac(){if(!actx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{actx=new C();}catch(e){return null;}}if(actx.state==='suspended')actx.resume();return actx;}
function tone(f,d,type,v,delay){if(!store.sound)return;var c=ac();if(!c)return;var t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.12,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+0.05);}
var SFX={
  tap:function(){tone(660,0.07,'triangle',0.07);},
  pick:function(){tone(520,0.08,'sine',0.1);tone(780,0.08,'sine',0.08,0.06);},
  ok:function(){tone(660,0.1,'sine',0.12);tone(880,0.14,'sine',0.12,0.09);},
  bad:function(){tone(240,0.16,'sawtooth',0.06);tone(190,0.2,'sawtooth',0.05,0.12);},
  unlock:function(){[523,659,784,1047].forEach(function(f,i){tone(f,0.12,'triangle',0.1,i*0.07);});},
  hint:function(){tone(988,0.08,'sine',0.08);tone(1319,0.12,'sine',0.07,0.08);},
  win:function(){[523,659,784,659,784,1047].forEach(function(f,i){tone(f,0.16,'triangle',0.12,i*0.11);});}
};

var STAR='M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z';
function starSvg(lit,cls){return '<svg viewBox="0 0 24 24"'+(cls?' class="'+cls+'"':'')+'><path d="'+STAR+'" fill="'+(lit?'#ffd166':'#3a2a48')+'" stroke="'+(lit?'#e59f00':'#5a4068')+'" stroke-width="1.5" stroke-linejoin="round"/></svg>';}
var toastT=null;function toast(t,ms){var el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show');},ms||2200);}
function confetti(){var cs=['#ff7ab6','#c48bff','#5ee0c4','#ffd166','#6ee0ff'];for(var i=0;i<36;i++){var d=document.createElement('div');d.className='confetti';d.style.left=Math.random()*100+'vw';d.style.background=cs[i%5];d.style.animationDuration=(1.6+Math.random()*1.4)+'s';d.style.animationDelay=(Math.random()*0.4)+'s';document.body.appendChild(d);(function(x){setTimeout(function(){x.remove();},3600);})(d);}}
function shake(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}

function seenCount(st){var n=0;for(var i=0;i<ROOMS.length;i++)if(st.flags['seen_'+ROOMS[i].id])n++;return n;}
function journalOpen(st){return JOURNAL.filter(function(j){return E.room.condAll(st,j.if);});}

var nav={screen:'home'};
function show(id){$$('.screen').forEach(function(s){s.classList.toggle('active',s.id==='scr-'+id);});nav.screen=id;window.scrollTo(0,0);}
function paintMute(){$$('[data-act="mute"]').forEach(function(b){b.textContent=store.sound?'🔊':'🔇';});}

function renderHome(){
  show('home');
  var st=store.st,done=store.won,seen=st?seenCount(st):0;
  $('#homeStars').innerHTML=starSvg(true)+(store.bestStars||0)+' / 3';
  if(done)$('#progText').textContent='已经逃出园子！';
  else if(st)$('#progText').textContent='已探索 '+seen+' / '+ROOMS.length+' 处';
  else $('#progText').textContent='准备出发';
  var say=done?'你已经走完了夜航。想再走一遍，也可以清空存档重来。':(st?'灯还灭着的地方，线索就藏在物件和纸条里。接着找下去吧。':'家庭日结束了。你回园里找掉了的兑奖券，大门却锁上，灯一盏盏灭掉……');
  $('#owlSay').textContent=say;
  $('#startBtn').textContent=st&&!done?'🎡 继续夜航':(done?'🎡 再看结局 / 逛园区':'🎡 开始夜航');
  paintMute();
}

function resetAll(){var sound=!!store.sound;store=defStore();store.sound=sound;save();}

var sheetLocked=false,sheetOnClose=null;
function openSheet(html,opt){opt=opt||{};$('#sheet').innerHTML=html;$('#mask').classList.add('show');sheetLocked=!!opt.locked;sheetOnClose=opt.onClose||null;$('#sheet').scrollTop=0;}
function closeSheet(silent){var m=$('#mask');if(!m.classList.contains('show'))return;m.classList.remove('show');$('#sheet').innerHTML='';var f=sheetOnClose;sheetOnClose=null;sheetLocked=false;if(f&&!silent)f();}
function sheetHead(t){return '<div class="sheet-h"><h3>'+t+'</h3><button class="xbtn" data-act="close" aria-label="关闭">✕</button></div>';}

function howtoSheet(){
  var h=sheetHead('🎡 怎么玩');
  h+='<div class="story"><p class="say">这是一座连在一起的夜间游乐园。你要在天亮前重启电源、打开大门，并弄清是谁关了电。</p>';
  h+='<p class="say">点场景里的东西仔细看；看到「拿起」就把物品放进物品栏。先点物品栏里的物品选中它，再点房间里的东西就能「使用」。先后点两个物品可以「组合」。</p>';
  h+='<p class="say">密码都藏在现场的证据里，墙上也会出现假数字和涂鸦，不要轻易相信最显眼的那一行。</p>';
  h+='<p class="say">道具会一直带在身上。这边拿到的钥匙，也许要去另一边才用得上。卡住了可以看线索本、园区地图，或点「💡 提示」。</p></div>';
  h+='<div class="actions"><button class="btn primary" data-act="close">知道了</button></div>';
  openSheet(h);
}
function openResetSheet(){
  var h=sheetHead('🗑 清空存档？');
  h+='<p class="say">会清空「星灯游乐园 · 午夜闭园」的全部进度，不能恢复。</p>';
  h+='<div class="note">声音开关会保留。不会影响旧版密室（mishi / mishi2）的存档。</div>';
  h+='<div class="actions"><button class="btn coral" data-act="resetAllYes">确认清空</button><button class="btn ghost" data-act="close">再想想</button></div>';
  openSheet(h);
}

var RP=null;
function ensureState(){
  if(store.st)return store.st;
  store.st=E.room.init();store.hints=0;store.stage={};store.won=false;save();return store.st;
}
function startGame(force){
  if(force){store.st=E.room.init();store.hints=0;store.stage={};store.won=false;save();}
  else ensureState();
  RP={sel:null,hl:null,msg:'点房间里的东西，仔细看看吧！',inspect:null};
  enterRoom(store.st.room, !store.st.flags['visited_'+store.st.room] || force, true);
}
function enterRoom(id,showStory,first){
  var st=store.st,room=roomById(id);
  if(st.room!==id){ /* only when called directly */ }
  st.flags['seen_'+id]=true;
  st.flags['visited_'+id]=true;
  var r=roomById(st.room);
  $('#roomTitle').innerHTML=r.emoji+' '+esc(r.title)+'<small>'+esc(r.sub)+' · '+seenCount(st)+'/'+ROOMS.length+' 处</small>';
  show('room');paintMute();renderRoom();
  if(showStory)storySheet();
}
function storySheet(){
  var r=E.room.cur(store.st);
  openSheet(sheetHead(r.emoji+' '+esc(r.title))+'<div class="story">'+r.story.map(function(p){return '<p class="say">'+esc(p)+'</p>';}).join('')+'</div><div class="note">点物件查看；「拿起」放入物品栏；先选中物品再点场景来使用；两个物品可以组合。假密码也会出现。</div><div class="actions"><button class="btn primary" data-act="close">继续探险</button></div>');
}
function renderRoom(){
  var st=store.st,r=E.room.cur(st);
  var s=r.art(st.flags);
  r.objects.forEach(function(o){var b=o.box;s+='<rect class="hit" data-obj="'+o.id+'" x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+b[3]+'" fill="transparent"><title>'+esc(o.name)+'</title></rect>';});
  if(RP.hl){var o=E.room.obj(r,RP.hl);if(o){var b=o.box;s+='<rect class="hl" x="'+(b[0]-3)+'" y="'+(b[1]-3)+'" width="'+(b[2]+6)+'" height="'+(b[3]+6)+'" rx="10"/>';}}
  $('#scene').innerHTML=s;$('#roomMsg').innerHTML=esc(RP.msg);
  var h='',n=Math.max(5,st.inv.length);for(var i=0;i<n;i++){var it=st.inv[i];if(!it){h+='<div class="slot empty"></div>';continue;}var I=ITEMS[it];
    h+='<button class="slot'+(RP.sel===it?' sel':'')+(I&&I.glow?' glow':'')+'" data-act="item" data-item="'+it+'"><span class="ic">'+(I?I.icon:'❓')+'</span><span class="nm">'+esc(I?I.name:it)+'</span></button>';}
  $('#inv').innerHTML=h;$('#invTip').textContent=RP.sel?'已选中「'+ITEMS[RP.sel].name+'」':'点物品可以选中它';
  var ex=E.room.exits(st),eh='';
  ex.forEach(function(e){
    var dest=roomById(e.to);
    if(e.open)eh+='<button class="btn '+(st.flags['seen_'+e.to]?'ghost':'purple')+'" data-act="go" data-to="'+e.to+'">'+(e.emoji||dest.emoji)+' '+esc(e.label)+'</button>';
    else eh+='<button class="btn locked" data-act="goLocked" data-to="'+e.to+'">🔒 '+esc(e.label)+'</button>';
  });
  $('#exits').innerHTML=eh||'<span class="gnote">暂时还没有别的路。</span>';
  save();
}
function roomMsg(t){RP.msg=t;$('#roomMsg').innerHTML=esc(t);}
function roomAfter(res){
  var st=store.st,h=E.room.hint(E.room.cur(st),st);
  if(RP.hl&&(!h||h.h.obj!==RP.hl))RP.hl=null;
  save();renderRoom();
  if(st.done&&!store.won){store.won=true;save();setTimeout(roomWin,800);}
}
function roomTapObj(id){
  var r=E.room.cur(store.st),st=store.st;if(st.done&&id){ /* still allow looking after win */ }
  if(RP.sel){var it=RP.sel,res=E.room.use(r,st,id,it);if(res.ok){SFX.unlock();RP.sel=null;roomMsg(res.text);toast(res.text,2600);roomAfter(res);if(res.eff&&!st.done){var v=E.room.view(r,st,id);if(v&&v.game){openGame(id,v);return;}}roomInspect(id);}else{SFX.bad();roomMsg(res.text);toast(res.text);shake($('.scene-box'));}return;}
  SFX.tap();var lk=E.room.look(r,st,id);if(lk.view&&lk.view.set)save();
  var v=E.room.view(r,st,id);
  if(v&&v.game){openGame(id,v);return;}
  roomInspect(id);
}
var LK=null;
function roomInspect(id,banner,bad){
  var r=E.room.cur(store.st),o=E.room.obj(r,id),v=E.room.view(r,store.st,id);if(!o||!v){closeSheet();return;}
  var h=sheetHead(esc(o.name));if(banner)h+='<div class="banner'+(bad?' bad':'')+'">'+esc(banner)+'</div>';
  h+='<p class="say">'+esc(v.text)+'</p>';if(v.note)h+='<div class="note">'+esc(v.note)+'</div>';
  if(v.use&&!v.take&&!v.lock&&!v.game)h+='<div class="gnote">💡 要在这里用东西：先关掉这个窗口，在物品栏选中物品，再点「'+esc(o.name)+'」。</div>';
  if(v.lock){var L=v.lock;if(!LK||LK.id!==id||LK.kind!==L.kind||LK.ans!==L.answer)LK={id:id,kind:L.kind,len:L.len||(L.opts?L.opts.length:4),val:'',dial:L.opts&&L.kind==='dial'?L.opts.map(function(){return 0;}):null,ans:L.answer};h+=lockHtml(L);}
  else LK=null;
  h+='<div class="actions">'+(v.take?'<button class="btn mint" data-act="take" data-obj="'+id+'">✋ 拿起</button>':'')+'<button class="btn ghost" data-act="close">'+(v.take?'先不拿':'好的')+'</button></div>';
  openSheet(h);RP.inspect=id;
}
function lockHtml(L){var h='<div class="lock" id="lockBox"><div class="lock-p">🔒 '+esc(L.prompt||'输入密码')+'</div>';
  if(L.kind==='num'||L.kind==='alpha'){h+='<div class="codebox" id="codebox">'+codeCells()+'</div>';
    if(L.kind==='num'){h+='<div class="pad">';['1','2','3','4','5','6','7','8','9',L.dot?'.':'','0','⌫'].forEach(function(k){h+=k===''?'<span></span>':'<button data-act="'+(k==='⌫'?'bs':'key')+'" data-k="'+k+'">'+k+'</button>';});h+='</div>';}
    else{h+='<div class="kb">';'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(k){h+='<button data-act="key" data-k="'+k+'">'+k+'</button>';});h+='<button data-act="bs" data-k="⌫">⌫</button></div>';}
    h+='<button class="btn purple ok" data-act="lockok">确定</button>';}
  else if(L.kind==='dial'){h+='<div class="dials">';L.opts.forEach(function(o,i){h+='<div class="dial"><button data-act="dial" data-i="'+i+'" data-d="-1" aria-label="上一个">▲</button><div class="ch" id="dial'+i+'">'+o[LK.dial[i]]+'</div><button data-act="dial" data-i="'+i+'" data-d="1" aria-label="下一个">▼</button></div>';});h+='</div><button class="btn purple ok" data-act="lockok">确定</button>';}
  return h+'</div>';}
function codeCells(){var s='';for(var i=0;i<LK.len;i++){var c=LK.val[i]||'';s+='<span class="'+(c?'f':'')+'">'+c+'</span>';}return s;}
function lockKey(k){if(!LK)return;SFX.tap();if(k==='⌫')LK.val=LK.val.slice(0,-1);else if(LK.val.length<LK.len)LK.val+=k;var cb=$('#codebox');if(cb)cb.innerHTML=codeCells();}
function lockDial(i,d){var v=E.room.view(E.room.cur(store.st),store.st,LK.id),o=v.lock.opts[i];LK.dial[i]=(LK.dial[i]+d+o.length)%o.length;$('#dial'+i).textContent=o[LK.dial[i]];SFX.tap();}
function lockSubmit(val){var id=LK.id,r=E.room.cur(store.st),v=E.room.view(r,store.st,id);if(val===undefined)val=v.lock.kind==='dial'?LK.dial.map(function(x,i){return v.lock.opts[i][x];}).join(''):LK.val;
  if((v.lock.kind==='num'||v.lock.kind==='alpha')&&val.length<1){toast('先输入密码哦');return;}
  var res=E.room.code(r,store.st,id,val);
  if(res.ok){SFX.unlock();LK=null;roomMsg(res.text);save();if(store.st.done){closeSheet(true);roomAfter(res);toast(res.text,2800);return;}roomAfter(res);roomInspect(id,res.text);}
  else{SFX.bad();if(LK.kind!=='dial')LK.val='';roomInspect(id,res.text,true);shake($('#lockBox'));}}
function roomTake(id){var res=E.room.take(E.room.cur(store.st),store.st,id);if(!res.ok)return;SFX.pick();roomMsg(res.text);roomAfter(res);roomInspect(id,res.text);}
function roomTapItem(it){var st=store.st;
  if(RP.sel===it){RP.sel=null;SFX.tap();roomMsg('「'+ITEMS[it].name+'」：'+ITEMS[it].desc);renderRoom();return;}
  if(RP.sel){var a=RP.sel,res=E.room.combine(E.room.cur(st),st,a,it);RP.sel=null;if(res.ok){SFX.unlock();roomMsg(res.text);toast(res.text);roomAfter(res);}else{SFX.bad();roomMsg(res.text);toast(res.text);renderRoom();}return;}
  RP.sel=it;SFX.pick();roomMsg('已选中「'+ITEMS[it].name+'」：'+ITEMS[it].desc+' 点房间里的东西来使用它，或者再点一个物品来组合。（再点一次可以放下）');renderRoom();}

function goTo(dest){
  var res=E.room.go(store.st,dest);
  if(!res.ok){SFX.bad();toast(res.text);roomMsg(res.text);return;}
  SFX.ok();RP.sel=null;RP.hl=null;RP.inspect=null;closeSheet(true);
  var first=!store.st.flags['been_'+dest];store.st.flags['been_'+dest]=true;
  roomMsg(res.text||('来到了'+roomById(dest).title+'。'));
  enterRoom(dest, first, false);
}
function goLocked(dest){
  var list=E.room.exits(store.st);var e=null;for(var i=0;i<list.length;i++)if(list[i].to===dest)e=list[i];
  SFX.bad();toast(e?e.locked:'那边现在过不去。');
}

/* -------- mini-games -------- */
function openGame(id,v){
  var g=v.game;if(!g)return;
  if(g.id==='claw')openClaw(id,v);
  else if(g.id==='diff')openDiff(id,v);
}
function openClaw(id,v){
  var dolls=[
    {id:'a',em:'🐻',name:'红熊 + 星围巾'},
    {id:'b',em:'🐻',name:'蓝熊（没围巾）'},
    {id:'c',em:'🐱',name:'蓝猫 + 星围巾'},
    {id:'d',em:'🐰',name:'黄兔'},
    {id:'e',em:'🐻',name:'蓝熊 + 星围巾',ok:1},
    {id:'f',em:'🐷',name:'粉猪 + 星围巾'}
  ];
  var h=sheetHead('🕹️ 抓娃娃机');
  h+='<p class="say">海报写着：「本周头奖是<strong>戴星星围巾的蓝熊</strong>」。选对那一只，爪子就会落下。</p>';
  h+='<div class="claw-grid">';
  dolls.forEach(function(d){h+='<button class="claw-cell" data-act="clawPick" data-ok="'+(d.ok?1:0)+'" data-obj="'+id+'"><span class="em">'+d.em+'</span>'+esc(d.name)+'</button>';});
  h+='</div><div class="gnote">看清楚颜色和围巾，不要被长得像的娃娃骗到。</div>';
  h+='<div class="actions"><button class="btn ghost" data-act="close">先不抓</button></div>';
  openSheet(h);
}
function clawPick(ok,id){
  if(!ok){SFX.bad();toast('爪子抓起来又掉下去了……再看看海报？');shake($('.claw-grid'));return;}
  var r=E.room.cur(store.st),res=E.room.gameWin(r,store.st,id);
  if(!res.ok){SFX.bad();toast(res.text||'再试一次');return;}
  SFX.unlock();confetti();roomMsg(res.text);toast(res.text,2600);roomAfter(res);roomInspect(id,res.text);
}
function diffSvg(side){
  // side 0 = left (original), 1 = right (3 differences)
  var lampStars=side?6:5;
  var badge=!side;
  var clock=side?9:8;
  var s='<svg viewBox="0 0 160 180" aria-hidden="true">';
  s+='<rect width="160" height="180" fill="#120c28"/>';
  s+='<rect x="0" y="0" width="160" height="70" fill="#1a1448"/>';
  s+='<circle cx="130" cy="22" r="12" fill="#c8bdd8"/>';
  s+='<rect x="0" y="130" width="160" height="50" fill="#1a1020"/>';
  // string lights
  s+='<path d="M8 40 Q80 52 152 40" fill="none" stroke="#ffd166" stroke-width="1"/>';
  // lamp with stars (diff 1) at 30,70
  s+='<rect x="18" y="70" width="16" height="50" fill="#6a5040"/>';
  s+='<circle cx="26" cy="68" r="14" fill="#ffd166"/>';
  for(var i=0;i<lampStars;i++){var a=-90+i*(360/lampStars),x=26+Math.cos(a*Math.PI/180)*8,y=68+Math.sin(a*Math.PI/180)*8;s+='<circle cx="'+x+'" cy="'+y+'" r="1.6" fill="#fff"/>';}
  s+='<rect class="spot" data-diff="1" x="8" y="50" width="40" height="40"/>';
  // staff with/without badge (diff 2) at 80,90
  s+='<circle cx="90" cy="88" r="10" fill="#f3d2b0"/>';
  s+='<rect x="78" y="98" width="24" height="32" fill="#3a6aaa" rx="3"/>';
  if(badge)s+='<circle cx="100" cy="108" r="4" fill="#ffd166"/>';
  s+='<rect class="spot" data-diff="2" x="70" y="80" width="40" height="50"/>';
  // clock (diff 3)
  s+='<circle cx="130" cy="100" r="16" fill="#f3e3b0" stroke="#5a3020" stroke-width="2"/>';
  s+='<text x="130" y="105" font-size="11" text-anchor="middle" fill="#5a3020" font-weight="700">'+clock+':00</text>';
  s+='<rect class="spot" data-diff="3" x="112" y="82" width="36" height="36"/>';
  // carousel silhouette same both sides
  s+='<ellipse cx="80" cy="150" rx="40" ry="10" fill="#8a2048"/>';
  s+='<text x="80" y="170" font-size="9" text-anchor="middle" fill="#ffd166">木马</text>';
  s+='</svg>';
  return s;
}
var DIFF={found:{}};
function openDiff(id,v){
  DIFF={found:{},id:id};
  paintDiff();
}
function paintDiff(){
  var n=Object.keys(DIFF.found).length;
  var h=sheetHead('🔎 找出三处不同');
  h+='<p class="say">左右两幅「夜游园」几乎一样。把不同的地方点出来（点左边或右边都可以）。</p>';
  h+='<div class="diff-count">已找到 '+n+' / 3</div>';
  h+='<div class="diff-wrap"><div class="diff-pane" data-side="0">'+diffSvg(0)+'</div><div class="diff-pane" data-side="1">'+diffSvg(1)+'</div></div>';
  Object.keys(DIFF.found).forEach(function(k){ /* marked via class after insert */ });
  h+='<div class="gnote">提示：比一比灯上的星星、工作人员的胸前，还有钟点。</div>';
  h+='<div class="actions"><button class="btn ghost" data-act="close">先不比了</button></div>';
  openSheet(h);
  $$('.diff-pane .spot').forEach(function(el){if(DIFF.found[el.getAttribute('data-diff')])el.classList.add('on');});
}
function diffTap(k,id){
  if(DIFF.found[k]){SFX.tap();return;}
  DIFF.found[k]=1;SFX.ok();
  var n=Object.keys(DIFF.found).length;
  if(n>=3){
    var r=E.room.cur(store.st),res=E.room.gameWin(r,store.st,id);
    if(res.ok){SFX.unlock();confetti();roomMsg(res.text);toast(res.text,2600);roomAfter(res);roomInspect(id,res.text);}
    else{SFX.bad();toast('再试一次');}
    return;
  }
  paintDiff();toast('找到一处不同！还差 '+(3-n)+' 处');
}

function mapSheet(){
  var st=store.st,here=st.room;
  var order=['gate','carousel','fountain','cotton','prize','coaster','windmill','mirror','haunted','office','power','exit'];
  var h=sheetHead('🗺️ 园区地图');
  h+='<p class="say">亮着边的是你去过的地方。金色的是你现在的位置。还没路的地方会是灰的。</p><div class="map-grid">';
  order.forEach(function(id){
    var r=roomById(id),seen=!!st.flags['seen_'+id],isHere=here===id;
    var reachable=false;
    if(isHere||seen)reachable=true;
    else{
      var ex=E.room.exits({flags:st.flags,inv:st.inv,room:here,done:st.done});
      ex.forEach(function(e){if(e.to===id&&e.open)reachable=true;});
    }
    var cls=isHere?'here':(seen?'seen':'locked');
    h+='<button class="map-cell '+cls+'" data-act="'+(isHere?'close':(seen||reachable?'mapGo':'mapLocked'))+'" data-to="'+id+'"><span class="em">'+(seen||isHere?r.emoji:'🔒')+'</span>'+esc(r.title)+'</button>';
  });
  h+='</div>';
  openSheet(h);
}
function journalSheet(){
  var st=store.st,open=journalOpen(st);
  var h=sheetHead('📒 线索本');
  h+='<p class="say">你一路捡到的线索，会记在这里。谁关了电，答案会一点点清楚起来。</p><ol class="journal">';
  JOURNAL.forEach(function(j){
    var ok=E.room.condAll(st,j.if);
    if(ok)h+='<li><b>'+esc(j.title)+'</b><br>'+esc(j.text)+'</li>';
    else h+='<li class="locked-j">？？？ · 还没发现这条线索</li>';
  });
  h+='</ol><div class="actions"><button class="btn ghost" data-act="close">合上</button></div>';
  openSheet(h);
}
function hintSheet(H){var h=sheetHead('💡 提示');h+='<div class="hint-list">';
  if(!H.texts.length)h+='<div class="hint-item">需要帮忙吗？提示会一点一点给，先看第一条，想一想再看下一条。</div>';
  H.texts.forEach(function(t,i){h+='<div class="hint-item"><b>提示 '+(i+1)+'：</b>'+esc(t)+'</div>';});h+='</div>';
  var more=H.texts.length<H.max||H.repeat;
  h+='<div class="actions">'+(more?'<button class="btn sun" data-act="hintMore">'+(H.texts.length===0?'给我一点提示':H.texts.length<H.max?'再多一点提示':'再看下一步')+'</button>':'')+'<button class="btn ghost" data-act="close">我自己想想</button></div>';
  h+='<div class="hint-cost">用了提示，通关时星星会少一点。没关系，把故事走完最重要。</div>';
  openSheet(h);curHint=H;}
var curHint=null;
function hintMore(){var H=curHint;if(!H)return;var t=H.reveal(H.texts.length<H.max?H.texts.length:H.max-1);
  if(H.texts.length<H.max)H.texts.push(t);else H.texts[H.max-1]=t;SFX.hint();hintSheet(H);}
function roomHint(){
  var st=store.st,hh=E.room.hint(E.room.cur(st),st);
  if(!hh){toast('这一步你已经很接近啦！再四处看看，或打开线索本。');return;}
  var key=hh.idx;var texts=(store.stage[key]||[]).slice();
  hintSheet({texts:texts,max:hh.h.tiers.length,reveal:function(i){store.hints=(store.hints||0)+1;var arr=store.stage[key]=store.stage[key]||[];if(arr.length===i)arr.push(hh.h.tiers[i]);if(i>=1&&hh.h.obj){RP.hl=hh.h.obj;}save();renderRoom();return hh.h.tiers[i];}});
}
function roomWin(){
  SFX.win();confetti();
  var hints=store.hints||0,stars=hints<=0?3:hints<=5?2:1;
  if(stars>(store.bestStars||0))store.bestStars=stars;save();
  var ending=(window.PZ_ENDING||[]).join('\n\n');
  var h='<div class="win"><div style="font-size:48px">🌅</div><div class="wt">大门打开了！</div><div class="bigstars">'+[0,1,2].map(function(i){return starSvg(i<stars);}).join('')+'</div>';
  h+='<div class="ws">'+(hints?'用了 '+hints+' 次提示':'一次提示也没用，太棒了！')+'</div>';
  h+='<div class="ending">'+esc(ending)+'</div>';
  if(window.PZ_EXPLAIN)h+='<div class="explain"><h4>🎡 解谜思路</h4><ol>'+window.PZ_EXPLAIN.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol></div>';
  h+='<div class="actions"><button class="btn primary" data-act="stay">留在园里看看</button><button class="btn ghost" data-act="home">返回首页</button></div>';
  h+='<div class="hint-cost">🏆 星灯游乐园 · 午夜闭园 通关！想再玩一遍，可在首页清空存档。</div></div>';
  openSheet(h,{locked:true});
}

document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.id==='mask'){if(!sheetLocked)closeSheet();return;}
  var spot=t.closest&&t.closest('.diff-pane .spot');
  if(spot){diffTap(spot.getAttribute('data-diff'),DIFF.id);return;}
  if(nav.screen==='room'){var ob=t.closest('#scene [data-obj]');if(ob){roomTapObj(ob.getAttribute('data-obj'));return;}}
  var b=t.closest('[data-act]');if(!b)return;var a=b.dataset.act;
  switch(a){
    case 'mute':store.sound=!store.sound;save();paintMute();if(store.sound)SFX.tap();break;
    case 'home':SFX.tap();closeSheet(true);renderHome();break;
    case 'start':SFX.tap();closeSheet(true);startGame(false);break;
    case 'howto':SFX.tap();howtoSheet();break;
    case 'close':SFX.tap();closeSheet();break;
    case 'hint':SFX.tap();roomHint();break;
    case 'hintMore':hintMore();break;
    case 'item':roomTapItem(b.dataset.item);break;
    case 'take':roomTake(b.dataset.obj);break;
    case 'key':lockKey(b.dataset.k);break;
    case 'bs':lockKey('⌫');break;
    case 'dial':lockDial(+b.dataset.i,+b.dataset.d);break;
    case 'lockok':lockSubmit();break;
    case 'story':SFX.tap();storySheet();break;
    case 'map':SFX.tap();mapSheet();break;
    case 'journal':SFX.tap();journalSheet();break;
    case 'go':closeSheet(true);goTo(b.dataset.to);break;
    case 'mapGo':closeSheet(true);(function(){var dest=b.dataset.to;if(dest===store.st.room)return;var res=E.room.go(store.st,dest);if(res.ok){goTo(dest);return;}/* allow walk to any seen room via virtual travel if we have a path later */ if(store.st.flags['seen_'+dest]){store.st.room=dest;SFX.ok();RP.sel=null;RP.hl=null;roomMsg('你穿过园路，来到'+roomById(dest).title+'。');enterRoom(dest,false,false);}else{SFX.bad();toast('那边现在还过不去。');}})();break;
    case 'mapLocked':SFX.bad();toast('那边现在还过不去，先把眼前的路走通。');break;
    case 'goLocked':goLocked(b.dataset.to);break;
    case 'clawPick':clawPick(b.dataset.ok==='1',b.dataset.obj);break;
    case 'stay':closeSheet(true);renderRoom();break;
    case 'roomReset':SFX.tap();openSheet(sheetHead('🔄 重新开始？')+'<p class="say">会从入口大门重新开始，物品栏和线索都会清空。不能恢复。</p><div class="actions"><button class="btn primary" data-act="roomResetYes">重新开始</button><button class="btn ghost" data-act="close">不了</button></div>');break;
    case 'roomResetYes':closeSheet(true);startGame(true);SFX.ok();toast('从入口大门重新开始。');break;
    case 'resetProgress':SFX.tap();openResetSheet();break;
    case 'resetAllYes':closeSheet(true);resetAll();SFX.ok();toast('存档已清空，可以从头玩啦！');renderHome();break;
  }
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!sheetLocked)closeSheet();}});
window.PZ={E:E,store:function(){return store;},KEY:KEY,startGame:startGame,resetAll:resetAll,renderHome:renderHome};
paintMute();renderHome();
if(QS.has('play'))startGame(false);
})();
/*UI-END*/
