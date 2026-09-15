import * as THREE from './vendor/three.module.js';
import { pages } from './content.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dialog=$('#detail');
let theme='ocean', exploring=false, paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const keys=new Set(), pulses=new Map();
const pressed=k=>keys.has(k)||(pulses.get(k)||0)>performance.now();
function openPage(id){const p=pages[id];$('#detail-title').textContent=p.title;$('#detail-index').textContent=p.index;$('#detail-body').innerHTML=p.body;keys.clear();pulses.clear();if(!dialog.open)dialog.showModal();}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));
$('#close').onclick=$('#return').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

try { boot(); } catch(error){ console.error('3D world unavailable',error);$('#fallback').hidden=false;$('#instructions').textContent='Use the navigation to explore';$('#start').onclick=()=>openPage('about'); }

function boot(){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;$('#world').append(renderer.domElement);
 const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-20,20,15,-15,.1,160);
 camera.position.set(0,25,33);camera.lookAt(0,0,0);
 const hemi=new THREE.HemisphereLight(0xe9fffb,0x537568,2.6);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xfff0ca,4.2);sun.position.set(-12,25,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:90});sun.shadow.bias=-.0005;sun.shadow.normalBias=.08;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xb2e8ff,1);fill.position.set(10,7,-14);scene.add(fill);
 const world=new THREE.Group();scene.add(world);
 let seed=478;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
 const materials=new Map();
 function mat(color,extra={}){const key=color+JSON.stringify(extra);if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.76,...extra}));return materials.get(key);}
 function mesh(geo,color,parent,x=0,y=0,z=0,extra={}){const m=new THREE.Mesh(geo,mat(color,extra));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(w,h,d,c,p,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),c,p,x,y,z);
 const cylinder=(rt,rb,h,c,p,x=0,y=0,z=0,n=16)=>mesh(new THREE.CylinderGeometry(rt,rb,h,n),c,p,x,y,z);
 const ico=(r,c,p,x=0,y=0,z=0,d=1)=>mesh(new THREE.IcosahedronGeometry(r,d),c,p,x,y,z);
 const group=(p,x=0,y=0,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;};
 const islands=[{id:'about',x:0,z:-5.2,r:3.4},{id:'work',x:10.2,z:-2.8,r:2.6},{id:'notes',x:-2.3,z:5.2,r:2.6},{id:'contact',x:9,z:7,r:2.5}];
 const ocean=group(world), orbit=group(world), studio=group(world);const anchors={ocean:[],orbit:[],studio:[]};
 const water=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.ShaderMaterial({uniforms:{time:{value:0},deep:{value:new THREE.Color('#167e93')},shallow:{value:new THREE.Color('#68cbbc')}},vertexShader:`varying vec3 pos; void main(){pos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 pos;uniform float time;uniform vec3 deep;uniform vec3 shallow;void main(){vec2 p=pos.xy;float w=sin(p.x*.49+time*.32)*sin(p.y*.38-time*.25);float q=sin(p.x*1.3+sin(p.y*.9+time*.3))*sin(p.y*1.8-time*.5);float foam=pow(max(0.,q),18.)*.23;float glow=exp(-length(p-vec2(-14.,15.))*.023);vec3 c=mix(deep,shallow,.37+w*.09+glow*.17);c+=foam;gl_FragColor=vec4(c,1.);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')}));water.rotation.x=-Math.PI/2;water.position.y=-.25;water.receiveShadow=true;ocean.add(water);
 // Real 3D meshes are intentional: a flat concept bitmap cannot support free navigation and view changes.
 function tree(parent,x,z,size=1){const g=group(parent,x,.55,z);cylinder(.1,.16,1.1*size,0x806044,g,0,.5*size,0,7);for(let i=0;i<3;i++){const t=mesh(new THREE.ConeGeometry((.75-i*.12)*size,(1.2-i*.1)*size,7),[0x467653,0x56844e,0x789754][i],g,0,(1.2+i*.45)*size,0);t.rotation.y=rand()*3;}return g;}
 function palm(parent,x,z,s=1){const g=group(parent,x,.5,z);const trunk=cylinder(.10*s,.16*s,1.9*s,0x95724f,g,0,.95*s,0,7);trunk.rotation.z=.12;for(let i=0;i<7;i++){const leaf=mesh(new THREE.SphereGeometry(1,6,4),0x628e45,g,Math.cos(i*.9)*.6*s,1.85*s,Math.sin(i*.9)*.6*s);leaf.scale.set(1.05*s,.10*s,.29*s);leaf.rotation.set(0,-i*.9,.3);}return g;}
 function dock(parent,r){const g=group(parent,0,.37,r+.8);for(let i=0;i<10;i++)box(1.35,.10,.24,0xb79567,g,0,0,i*.26-.9);for(const x of[-.58,.58])for(const z of[-.9,1.35])cylinder(.07,.08,.8,0x886649,g,x,-.15,z,6);}
 islands.forEach((item,i)=>{
  const g=group(ocean,item.x,0,item.z);anchors.ocean.push(g);
  const base=cylinder(item.r*.93,item.r,.85,0xecdab1,g,0,.07,0,15);base.rotation.y=.2;
  const lawn=cylinder(item.r*.76,item.r*.90,.20,0xa7b976,g,0,.57,0,15);lawn.rotation.y=.2;
  const ring=mesh(new THREE.RingGeometry(item.r+.22,item.r+.32,64),0xd7f5df,g,0,-.19,0,{transparent:true,opacity:.64,side:THREE.DoubleSide});ring.rotation.x=-Math.PI/2;
  for(let k=0;k<13;k++){const a=k/13*Math.PI*2;const rock=ico(.35+rand()*.4,[0xa6aaa0,0xc0c1aa,0x929e98][k%3],g,Math.cos(a)*(item.r-.18),.28,Math.sin(a)*(item.r-.18));rock.scale.set(1.2,.9,1);rock.rotation.set(rand(),rand(),rand());}
  for(let k=0;k<12;k++){let x=(rand()-.5)*item.r*1.8,z=(rand()-.5)*item.r*1.5;if(Math.abs(x)<1&&Math.abs(z)<1)continue;const bush=ico(.25+rand()*.35,[0x839b59,0x90a25a,0x738f50][k%3],g,x,.85,z);bush.scale.y=.85;}
  dock(g,item.r-.4);
  if(i===0){
   const mountain=ico(1.65,0x92a69c,g,.25,1.55,-1.5);mountain.scale.set(1.1,1.8,.9);
   for(const [x,z,s]of[[-2,-.9,1],[-1.5,-2,1.1],[1.1,-2.3,1.2],[2,-.8,.85],[1.8,1,.75],[-2,1.2,.7]])tree(g,x,z,s);
   const home=group(g,-.4,.62,.45);box(1.65,1.4,1.45,0xffebc4,home,0,.7,0);
   const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute([-1,1.4,.85, 1,1.4,.85, 0,2.1,.85, -1,1.4,-.85, 0,2.1,-.85, 1,1.4,-.85, -1,1.4,.85, 0,2.1,.85, 0,2.1,-.85, -1,1.4,.85, 0,2.1,-.85, -1,1.4,-.85, 1,1.4,.85, 1,1.4,-.85, 0,2.1,-.85, 1,1.4,.85, 0,2.1,-.85, 0,2.1,.85],3));roofGeo.computeVertexNormals();mesh(roofGeo,0xb96247,home,0,0,0,{side:THREE.DoubleSide});
   box(.36,.76,.05,0x715344,home,.25,.38,.74);box(.35,.36,.06,0x536e68,home,-.43,.87,.74);box(.15,.48,.06,0xf6ddb0,home,-.43,.87,.78);box(.36,.08,.06,0xf6ddb0,home,-.43,.86,.79);
   box(.3,.85,.3,0xd6b993,home,.5,1.8,-.25);
   for(let k=0;k<6;k++){const stone=ico(.17,0xe6d8b6,g,-.12,.70,1.5+k*.2,0);stone.scale.set(1,.24,1);}
  }else if(i===1){
   const lighthouse=group(g,0,.67,-.3);for(let k=0;k<5;k++)cylinder(.62-k*.055,.68-k*.055,.65,k%2===0?0xf8eccb:0xc76d55,lighthouse,0,.325+k*.65,0,16);
   cylinder(.84,.84,.16,0xc88564,lighthouse,0,3.35,0);cylinder(.49,.49,.68,0xffe4a0,lighthouse,0,3.74,0,12);mesh(new THREE.ConeGeometry(.72,.50,16),0xb45b45,lighthouse,0,4.32,0);
   for(let k=0;k<8;k++){const a=k*Math.PI/4;cylinder(.028,.028,.55,0x92573e,lighthouse,Math.cos(a)*.7,3.69,Math.sin(a)*.7,5);}
   mesh(new THREE.TorusGeometry(.7,.028,6,32),0x92573e,lighthouse,0,3.98,0).rotation.x=Math.PI/2;
   box(.30,.53,.03,0x6c6458,lighthouse,0,.33,.69);palm(g,-1.35,.5,.85);tree(g,1.1,-.85,.7);
  }else if(i===2){
   const art=mesh(new THREE.TorusGeometry(.93,.26,5,32),0xf4ecd8,g,0,2,0);art.rotation.y=-.25;box(1.65,.3,1,0xe9daba,g,0,.84,0);palm(g,-1.5,-.2,1);palm(g,1.35,.4,.75);
  }else{
   cylinder(.24,.33,2.1,0x8f7150,g,.35,1.45,-.35,8);for(let k=0;k<9;k++){const a=k*2.4;ico(.78, [0x7d9b51,0x91ab59,0x688a50][k%3],g,.35+Math.cos(a)*.9,2.9+rand()*.6,-.35+Math.sin(a)*.8);}
   cylinder(.09,.13,1.1,0x846e51,g,-.7,1.05,1,7);box(.65,.57,.50,0xd8674b,g,-.7,1.65,1);box(.34,.055,.03,0xffdbb0,g,-.7,1.72,1.26);palm(g,-1.3,-1,.7);
  }
 });
 const boat=group(ocean,2.8,.2,11.8);
 const hullShape=new THREE.Shape();hullShape.moveTo(-.48,-.85);hullShape.lineTo(.48,-.85);hullShape.lineTo(.58,.38);hullShape.quadraticCurveTo(.42,.94,0,1.2);hullShape.quadraticCurveTo(-.42,.94,-.58,.38);hullShape.closePath();
 const hull=mesh(new THREE.ExtrudeGeometry(hullShape,{depth:.38,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.08,bevelThickness:.07}),0xfff0cc,boat,0,.2,0);hull.rotation.x=-Math.PI/2;
 box(.71,.12,1.25,0xae7951,boat,0,.67,0);box(.65,.14,.18,0xe3bf83,boat,0,.81,-.43);cylinder(.04,.06,2.65,0x8b6846,boat,0,1.8,.2,8);
 const sailGeo=new THREE.BufferGeometry();sailGeo.setAttribute('position',new THREE.Float32BufferAttribute([.07,3.03,.20,.07,.95,.20,1.20,1.02,.20],3));sailGeo.computeVertexNormals();mesh(sailGeo,0xe98242,boat,0,0,0,{side:THREE.DoubleSide,roughness:.8});
 const smallSail=new THREE.BufferGeometry();smallSail.setAttribute('position',new THREE.Float32BufferAttribute([-.06,2.72,.22,-.06,1.05,.22,-.64,1.08,.22],3));smallSail.computeVertexNormals();mesh(smallSail,0xffedcc,boat,0,0,0,{side:THREE.DoubleSide});
 const wakes=[];for(let i=0;i<14;i++){const w=mesh(new THREE.RingGeometry(.22,.26,24),0xf6fff0,ocean,0,-.16,0,{transparent:true,opacity:0,side:THREE.DoubleSide});w.rotation.x=-Math.PI/2;w.visible=false;wakes.push(w);}
 const birds=[];for(let i=0;i<5;i++){const b=group(ocean,-6+i*4,5+rand()*3,-4+rand()*12);for(let s of[-1,1]){const wing=box(.65,.045,.16,0xfff4db,b,s*.25,0,0);wing.rotation.z=s*.22;}birds.push(b);}
 const starGeo=new THREE.BufferGeometry(),starPoints=[];for(let i=0;i<950;i++)starPoints.push((rand()-.5)*120,(rand()-.2)*65,(rand()-.5)*100);starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPoints,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xd4dfff,size:.14,sizeAttenuation:true,toneMapped:false}));orbit.add(stars);
 const planets=[];
 islands.forEach((item,i)=>{const g=group(orbit,item.x,1,item.z);anchors.orbit.push(g);const p=ico([2.55,2.15,2.05,1.85][i],[0xc57149,0xe2c69d,0x96c9dc,0xaf91d2][i],g,0,1,0,2);p.material=p.material.clone();p.material.flatShading=true;p.material.needsUpdate=true;planets.push(p);
  if(i===1){for(let k=0;k<5;k++){const ring=mesh(new THREE.RingGeometry(2.65+k*.16,2.75+k*.16,100),k%2?0x9c8e7b:0xe7d2ac,g,0,1,0,{side:THREE.DoubleSide,transparent:true,opacity:.75});ring.rotation.set(-1.2,.3,.15);}}
  if(i===3){for(let k=0;k<12;k++){const a=k*2.4;const c=mesh(new THREE.ConeGeometry(.30,.9+rand(),5),0xc0a8ea,g,Math.cos(a)*1.35,1+rand()*1.4,Math.sin(a)*1.35);c.rotation.z=(rand()-.5)*1.5;}}
  for(let k=0;k<15;k++){const a=k/15*Math.PI*2;const stone=ico(.11+rand()*.2,[0x9d7058,0xded0af,0xa1c7da,0xc2a0d2][i],g,Math.cos(a)*3.25,(rand()-.5)*1.4+1,Math.sin(a)*3.25,0);stone.rotation.set(rand(),rand(),rand());}
 });
 const ship=group(orbit,2.8,1,11.8);const body=ico(.64,0xe8e4d9,ship);body.scale.set(.7,.55,1.7);box(1.9,.10,.65,0xd6d7d0,ship,0,-.15,-.15);const canopy=ico(.38,0x40617d,ship,0,.29,.15,2);canopy.scale.set(.72,.6,1.2);const engine=mesh(new THREE.ConeGeometry(.21,.9,12),0xffa24c,ship,0,0,-1.2,{emissive:0xf47724,emissiveIntensity:2});engine.rotation.x=-Math.PI/2;
 const floor=mesh(new THREE.PlaneGeometry(200,200),0xe6cfc4,studio,0,-.2,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 const sculptures=[];
 islands.forEach((item,i)=>{const g=group(studio,item.x,.05,item.z);anchors.studio.push(g);cylinder(2.05,2.08,1,0xf8eadb,g,0,.35,0,64);let art;
 if(i===0)art=mesh(new THREE.TorusKnotGeometry(1.12,.36,120,18),0xc27542,g,0,2.3,0,{metalness:.72,roughness:.25});
 if(i===1){art=group(g,0,1.6,0);for(let k=0;k<5;k++){const c=mesh(new THREE.OctahedronGeometry(.9,0),0xb5a0cf,art,(rand()-.5)*1.2,rand()*.5,(rand()-.5)*1.2,{metalness:.2,roughness:.13});c.scale.y=1.8;}}
 if(i===2){art=group(g,0,2.0,0);for(let k=0;k<3;k++){const ring=mesh(new THREE.TorusGeometry(1.15,.17,14,72),0x8bb9ce,art);ring.rotation.set(k*1.05,k*.83,.4);}}
 if(i===3){art=group(g,0,2.1,0);ico(1.23,0x333948,art,0,0,0,4);for(let k=0;k<2;k++){const ring=mesh(new THREE.TorusGeometry(1.73,.035,8,96),0xb28c61,art);ring.rotation.set(.4+k*1.1,.2,.35);ico(.17,0xd1a26e,art,1.6,0,.4,2);}}
 sculptures.push(art);
 });
 const cursor=new THREE.Vector2();const raycaster=new THREE.Raycaster();let dragging=false,lastX=0,dragDistance=0;
 renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;dragDistance=0;renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{cursor.set(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1);if(dragging&&theme==='studio'){const dx=e.clientX-lastX;dragDistance+=Math.abs(dx);sculptures.forEach(a=>a.rotation.y+=dx*.009);lastX=e.clientX;}});
 renderer.domElement.addEventListener('pointerup',e=>{dragging=false;if(dragDistance>8)return;raycaster.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);const hit=raycaster.intersectObjects(anchors[theme],true)[0];if(hit){let o=hit.object;while(o&&!anchors[theme].includes(o))o=o.parent;const i=anchors[theme].indexOf(o);if(i>=0)openPage(islands[i].id);}});
 renderer.domElement.addEventListener('pointercancel',()=>{dragging=false;});
 const markerButtons=islands.map(item=>{const b=document.createElement('button');b.className='marker';b.textContent=pages[item.id].label;b.setAttribute('aria-label',`探索 ${pages[item.id].label}`);b.onclick=()=>openPage(item.id);$('#markers').append(b);return b;});
 let mobile=innerWidth<=700,elapsed=0,last=performance.now(),wakeTimer=0,wakeIndex=0,near=null;
 const state={x:2.8,z:11.8,angle:Math.PI*.25};
 function resize(){mobile=innerWidth<=700;const aspect=innerWidth/innerHeight,vertical=mobile?43:26;camera.left=-vertical*aspect/2;camera.right=vertical*aspect/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(mobile){camera.position.set(3.5,28,36);camera.lookAt(3.5,0,2);world.scale.setScalar(.9);world.position.set(0,-5,4);}else{camera.position.set(-4,25,33);camera.lookAt(-4,0,1);world.scale.setScalar(1);world.position.set(0,0,0);}}
 addEventListener('resize',resize);resize();
 function reset(){state.x=2.8;state.z=11.8;state.angle=Math.PI*.25;exploring=false;document.body.classList.remove('exploring');$('#explore-message').hidden=true;$('#dock').hidden=true;keys.clear();pulses.clear();}
 function setTheme(t){theme=t;document.body.dataset.theme=t;ocean.visible=t==='ocean';orbit.visible=t==='orbit';studio.visible=t==='studio';scene.background=new THREE.Color({ocean:0x9bdcdb,orbit:0x080f21,studio:0xefdad0}[t]);scene.fog=new THREE.Fog(scene.background,65,145);hemi.intensity=t==='orbit'?1.9:2.6;sun.intensity=t==='orbit'?3.3:4.2;hemi.color.set(t==='orbit'?0xa4b5e3:0xe9fffb);hemi.groundColor.set(t==='orbit'?0x292640:0x537568);sun.color.set(t==='studio'?0xffdabd:0xfff0ca);$$('.themes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===t)));$('#instructions').innerHTML=t==='studio'?'Drag to rotate · Click a sculpture':`<span class="keys">W A S D</span><span>/ Arrow keys to ${t==='ocean'?'sail':'fly'}</span>`;reset();}
 $$('.themes button').forEach(b=>b.onclick=()=>setTheme(b.dataset.theme));setTheme('ocean');
 $('#start').onclick=()=>{if(theme==='studio'){openPage('about');return;}exploring=true;document.body.classList.add('exploring');$('#explore-message').textContent=theme==='ocean'?'驶向一座岛，或者点击它的名字。':'飞向一颗星球，或者点击它的名字。';$('#explore-message').hidden=false;};
 $('#reset').onclick=reset;
 function motionUI(){$('#motion').textContent=paused?'Resume motion':'Pause motion';$('#motion').setAttribute('aria-pressed',String(paused));}motionUI();$('#motion').onclick=()=>{paused=!paused;motionUI();};
 const moveKeys=['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'];
 addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(dialog.open)return;if(moveKeys.includes(k)){e.preventDefault();keys.add(k);pulses.set(k,performance.now()+120);if(!exploring&&theme!=='studio')$('#start').click();}if((k==='e'||k==='enter')&&near&&exploring){e.preventDefault();openPage(near.id);}});
 addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();pulses.clear();last=performance.now();});
 $$('.touch-controls button').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pulses.set(b.dataset.key,performance.now()+120);};for(const event of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});
 $('#dock').onclick=()=>{if(near)openPage(near.id);};
 const projected=new THREE.Vector3();
 renderer.setAnimationLoop(now=>{
  const dt=Math.min((now-last)/1000,.04);last=now;if(document.hidden)return;if(!paused&&!dialog.open)elapsed+=dt;
  const dx=Number(pressed('d')||pressed('arrowright'))-Number(pressed('a')||pressed('arrowleft'));
  const dz=Number(pressed('s')||pressed('arrowdown'))-Number(pressed('w')||pressed('arrowup'));
  const moving=(dx||dz)&&!dialog.open&&theme!=='studio';
  if(moving){const len=Math.hypot(dx,dz),speed=theme==='orbit'?6:4.5;let nx=state.x+dx/len*speed*dt,nz=state.z+dz/len*speed*dt;for(const item of islands){const d=Math.hypot(nx-item.x,nz-item.z),bound=theme==='ocean'?item.r+.65:2.9;if(d<bound){nx=item.x+(nx-item.x)/(d||1)*bound;nz=item.z+(nz-item.z)/(d||1)*bound;}}state.x=THREE.MathUtils.clamp(nx,-9,16);state.z=THREE.MathUtils.clamp(nz,-11,16);const target=Math.atan2(dx,dz);state.angle+=Math.atan2(Math.sin(target-state.angle),Math.cos(target-state.angle))*Math.min(1,dt*7);}
  boat.position.set(state.x,.13+Math.sin(elapsed*2.1)*.055,state.z);boat.rotation.set(Math.sin(elapsed*1.8)*.028,state.angle,Math.sin(elapsed*1.6)*.035);
  ship.position.set(state.x,1+Math.sin(elapsed*1.6)*.12,state.z);ship.rotation.y=state.angle;engine.scale.y=1+Math.sin(elapsed*20)*.12;
  water.material.uniforms.time.value=elapsed;
  if(moving&&theme==='ocean'){wakeTimer+=dt;if(wakeTimer>.09){wakeTimer=0;const w=wakes[wakeIndex++%wakes.length];w.position.set(state.x-Math.sin(state.angle)*.85,-.16,state.z-Math.cos(state.angle)*.85);w.userData.life=1;w.visible=true;}}
  for(const w of wakes){if(w.visible){w.userData.life-=dt*.5;w.material.opacity=Math.max(0,w.userData.life*.5);w.scale.setScalar(1+(1-w.userData.life)*3);if(w.userData.life<=0)w.visible=false;}}
  birds.forEach((b,i)=>{b.position.x=-4+Math.sin(elapsed*.12+i*1.3)*10;b.position.z=1+Math.cos(elapsed*.12+i)*8;b.rotation.y=-elapsed*.12-i;b.children.forEach((w,k)=>w.rotation.z=(k?1:-1)*(.2+Math.sin(elapsed*3+i)*.16));});
  planets.forEach((p,i)=>{p.rotation.y=elapsed*(.05+i*.009);});stars.rotation.y=elapsed*.004;
  if(!dragging)sculptures.forEach((a,i)=>{if(!paused&&!dialog.open)a.rotation.y+=dt*(.12+i*.025);});
  near=null;if(exploring&&theme!=='studio'){for(const item of islands)if(Math.hypot(state.x-item.x,state.z-item.z)<item.r+2.3){near=item;break;}}
  $('#dock').hidden=!near||dialog.open;if(near)$('#dock').textContent=`探索 ${pages[near.id].label} ↗${mobile?'':'  ·  Enter'}`;
  scene.updateMatrixWorld();
  anchors[theme].forEach((g,i)=>{projected.set(0,theme==='ocean'?1.1:1,islands[i].r*.75);g.localToWorld(projected);projected.project(camera);const b=markerButtons[i];const x=(projected.x*.5+.5)*innerWidth,y=(-projected.y*.5+.5)*innerHeight;b.style.left=`${Math.max(42,Math.min(innerWidth-42,x))}px`;b.style.top=`${y}px`;b.hidden=y<85||y>innerHeight-82;});
  renderer.render(scene,camera);
 });
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#fallback').hidden=false;});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{$('#fallback').hidden=true;});
}
