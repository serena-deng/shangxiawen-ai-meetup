const mascot=document.querySelector('.mascot-interactive');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(mascot){
  mascot.addEventListener('pointermove',event=>{
    if(motion.matches||event.pointerType==='touch')return;
    const rect=mascot.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
    mascot.style.setProperty('--mx',`${Math.round(x*10)}px`);
    mascot.style.setProperty('--my',`${Math.round(y*8)}px`);
    mascot.style.setProperty('--mr',`${(x*3).toFixed(1)}deg`);
  });
  mascot.addEventListener('pointerleave',()=>{for(const key of ['--mx','--my','--mr'])mascot.style.removeProperty(key);});
  mascot.addEventListener('click',()=>{
    if(motion.matches)return;
    mascot.classList.remove('is-waving');
    void mascot.offsetWidth;
    mascot.classList.add('is-waving');
  });
  mascot.addEventListener('animationend',()=>mascot.classList.remove('is-waving'));
}
