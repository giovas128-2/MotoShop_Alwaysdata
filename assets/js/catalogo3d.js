/* MotoShop · Tabla periódica 3D con productos ilustrativos. */
import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import {CSS3DRenderer,CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';
import {TrackballControls} from 'three/addons/controls/TrackballControls.js';

let current=null;
const formatMoney=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cleanUp(){
 if(!current)return;
 current.resizeObserver.disconnect();
 current.intersectionObserver?.disconnect();
 window.cancelAnimationFrame(current.frameId);
 current.controls.dispose();
 current.tweens.removeAll();
 current.renderer.domElement.remove();
 current=null;
}
function targetAt(position,lookAt){
 const t=new THREE.Object3D();
 t.position.copy(position);
 if(lookAt)t.lookAt(lookAt);
 return t;
}
function start3D(products){
 const stage=document.getElementById('ms3d-stage');
 const wrapper=document.getElementById('ms3d');
 if(!stage||!wrapper){cleanUp();return;}
 if(current?.stage===stage)return;
 cleanUp();
 if(!products?.length){
  stage.querySelector('.ms3d-fallback').textContent='No hay productos activos en esta tienda.';
  return;
 }
 const catalog=products.slice(0,120);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(45,1,1,11000);
 camera.position.set(0,0,2500);
 const renderer=new CSS3DRenderer();
 renderer.domElement.style.position='absolute';
 renderer.domElement.style.top='0';
 renderer.domElement.style.left='0';
 stage.append(renderer.domElement);
 const controls=new TrackballControls(camera,renderer.domElement);
 controls.minDistance=660;controls.maxDistance=6800;
 controls.rotateSpeed=1.05;controls.panSpeed=.65;controls.zoomSpeed=.95;
 controls.staticMoving=false;controls.dynamicDampingFactor=.15;
 const tweens=new TWEEN.Group();
 const cards=[], layouts={table:[],sphere:[],helix:[],grid:[]};
 let mode='sphere',focused=null,visible=true;
 const session={stage,renderer,controls,tweens,resizeObserver:null,intersectionObserver:null,frameId:0};
 current=session;
 const make=(tag,cls,txt)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(txt!==undefined)el.textContent=txt;
  return el;
 };
 const setStatus=txt=>{const el=document.getElementById('ms3d-status');if(el)el.textContent=txt;};
 const ease=TWEEN.Easing.Exponential.InOut;
 function move(obj,t,duration){
  const d=reducedMotion?1:duration;
  new TWEEN.Tween(obj.position,tweens).to({x:t.position.x,y:t.position.y,z:t.position.z},d).easing(ease).start();
  new TWEEN.Tween(obj.rotation,tweens).to({x:t.rotation.x,y:t.rotation.y,z:t.rotation.z},d).easing(ease).start();
 }
 function restore(){
  if(!focused)return;
  const r=focused;
  focused=null;
  r.el.classList.remove('ms3d-active');
  r.el.style.zIndex='';
  move(r.obj,layouts[mode][r.index],reducedMotion?1:620);
  new TWEEN.Tween(r.obj.scale,tweens).to({x:1,y:1,z:1},reducedMotion?1:620).easing(ease).start();
  controls.enabled=true;
  setStatus('Ficha devuelta a la animación · Selecciona otro producto');
 }
 function focus(r){
  if(focused===r)return;
  if(focused)restore();
  focused=r;controls.enabled=false;
  const forward=camera.getWorldDirection(new THREE.Vector3());
  const t=targetAt(camera.position.clone().add(forward.multiplyScalar(stage.clientWidth<640?850:735)));
  t.quaternion.copy(camera.quaternion);
  move(r.obj,t,700);
  const scale=stage.clientWidth<640?1.17:1.62;
  new TWEEN.Tween(r.obj.scale,tweens).to({x:scale,y:scale,z:scale},reducedMotion?1:700).easing(ease).start();
  r.el.classList.add('ms3d-active');
  r.el.style.zIndex='9999';
  setStatus('Ficha ampliada · Comprar añade el producto al carrito · Cancelar lo regresa');
 }
 for(let i=0;i<catalog.length;i++){
  const product=catalog[i];
  const card=make('div','ms3d-card');
  card.setAttribute('role','button');card.setAttribute('tabindex','0');
  card.setAttribute('aria-label','Mostrar detalles de '+product.nombre);
  card.append(make('span','ms3d-number',String(i+1).padStart(3,'0')));
  const visual=make('div','ms3d-visual');
  if(product.imagen){
   const img=make('img');img.src=product.imagen;img.alt=product.nombre;img.loading='lazy';visual.append(img);
  }else{
   visual.append(make('span','ms3d-emoji',product.emoji||'🏍️'));
  }
  card.append(visual);
  card.append(make('div','ms3d-name',product.nombre));
  card.append(make('div','ms3d-price',formatMoney.format(product.precio)));
  card.append(make('div','ms3d-type',product.categoria));
  const detail=make('div','ms3d-detail');
  detail.append(make('p','ms3d-description',product.descripcion||'Producto de demostración.'));
  const actions=make('div','ms3d-actions');
  const buy=make('button','ms3d-buy',product.stock>0?'Comprar':'Sin stock');
  buy.type='button';buy.disabled=product.stock<=0;
  const cancel=make('button','ms3d-cancel','Cancelar');cancel.type='button';
  actions.append(buy,cancel);detail.append(actions);card.append(detail);
  const obj=new CSS3DObject(card);
  obj.position.set((Math.random()-.5)*3200,(Math.random()-.5)*3200,(Math.random()-.5)*3200);
  scene.add(obj);
  const record={index:i,obj,el:card,product};cards.push(record);
  card.addEventListener('pointerdown',ev=>ev.stopPropagation());
  card.addEventListener('click',ev=>{if(ev.target.closest('button'))return;ev.stopPropagation();focus(record);});
  card.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target===card){ev.preventDefault();focus(record);}});
  buy.addEventListener('click',ev=>{
   ev.stopPropagation();
   if(product.stock<=0)return;
   restore();
   window.dispatchEvent(new CustomEvent('motoshop:3d-buy',{detail:{id:product.id}}));
  });
  cancel.addEventListener('click',ev=>{ev.stopPropagation();restore();});
  const cols=Math.min(12,Math.max(5,Math.ceil(Math.sqrt(catalog.length*1.6))));
  const col=i%cols,row=Math.floor(i/cols),rows=Math.ceil(catalog.length/cols);
  layouts.table.push(targetAt(new THREE.Vector3((col-(cols-1)/2)*175,((rows-1)/2-row)*230,0)));
  const phi=Math.acos(-1+2*(i+.5)/catalog.length);
  const theta=Math.sqrt(catalog.length*Math.PI)*phi;
  const spherePos=new THREE.Vector3(920*Math.cos(theta)*Math.sin(phi),920*Math.sin(theta)*Math.sin(phi),920*Math.cos(phi));
  layouts.sphere.push(targetAt(spherePos,spherePos.clone().multiplyScalar(2)));
  const a=i*.48+Math.PI;
  const helixPos=new THREE.Vector3(800*Math.sin(a),((catalog.length-1)/2-i)*51,800*Math.cos(a));
  layouts.helix.push(targetAt(helixPos,new THREE.Vector3(helixPos.x*2,helixPos.y,helixPos.z*2)));
  const x=i%5,y=Math.floor(i/5)%5,z=Math.floor(i/25);
  layouts.grid.push(targetAt(new THREE.Vector3((x-2)*325,(2-y)*260,(z-2)*520)));
 }
 stage.querySelector('.ms3d-fallback')?.remove();
 function shape(name){
  if(!layouts[name])return;
  restore();mode=name;
  cards.forEach((r,i)=>move(r.obj,layouts[name][i],1250));
  wrapper.querySelectorAll('[data-ms3d-layout]').forEach(button=>{
   button.setAttribute('aria-pressed',String(button.dataset.ms3dLayout===name));
  });
  setStatus('Vista '+({table:'Tabla',sphere:'Esfera',helix:'Hélice',grid:'Cuadrícula'}[name])+' · '+cards.length+' productos · Arrastra para girar y desplaza para acercarte');
 }
 wrapper.querySelectorAll('[data-ms3d-layout]').forEach(b=>b.addEventListener('click',()=>shape(b.dataset.ms3dLayout)));
 function resize(){
  if(current!==session)return;
  const w=Math.max(stage.clientWidth,280),h=Math.max(stage.clientHeight,320);
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
  if(typeof controls.handleResize==='function')controls.handleResize();
 }
 session.resizeObserver=new ResizeObserver(resize);
 session.resizeObserver.observe(stage);
 resize();
 function frame(t){
  if(current!==session)return;
  if(visible){
   tweens.update(t);
   if(!focused)controls.update();
   renderer.render(scene,camera);
  }
  session.frameId=requestAnimationFrame(frame);
 }
 session.intersectionObserver=new IntersectionObserver(entries=>{
  visible=entries.some(e=>e.isIntersecting);
 },{threshold:0});
 session.intersectionObserver.observe(wrapper);
 shape('sphere');
 session.frameId=requestAnimationFrame(frame);
}
window.addEventListener('motoshop:rendered',event=>{
 start3D(event.detail?.products||[]);
});
window.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&current){
  const cancel=document.querySelector('#ms3d .ms3d-active .ms3d-cancel');
  cancel?.click();
 }
});
window.dispatchEvent(new Event('motoshop:3d-ready'));
