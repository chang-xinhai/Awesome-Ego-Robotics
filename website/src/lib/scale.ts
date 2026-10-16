/** Format sourced scale fields without discarding new dimensions or counting scopes. */
const labels:Record<string,string> = {
 hours:'hours',minutes:'minutes',participants:'participants',subjects:'subjects',images:'images',frames:'frames',videos:'videos',episodes:'episodes',tasks:'tasks',scenes:'scenes',objects:'objects',sequences:'sequences',recordings:'recordings',sessions:'sessions',locations:'locations',countries:'countries',days:'days',gestures:'gestures',gestureClasses:'gesture classes',gestureSamples:'gesture samples',takes:'takes',sceneTypes:'scene types',actionTypes:'action types',hdf5Files:'HDF5 files',instructorPerformerPairs:'instructor–performer pairs',kitchens:'kitchens',motionSequences:'motion sequences',objectInstances:'object instances',recipes:'recipes',stages:'stages',toyModels:'toy models',videoFrames:'video frames',multiViewFrames:'multi-view frames',egocentricFrames:'egocentric frames',egocentricImages:'egocentric images',atomicAnnotationHours:'hours with atomic annotations',atomicEpisodes:'atomic episodes',realSessions:'real sessions',syntheticSessions:'synthetic sessions',realVideosPerSession:'real video streams per session',syntheticFrames:'synthetic frames',trajectories:'trajectories',indexedDemos:'indexed demonstrations',indexedRows:'indexed rows',semanticTasks:'semantic tasks',vqaSamples:'VQA samples',demos:'demonstrations',demonstrations:'demonstrations',environments:'environments',operators:'operators',collectionDesks:'collection desks',clips:'clips',processedSplits:'processed splits',datasetFamilies:'dataset families',tables:'tables',taskConfigurations:'task configurations',taskHandConfigurations:'task–hand configurations',indoorScenes:'indoor scenes',householdScenarios:'household scenarios',singleArmTasks:'single-arm tasks',dualArmTasks:'bimanual tasks',pretrainingVideos:'pretraining videos',realWorldVqaSamples:'real-world VQA samples',fisheyeRefSpatialVqaSamples:'fisheye VQA samples',singleArmSessions:'single-arm sessions',dualArmSessions:'bimanual sessions',laundryEpisodes:'laundry episodes',drawingEpisodes:'drawing episodes',uniqueDrawings:'unique drawings',
};
const metadata=new Set(['scope','durationUnit','snapshotDate','version','note','qualifier','source','url']);
export function scaleMetrics(scale:Record<string,unknown>,compact=false):{key:string;text:string}[] {
 return Object.entries(scale).flatMap(([key,value])=>{
  if(metadata.has(key)||/Qualifier$/.test(key)||!['string','number'].includes(typeof value)||value==='')return [];
  const label=key==='hours'&&typeof scale.durationUnit==='string'?scale.durationUnit:labels[key]??key.replace(/([a-z])([A-Z])/g,'$1 $2').toLowerCase();
  const number=typeof value==='number'?new Intl.NumberFormat('en',{notation:compact&&value>=10000?'compact':'standard',maximumFractionDigits:compact?1:3}).format(value):String(value);
  const qualifier=scale[key+'Qualifier']==='>'&&!number.startsWith('>')?'>':'';
  // Some official statistics already include a qualified unit (e.g. “2.1M camera frames”).
  const unitWord=label.match(/images|frames|hours|minutes|episodes|sessions|sequences|videos|participants|objects|tasks|recordings|gestures/i)?.[0];
  const hasUnit=typeof value==='string'&&unitWord&&new RegExp('\\b'+unitWord+'\\b','i').test(value);
  return [{key,text:`${qualifier}${number}${hasUnit?'':' '+label}`}];
 });
}
export const formatScale = (scale:Record<string,unknown>) => scaleMetrics(scale).map(m=>m.text).join(' · ')||'Not verified';
