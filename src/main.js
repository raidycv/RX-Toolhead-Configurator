import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {groups} from './config.js';

const state=Object.fromEntries(groups.map(g=>[g.id,new URLSearchParams(location.search).get(g.id)||g.default]));
const controls=document.querySelector('#controls'), summary=document.querySelector('#summary');

for(const g of groups){
  const d=document.createElement('div'); d.className='group'; d.innerHTML=`<h3>${g.label}</h3>`;
  for(const o of g.options){
    const l=document.createElement('label'); l.className='option';
    l.innerHTML=`<input type="radio" name="${g.id}" value="${o.id}" ${state[g.id]===o.id?'checked':''}>${o.label}`;
    l.querySelector('input').onchange=()=>{state[g.id]=o.id;updateSummary()}; d.append(l);
  } controls.append(d);
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

let master=null, meshes=[], wire=false;
const dracoLoader=new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/');
const loader=new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

function fitView(){
  if(!master)return;
  const box=new THREE.Box3().setFromObject(master);
  const size=box.getSize(new THREE.Vector3()), center=box.getCenter(new THREE.Vector3());
  const max=Math.max(size.x,size.y,size.z);
  const dist=max/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.25;
  camera.near=Math.max(dist/1000,.01); camera.far=dist*20; camera.updateProjectionMatrix();
  camera.position.copy(center).add(new THREE.Vector3(dist*.75,dist*.45,dist));
  orbit.target.copy(center); orbit.update();
}

loader.load('./assets/models/rx-v55-master.glb', gltf=>{
  master=gltf.scene; scene.add(master);
  master.traverse(o=>{
    if(o.isMesh){
      o.userData.rxMeshId=meshes.length;
      meshes.push(o);
      o.material=o.material.clone();
    }
  });
  document.querySelector('#notice').style.display='none';
  document.querySelector('#meshInfo').textContent=`Real RX master loaded · ${meshes.length} selectable meshes · click a part to identify it`;
  fitView();
}, undefined, err=>{
  document.querySelector('#notice').textContent='Could not load the RX GLB. Check that assets/models/rx-v55-master.glb was uploaded.';
  console.error(err);
});

function updateSummary(){
  summary.innerHTML=groups.map(g=>`<span class="pill">${g.options.find(o=>o.id===state[g.id])?.label}</span>`).join('');
  history.replaceState(null,'','?'+new URLSearchParams(state));
}
updateSummary();

const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
canvas.addEventListener('pointerdown',e=>{
  if(!master)return;
  const r=canvas.getBoundingClientRect();
  pointer.x=((e.clientX-r.left)/r.width)*2-1; pointer.y=-((e.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(meshes,false)[0];
  if(hit){
    const id=hit.object.userData.rxMeshId;
    document.querySelector('#meshInfo').textContent=`Selected mesh #${id} · triangles: ${Math.round(hit.object.geometry.index ? hit.object.geometry.index.count/3 : hit.object.geometry.attributes.position.count/3).toLocaleString()}`;
  }
});

function resize(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  if(canvas.width!==Math.floor(w*renderer.getPixelRatio())||canvas.height!==Math.floor(h*renderer.getPixelRatio())) renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
function animate(){resize();orbit.update();renderer.render(scene,camera);requestAnimationFrame(animate)} animate();

document.querySelector('#fit').onclick=fitView;
document.querySelector('#wire').onclick=()=>{wire=!wire; meshes.forEach(m=>m.material.wireframe=wire)};
document.querySelector('#share').onclick=async()=>{await navigator.clipboard.writeText(location.href);alert('Configuration link copied')};
document.querySelector('#reset').onclick=()=>{for(const g of groups)state[g.id]=g.default; location.search=new URLSearchParams(state)};
document.querySelector('#download').onclick=()=>alert('Part downloads will activate after we finish mapping the selectable meshes.');
