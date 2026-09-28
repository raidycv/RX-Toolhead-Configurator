export const groups=[
 {id:'gear',label:'Gear setup',default:'h2s',options:[{id:'h2s',label:'H2S Gear'},{id:'a1',label:'A1 Gear'}]},
 {id:'carriage',label:'X carriage',default:'mgn12h',options:[{id:'mgn12h',label:'MGN12H'},{id:'mgn9',label:'MGN9'}]},
 {id:'probe',label:'Probe',default:'carto',options:[{id:'none',label:'None'},{id:'carto',label:'Cartographer / Beacon'},{id:'microprobe',label:'BIQU MicroProbe'}]},
 {id:'cutter',label:'Filament cutter arm',default:'none',options:[{id:'none',label:'None'},{id:'static',label:'Static arm'},{id:'servo',label:'Servo arm'}]}
];

export const modelFiles=[
 'Body for h2d right heating assembly.glb','Monolith carriage.glb','H2S Extruder Gear system.glb','default connector.glb',
 'carriage mount for BIQU microprobe.glb','screws and fasteners.glb','MGN12H  carriage.glb','carto mount.glb',
 'Main Body for H2S Extruder gear.glb','longer back cover.glb','extruder gear Box.glb','A1 gear setup parts.glb',
 'Gantry for MGN9 RAILS.step.glb','extruder gear box for Dual Filament sensor.glb','Body for H2D left heating assembly.glb',
 'RX-H2S Gear toolhead 5015 V4.5.3.x_t.glb','Electronics.glb','front cover.glb','connectors.glb',
 'filament cutter depressor.glb','Filament Cutter harm.glb','OZNLAB sensor setu H2S gear.step.glb','Back Electronics housing.glb'
];

// Conservative first-pass mapping. Named assemblies are now the unit of configuration.
// Unclassified assemblies remain visible until their exact dependency is verified.
export const optionModels={
 gear:{
  h2s:['H2S Extruder Gear system.glb','Main Body for H2S Extruder gear.glb'],
  a1:['A1 gear setup parts.glb']
 },
 carriage:{
  mgn12h:['MGN12H  carriage.glb'],
  mgn9:['Gantry for MGN9 RAILS.step.glb']
 },
 probe:{
  none:[],
  carto:['carto mount.glb'],
  microprobe:['carriage mount for BIQU microprobe.glb']
 },
 cutter:{
  none:[],
  static:['Filament Cutter harm.glb'],
  servo:['filament cutter depressor.glb']
 }
};

export const configurableFiles=new Set(Object.values(optionModels).flatMap(x=>Object.values(x).flat()));
