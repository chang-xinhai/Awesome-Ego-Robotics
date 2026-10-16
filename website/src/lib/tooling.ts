import type { Work } from './catalog';

export const TOOL_TOPICS = [
  {key:'all',label:'All tools',section:'',description:'Localization, calibration and processing tools.'},
  {key:'slam',label:'SLAM & 3D mapping',section:'SLAM',description:'Localization, scene maps and neural reconstruction.'},
  {key:'calibration',label:'Calibration & sync',section:'Calibration and synchronization',description:'Sensor models, extrinsics and shared timing.'},
  {key:'evaluation',label:'Trajectory evaluation',section:'Trajectory evaluation',description:'Alignment, trajectory error and diagnostic tools.'},
  {key:'capture',label:'Ego / UMI workflows',section:'Ego and UMI workflows',description:'Processing pipelines with a documented capture role.'},
  {key:'others',label:'Others',section:'Others',description:'Teleoperation, retargeting and supporting tools.'},
] as const;

export const SLAM_FAMILIES = [
  {key:'all',label:'All references',description:'SLAM, odometry and 3D reconstruction.'},
  {key:'classical',label:'Visual & inertial',description:'Feature-based, direct and RGB-D systems.'},
  {key:'learned',label:'Learned & dense',description:'Learned tracking, neural maps and 3D Gaussians.'},
  {key:'streaming',label:'Streaming reconstruction',description:'Incremental geometry for long video sequences.'},
  {key:'foundation',label:'Geometry foundations',description:'Feed-forward geometry and matching priors.'},
  {key:'lidar',label:'LiDAR & fusion',description:'Range sensing with inertial or visual fusion.'},
  {key:'capture',label:'Capture workflows',description:'Ego / UMI processing and trajectory export.'},
] as const;

const obj=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
export function slamFor(w:Work) { return obj(w.research?.method?.slam); }
export function toolTopicsFor(w:Work):string[] {
  if(!w.collections.includes('methods'))return [];
  const topics=new Set<string>();
  for(const topic of TOOL_TOPICS)if(topic.section&&w.subsections?.some(s=>s.endsWith(' / '+topic.section)))topics.add(topic.key);
  const method=obj(w.research?.method),slam=slamFor(w);
  if(typeof slam.family==='string'&&!['calibration','evaluation'].includes(slam.family))topics.add('slam');
  if(Array.isArray(method.toolTopics))for(const topic of method.toolTopics)if(TOOL_TOPICS.some(t=>t.key===topic&&topic!=='all'))topics.add(topic);
  if(!topics.size&&w.sections.some(s=>s.endsWith(' / Evaluation and toolchains')))topics.add('others');
  return [...topics];
}
export function slamFamilyFor(w:Work):string {
  const family=String(slamFor(w).family??'');
  return ['visual','visual-inertial','rgbd'].includes(family)?'classical':['learned','dense','geometry'].includes(family)?'learned':['streaming','foundation'].includes(family)?family:family.startsWith('lidar')?'lidar':family==='capture'?'capture':'unknown';
}

export function scopeLabelFor(w:Work):string {
  const scope=String(slamFor(w).systemType??'');
  const labels:Record<string,string>={
    'Geometry foundation':'Geometry model',
    'Streaming reconstruction':'Streaming 3D',
    'Offline reconstruction':'Offline 3D',
    'Point-map reconstruction':'Point maps',
    'Capture pipeline':'Capture workflow',
    'SLAM and body tracking':'SLAM + body',
    'Trajectory evaluation':'Trajectory eval',
    'Localization benchmark':'Benchmark',
    'Localization / annotation benchmark':'Benchmark',
    'Trajectory benchmark':'Benchmark',
    'Multi-sensor odometry and mapping':'Multi-sensor odometry',
    'Odometry and dense mapping':'Odometry + mapping',
    'Odometry and online meshing':'Odometry + meshing',
    'Odometry and radiance mapping':'Odometry + 3DGS',
    'Offline global map refinement':'Offline map refinement',
    'SLAM with an odometry frontend':'SLAM',
    'Offline scene reconstruction':'Offline 3D',
    'Offline video SfM':'Offline SfM',
    'Windowed visual reconstruction':'Windowed 3D',
    'LiDAR-inertial capture pipeline':'Capture workflow',
    'Fiducial-aided VIO':'Fiducial VIO',
  };
  return labels[scope]??scope;
}
