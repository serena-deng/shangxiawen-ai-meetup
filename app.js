const dialog=document.querySelector('#register');let lastFocus;document.querySelectorAll('[data-register]').forEach(button=>button.addEventListener('click',()=>{lastFocus=button;dialog.showModal()}));document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>lastFocus?.focus());

// Progressive enhancement: the original layout remains readable without animation.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.hero');
const sparkleLayer=document.createElement('div');sparkleLayer.className='sparkle-layer';sparkleLayer.setAttribute('aria-hidden','true');
for(let i=0;i<22;i++){const dot=document.createElement('i');dot.style.cssText=`--x:${18+(i*37%79)}%;--y:${8+(i*23%80)}%;--delay:${-(i*.71)}s;--duration:${5+i%5}s;--size:${i%4===0?4:2}px`;sparkleLayer.append(dot)}hero.append(sparkleLayer);
const motionToggle=document.createElement('button');motionToggle.className='motion-toggle';motionToggle.type='button';motionToggle.setAttribute('aria-label','切换页面动态效果');hero.append(motionToggle);
let effectsEnabled=!motionPreference.matches;
const reveals=[...document.querySelectorAll('.section-heading,.experience-list article,.manifesto h2,.manifesto .tags,.place-photos,.place-copy,.faq>div,.closing h2,.closing .primary')];
let observer;
function updateEffects(){document.body.classList.toggle('motion-on',effectsEnabled);motionToggle.textContent=effectsEnabled?'✦ 动效已开启':'✧ 动效已暂停';motionToggle.setAttribute('aria-pressed',String(effectsEnabled));if(!effectsEnabled){reveals.forEach(el=>el.classList.add('is-visible'));hero.style.removeProperty('--pointer-x');hero.style.removeProperty('--pointer-y')}}
motionToggle.addEventListener('click',()=>{effectsEnabled=!effectsEnabled;updateEffects()});motionPreference.addEventListener('change',()=>{effectsEnabled=!motionPreference.matches;updateEffects()});
if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}},{threshold:.12});reveals.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${el.matches('article')?(i%4)*65:0}ms`);observer.observe(el)})}
updateEffects();
if(matchMedia('(hover:hover) and (pointer:fine)').matches){hero.addEventListener('pointermove',e=>{if(!effectsEnabled)return;const r=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',`${(e.clientX-r.left-r.width/2)*.012}px`);hero.style.setProperty('--pointer-y',`${(e.clientY-r.top-r.height/2)*.012}px`)});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--pointer-x','0px');hero.style.setProperty('--pointer-y','0px')})}
