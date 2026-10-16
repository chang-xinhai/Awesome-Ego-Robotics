import type { Work } from './catalog';
export type Lens = 'hardware' | 'datasets' | 'methods' | 'research';
export interface Category { key: string; label: string; description: string; section: string; }
export interface Choice { value: string; label: string; }
export interface Facet { key: string; label: string; options?: Choice[]; }
export interface ViewState { category: string; filters: Record<string,string>; signals: string[]; query: string; sort: string; }
const choices = (entries: [string,string][]): Choice[] => entries.map(([value,label]) => ({value,label}));
export const CATEGORIES: Record<Lens, Category[]> = {
  hardware: [
    {key:'cameras',label:'Cameras & headsets',description:'Egocentric cameras and headsets',section:'Egocentric cameras and headsets'},
    {key:'gloves',label:'Gloves',description:'Gloves and hand capture',section:'Gloves and hand capture'},
    {key:'emg',label:'EMG',description:'EMG and neural interfaces',section:'EMG and neural interfaces'},
    {key:'body',label:'Whole-body',description:'Whole-body and hybrid capture',section:'Whole-body and hybrid capture'},
    {key:'touch',label:'Touch & contact',description:'Contact and tactile capture',section:'Contact and tactile capture'},
  ],
  datasets: [
    {key:'video',label:'Video & activity',description:'Video and activity datasets',section:'Video and activity'},
    {key:'interaction',label:'Hands & objects',description:'Hand-object geometry and pose',section:'Hand-object geometry and pose'},
    {key:'body',label:'Body & multimodal',description:'Whole-body and multimodal datasets',section:'Whole-body and multimodal'},
    {key:'touch',label:'Touch, force & EMG',description:'Touch, force and EMG datasets',section:'Touch force and EMG'},
    {key:'robot',label:'Robot transfer',description:'Robot demonstration and transfer',section:'Robot demonstration and transfer'},
  ],
  methods: [
    {key:'l1',label:'Hand reconstruction',description:'L1 · Hand reconstruction',section:'Hand reconstruction'},
    {key:'l2',label:'World & body motion',description:'L2 · World-space and body motion',section:'World-space and body motion'},
    {key:'l3',label:'Hand–object interaction',description:'L3 · Hand–object interaction',section:'Hand-object interaction'},
    {key:'l4',label:'Robotization',description:'L4 · Demonstration translation',section:'Demonstration translation'},
    {key:'l5',label:'Policy learning',description:'L5 · Policy learning from human data',section:'Policy learning from human data'},
    {key:'l6',label:'Video learning',description:'L6 · Direct representations and latent-action routes',section:'Representation and latent actions'},
    {key:'tools',label:'Tools',description:'Evaluation and toolchains',section:'Evaluation and toolchains'},
  ],
  research: [],
};
const coverage: Facet = {key:'coverage',label:'Body coverage',options:choices([['Hands','Hands'],['Upper body','Upper body'],['Whole body','Whole body'],['unknown','Not specified']])};
const year: Facet = {key:'year',label:'Year'};
export const FACETS: Record<Lens, Facet[]> = {
  hardware: [
    {key:'form',label:'Device form'}, coverage,
    {key:'availability',label:'Availability',options:choices([['research','Research / DIY'],['commercial','Commercial products']])},
    {key:'openness',label:'Project release',options:choices([['open','Open source'],['partial','Partial release'],['closed','Closed source'],['unknown','Not verified']])}, year,
  ],
  datasets: [
    coverage,
    {key:'annotation',label:'Annotation evidence',options:choices([['measured','Measured reference'],['estimated','Model estimates'],['human','Human annotation'],['synthetic','Synthetic'],['mixed','Mixed evidence'],['unknown','Not specified']])},
    {key:'role',label:'Data scope',options:choices([['egocentric','Egocentric capture'],['reference','Reference / adjacent'],['synthetic','Synthetic'],['mixed','Mixed capture']])},
    {key:'access',label:'Data access'}, year,
  ],
  methods: [
    coverage,
    {key:'output',label:'Output / representation',options:choices([['camera','Camera-relative'],['world','World-space'],['robot','Robot actions'],['latent','Latent actions'],['representation','Representation'],['model','3D model / asset'],['mixed','Multiple spaces'],['unknown','Not specified']])},
    {key:'evidence',label:'Validation',options:choices([['real-robot','Real-robot evidence'],['simulation','Simulation'],['reconstruction','Reconstruction / perception'],['tool','Tool / infrastructure'],['unknown','Not specified']])},
    {key:'training',label:'Learning / inference',options:choices([['supervised','Supervised'],['self-supervised','Self-supervised'],['co-training','Co-training'],['optimization','Optimization'],['model-based','Model-based'],['mixed','Mixed'],['unknown','Not specified']])}, year,
  ],
  research: [year],
};
export const LENS_COPY: Record<Lens,{title:string;signals:string;note:string;placeholder:string}> = {
  hardware:{title:'Hardware filters',signals:'Recorded signals',note:'Choose a device family above. Commercial availability and source release are separate.',placeholder:'Find a device, sensor, or manufacturer…'},
  datasets:{title:'Dataset filters',signals:'Data modalities',note:'Choose a data family above. Physical observations, synthetic channels and estimated labels are distinguished in Details.',placeholder:'Find a dataset, task, or annotation…'},
  methods:{title:'Method filters',signals:'Input signals',note:'Choose a research layer above. L6 is a parallel video-learning route; it can bypass explicit 3D reconstruction.',placeholder:'Find a method, output, or institution…'},
  research:{title:'Research index filters',signals:'Signals & representations',note:'The complete README-derived index, including every resource type.',placeholder:'Search the complete research index…'},
};
export const emptyView = ():ViewState => ({category:'all',filters:{},signals:[],query:'',sort:'newest'});
const record = (v:unknown):Record<string,unknown> => v && typeof v==='object' && !Array.isArray(v) ? v as Record<string,unknown> : {};
const string = (v:unknown,fallback='unknown'):string => typeof v==='string' && v.trim() ? v : fallback;
export function inLens(w:Work,lens:Lens) { return lens==='research' || w.collections.includes(lens); }
export function categoriesFor(w:Work,lens:Lens) { return CATEGORIES[lens].filter(c=>w.sections.some(s=>s.endsWith(' / '+c.section))).map(c=>c.key); }
export function coverageFor(w:Work,lens:Lens) {
  const evidence=record(w.research?.[lens==='datasets'?'dataset':lens==='methods'?'method':'hardware']);
  const v=string(evidence.bodyCoverage,w.coverage);
  return /whole|full.body/i.test(v)?'Whole body':/upper/i.test(v)?'Upper body':/hand|finger|bimanual|unimanual/i.test(v)?'Hands':'unknown';
}
export function signalsFor(w:Work,lens:Lens):string[] {
  const evidence=record(w.research?.[lens==='datasets'?'dataset':lens==='methods'?'method':'hardware']);
  const signals=lens==='hardware'?evidence.observationSignals:lens==='datasets'?[...(Array.isArray(evidence.recordedSignals)?evidence.recordedSignals:[]),...(Array.isArray(evidence.syntheticSignals)?evidence.syntheticSignals:[])]:lens==='methods'?evidence.inputSignals:w.signals;
  const aliases:Record<string,string> = {RGB:'Vision','RGB-D':'Depth',RGBD:'Depth','Eye tracking':'Gaze',Proprioception:'State',Pressure:'Tactile',Touch:'Tactile',sEMG:'EMG',Event:'Events'};
  return [...new Set((Array.isArray(signals)?signals:w.signals).filter(v=>typeof v==='string' && !/not reported|unknown/i.test(v)).flatMap(v=>/^(RGB-D|RGBD)$/.test(v)?['Vision','Depth']:[aliases[v]??v]))];
}
export function facetValues(w:Work,lens:Lens,key:string):string[] {
  const m=record(w.research?.method),d=record(w.research?.dataset),h=record(w.research?.hardware);
  switch(key){
    case 'coverage':return [coverageFor(w,lens)];
    case 'year':return [w.year];
    case 'form':return Array.isArray(h.interfaceForms)?h.interfaceForms as string[]:w.forms??[w.form];
    case 'availability':return [w.commercial?'commercial':'research'];
    case 'openness':return [w.openness??'unknown'];
    case 'access':return [string(d.access,w.dataAccess)];
    case 'annotation':return [string(d.annotationType)];
    case 'role':return [string(d.dataRole)];
    case 'output':return [string(m.outputSpace)];
    case 'evidence':return [string(m.evidenceLevel)];
    case 'training':return [string(m.trainingType)];
    default:return [];
  }
}
export function facetOptions(works:Work[],lens:Lens,facet:Facet):Choice[] {
  const values=new Set(works.filter(w=>inLens(w,lens)).flatMap(w=>facetValues(w,lens,facet.key)));
  return facet.options ? facet.options.filter(o=>values.has(o.value)) : [...values].sort((a,b)=>facet.key==='year'?b.localeCompare(a):a.localeCompare(b)).map(value=>({value,label:value==='Not reported'?'Not specified':value}));
}
const searchIndex=new WeakMap<Work,string>();
export function matches(w:Work,lens:Lens,state:ViewState,excludeFacet?:string) {
  if(!inLens(w,lens))return false;
  if(state.category!=='all'&&!categoriesFor(w,lens).includes(state.category))return false;
  if(state.query.trim()){
    let haystack=searchIndex.get(w);
    if(!haystack){haystack=[w.name,...(w.aliases??[]),w.title,w.keywords,w.institute,w.publication,...w.sections,JSON.stringify(w.research??{}),JSON.stringify(w.release??{})].join(' ').toLowerCase();searchIndex.set(w,haystack);}
    if(!haystack.includes(state.query.trim().toLowerCase()))return false;
  }
  if(state.signals.some(s=>!signalsFor(w,lens).includes(s)))return false;
  return FACETS[lens].every(f=>f.key===excludeFacet||!state.filters[f.key]||state.filters[f.key]==='all'||facetValues(w,lens,f.key).includes(state.filters[f.key]));
}
