import {pages,worlds,destinations} from './content.js';
import {createJourney} from './journey.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let selected='ocean',view='home',game=null,busy=false;
const visited=new Set();try{const saved=JSON.parse(localStorage.getItem('kade-discoveries-v2')||'[]');for(const id of saved)if(destinations.some(d=>d.id===id))visited.add(id);}catch{}
const journey=createJourney(),detail=$('#detail'),menu=$('#world-menu');
function recordDiscovery(id){visited.add(id);try{localStorage.setItem('kade-discoveries-v2',JSON.stringify([...visited]));}catch{}game?.refreshVisited();}
function openPage(id){const p=pages[id];if(!p)return;$('#detail-index').textContent=p.index;$('#detail-title').textContent=p.title;$('#detail-body').innerHTML=p.body;if(view==='game'){visited.add(id);try{localStorage.setItem('kade-discoveries-v2',JSON.stringify([...visited]));}catch{}game?.refreshVisited();}if(!detail.open)detail.showModal();}
$$('[data-page]').forEach(b=>b.onclick=()=>openPage(b.dataset.page));
$('#close').onclick=$('#return').onclick=()=>detail.close();
for(const dlg of[detail,menu])dlg.addEventListener('click',e=>{if(e.target!==dlg)return;const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg.close();});
$('#menu-open').onclick=()=>menu.showModal();$('[data-close-menu]').onclick=()=>menu.close();
function selectWorld(id){selected=id;document.body.dataset.theme=id;const w=worlds[id];$('#home-title').innerHTML=w.title;$('#home-description').textContent=w.description;$('#home-enter').firstChild.textContent=w.enter+' ';$('#entry-hint').textContent=w.hint;$$('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===id)));$$('[data-poster]').forEach(p=>p.classList.toggle('active',p.dataset.poster===id));document.title=`Kade Wu — ${w.name}`;}
function showHome(id=selected){game?.destroy();game=null;journey.stop();view='home';document.body.dataset.view='home';$('#game').hidden=true;$('#journey').hidden=true;$('#home').hidden=false;selectWorld(id);scrollTo(0,0);$('#home-enter').focus({preventScroll:true});}
$('#home-button').onclick=()=>{if(!busy)showHome();};$$('[data-home]').forEach(b=>b.onclick=()=>showHome());
$$('[data-select]').forEach(b=>b.onclick=()=>selectWorld(b.dataset.select));
$$('[data-menu-world]').forEach(b=>b.onclick=()=>{menu.close();showHome(b.dataset.menuWorld);});
$('#fallback-links').innerHTML=destinations.map(d=>`<button data-fallback="${d.id}">${pages[d.id].label}</button>`).join('');$$('[data-fallback]').forEach(b=>b.onclick=()=>openPage(b.dataset.fallback));
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
$('#home-enter').onclick=async()=>{if(busy)return;busy=true;$('#home-enter').disabled=true;$('#transition').classList.add('active');const target=selected;try{
 const worldModule=target==='journey'?null:await import('./worlds.js?v=glass-1');await delay(matchMedia('(prefers-reduced-motion: reduce)').matches?0:450);
 $('#home').hidden=true;$('#game-fallback').hidden=true;
 if(target==='journey'){view='journey';document.body.dataset.view='journey';$('#journey').hidden=false;journey.start();}
 else{view='game';document.body.dataset.view='game';$('#game').hidden=false;try{game=worldModule.createGame({theme:target,onVisit:openPage,onDiscover:recordDiscovery,visited});}catch(e){console.error('World initialization failed',e);$('#game-fallback').hidden=false;}}
 document.body.focus();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 }catch(e){console.error('Unable to enter world',e);showHome();$('#entry-hint').textContent='加载失败，请重试；也可从“关于我”阅读介绍。';}
 finally{$('#transition').classList.remove('active');busy=false;$('#home-enter').disabled=false;}
};
selectWorld('ocean');
