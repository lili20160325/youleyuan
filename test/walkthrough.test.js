'use strict';
const load=require('./load');
const ctx=load(['ENGINE','ROOMS']);
const E=ctx.PZE.room, ROOMS=ctx.PZ_ROOMS, ITEMS=ctx.PZ_ITEMS, SOLUTION=ctx.PZ_SOLUTION;
let fails=0;
const fail=(m)=>{fails++; console.log('FAIL', m);};
const ok=(m)=>console.log('OK', m);

function act(st,a){
  const r=E.cur(st);
  if(a[0]==='code')return E.code(r,st,a[1],a[2]);
  if(a[0]==='take')return E.take(r,st,a[1]);
  if(a[0]==='use')return E.use(r,st,a[1],a[2]);
  if(a[0]==='combine')return E.combine(r,st,a[1],a[2]);
  if(a[0]==='look')return E.look(r,st,a[1]);
  if(a[0]==='go')return E.go(st,a[1]);
  if(a[0]==='game')return E.gameWin(r,st,a[1]);
  return {ok:false,text:'unknown action '+a[0]};
}

console.log('=== rooms present ===');
const ids=ROOMS.map(r=>r.id);
const need=['gate','carousel','fountain','coaster','windmill','cotton','prize','mirror','haunted','office','power','exit'];
need.forEach(id=>{ if(ids.indexOf(id)<0) fail('missing room '+id); else ok('room '+id); });
if(ROOMS.length<10) fail('expected 10-12 rooms, got '+ROOMS.length);
else ok(ROOMS.length+' rooms');

console.log('=== walkthrough ===');
if(!SOLUTION||!SOLUTION.length) fail('no PZ_SOLUTION');
const st=E.init();
let step=0;
for(const a of SOLUTION){
  step++;
  const before=st.room;
  const res=act(st,a);
  if(!res||!res.ok){
    fail('step '+step+' @'+before+' '+JSON.stringify(a)+' => '+(res&&res.text)+' flags='+Object.keys(st.flags).filter(k=>st.flags[k]).join(',')+' inv='+st.inv.join(','));
    break;
  }
}
if(st.done) ok('walkthrough '+SOLUTION.length+' steps, escaped from '+st.room);
else fail('solution finished but not done. room='+st.room+' flags='+JSON.stringify(st.flags)+' inv='+st.inv);

console.log('=== wrong codes rejected ===');
(function(){
  const s=E.init();
  const r=E.cur(s);
  const bad=E.code(r,s,'lostbox','666');
  if(bad&&bad.ok) fail('666 should not open lostbox'); else ok('666 rejected');
  const s2=E.init();
  // skip to music box? just check hatch STAR vs RAIL later after walking part
})();

console.log('=== item refs ===');
const used=new Set();
function add(i){if(i)used.add(i);}
for(const r of ROOMS){
  for(const o of r.objects){
    for(const v of o.views){
      (v.take&&v.take.give||[]).forEach(add);
      (v.take&&v.take.take||[]).forEach(add);
      (v.lock&&v.lock.ok&&v.lock.ok.give||[]).forEach(add);
      (v.game&&v.game.ok&&v.game.ok.give||[]).forEach(add);
      (v.use||[]).forEach(u=>{add(u.item);(u.give||[]).forEach(add);(u.take||[]).forEach(add);});
    }
  }
  (r.combos||[]).forEach(c=>{add(c.a);add(c.b);(c.give||[]).forEach(add);});
}
(ctx.PZ_COMBOS||[]).forEach(c=>{add(c.a);add(c.b);(c.give||[]).forEach(add);});
for(const i of used){
  if(!ITEMS[i]) fail('missing item def '+i);
}
ok('items used '+used.size+' / defined '+Object.keys(ITEMS).length);

console.log('=== every room has art, exits, hints, objects ===');
for(const r of ROOMS){
  if(typeof r.art!=='function') fail(r.id+' missing art');
  if(!r.objects||r.objects.length<3) fail(r.id+' too few objects');
  if(!r.hints||!r.hints.length) fail(r.id+' missing hints');
  if(!r.story||!r.story.length) fail(r.id+' missing story');
  const st0={flags:{},inv:[],room:r.id,done:false};
  let art='';
  try{art=r.art(st0.flags)+r.art({power_on:true,escaped:true});}catch(e){fail(r.id+' art threw '+e.message);}
  if(art&&art.indexOf('<')<0) fail(r.id+' art empty');
  // every obj has box + at least one view
  for(const o of r.objects){
    if(!o.box||o.box.length!==4) fail(r.id+'.'+o.id+' bad box');
    if(!o.views||!o.views.length) fail(r.id+'.'+o.id+' no views');
  }
}
ok('room structure ok');

console.log('=== lock answers have evidence in texts ===');
const corpus=ROOMS.map(r=>JSON.stringify(r.objects)+JSON.stringify(r.story)).join('\n')
  +JSON.stringify(ITEMS)+JSON.stringify(ctx.PZ_EXPLAIN)+JSON.stringify(ctx.PZ_JOURNAL);
const answers=new Set();
for(const r of ROOMS){
  for(const o of r.objects){
    for(const v of o.views){
      if(v.lock&&v.lock.answer) answers.add(String(v.lock.answer).toUpperCase());
    }
  }
}
for(const ans of answers){
  // evidence can be split (2,0,8 or 晚晚 / WAN) — check loose
  const okHit=corpus.toUpperCase().indexOf(ans)>=0
    || (ans==='208' && /2、0、8|2,0,8|208/.test(corpus))
    || (ans==='315' && /号牌写着 3[\s\S]*号牌写着 1[\s\S]*号牌写着 5|蓝马号牌：3/.test(corpus))
    || (ans==='427' && /4、2、7|从左到右是 4、2、7/.test(corpus))
    || (ans==='STAR' && /STAR-RAIL|前四个字母/.test(corpus))
    || (ans==='WANWAN' && /晚晚/.test(corpus))
    || (ans==='10' && /10 月/.test(corpus))
    || (ans==='6' && /写着 6|数字 6/.test(corpus));
  if(!okHit) fail('no evidence for lock answer '+ans);
  else ok('evidence for '+ans);
}

console.log('=== cannot open exit early ===');
(function(){
  const s=E.init();
  const r1=E.go(s,'exit');
  if(r1.ok) fail('should not go exit from gate at start'); else ok('exit not reachable at start');
  const r2=E.go(s,'carousel');
  if(r2.ok) fail('should not go carousel before side door'); else ok('carousel locked at start');
})();

console.log('=== fake codes still fail mid-game ===');
(function(){
  const s=E.init();
  // walk until music box is available
  for(const a of SOLUTION){
    if(a[0]==='code'&&a[1]==='musicbox')break;
    const res=act(s,a);
    if(!res||!res.ok){fail('pre-music walk failed');return;}
  }
  const bad=E.code(E.cur(s),s,'musicbox','777');
  if(bad&&bad.ok) fail('777 should not open music box'); else ok('777 rejected at music box');
  const bad2=E.code(E.cur(s),s,'musicbox','1234');
  if(bad2&&bad2.ok) fail('1234 should not open music box'); else ok('1234 rejected');
})();

console.log(fails?('\nFAILED '+fails):'\nALL PASS');
process.exit(fails?1:0);
