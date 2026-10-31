/* ---------- Oscilloscope hero ---------- */
const cv=document.getElementById('scope'),cx=cv.getContext('2d');
let W,H,mx=.5,my=.5,t=0;
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){const r=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*r;cv.height=H*r;cx.setTransform(r,0,0,r,0,0)}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth;my=e.clientY/innerHeight});
function draw(){
 cx.clearRect(0,0,W,H);
 cx.strokeStyle='rgba(92,200,255,.07)';cx.lineWidth=1;
 for(let x=0;x<W;x+=48){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke()}
 for(let y=0;y<H;y+=48){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke()}
 const f=1+mx*7, a=(1-my)*H*.16+14, mid=H*.72;
 const waves=[[f,a,'rgba(92,200,255,.9)',2.5,0],[f*2,a*.45,'rgba(255,178,62,.85)',1.8,1.2],[f*.5,a*1.2,'rgba(0,98,155,.9)',3,2.4]];
 waves.forEach(([fr,am,col,lw,ph])=>{
  cx.beginPath();cx.strokeStyle=col;cx.lineWidth=lw;cx.shadowColor=col;cx.shadowBlur=14;
  for(let x=0;x<=W;x+=4){
   const y=mid+Math.sin(x/W*Math.PI*2*fr+t+ph)*am;
   x?cx.lineTo(x,y):cx.moveTo(x,y)}
  cx.stroke()});
 cx.shadowBlur=0;
 document.getElementById('fq').textContent=(f*50).toFixed(0);
 document.getElementById('am').textContent=(a/20).toFixed(1);
 if(!still){t+=.03;requestAnimationFrame(draw)}
}
draw();

/* ---------- Nav ---------- */
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
menu.onclick=e=>{if(e.target.tagName==='A')menu.classList.remove('open')};
const links=[...menu.querySelectorAll('a')];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('section').forEach(s=>spy.observe(s));

/* ---------- Counters ---------- */
const cs=new IntersectionObserver((es,o)=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);
 e.target.querySelectorAll('b').forEach(b=>{const n=+b.dataset.n;let i=0;const s=Math.max(1,n/40);
  const id=setInterval(()=>{i+=s;if(i>=n){i=n;clearInterval(id)}b.textContent=Math.round(i)+(n>=100?'+':'')},30)})}),{threshold:.4});
cs.observe(document.getElementById('stats'));

/* ---------- Events (sample data: edit freely) ---------- */
const events=[
 {d:'Nov 2026',t:'IEEE Day Celebration',p:'Quiz, project showcase and branch awards.',c:'Celebration'},
 {d:'Dec 2026',t:'24-Hour Hackathon',p:'Build solutions for real campus and community problems.',c:'Competition'},
 {d:'Jan 2027',t:'Intro to Embedded Systems',p:'Hands-on Arduino and sensors workshop for beginners.',c:'Workshop'},
 {d:'Feb 2027',t:'Industry Talk: Careers in AI',p:'Session with a working engineer, followed by Q&A.',c:'Talk'},
 {d:'Mar 2027',t:'Women in Engineering Summit',p:'Panels, mentoring circles and project demos.',c:'Talk'},
 {d:'Apr 2027',t:'Robotics Challenge',p:'Line followers and obstacle runners go head to head.',c:'Competition'}
];
const cats=['All',...new Set(events.map(e=>e.c))];
const fl=document.getElementById('filters'),tl=document.getElementById('tl');
tl.innerHTML=events.map(e=>`<article class="ev" data-c="${e.c}"><time>${e.d}</time><div><h3>${e.t}</h3><p>${e.p}</p><span class="tag">${e.c}</span></div></article>`).join('');
fl.innerHTML=cats.map((c,i)=>`<button class="chip" aria-pressed="${i===0}">${c}</button>`).join('');
fl.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;
 fl.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));
 tl.querySelectorAll('.ev').forEach(v=>v.hidden=b.textContent!=='All'&&v.dataset.c!==b.textContent)};

/* ---------- Join form ---------- */
const f=document.getElementById('form');
f.onsubmit=e=>{e.preventDefault();let ok=true;
 const chk=(id,bad,msg)=>{const el=document.getElementById(id),s=el.parentElement.querySelector('.err');
  const fail=bad(el.value.trim());s.textContent=fail?msg:'';if(fail)ok=false};
 chk('nm',v=>v.length<2,'Enter your full name.');
 chk('em',v=>!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),'Enter a valid email address.');
 chk('br',v=>!v,'Choose your branch of study.');
 if(ok){document.getElementById('ok').style.display='block';f.reset()}};
document.getElementById('yr').textContent=new Date().getFullYear();

/* ---------- Animated site background: signal network ---------- */
(()=>{const c=document.getElementById('bg'),x=c.getContext('2d');let w,h,n=[],m={x:-999,y:-999};
 function init(){const r=devicePixelRatio||1;w=innerWidth;h=innerHeight;c.width=w*r;c.height=h*r;x.setTransform(r,0,0,r,0,0);
  n=Array.from({length:Math.min(90,Math.floor(w*h/17000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
 addEventListener('resize',init);addEventListener('pointermove',e=>{m.x=e.clientX;m.y=e.clientY});init();
 function frame(){x.clearRect(0,0,w,h);
  for(const p of n){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
   const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<130){p.x+=dx/d*1.2;p.y+=dy/d*1.2}
   x.fillStyle='rgba(0,98,155,.5)';x.beginPath();x.arc(p.x,p.y,2.2,0,7);x.fill()}
  for(let i=0;i<n.length;i++)for(let j=i+1;j<n.length;j++){const d=Math.hypot(n[i].x-n[j].x,n[i].y-n[j].y);
   if(d<140){x.strokeStyle=`rgba(0,98,155,${.28*(1-d/140)})`;x.lineWidth=1;x.beginPath();x.moveTo(n[i].x,n[i].y);x.lineTo(n[j].x,n[j].y);x.stroke()}}
  if(!still)requestAnimationFrame(frame)}
 frame()})();

/* ---------- Button effects: magnetic pull + click ripple ---------- */
document.querySelectorAll('.btn,.chip,.peek a').forEach(b=>{
 if(b.classList.contains('btn')&&!still){
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();
   b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='')}
 b.addEventListener('click',e=>{const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),p=document.createElement('span');
  p.className='ripple';p.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
  b.appendChild(p);setTimeout(()=>p.remove(),600)})});