export const groups=[
 {id:'gear',label:'Gear setup',default:'h2s',options:[{id:'h2s',label:'H2S Gear',models:['common','h2s']},{id:'a1',label:'A1 Gear',models:['common','a1']}]},
 {id:'carriage',label:'X carriage',default:'mgn12h',options:[{id:'mgn12h',label:'MGN12H',models:['mgn12h']},{id:'mgn9',label:'MGN9',models:['mgn9']}]},
 {id:'probe',label:'Probe',default:'carto',options:[{id:'none',label:'None',models:[]},{id:'carto',label:'Cartographer / Beacon',models:['carto']},{id:'microprobe',label:'BIQU MicroProbe',models:['microprobe']}]}
];
export const models={
 common:{file:'./assets/models/common.glb'},h2s:{file:'./assets/models/h2s.glb'},a1:{file:'./assets/models/a1.glb'},mgn12h:{file:'./assets/models/mgn12h.glb'},mgn9:{file:'./assets/models/mgn9.glb'},carto:{file:'./assets/models/carto.glb'},microprobe:{file:'./assets/models/microprobe.glb'}
};
