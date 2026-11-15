(function(){
var $=function(i){return document.getElementById(i)};
if(!$('neuro'))return;
/* NEURONS */
var Neuro=(function(){
  var cv=$('neuro'),ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,H=0,nodes=[],edges=[],layers=[],pulses=[],on=false,vis=true,raf=0,last=0,spawn=0,mx=-999,my=-999,sx=0,sy=0,tx=0,ty=0;
  function build(){
    var r=cv.getBoundingClientRect();if(!r.width)return;
    var d=Math.min(window.devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
    var mob=W<900,spec=mob?[4,5,6,5,3]:[5,6,7,6,4],mx_=Math.max.apply(null,spec);
    var x0=mob?W*.1:(W<1200?W*.5:W*.44),x1=mob?W*.9:W*.95,bh=mob?Math.min(290,H*.38):H*.7,cy=mob?H-bh/2-34:H*.53,gap=bh/mx_,rad=mob?(W>600?8:6):Math.max(7,Math.min(13,gap*.22));
    nodes=[];edges=[];layers=[];pulses=[];
    spec.forEach(function(n,l){var L=[];for(var i=0;i<n;i++){var nd={bx:x0+(x1-x0)*l/(spec.length-1),by:cy+(i-(n-1)/2)*gap,x:0,y:0,l:l,g:0,ph:Math.random()*6.28,r:rad,out:[]};L.push(nd);nodes.push(nd)}layers.push(L)});
    for(var l=0;l<layers.length-1;l++)layers[l].forEach(function(a){layers[l+1].forEach(function(b){var e={a:a,b:b,act:0};a.out.push(e);edges.push(e)})});
  }
  function pt(e,t){var a=e.a,b=e.b,mx2=(a.x+b.x)/2,u=1-t;return[u*u*u*a.x+3*u*u*t*mx2+3*u*t*t*mx2+t*t*t*b.x,u*u*u*a.y+3*u*u*t*a.y+3*u*t*t*b.y+t*t*t*b.y]}
  function send(e){e.act=1;pulses.push({e:e,t:0,s:(.16+Math.random()*.14)*(reduce?.5:1)/Math.max(60,Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y))})}
  function frame(dt,t,still){
    sx+=(tx-sx)*.06;sy+=(ty-sy)*.06;
    nodes.forEach(function(n){var k=(n.l+1)*.5;n.x=n.bx+Math.sin(t*.0007+n.ph)*(reduce?0:3)+sx*k;n.y=n.by+Math.cos(t*.0006+n.ph)*(reduce?0:3)+sy*k;n.g*=Math.exp(-dt/650);
      if(mx>-900){var dx=n.x-mx,dy=n.y-my;if(dx*dx+dy*dy<14400)n.g=Math.max(n.g,.6)}});
    ctx.clearRect(0,0,W,H);ctx.lineWidth=1;
    ctx.strokeStyle='rgba(130,105,255,.14)';ctx.beginPath();
    edges.forEach(function(e){var m=(e.a.x+e.b.x)/2;ctx.moveTo(e.a.x,e.a.y);ctx.bezierCurveTo(m,e.a.y,m,e.b.y,e.b.x,e.b.y)});ctx.stroke();
    edges.forEach(function(e){e.act*=Math.exp(-dt/520);if(e.act>.03){var m=(e.a.x+e.b.x)/2;ctx.strokeStyle='rgba(176,155,255,'+(.14+.55*e.act)+')';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.bezierCurveTo(m,e.a.y,m,e.b.y,e.b.x,e.b.y);ctx.stroke()}});
    ctx.globalCompositeOperation='lighter';
    for(var i=pulses.length-1;i>=0;i--){var p=pulses[i];p.t+=p.s*dt;
      if(p.t>=1){p.e.b.g=1;var o=p.e.b.out;if(o.length){send(o[Math.floor(Math.random()*o.length)]);if(Math.random()<.5&&pulses.length<70)send(o[Math.floor(Math.random()*o.length)])}pulses.splice(i,1);continue}
      for(var k=0;k<4;k++){var q=pt(p.e,Math.max(0,p.t-k*.025)),a=1-k*.24;
        var g=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],k?5:11);g.addColorStop(0,'rgba(200,185,255,'+(.9*a)+')');g.addColorStop(1,'rgba(124,92,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q[0],q[1],k?5:11,0,6.283);ctx.fill()}}
    nodes.forEach(function(n){var g=n.g,h=ctx.createRadialGradient(n.x,n.y,n.r*.5,n.x,n.y,n.r*(3.2+g*2));h.addColorStop(0,'rgba(124,92,255,'+(.3+.5*g)+')');h.addColorStop(1,'rgba(124,92,255,0)');ctx.fillStyle=h;ctx.beginPath();ctx.arc(n.x,n.y,n.r*(3.2+g*2),0,6.283);ctx.fill()});
    ctx.globalCompositeOperation='source-over';
    nodes.forEach(function(n){var g=n.g,f=ctx.createRadialGradient(n.x-n.r*.3,n.y-n.r*.3,0,n.x,n.y,n.r);f.addColorStop(0,'rgba('+(110+90*g|0)+','+(90+90*g|0)+',255,1)');f.addColorStop(1,'#2a1d8f');
      ctx.fillStyle=f;ctx.strokeStyle='rgba(205,195,255,'+(.55+.45*g)+')';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);ctx.fill();ctx.stroke()});
    if(!still){spawn-=dt;if(spawn<=0&&pulses.length<60&&layers.length){var L=layers[0],n=L[Math.floor(Math.random()*L.length)];n.g=.8;send(n.out[Math.floor(Math.random()*n.out.length)]);spawn=(W<900?420:230)*(reduce?3:1)}}
  }
  function loop(ts){raf=0;if(!on||!vis||document.hidden)return;if(reduce&&ts-last<66){raf=requestAnimationFrame(loop);return}var dt=Math.min(ts-last,50);last=ts;frame(dt,ts);raf=requestAnimationFrame(loop)}
  function kick(){if(on&&vis&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
  function stillDraw(){build();if(!nodes.length)return;for(var i=0;i<14;i++){var l=Math.floor(Math.random()*3),L=layers[l],n=L[Math.floor(Math.random()*L.length)];n.g=.5+Math.random()*.5;var e=n.out[Math.floor(Math.random()*n.out.length)];e.act=1}frame(16,0,true)}
  var hero=$('hero');
  new IntersectionObserver(function(en){vis=en[0].isIntersecting;kick()}).observe(hero);
  document.addEventListener('visibilitychange',kick);
  new ResizeObserver(function(){if(on){build();kick()}}).observe(hero);
  window.addEventListener('pageshow',function(){if(on){build();kick()}});
  hero.addEventListener('pointermove',function(e){if(reduce||e.pointerType==='touch')return;var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;tx=(mx-W/2)*-.03;ty=(my-H/2)*-.03});
  hero.addEventListener('pointerleave',function(){mx=my=-999;tx=ty=0});
  return{set:function(v){on=v;if(v){build();kick()}}}
})();


Neuro.set(true);
})();
