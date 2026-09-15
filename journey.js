const clamp=x=>Math.max(0,Math.min(1,x));
export function createJourney(){
 const root=document.querySelector('#journey'),career=document.querySelector('#career'),track=document.querySelector('#career-track'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=false,queued=false;
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});root.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
 function update(){queued=false;if(!active)return;const y=scrollY,range=Math.max(1,document.documentElement.scrollHeight-innerHeight);document.querySelector('.scroll-progress').style.transform=`scaleX(${clamp(y/range)})`;
 const hero=document.querySelector('.journey-hero');const h=clamp(y/hero.offsetHeight);if(!reduced)document.querySelector('.journey-art').style.transform=`translateY(${h*110}px) scale(${1+h*.15})`;
 const rect=career.getBoundingClientRect(),p=clamp(-rect.top/Math.max(1,career.offsetHeight-innerHeight)),available=Math.max(0,track.scrollWidth-(innerWidth*.9));track.style.transform=`translateX(${-p*available}px)`;document.querySelector('.career-line span').style.width=`${33.33+p*66.67}%`;document.querySelector('#career-step').textContent=`0${Math.min(3,Math.floor(p*2.99)+1)} / 03`;
 const skills=document.querySelector('.skills-section').getBoundingClientRect();if(!reduced)document.querySelector('.skills-marquee').style.transform=`translateX(${Math.max(-350,Math.min(0,(skills.top-innerHeight)*.23))}px)`;
 const contact=document.querySelector('.journey-contact').getBoundingClientRect();document.body.classList.toggle('journey-dark',(rect.top<65&&rect.bottom>65)||contact.top<65);
 }
 function request(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);
 function shift(direction){const start=career.offsetTop,span=career.offsetHeight-innerHeight,p=clamp((scrollY-start)/span),next=clamp(Math.round(p*2)/2+direction*.5);scrollTo({top:start+next*span,behavior:reduced?'instant':'smooth'});}
 document.querySelector('#career-next').onclick=()=>shift(1);document.querySelector('#career-prev').onclick=()=>shift(-1);
 return{start(){active=true;scrollTo(0,0);request();},stop(){active=false;document.body.classList.remove('journey-dark');},update};
}
