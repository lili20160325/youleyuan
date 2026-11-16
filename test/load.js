'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function load(blocks){
  const useSrc=process.argv.includes('--src');
  const txt=useSrc
    ?['engine','rooms'].map(f=>fs.readFileSync(path.join(__dirname,'../src/'+f+'.js'),'utf8')).join('\n')
    :fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
  for(const b of blocks){
    const m=txt.match(new RegExp('/\\*'+b+'-START\\*/([\\s\\S]*?)/\\*'+b+'-END\\*/'));
    if(!m)throw new Error(b+' block not found');
    vm.runInContext(m[1],ctx);
  }
  return ctx;
};
