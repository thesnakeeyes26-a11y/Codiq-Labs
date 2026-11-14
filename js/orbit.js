(function(){
var root=document.getElementById('orbit');if(!root)return;
var IMG='/assets/img/project',TAU=Math.PI*2,FLIGHT=600,EASE='cubic-bezier(0.22,1,0.36,1)',TID='eqKBKe';
var LOCK='<svg viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3"/></svg>';
var ITEMS=[
 {title:'Aivus AI',meta:'Coming soon · Offline AI',desc:'An AI assistant being built to run fully on your device: no cloud server, no data sent to the internet.',cover:'av',logo:true,status:'Coming soon',tags:['Our product','Offline AI','Privacy-first'],
  lead:'Aivus AI is a private AI assistant built to run entirely on your device. There is no cloud server and nothing is sent to the internet, so your chats, files and credentials never leave your device.',
  features:[['Smart model recommendation','Checks your device’s RAM and recommends the AI model that will run best on it.'],['Vault','An offline, on-device vault to store sensitive data like passwords and IDs.'],['100% offline chat','Chat with the AI without any internet connection or cloud server.'],['Conversations stay with you','Every chat is stored on your device and nowhere else.'],['Voice and Summarize','Quick actions on the home screen to talk to Aivus and summarize content.'],['Model manager','A Models section to manage the AI models installed on your device.']],
  tech:['On-device AI','Local GGUF models','Offline vault']},
 {title:'Finance Ledger Pro',meta:'Android · Firebase · SQLite',desc:'Multi-role finance app with cashbook tracking, audit reports and offline-first Firebase sync.',imgs:[1,2],tags:['Android','Firebase','SQLite'],
  lead:'A multi-role finance management app for tracking money in and out, built to keep working even without an internet connection.',
  features:[['Admin and staff roles','Separate access for admins and staff members.'],['Customer accounts','Maintain accounts for each of your customers in one place.'],['Cashbook tracking','Record every cash-in and cash-out entry as it happens.'],['Audit reports','Generate reports to review and verify your records.'],['PDF and CSV export','Share or archive your reports in the format you need.'],['Cloud sync with offline mode','Firebase sync backs up your data, while local storage keeps the app working offline.']],
  tech:['Android','Firebase','SQLite']},
 {title:'SpendWise',meta:'Android · SMS parsing · Biometric',desc:'Privacy-first expense tracker that reads bank SMS and keeps all data on your device.',imgs:[3,4],tags:['Android','SMS Parsing','Biometric'],
  lead:'A privacy-first expense tracker that reads your bank SMS to log spending automatically, with all your data stored on your device.',
  features:[['Automatic SMS parsing','Transactions are picked up from bank SMS, so there is no manual entry.'],['Category breakdown charts','See where your money goes with clear charts by category.'],['Keyword mapping rules','Set your own rules so transactions land in the right category.'],['Biometric security','Lock the app behind your fingerprint or face.'],['Fully offline','All data lives in local SQLite storage on your device.'],['Privacy-first by design','Your financial data is never uploaded anywhere.']],
  tech:['Android','SMS parsing','Biometric','SQLite']},
 {title:'Your project',meta:'',desc:'Tell us what you want to automate or build.',cover:'nx',cta:true}
];
var total=ITEMS.length,mq=matchMedia('(prefers-reduced-motion: reduce)'),reduced=mq.matches;
var st={active:null,angle:0,hover:null,playing:!reduced,focusTrig:false,vis:true,W:root.clientWidth||720,H:root.clientHeight||510,last:'',changed:false,start:0,prev:0,raf:0,restore:0,drag:null,noclick:false};
var anims=[];
function cover(it){
 if(it.cover==='av')return '<div class="o-cover av"><div class="avl"><img class="avlogo" src="/assets/img/aivus-logo-v1.png" alt="Aivus logo" width="360" height="369"><em>Coming soon</em></div><img src="/assets/img/aivus-app-v1.webp" alt="Aivus AI app screenshot" width="480" height="965" draggable="false"></div>';
 if(it.cover==='nx')return '<div class="o-cover nx"><span>+</span><b>Your project</b></div>';
 return '<div class="o-cover">'+it.imgs.map(function(n){return '<img src="'+IMG+n+'-v1.webp" alt="'+it.title+' screenshot" width="480" height="1067" draggable="false">'}).join('')+'</div>';
}
root.tabIndex=0;root.setAttribute('role','region');root.setAttribute('aria-label','Portfolio orbit gallery');root.setAttribute('aria-describedby','o-hint');
root.innerHTML='<div class="o-top"><span class="o-lab">Orbit<i>/</i>'+String(total).padStart(2,'0')+' works</span><span class="o-act"></span></div>'
 +'<div class="o-ring" aria-hidden="true"></div>'
 +'<div class="o-title"><p class="o-eye">A collection in motion</p><h2>Our <em>portfolio</em></h2><p class="o-sub">Choose a work to bring it closer</p></div>'
 +ITEMS.map(function(it){return '<div class="o-item">'+cover(it)+'<button type="button" class="o-btn" aria-label="View '+it.title+'"></button></div>'}).join('')
 +'<div class="o-cap" hidden></div>'
 +'<div class="o-dots" role="group" aria-label="Choose a work" hidden><span class="o-dring" aria-hidden="true"></span>'+ITEMS.map(function(it,i){return '<button type="button" class="o-dot" data-dot="'+i+'" aria-label="Show '+it.title+'" title="'+it.title+'"><span></span></button>'}).join('')+'</div>'
 +'<div class="o-bot"><p class="o-hint" id="o-hint"></p><div class="o-nav"><button type="button" class="o-circ" data-step="-1" aria-label="Previous work">←</button><button type="button" class="o-circ" data-step="1" aria-label="Next work">→</button></div></div>'
 +'<span class="sr" role="status" aria-live="polite"></span>';
function q(s){return root.querySelector(s)}
var nodes=[].slice.call(root.querySelectorAll('.o-item')),btns=nodes.map(function(n){return n.querySelector('.o-btn')}),dots=[].slice.call(root.querySelectorAll('.o-dot'));
var act=q('.o-act'),ring=q('.o-ring'),title=q('.o-title'),cap=q('.o-cap'),dbox=q('.o-dots'),hint=q('.o-hint'),status=q('.sr');

function valid(i){return i!=null&&Number.isInteger(i)&&i>=0&&i<total?i:null}
function pos(i){
 var W=st.W,H=st.H,a=st.active,portrait=W<560;
 var fw=Math.min(W*.88,H*.42*1.55),fh=fw/1.55,ft=H*.12,fx=(W-fw)/2;
 if(a===i)return{x:fx,y:ft,w:fw,h:fh,s:1,d:1,b:0};
 if(a!==null){var t=(i-a)/total*TAU-Math.PI/2;return{x:W/2+Math.cos(t)*70-4,y:H*.86+Math.sin(t)*30-4,w:8,h:8,s:1,d:0,b:0}}
 var t2=i/total*TAU+st.angle-Math.PI/2,d=(Math.sin(t2)+1)/2,s=.64+d*.36+(st.hover===i?.16:0),w=Math.min(150,W*.24),h=w*.76;
 return{x:W/2+Math.cos(t2)*W*(portrait?.31:.355)-w*s/2,y:H*.47+Math.sin(t2)*H*(portrait?.32:.29)-h*s/2,w:w,h:h,s:s,d:d,b:st.hover===i?0:(1-d)*.7};
}
function paint(animate,before,br){
 var a=st.active;
 for(var i=0;i<total;i++){
  var n=nodes[i],p=pos(i),tf='translate3d('+p.x+'px,'+p.y+'px,0) scale('+p.s+')',fl='blur('+p.b+'px)',rad=a!==null&&a!==i?'50%':'8px',op=a===null||a===i?'1':'0';
  n.style.width=p.w+'px';n.style.height=p.h+'px';n.style.transform=tf;n.style.filter=fl;n.style.borderRadius=rad;n.style.zIndex=a===i?30:5+Math.round(p.d*10);
  var im=n.firstElementChild;im.style.opacity=op;
  var o=before&&before[i];
  if(animate&&o&&o.rect.width>0){
   var from='translate3d('+(o.rect.left-br.left)+'px,'+(o.rect.top-br.top)+'px,0) scale('+(o.rect.width/p.w)+','+(o.rect.height/p.h)+')';
   anims.push(n.animate([{transform:from,filter:o.filter,borderRadius:o.radius},{transform:tf,filter:fl,borderRadius:rad}],{duration:FLIGHT,easing:EASE}));
   anims.push(im.animate([{opacity:o.op},{opacity:op}],{duration:FLIGHT,easing:EASE}));
  }
 }
}
function layout(){
 var br=root.getBoundingClientRect();
 var before=nodes.map(function(n){var cs=getComputedStyle(n);return{rect:n.getBoundingClientRect(),filter:cs.filter,radius:cs.borderRadius,op:getComputedStyle(n.firstElementChild).opacity}});
 anims.forEach(function(x){x.cancel()});anims=[];
 var key=st.active+':'+total,ch=st.last!==''&&st.last!==key;st.last=key;st.changed=ch;st.start=performance.now();
 paint(ch&&!reduced,before,br);kick();
}
function place(){if(st.active===null)return;var p=pos(st.active);cap.style.left=p.x+'px';cap.style.top=(p.y+p.h+16)+'px';cap.style.width=p.w+'px'}
function sizing(){
 var portrait=st.W<560;
 ring.style.left=portrait?'19%':'14.5%';ring.style.top=portrait?'15%':'18%';ring.style.width=portrait?'62%':'71%';ring.style.height=portrait?'64%':'58%';
 title.querySelector('h2').style.fontSize=Math.min(52,st.W*.066)+'px';
}
function ui(){
 var a=st.active,it=ITEMS[a];
 root.dataset.state=a===null?'orbit':'spotlight';
 ring.style.opacity=a===null?1:0;ring.style.transform=a===null?'scale(1)':'scale(.2)';
 title.style.opacity=a===null?1:0;title.style.filter=a===null?'blur(0px)':'blur(8px)';title.setAttribute('aria-hidden',a!==null);
 act.innerHTML=a!==null?'<button type="button" class="o-pill" data-back>← Back to orbit</button>':(reduced?'':'<button type="button" class="o-circ" data-toggle aria-label="'+(st.playing?'Pause':'Play')+' orbit" aria-pressed="'+st.playing+'">'+(st.playing?'❚❚':'▶')+'</button>');
 nodes.forEach(function(n,i){n.setAttribute('aria-hidden',a!==null&&a!==i);btns[i].tabIndex=a===null?0:-1;btns[i].disabled=a!==null});
 hint.textContent=a===null?'Click a work to bring it closer':'Drag the dots · Esc to return';
 status.textContent=it?(a+1)+' of '+total+': '+it.title:total+' works in orbit';
 if(it){
  cap.hidden=false;
  cap.innerHTML='<div class="o-row"><h3>'+it.title+'</h3><span class="o-count">'+String(a+1).padStart(2,'0')+' / '+String(total).padStart(2,'0')+'</span></div><div class="o-row2"><p class="o-meta">'+it.meta+'</p>'+(it.cta?'<a class="o-more" href="/contact" data-cta>Start a project <i>→</i></a>':'<button type="button" class="o-more" data-more>Know more <i>→</i></button>')+'</div><p class="o-desc">'+it.desc+'</p>';
  place();
 }else cap.hidden=true;
 dbox.hidden=a===null;
 if(a!==null)dots.forEach(function(d,i){var t=(i-a)/total*TAU-Math.PI/2;d.style.transform='translate('+(78+Math.cos(t)*70)+'px,'+(34+Math.sin(t)*30)+'px)';d.classList.toggle('on',i===a);d.setAttribute('aria-pressed',i===a)});
}
function setActive(n,focus){
 n=valid(n);if(n===st.active)return;
 if(n!==null)st.restore=n;else if(st.active!==null)st.restore=st.active;
 st.active=n;st.hover=null;ui();layout();
 if(focus){var t=n===null?btns[st.restore]:dots[n];if(t)t.focus({preventScroll:true})}
}
function step(dir,focus){var a=st.active;setActive(a===null?(dir>0?0:total-1):(a+dir+total)%total,focus)}

/* animation loop (paused offscreen / hidden tab / reduced motion) */
function tick(now){
 st.raf=0;if(!st.vis||document.hidden)return;
 var el=st.prev?Math.min(now-st.prev,64):0;st.prev=now;
 if(st.active===null&&(!st.changed||now-st.start>=FLIGHT)){
  if(st.playing&&!st.focusTrig)st.angle+=el/40000*TAU*(st.hover===null?1:.18);
  paint(false);
 }
 st.raf=requestAnimationFrame(tick);
}
function kick(){if(reduced||st.raf||!st.vis||document.hidden)return;st.prev=0;st.raf=requestAnimationFrame(tick)}
new IntersectionObserver(function(e){st.vis=e[0].isIntersecting;kick()}).observe(root);
document.addEventListener('visibilitychange',kick);
mq.addEventListener('change',function(){reduced=mq.matches;if(reduced)st.playing=false;ui();layout()});
new ResizeObserver(function(){var w=root.clientWidth,h=root.clientHeight;if(w===st.W&&h===st.H)return;st.W=w;st.H=h;sizing();layout();place()}).observe(root);

/* events */
btns.forEach(function(b,i){
 b.addEventListener('click',function(){setActive(i,true)});
 b.addEventListener('mouseenter',function(){st.hover=i;if(st.active===null)paint(false)});
 b.addEventListener('mouseleave',function(){st.hover=null;if(st.active===null)paint(false)});
});
act.addEventListener('click',function(e){
 if(e.target.closest('[data-back]'))setActive(null,true);
 else if(e.target.closest('[data-toggle]')){st.playing=!st.playing;ui();kick()}
});
root.querySelector('.o-nav').addEventListener('click',function(e){var b=e.target.closest('[data-step]');if(b)step(+b.getAttribute('data-step'),true)});
cap.addEventListener('click',function(e){if(e.target.closest('[data-more]')){openDetails(st.active);return}if(e.target.closest('[data-cta]')&&window.codiqTally){e.preventDefault();window.codiqTally(TID)}});
root.addEventListener('click',function(e){if(e.target===root&&st.active!==null)setActive(null,true)});
root.addEventListener('keydown',function(e){
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1,true)}
 else if(e.key==='Escape'&&st.active!==null){e.preventDefault();setActive(null,true)}
 else if(e.key==='Home'||e.key==='End'){e.preventDefault();setActive(e.key==='Home'?0:total-1,true)}
});
root.addEventListener('focusin',function(e){st.focusTrig=e.target.classList.contains('o-btn')&&e.target.matches(':focus-visible')});
root.addEventListener('focusout',function(){st.focusTrig=false});
dbox.addEventListener('click',function(e){var d=e.target.closest('[data-dot]');if(!d)return;if(!st.noclick)setActive(+d.getAttribute('data-dot'),true);st.noclick=false});
function ang(e){var r=dbox.getBoundingClientRect();return Math.atan2(e.clientY-r.top-50,e.clientX-r.left-94)}
dbox.addEventListener('pointerdown',function(e){if(e.button!==0)return;st.drag={angle:ang(e),acc:0,moved:false,x:e.clientX,y:e.clientY};st.noclick=false});
dbox.addEventListener('pointermove',function(e){
 var d=st.drag;if(!d)return;
 if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)return;
 if(!d.moved)dbox.setPointerCapture(e.pointerId);
 d.moved=true;st.noclick=true;
 var nx=ang(e);d.acc+=Math.atan2(Math.sin(nx-d.angle),Math.cos(nx-d.angle));d.angle=nx;
 if(Math.abs(d.acc)>=TAU/total){step(Math.sign(d.acc));d.acc=0}
});
['pointerup','pointercancel','lostpointercapture'].forEach(function(ev){dbox.addEventListener(ev,function(){st.drag=null})});

/* project details modal */
var pm=null,pmLast=null,pmT=0;
function visual(it){
 if(it.logo)return '<img class="pm-logo" src="/assets/img/aivus-logo-v1.png" alt="Aivus logo" width="360" height="369"><div class="pm-phones"><img src="/assets/img/aivus-app-v1.webp" alt="Aivus AI app screenshot" width="480" height="965"></div>';
 return '<div class="pm-phones">'+it.imgs.map(function(n){return '<img src="'+IMG+n+'-v1.webp" alt="'+it.title+' screenshot" width="480" height="1067">'}).join('')+'</div>';
}
function closeDetails(){
 if(!pm||pm.hidden)return;
 pm.classList.remove('show');document.documentElement.style.overflow='';
 clearTimeout(pmT);pmT=setTimeout(function(){pm.hidden=true},reduced?0:300);
 if(pmLast&&pmLast.focus)pmLast.focus({preventScroll:true});
}
function buildModal(){
 pm=document.createElement('div');pm.className='pm';pm.hidden=true;pm.setAttribute('role','dialog');pm.setAttribute('aria-modal','true');pm.setAttribute('aria-labelledby','pm-t');
 pm.innerHTML='<div class="pm-card"><button type="button" class="pm-x" aria-label="Close details">✕</button><div class="pm-body"></div></div>';
 document.body.appendChild(pm);
 pm.addEventListener('click',function(e){
  if(e.target===pm||e.target.closest('.pm-x')||e.target.closest('[data-close]')){closeDetails();return}
  if(e.target.closest('[data-cta]')&&window.codiqTally){e.preventDefault();closeDetails();window.codiqTally(TID)}
 });
 pm.addEventListener('keydown',function(e){
  if(e.key==='Escape'){e.preventDefault();closeDetails();return}
  if(e.key!=='Tab')return;
  var f=[].slice.call(pm.querySelectorAll('button,a[href]')).filter(function(x){return !x.disabled});if(!f.length)return;
  if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}
  else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}
 });
}
function openDetails(i){
 var it=ITEMS[i];if(!it||!it.features)return;if(!pm)buildModal();
 pmLast=document.activeElement;clearTimeout(pmT);
 pm.querySelector('.pm-body').innerHTML='<div class="pm-vis">'+visual(it)+'</div><div class="pm-info"><div class="tags">'+(it.status?'<span class="soon">'+it.status+'</span>':'')+it.tags.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div><h2 id="pm-t">'+it.title+'</h2><p class="pm-lead">'+it.lead+'</p><h3 class="pm-h">Key features</h3><div class="pm-feats">'+it.features.map(function(f){return '<div class="pm-f"><b>'+f[0]+'</b><span>'+f[1]+'</span></div>'}).join('')+'</div><h3 class="pm-h">Built with</h3><div class="pm-tech">'+it.tech.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div><div class="pm-cta"><a class="btn pri" href="/contact" data-cta>Build something like this →</a><button type="button" class="btn ghost" data-close>Close</button></div></div>';
 pm.querySelector('.pm-card').scrollTop=0;
 pm.hidden=false;document.documentElement.style.overflow='hidden';
 requestAnimationFrame(function(){pm.classList.add('show');pm.querySelector('.pm-x').focus()});
}

sizing();ui();layout();
})();
