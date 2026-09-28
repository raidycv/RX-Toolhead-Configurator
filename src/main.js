import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {groups,modelFiles,optionModels,configurableFiles} from './config.js';

const qs=new URLSearchParams(location.search);
const state=Object.fromEntries(groups.map(g=>[g.id,qs.get(g.id)||g.default]));
const controlsEl=document.querySelector('#controls'), summary=document.querySelector('#summary');
for(const g of groups){
 const d=document.createElement('div'); d.className='group'; d.innerHTML=`<h3>${g.label}</h3>`;
 for(const o of g.options){
  const l=document.createElement('label'); l.className='option';
  l.innerHTML=`<input type="radio" name="${g.id}" value="${o.id}" ${state[g.id]===o.id?'checked':''}>${o.label}`;
  l.querySelector('input').onchange=()=>{state[g.id]=o.id;applyConfiguration();updateSummary()}; d.append(l);
 } controlsEl.append(d);
}

const canvas=document.querySelector('#viewer');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.1,10000);
const orbit=new OrbitControls(camera,canvas); orbit.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xffffff,0x30343b,2.2));
const key=new THREE.DirectionalLight(0xffffff,3.2); key.position.set(3,5,4); scene.add(key);
const fill=new THREE.DirectionalLight(0xffffff,1.2); fill.position.set(-4,1,-3); scene.add(fill);

const root=new THREE.Group(); scene.add(root);
const assemblies=new Map(); let wire=false, explosion=0, assemblySize=1, center=new THREE.Vector3();
const draco=new DRACOLoader(); draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/');
const loader=new GLTFLoader(); loader.setDRACOLoader(draco);
const enc=s=>'./assets/models/'+s.split('/').map(encodeURIComponent).join('/');

function loadModel(file){return new Promise((resolve,reject)=>loader.load(enc(file),g=>resolve(g.scene),undefined,reject));}
async function loadAll(){
 const notice=document.querySelector('#notice'); let done=0;
 const results=await Promise.allSettled(modelFiles.map(async file=>{
  const obj=await loadModel(file); obj.userData.file=file; obj.name=file.replace(/\.glb$/,'');
  obj.traverse(o=>{if(o.isMesh)o.material=o.material.clone()}); root.add(obj); assemblies.set(file,obj);
  done++; notice.textContent=`Loading named RX assemblies… ${done}/${modelFiles.length}`;
 }));
 const failed=results.filter(x=>x.status==='rejected').length;
 root.updateMatrixWorld(true); cacheExplosion(); applyConfiguration(); fitView();
 notice.style.display='none';
 document.querySelector('#meshInfo').textContent=`${assemblies.size} named RX assemblies loaded${failed?` · ${failed} failed`:''} · click a component to identify its assembly`;
}
function cacheExplosion(){
 const box=new THREE.Box3().setFromObject(root); box.getCenter(center); const dims=box.getSize(new THREE.Vector3()); assemblySize=Math.max(dims.x,dims.y,dims.z)||1;
 let i=0; for(const obj of assemblies.values()){
  obj.userData.originalPosition=obj.position.clone(); const b=new THREE.Box3().setFromObject(obj), c=b.getCenter(new THREE.Vector3());
  let d=c.sub(center); if(d.lengthSq()<1e-8){const a=(i++*2.3999632297)%(Math.PI*2);d.set(Math.cos(a),((i%5)-2)/2,Math.sin(a));} d.normalize(); obj.userData.explodeDir=d;
 }
}
function applyConfiguration(){
 const active=new Set(); for(const g of groups)(optionModels[g.id]?.[state[g.id]]||[]).forEach(f=>active.add(f));
 for(const [file,obj] of assemblies)obj.visible=!configurableFiles.has(file)||active.has(file);
 setExplosion(explosion);
}
function setExplosion(v){
 explosion=THREE.MathUtils.clamp(Number(v)||0,0,1.5); const distance=assemblySize*.16*explosion;
 for(const obj of assemblies.values()){
  obj.position.copy(obj.userData.originalPosition||new THREE.Vector3());
  if(obj.visible&&explosion>0&&obj.userData.explodeDir)obj.position.addScaledVector(obj.userData.explodeDir,distance);
 }
 root.updateMatrixWorld(true);
}
function fitView(){
 const box=new THREE.Box3().setFromObject(root); if(box.isEmpty())return; const size=box.getSize(new THREE.Vector3()), c=box.getCenter(new THREE.Vector3());
 const max=Math.max(size.x,size.y,size.z),dist=max/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.25;
 camera.near=Math.max(dist/1000,.01);camera.far=dist*20;camera.updateProjectionMatrix();camera.position.copy(c).add(new THREE.Vector3(dist*.75,dist*.45,dist));orbit.target.copy(c);orbit.update();
}
function updateSummary(){
 summary.innerHTML=groups.map(g=>`<span class="pill">${g.options.find(o=>o.id===state[g.id])?.label}</span>`).join(''); history.replaceState(null,'','?'+new URLSearchParams(state));
}
updateSummary(); loadAll();

const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
canvas.addEventListener('pointerdown',e=>{
 const r=canvas.getBoundingClientRect(); pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);
 const visible=[...assemblies.values()].filter(x=>x.visible); const hits=ray.intersectObjects(visible,true); if(!hits.length)return;
 let a=hits[0].object; while(a.parent&&a.parent!==root)a=a.parent;
 document.querySelector('#meshInfo').textContent=`Assembly: ${a.userData.file||a.name}`;
});
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==Math.floor(w*renderer.getPixelRatio())||canvas.height!==Math.floor(h*renderer.getPixelRatio()))renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
(function animate(){resize();orbit.update();renderer.render(scene,camera);requestAnimationFrame(animate)})();
document.querySelector('#fit').onclick=fitView;
document.querySelector('#wire').onclick=()=>{wire=!wire;root.traverse(o=>{if(o.isMesh)o.material.wireframe=wire})};
document.querySelector('#share').onclick=async()=>{await navigator.clipboard.writeText(location.href);alert('Configuration link copied')};
document.querySelector('#reset').onclick=()=>{for(const g of groups)state[g.id]=g.default;location.search=new URLSearchParams(state)};
document.querySelector('#download').onclick=()=>alert('Named assemblies are mapped for preview. Printable download-file packaging is the next step.');
const explode=document.querySelector('#explode'),val=document.querySelector('#explodeValue');
explode.oninput=()=>{val.textContent=`${Number(explode.value).toFixed(1)}×`;setExplosion(explode.value)};
document.querySelector('#explodeOff').onclick=()=>{explode.value=0;val.textContent='0.0×';setExplosion(0)};
