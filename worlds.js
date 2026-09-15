import * as THREE from './vendor/three.module.js';
import {destinations,pages} from './content.js';
const $=s=>document.querySelector(s);
export function createGame({theme,onVisit,onDiscover,visited}){
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
 const islands=destinations;
 const ocean=group(world), orbit=group(world);const anchors={ocean:[],orbit:[]};const animated=[];
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
  if(item.type===0){
   const mountain=ico(1.65,0x92a69c,g,.25,1.55,-1.5);mountain.scale.set(1.1,1.8,.9);
   for(const [x,z,s]of[[-2,-.9,1],[-1.5,-2,1.1],[1.1,-2.3,1.2],[2,-.8,.85],[1.8,1,.75],[-2,1.2,.7]])tree(g,x,z,s);
   const home=group(g,-.4,.62,.45);box(1.65,1.4,1.45,0xffebc4,home,0,.7,0);
   const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute([-1,1.4,.85, 1,1.4,.85, 0,2.1,.85, -1,1.4,-.85, 0,2.1,-.85, 1,1.4,-.85, -1,1.4,.85, 0,2.1,.85, 0,2.1,-.85, -1,1.4,.85, 0,2.1,-.85, -1,1.4,-.85, 1,1.4,.85, 1,1.4,-.85, 0,2.1,-.85, 1,1.4,.85, 0,2.1,-.85, 0,2.1,.85],3));roofGeo.computeVertexNormals();mesh(roofGeo,0xb96247,home,0,0,0,{side:THREE.DoubleSide});
   box(.36,.76,.05,0x715344,home,.25,.38,.74);box(.35,.36,.06,0x536e68,home,-.43,.87,.74);box(.15,.48,.06,0xf6ddb0,home,-.43,.87,.78);box(.36,.08,.06,0xf6ddb0,home,-.43,.86,.79);
   box(.3,.85,.3,0xd6b993,home,.5,1.8,-.25);
   for(let k=0;k<6;k++){const stone=ico(.17,0xe6d8b6,g,-.12,.70,1.5+k*.2,0);stone.scale.set(1,.24,1);}
  }else if(item.type===1){
   const lighthouse=group(g,0,.67,-.3);for(let k=0;k<5;k++)cylinder(.62-k*.055,.68-k*.055,.65,k%2===0?0xf8eccb:0xc76d55,lighthouse,0,.325+k*.65,0,16);
   cylinder(.84,.84,.16,0xc88564,lighthouse,0,3.35,0);cylinder(.49,.49,.68,0xffe4a0,lighthouse,0,3.74,0,12);mesh(new THREE.ConeGeometry(.72,.50,16),0xb45b45,lighthouse,0,4.32,0);
   for(let k=0;k<8;k++){const a=k*Math.PI/4;cylinder(.028,.028,.55,0x92573e,lighthouse,Math.cos(a)*.7,3.69,Math.sin(a)*.7,5);}
   mesh(new THREE.TorusGeometry(.7,.028,6,32),0x92573e,lighthouse,0,3.98,0).rotation.x=Math.PI/2;
   box(.30,.53,.03,0x6c6458,lighthouse,0,.33,.69);palm(g,-1.35,.5,.85);tree(g,1.1,-.85,.7);
  }else if(item.type===2){
   const art=mesh(new THREE.TorusGeometry(.93,.26,5,32),0xf4ecd8,g,0,2,0);art.rotation.y=-.25;box(1.65,.3,1,0xe9daba,g,0,.84,0);palm(g,-1.5,-.2,1);palm(g,1.35,.4,.75);
  }else if(item.type===3){
   cylinder(.24,.33,2.1,0x8f7150,g,.35,1.45,-.35,8);for(let k=0;k<9;k++){const a=k*2.4;ico(.78, [0x7d9b51,0x91ab59,0x688a50][k%3],g,.35+Math.cos(a)*.9,2.9+rand()*.6,-.35+Math.sin(a)*.8);}
   cylinder(.09,.13,1.1,0x846e51,g,-.7,1.05,1,7);box(.65,.57,.50,0xd8674b,g,-.7,1.65,1);box(.34,.055,.03,0xffdbb0,g,-.7,1.72,1.26);palm(g,-1.3,-1,.7);
  }else if(item.type===4){
   const lab=group(g,0,.72,0);box(2.3,1.5,1.7,0xeddfb8,lab,0,.75,0);box(2.7,.18,2.1,0x507d84,lab,0,1.55,0);
   for(let k=0;k<3;k++)box(.45,.58,.05,0x6c9694,lab,-.7+k*.7,.87,.87);
   const dish=mesh(new THREE.SphereGeometry(.72,18,9,0,Math.PI*2,0,Math.PI*.5),0xf4e5c9,lab,0,2,0,{side:THREE.DoubleSide});dish.rotation.z=.55;animated.push({object:dish,kind:'rotate'});cylinder(.08,.1,.7,0x747e70,lab,0,1.85,0);
   tree(g,-2,-1.6,1);tree(g,2,-1.3,1.25);
  }else if(item.type===5){
   for(let k=0;k<3;k++){const rack=group(g,-1.3+k*1.3,.78,0);box(.86,2.0,.75,0x496f73,rack,0,1,0);for(let q=0;q<5;q++){box(.63,.12,.025,0x264e55,rack,0,.3+q*.35,.39);ico(.035,0xe9ce70,rack,.23,.3+q*.35,.415,0);}}
   for(let k=0;k<4;k++)palm(g,Math.cos(k*1.57)*3,Math.sin(k*1.57)*2.5,.8);
  }else if(item.type===6){
   const campus=group(g,0,.8,0);box(3,1.7,1.7,0xf0dfb9,campus,0,.85,0);for(let k=0;k<5;k++)cylinder(.12,.15,1.9,0xffedc8,campus,-1.2+k*.6,.9,1,10);box(3.4,.25,2.4,0xc07d5b,campus,0,1.88,.2);mesh(new THREE.ConeGeometry(2.05,.85,4),0xc07d5b,campus,0,2.4,.2).rotation.y=Math.PI/4;tree(g,-2.7,0,1);tree(g,2.7,-.6,1.1);
  }else{
   const tower=group(g,.2,.7,-.2);cylinder(.65,.9,2.7,0xece0bf,tower,0,1.35,0,12);mesh(new THREE.ConeGeometry(.9,.8,12),0xbd7050,tower,0,3.04,0);const rotor=group(tower,0,2.35,.74);for(let k=0;k<4;k++){const blade=box(.2,2.8,.1,0xf0d7a3,rotor);blade.rotation.z=k*Math.PI/2;}animated.push({object:rotor,kind:'windmill'});palm(g,-2.1,1,1);tree(g,2,-1,1.3);
  }
  for(let k=0;k<6;k++){const a=k*Math.PI/3+.4;tree(g,Math.cos(a)*(item.r-1),Math.sin(a)*(item.r-1),.55+rand()*.4);}
 });
 const boat=group(ocean,2.8,.2,11.8);
 const hullShape=new THREE.Shape();hullShape.moveTo(-.48,-.85);hullShape.lineTo(.48,-.85);hullShape.lineTo(.58,.38);hullShape.quadraticCurveTo(.42,.94,0,1.2);hullShape.quadraticCurveTo(-.42,.94,-.58,.38);hullShape.closePath();
 const hull=mesh(new THREE.ExtrudeGeometry(hullShape,{depth:.38,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.08,bevelThickness:.07}),0xfff0cc,boat,0,.02,0);hull.rotation.x=-Math.PI/2;
 box(.71,.12,1.25,0xae7951,boat,0,.67,0);box(.65,.14,.18,0xe3bf83,boat,0,.81,-.43);cylinder(.04,.06,2.65,0x8b6846,boat,0,1.8,.2,8);
 const sailGeo=new THREE.BufferGeometry();sailGeo.setAttribute('position',new THREE.Float32BufferAttribute([.07,3.03,.20,.07,.95,.20,1.20,1.02,.20],3));sailGeo.computeVertexNormals();mesh(sailGeo,0xe98242,boat,0,0,0,{side:THREE.DoubleSide,roughness:.8});
 const smallSail=new THREE.BufferGeometry();smallSail.setAttribute('position',new THREE.Float32BufferAttribute([-.06,2.72,.22,-.06,1.05,.22,-.64,1.08,.22],3));smallSail.computeVertexNormals();mesh(smallSail,0xffedcc,boat,0,0,0,{side:THREE.DoubleSide});
 const wakes=[];for(let i=0;i<14;i++){const w=mesh(new THREE.RingGeometry(.22,.26,24),0xf6fff0,ocean,0,-.16,0,{transparent:true,opacity:0,side:THREE.DoubleSide});w.rotation.x=-Math.PI/2;w.visible=false;wakes.push(w);}
 const birds=[];for(let i=0;i<5;i++){const b=group(ocean,-6+i*4,5+rand()*3,-4+rand()*12);for(let s of[-1,1]){const wing=box(.65,.045,.16,0xfff4db,b,s*.25,0,0);wing.rotation.z=s*.22;}birds.push(b);}
 const starGeo=new THREE.BufferGeometry(),starPoints=[];for(let i=0;i<1800;i++)starPoints.push((rand()-.5)*190,(rand()-.2)*65,(rand()-.5)*190);starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPoints,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xd4dfff,size:.14,sizeAttenuation:true,toneMapped:false}));orbit.add(stars);
 const planets=[];
 islands.forEach((item,i)=>{const g=group(orbit,item.x,1,item.z);anchors.orbit.push(g);const p=ico(item.r*.78,[0xc57149,0xe2c69d,0x96c9dc,0xaf91d2,0x72a2a2,0xc2a476,0x789da5,0xad7f9e][i],g,0,1,0,2);p.material=p.material.clone();p.material.flatShading=true;p.material.needsUpdate=true;planets.push(p);
  if(i===1||i===5){for(let k=0;k<5;k++){const ring=mesh(new THREE.RingGeometry(item.r*.91+k*.17,item.r*.98+k*.17,100),k%2?0x9c8e7b:0xe7d2ac,g,0,1,0,{side:THREE.DoubleSide,transparent:true,opacity:.75});ring.rotation.set(-1.2,.3,.15);}}
  if(i===3||i===6){for(let k=0;k<12;k++){const a=k*2.4;const c=mesh(new THREE.ConeGeometry(.30,.9+rand(),5),0xc0a8ea,g,Math.cos(a)*1.35,1+rand()*1.4,Math.sin(a)*1.35);c.rotation.z=(rand()-.5)*1.5;}}
  for(let k=0;k<15;k++){const a=k/15*Math.PI*2;const stone=ico(.11+rand()*.2,[0x9d7058,0xded0af,0xa1c7da,0xc2a0d2][i%4],g,Math.cos(a)*(item.r+1),(rand()-.5)*1.4+1,Math.sin(a)*(item.r+1),0);stone.rotation.set(rand(),rand(),rand());}
 });
 const ship=group(orbit,2.8,1,11.8);const body=ico(.64,0xe8e4d9,ship);body.scale.set(.7,.55,1.7);box(1.9,.10,.65,0xd6d7d0,ship,0,-.15,-.15);const canopy=ico(.38,0x40617d,ship,0,.29,.15,2);canopy.scale.set(.72,.6,1.2);const engine=mesh(new THREE.ConeGeometry(.21,.9,12),0xffa24c,ship,0,0,-1.2,{emissive:0xf47724,emissiveIntensity:2});engine.rotation.x=-Math.PI/2;
 // Outlying reefs and moving wildlife make the space between destinations worth exploring.
 const reefs=[];
 for(let i=0;i<34;i++){const x=(rand()-.5)*95,z=(rand()-.5)*90;if(islands.some(d=>Math.hypot(x-d.x,z-d.z)<d.r+5)||Math.hypot(x,z-10)<8)continue;const g=group(ocean,x,0,z);const r=.6+rand()*1.6;cylinder(r*.8,r,.45,0xd9d5b0,g,0,-.06,0,8);for(let k=0;k<4;k++)ico(.3+rand()*.6,0x8ba69c,g,(rand()-.5)*r,.25,(rand()-.5)*r,0);reefs.push({x,z,r});}
 const dolphins=[];for(let i=0;i<4;i++){const g=group(ocean,-13+i*2,0,7);const body=ico(.45,0x447b85,g);body.scale.set(.55,.65,2);const fin=mesh(new THREE.ConeGeometry(.22,.42,3),0x477a7f,g,0,.38,-.15);dolphins.push(g);}
 const beacons=[];const beaconCoords=[[0,11],[-8,-8],[-15,-12],[8,-9],[14,-17],[29,-11],[26,18],[6,30],[-22,28],[-30,5],[-39,-1],[-14,10]];
 beaconCoords.forEach(([x,z],i)=>{const g=group(theme==='ocean'?ocean:orbit,x,.7,z);const m=mesh(new THREE.TorusGeometry(.34,.07,8,28),0xf3bd5d,g,0,.6,0,{emissive:0xcf8f22,emissiveIntensity:.4});cylinder(.05,.06,.65,0x917649,g,0,.1,0,6);beacons.push({g,m,x,z,taken:false,phase:i});});
 const lightBeam=mesh(new THREE.ConeGeometry(3.8,13,24,1,true),0xfff1b9,ocean,-22,4,-19,{transparent:true,opacity:.06,depthWrite:false,side:THREE.DoubleSide});lightBeam.rotation.z=Math.PI/2;
 ocean.visible=theme==='ocean';orbit.visible=theme==='orbit';scene.background=new THREE.Color(theme==='ocean'?0x9bdcdb:0x080f21);scene.fog=new THREE.Fog(scene.background,95,180);hemi.intensity=theme==='orbit'?1.9:2.6;sun.intensity=theme==='orbit'?3.3:4.2;hemi.color.set(theme==='orbit'?0xa4b5e3:0xe9fffb);
 const keys=new Set(),pulses=new Map(),listeners=[];const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let paused=reduced;
 const state={x:0,z:10,angle:Math.PI,zoom:1},cameraTarget=new THREE.Vector3(0,0,7);
 const pressed=k=>keys.has(k)||(pulses.get(k)||0)>performance.now();
 const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);listeners.push(()=>target.removeEventListener(event,fn,options));};
 let mobile=innerWidth<=700,near=null,shownId=null,dismissedId=null,last=performance.now(),elapsed=0,wakeTimer=0,wakeIndex=0,found=0,stopped=false,uiTimer=0;
 $('#world-name').textContent=theme==='ocean'?'Ocean / 群岛漫游':'Orbit / 星际航行';
 const markers=islands.map((d,i)=>{const b=document.createElement('button');b.className='marker';b.textContent=pages[d.id].label;b.setAttribute('aria-label','阅读 '+pages[d.id].label);b.onclick=()=>visit(d.id);$('#markers').append(b);return b;});
 function visit(id){keys.clear();pulses.clear();onVisit(id);refreshVisited();}
 function refreshVisited(){markers.forEach((b,i)=>b.classList.toggle('visited',visited.has(islands[i].id)));document.querySelectorAll('.map-point').forEach(b=>b.classList.toggle('visited',visited.has(b.dataset.id)));$('#discovery-count').textContent=`已阅读 ${visited.size} / 8 个地点`;}refreshVisited();
 function travel(id){const d=islands.find(d=>d.id===id);if(!d)return;state.x=d.x;state.z=d.z+d.r+2;state.angle=Math.PI;keys.clear();pulses.clear();$('#travel-status').textContent=`已抵达 ${pages[id].label} 附近`;} 
 $('#map-points').innerHTML='';islands.forEach((d,i)=>{const b=document.createElement('button');b.className='map-point';b.textContent=String(i+1);b.dataset.id=d.id;b.style.left=`${(d.x+50)}%`;b.style.top=`${(d.z+46)/.94}%`;b.setAttribute('aria-label',`前往 ${pages[d.id].label}`);b.title=pages[d.id].label;b.onclick=()=>travel(d.id);$('#map-points').append(b);});refreshVisited();
 $('#map-shell').classList.toggle('collapsed',mobile);function mapButton(){$('#map-toggle').textContent=$('#map-shell').classList.contains('collapsed')?'展开':'收起';$('#map-toggle').setAttribute('aria-expanded',String(!$('#map-shell').classList.contains('collapsed')));}mapButton();$('#map-toggle').onclick=()=>{$('#map-shell').classList.toggle('collapsed');mapButton();};
 function resize(){mobile=innerWidth<=700;const aspect=innerWidth/innerHeight,vertical=(mobile?27:28)/state.zoom;camera.left=-vertical*aspect/2;camera.right=vertical*aspect/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
 listen(window,'resize',resize);resize();
 $('#zoom-out').onclick=()=>{state.zoom=THREE.MathUtils.clamp(state.zoom-.15,.6,1.45);resize();};$('#zoom-in').onclick=()=>{state.zoom=THREE.MathUtils.clamp(state.zoom+.15,.6,1.45);resize();};
 $('#reset').onclick=()=>{state.x=0;state.z=10;state.angle=Math.PI;keys.clear();pulses.clear();};
 function motionUI(){$('#motion').textContent=paused?'恢复动画':'暂停动画';$('#motion').setAttribute('aria-pressed',String(paused));}motionUI();$('#motion').onclick=()=>{paused=!paused;motionUI();};
 // Keep proximity reading non-modal so keyboard and touch navigation stay available.
 const panel=$('#dock-prompt');
 function hidePanel(){if(panel.contains(document.activeElement))document.activeElement.blur();panel.hidden=true;}
 $('#dock-close').onclick=()=>{dismissedId=near?.id;hidePanel();};
 function updateProximity(overlay){
  // A wider exit radius prevents flicker when sailing along the boundary.
  if(!near||Math.hypot(state.x-near.x,state.z-near.z)>near.r+4)near=islands.find(d=>Math.hypot(state.x-d.x,state.z-d.z)<d.r+3)||null;
  const id=near?.id||null;
  if(id!==shownId){shownId=id;dismissedId=null;if(id){const p=pages[id];$('#dock-index').textContent=p.index;$('#dock-title').textContent=p.title;$('#dock-body').innerHTML=p.body;$('#dock-body').scrollTop=0;onDiscover(id);refreshVisited();}}
  if(!id||overlay||dismissedId===id)hidePanel();else panel.hidden=false;
 }

 const moveKeys=['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift'];
 listen(window,'keydown',e=>{if(document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();if(moveKeys.includes(k)){e.preventDefault();keys.add(k);pulses.set(k,performance.now()+130);}if((k==='enter'||k==='e')&&near&&e.target===document.body){e.preventDefault();visit(near.id);}});
 listen(window,'keyup',e=>keys.delete(e.key.toLowerCase()));listen(window,'blur',()=>{keys.clear();pulses.clear();});listen(document,'visibilitychange',()=>{keys.clear();pulses.clear();last=performance.now();});
 document.querySelectorAll('.touch-controls button').forEach(b=>{listen(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pulses.set(b.dataset.key,performance.now()+150);});for(const event of['pointerup','pointercancel','lostpointercapture'])listen(b,event,()=>keys.delete(b.dataset.key));});
 const raycaster=new THREE.Raycaster();let pointerStart=null;
 listen(renderer.domElement,'pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
 listen(renderer.domElement,'pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>10)return;raycaster.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);const hit=raycaster.intersectObjects(anchors[theme],true)[0];if(hit){let o=hit.object;while(o&&!anchors[theme].includes(o))o=o.parent;const i=anchors[theme].indexOf(o);if(i>=0)visit(islands[i].id);}});
 listen(renderer.domElement,'webglcontextlost',e=>{e.preventDefault();$('#game-fallback').hidden=false;});listen(renderer.domElement,'webglcontextrestored',()=>{$('#game-fallback').hidden=true;});
 const projected=new THREE.Vector3();
 renderer.setAnimationLoop(now=>{
  if(stopped)return;const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;const overlay=!!document.querySelector('dialog[open]');if(!paused&&!overlay)elapsed+=dt;
  const dx=Number(pressed('d')||pressed('arrowright'))-Number(pressed('a')||pressed('arrowleft'));const dz=Number(pressed('s')||pressed('arrowdown'))-Number(pressed('w')||pressed('arrowup'));const moving=!!(dx||dz)&&!overlay;
  if(moving){const len=Math.hypot(dx,dz),speed=(theme==='orbit'?11:8)*(pressed('shift')?1.7:1);let nx=state.x+dx/len*speed*dt,nz=state.z+dz/len*speed*dt;const obstacles=theme==='ocean'?[...islands,...reefs]:islands;for(const item of obstacles){const d=Math.hypot(nx-item.x,nz-item.z),bound=(theme==='ocean'?item.r:item.r*.8)+.7;if(d<bound){nx=item.x+(nx-item.x)/(d||1)*bound;nz=item.z+(nz-item.z)/(d||1)*bound;}}state.x=THREE.MathUtils.clamp(nx,-48,44);state.z=THREE.MathUtils.clamp(nz,-40,44);const target=Math.atan2(dx,dz);state.angle+=Math.atan2(Math.sin(target-state.angle),Math.cos(target-state.angle))*Math.min(1,dt*9);}
  cameraTarget.lerp(new THREE.Vector3(state.x,0,state.z-3),reduced?1:1-Math.exp(-dt*3));camera.position.set(cameraTarget.x,29,cameraTarget.z+34);camera.lookAt(cameraTarget);
  sun.position.set(state.x-12,25,state.z+8);sun.target.position.set(state.x,0,state.z);sun.target.updateMatrixWorld();
  boat.position.set(state.x,.13+Math.sin(elapsed*2.1)*.065,state.z);boat.rotation.set(Math.sin(elapsed*1.8)*.025,state.angle+Math.PI,Math.sin(elapsed*1.6)*.038);ship.position.set(state.x,1+Math.sin(elapsed*1.6)*.12,state.z);ship.rotation.y=state.angle;engine.scale.y=(moving?1.8:1)+Math.sin(elapsed*20)*.12;
  water.material.uniforms.time.value=elapsed;
  if(moving&&theme==='ocean'){wakeTimer+=dt;if(wakeTimer>.08){wakeTimer=0;const w=wakes[wakeIndex++%wakes.length];w.position.set(state.x-Math.sin(state.angle),-.16,state.z-Math.cos(state.angle));w.userData.life=1;w.visible=true;}}
  for(const w of wakes)if(w.visible){w.userData.life-=dt*.55;w.material.opacity=Math.max(0,w.userData.life*.5);w.scale.setScalar(1+(1-w.userData.life)*3);if(w.userData.life<=0)w.visible=false;}
  birds.forEach((b,i)=>{b.position.x=Math.sin(elapsed*.07+i*1.3)*24;b.position.z=Math.cos(elapsed*.09+i)*25;b.rotation.y=-elapsed*.09-i;b.children.forEach((w,k)=>w.rotation.z=(k?1:-1)*(.2+Math.sin(elapsed*3+i)*.16));});
  dolphins.forEach((d,i)=>{const t=elapsed*.65+i*.7;d.position.set(-12+Math.sin(t*.3)*4+i,Math.max(-.7,Math.sin(t)*1.1),10+Math.cos(t*.3)*7);d.rotation.set(Math.cos(t)*.4,t*.3,0);});
  animated.forEach(a=>{if(a.kind==='windmill')a.object.rotation.z=elapsed*.5;else a.object.rotation.y=elapsed*.3;});lightBeam.rotation.y=elapsed*.4;planets.forEach((p,i)=>p.rotation.y=elapsed*(.05+i*.009));stars.rotation.y=elapsed*.002;
  beacons.forEach(b=>{if(b.taken)return;b.g.position.y=.6+Math.sin(elapsed*1.9+b.phase)*.16;b.m.rotation.y=elapsed*1.3;if(Math.hypot(state.x-b.x,state.z-b.z)<1.2){b.taken=true;b.g.visible=false;found++;}});
  updateProximity(overlay);
  uiTimer+=dt;if(uiTimer>.15){uiTimer=0;$('#map-player').style.left=`${state.x+50}%`;$('#map-player').style.top=`${(state.z+46)/.94}%`;$('#map-player').setAttribute('aria-label',`当前位置 ${Math.round(state.x)}, ${Math.round(state.z)}`);$('#travel-status').textContent=mobile?`航标 ${found} / ${beacons.length}`:`WASD / 方向键 · Shift 加速 · 航标 ${found} / ${beacons.length}`;}
  scene.updateMatrixWorld();anchors[theme].forEach((g,i)=>{projected.set(0,theme==='ocean'?1.2:1,islands[i].r*.7);g.localToWorld(projected);projected.project(camera);const b=markers[i],x=(projected.x*.5+.5)*innerWidth,y=(-projected.y*.5+.5)*innerHeight;b.style.left=`${x}px`;b.style.top=`${y}px`;b.hidden=x<45||x>innerWidth-65||y<155||y>innerHeight-155||(x>innerWidth-215&&y<330&&!$('#map-shell').classList.contains('collapsed'));});
  renderer.render(scene,camera);
 });
 return {travel,refreshVisited,destroy(){stopped=true;renderer.setAnimationLoop(null);listeners.forEach(fn=>fn());scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});renderer.dispose();renderer.domElement.remove();$('#markers').innerHTML='';$('#map-points').innerHTML='';$('#dock-prompt').hidden=true;}};
}
