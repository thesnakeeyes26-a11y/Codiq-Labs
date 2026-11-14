(function(){
var $=function(i){return document.getElementById(i)},nav=$('nav');
$('burger').addEventListener('click',function(){var o=nav.classList.toggle('open');this.setAttribute('aria-expanded',o)});
/* MAGNETIC */
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.mag').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transition='transform .15s';el.style.transform='translate('+(e.clientX-r.left-r.width/2)*.3+'px,'+(e.clientY-r.top-r.height/2)*.3+'px) scale(1.04)'});
    el.addEventListener('mouseleave',function(){el.style.transition='transform .7s cubic-bezier(.2,1.6,.4,1)';el.style.transform=''});
  });
}

/* CURTAIN FOOTER scroll */
var rv=$('reveal'),gi=$('giant'),fh=$('fh'),fp=$('fp');
function clamp(v){return Math.max(0,Math.min(1,v))}
function onScroll(){if(!rv)return;
  var vh=window.innerHeight,top=rv.getBoundingClientRect().top,p=clamp(1-top/(vh*.8)),q=clamp((vh*.4-top)/(vh*.4));
  gi.style.transform='translate(-50%,'+(1-p)*10+'vh) scale('+(.8+.2*p)+')';gi.style.opacity=p;
  var a=clamp(q*1.25),b=clamp(q*1.25-.25);
  fh.style.transform='translateY('+(1-a)*50+'px)';fh.style.opacity=a;fp.style.transform='translateY('+(1-b)*50+'px)';fp.style.opacity=b;
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
if($('up'))$('up').addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})});


/* Tally: third-party script loads only when the visitor asks for the form */
function loadTally(cb){if(window.Tally)return cb();var s=document.createElement('script');s.src='https://tally.so/widgets/embed.js';s.onload=cb;s.onerror=function(){location.href='/contact'};document.head.appendChild(s)}
document.querySelectorAll('[data-tally-form]').forEach(function(a){a.addEventListener('click',function(e){
  e.preventDefault();var id=a.getAttribute('data-tally-form');
  loadTally(function(){Tally.openPopup(id,{layout:'modal',width:640,overlay:true,hideTitle:true,autoClose:0})})})});
window.codiqTally=function(id){loadTally(function(){Tally.openPopup(id,{layout:'modal',width:640,overlay:true,hideTitle:true,autoClose:0})})};
if(document.querySelector('iframe[data-tally-src]'))loadTally(function(){Tally.loadEmbeds()});

/* Navbar: hide on scroll down, show on scroll up */
var lastY=window.pageYOffset,tick=false;
function navScroll(){tick=false;var y=window.pageYOffset;
  if(nav.classList.contains('open')||y<90||y<lastY-6)nav.classList.remove('hide');
  else if(y>lastY+6)nav.classList.add('hide');
  lastY=y}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(navScroll)}},{passive:true});
nav.addEventListener('focusin',function(){nav.classList.remove('hide')});
onScroll();
})();
