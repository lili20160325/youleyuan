/*ENGINE-START*/
(function(G){
'use strict';
var E={};
function has(st,i){return st.inv.indexOf(i)>=0;}
function cond(st,c){
  var neg=c[0]==='!';if(neg)c=c.slice(1);
  var v;
  if(c.indexOf('has:')===0)v=has(st,c.slice(4));
  else if(c.indexOf('room:')===0)v=st.room===c.slice(5);
  else v=!!st.flags[c];
  return neg?!v:v;
}
function condAll(st,list){return !list||list.every(function(c){return cond(st,c);});}
function cur(st){
  var rs=G.PZ_ROOMS||[];
  for(var i=0;i<rs.length;i++)if(rs[i].id===st.room)return rs[i];
  return rs[0];
}
var R={
  has:has,cond:cond,condAll:condAll,
  init:function(){return {flags:{seen_gate:true},inv:[],room:'gate',done:false};},
  cur:cur,
  obj:function(room,id){if(!room||!room.objects)return null;for(var i=0;i<room.objects.length;i++)if(room.objects[i].id===id)return room.objects[i];return null;},
  view:function(room,st,id){var o=R.obj(room,id);if(!o)return null;for(var i=0;i<o.views.length;i++)if(condAll(st,o.views[i].if))return o.views[i];return null;},
  apply:function(st,eff){
    (eff.take||[]).forEach(function(i){var k=st.inv.indexOf(i);if(k>=0)st.inv.splice(k,1);});
    (eff.give||[]).forEach(function(i){if(!has(st,i))st.inv.push(i);});
    (eff.set||[]).forEach(function(f){st.flags[f]=true;});
    if(eff.win){st.done=true;st.flags.escaped=true;}
    return {ok:true,text:eff.text||'',eff:eff};
  },
  look:function(room,st,id){var v=R.view(room,st,id);if(!v)return {ok:false,text:''};if(v.set)v.set.forEach(function(f){st.flags[f]=true;});return {ok:true,view:v,text:v.text};},
  take:function(room,st,id){var v=R.view(room,st,id);if(!v||!v.take)return {ok:false,text:'这里没有可以拿的东西。'};return R.apply(st,v.take);},
  norm:function(s){return String(s).toUpperCase().replace(/\s+/g,'');},
  code:function(room,st,id,code){var v=R.view(room,st,id);if(!v||!v.lock)return {ok:false,text:''};
    if(R.norm(code)===R.norm(v.lock.answer))return R.apply(st,v.lock.ok);return {ok:false,bad:true,text:v.lock.bad||'密码不对哦，再想一想。'};},
  use:function(room,st,id,item){if(!has(st,item))return {ok:false,text:''};var v=R.view(room,st,id);
    var u=v&&v.use?v.use.filter(function(x){return x.item===item;})[0]:null;
    if(!u)return {ok:false,text:(v&&v.wrong)||'好像用不上，换个东西试试吧。'};return R.apply(st,u);},
  combosOf:function(room){return (G.PZ_COMBOS||[]).concat((room&&room.combos)||[]);},
  combine:function(room,st,a,b){if(!has(st,a)||!has(st,b)||a===b)return {ok:false,text:''};
    var c=R.combosOf(room).filter(function(x){return (x.a===a&&x.b===b)||(x.a===b&&x.b===a);})[0];
    if(!c)return {ok:false,text:'这两样东西放在一起，好像没什么用。'};
    return R.apply(st,{take:[a,b],give:c.give,set:c.set,text:c.text});},
  exits:function(st){var room=cur(st);return ((room&&room.exits)||[]).map(function(e){var open=condAll(st,e.if);return {to:e.to,label:e.label,emoji:e.emoji||'',open:open,locked:e.locked||'那边现在过不去。',text:e.text||''};});},
  go:function(st,dest){var list=R.exits(st);var e=null;for(var i=0;i<list.length;i++)if(list[i].to===dest)e=list[i];
    if(!e)return {ok:false,text:'没有这条路。'};
    if(!e.open)return {ok:false,text:e.locked};
    st.room=dest;st.flags['seen_'+dest]=true;
    return {ok:true,text:e.text||'',moved:true};},
  hint:function(room,st){var hs=(room&&room.hints)||[];for(var i=0;i<hs.length;i++){var h=hs[i];if(!st.flags[h.until]&&condAll(st,h.if))return {idx:room.id+':'+i,h:h};}return null;},
  gameWin:function(room,st,id){var v=R.view(room,st,id);if(!v||!v.game)return {ok:false,text:''};return R.apply(st,v.game.ok);}
};
E.room=R;
G.PZE=E;
})(typeof window!=='undefined'?window:globalThis);
/*ENGINE-END*/
