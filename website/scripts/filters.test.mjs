import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES,FACETS,TOOL_FACETS,DEPTH_FACETS,facetsFor,emptyView,matches,signalsFor,coverageFor,facetOptions,categoriesFor } from '../src/lib/filters.ts';
import { toolTopicsFor,slamFamilyFor,depthFamiliesFor,toolSelectionFrom } from '../src/lib/tooling.ts';
const work=(values={})=>({id:'fixture',name:'Fixture',title:'Fixture',date:'2026-01-01',year:'2026',institute:'Lab',publication:'Paper',keywords:'',paperUrl:'https://example.org/',links:[],sections:['Methods and Toolchains / Hand reconstruction'],collections:['methods'],source:'Methods',kind:'Method',stage:'Hand reconstruction',form:'Glove',coverage:'Hands',tracking:'',signals:[],format:'',dataAccess:'Not verified',codeAccess:'',...values});
test('each collection exposes only its own categories and at most five facets',()=>{
 assert.equal(CATEGORIES.methods.find(c=>c.key==='l1').section,'Hand reconstruction');
 assert.ok(!CATEGORIES.methods.some(c=>/Gloves|EMG|Video and activity/.test(c.section)));
 assert.ok(!FACETS.methods.some(f=>['form','availability','access','openness'].includes(f.key)));
 assert.ok(!FACETS.hardware.some(f=>['annotation','role','output'].includes(f.key)));
 for(const fields of Object.values(FACETS))assert.ok(fields.length<=5);
});
test('L1 membership follows the method placement even for a multi-asset work',()=>{
 const x=work({collections:['hardware','methods'],sections:['Hardware and Capture Systems / Gloves and hand capture','Methods and Toolchains / Hand reconstruction']});
 assert.ok(matches(x,'methods',{...emptyView(),category:'l1'}));
 assert.ok(!matches(x,'methods',{...emptyView(),category:'l2'}));
 assert.ok(!matches(x,'datasets',emptyView()));
});
test('independent view states do not carry hardware restrictions into methods',()=>{
 const hardware={...emptyView(),filters:{availability:'commercial'},query:'glove'};
 const methods=emptyView();
 assert.ok(matches(work(),'methods',methods));assert.notEqual(hardware.filters,methods.filters);
});
test('bimanual labels normalize to Hands, world-body does not collapse to Hands',()=>{
 assert.equal(coverageFor(work({research:{dataset:{bodyCoverage:'Bimanual'}}}),'datasets'),'Hands');
 assert.equal(coverageFor(work({research:{method:{bodyCoverage:'Whole body and hands'}}}),'methods'),'Whole body');
});
test('RGB-D preserves both visual and depth channels; derived labels do not become observations',()=>{
 const x=work({research:{dataset:{recordedSignals:['RGB-D','IMU'],derivedSignals:['Tactile','Gaze']}}});
 assert.deepEqual(signalsFor(x,'datasets'),['Vision','Depth','IMU']);
});
test('facet candidates can be computed from category and all other restrictions',()=>{
 const l1=work({research:{method:{outputSpace:'camera',evidenceLevel:'reconstruction'}}});
 const l5=work({sections:['Robot Learning and Evaluation / Policy learning from human data'],research:{method:{outputSpace:'robot',evidenceLevel:'real-robot'}}});
 const state={...emptyView(),category:'l1'};
 const field=FACETS.methods.find(f=>f.key==='output');
 const pool=[l1,l5].filter(w=>matches(w,'methods',state,'output'));
 assert.deepEqual(facetOptions(pool,'methods',field).map(o=>o.value),['camera']);
});
test('L6 is a separate direct video route',()=>{
 assert.ok(matches(work({sections:['Methods and Toolchains / Representation and latent actions']}),'methods',{...emptyView(),category:'l6'}));
 assert.equal(CATEGORIES.methods.length,7);
});
test('official product and manufacturer aliases are searchable',()=>{
 const x=work({name:'Orbbec EGO',aliases:['奥比中光','EGO 四目']});
 assert.ok(matches(x,'methods',{...emptyView(),query:'奥比中光'}));
 assert.ok(matches(x,'methods',{...emptyView(),query:'ego 四目'}));
});
test('synthetic channels are filterable without becoming physical observations',()=>{
 const w=work({collections:['datasets'],sections:['Datasets / Hand-object geometry and pose'],research:{dataset:{recordedSignals:[],syntheticSignals:['Vision','Depth'],dataRole:'synthetic'}}});
 assert.deepEqual(signalsFor(w,'datasets'),['Vision','Depth']);
 assert.ok(matches(w,'datasets',{...emptyView(),filters:{role:'synthetic'},signals:['Vision']}));
 assert.deepEqual(w.research.dataset.recordedSignals,[]);
});
test('README tool subheadings and sourced SLAM cross-references define Tools membership',()=>{
 const calibrator=work({sections:['Robot Learning and Evaluation / Evaluation and toolchains'],subsections:['Robot Learning and Evaluation / Evaluation and toolchains / Calibration and synchronization']});
 assert.deepEqual(toolTopicsFor(calibrator),['calibration']);
 const existingBodyMethod=work({sections:['Methods and Toolchains / World-space and body motion'],research:{method:{slam:{family:'visual-inertial'}}}});
 assert.deepEqual(categoriesFor(existingBodyMethod,'methods'),['l2','tools']);
 assert.ok(matches(existingBodyMethod,'methods',{...emptyView(),category:'tools',toolTopic:'slam'}));
 assert.ok(!matches(existingBodyMethod,'methods',{...emptyView(),category:'tools',toolTopic:'others'}));
});
test('SLAM family and tool facets restrict results without leaking into reconstruction layers',()=>{
 const reference=work({research:{method:{slam:{family:'lidar-visual-inertial',role:'online',loopClosure:'no',relocalization:'unknown'},outputSpace:'world'}}});
 assert.equal(slamFamilyFor(reference),'lidar');
 assert.ok(matches(reference,'methods',{...emptyView(),category:'tools',toolTopic:'slam',slamFamily:'lidar',filters:{runtime:'online',loop:'no'}}));
 assert.ok(!matches(reference,'methods',{...emptyView(),category:'tools',toolTopic:'slam',slamFamily:'learned'}));
 assert.ok(!matches(reference,'methods',{...emptyView(),category:'tools',filters:{loop:'yes'}}));
 assert.ok(matches(reference,'methods',{...emptyView(),category:'l1',filters:{loop:'yes'}}));
 assert.equal(facetsFor('methods','tools'),TOOL_FACETS);
 assert.equal(TOOL_FACETS.length,5);
 assert.ok(!TOOL_FACETS.some(f=>f.key==='coverage'));
});
test('SLAM menu calibration and evaluation tools do not become SLAM algorithms',()=>{
 const evaluation=work({sections:['Robot Learning and Evaluation / Evaluation and toolchains'],subsections:['Robot Learning and Evaluation / Evaluation and toolchains / Trajectory evaluation'],research:{method:{slam:{family:'evaluation',role:'offline'}}}});
 assert.deepEqual(toolTopicsFor(evaluation),['evaluation']);
 assert.ok(!matches(evaluation,'methods',{...emptyView(),category:'tools',toolTopic:'slam'}));
 const fallback=work({sections:['Robot Learning and Evaluation / Evaluation and toolchains']});
 assert.deepEqual(toolTopicsFor(fallback),['others']);
});
test('geometry foundations and streaming models have independent discovery without implying a SLAM backend',()=>{
 const foundation=work({research:{method:{slam:{family:'foundation',systemType:'Geometry foundation',role:'offline',loopClosure:'no'}}}});
 const streaming=work({research:{method:{slam:{family:'streaming',systemType:'Streaming reconstruction',role:'online',loopClosure:'optional'}}}});
 assert.equal(slamFamilyFor(foundation),'foundation');
 assert.equal(slamFamilyFor(streaming),'streaming');
 assert.ok(matches(foundation,'methods',{...emptyView(),category:'tools',toolTopic:'slam',slamFamily:'foundation'}));
 assert.ok(!matches(foundation,'methods',{...emptyView(),category:'tools',toolTopic:'slam',slamFamily:'learned'}));
 assert.ok(!matches(foundation,'methods',{...emptyView(),category:'tools',filters:{loop:'yes'}}));
 assert.ok(matches(streaming,'methods',{...emptyView(),category:'tools',slamFamily:'streaming',filters:{loop:'optional'}}));
 assert.ok(!matches(streaming,'methods',{...emptyView(),category:'tools',filters:{loop:'yes'}}));
});

test('All methods contains core layers while tool-only references remain independently accessible',()=>{
 const tool=work({sections:['Robot Learning and Evaluation / Evaluation and toolchains'],subsections:['Robot Learning and Evaluation / Evaluation and toolchains / SLAM'],research:{method:{slam:{family:'visual-inertial'}}}});
 assert.ok(!matches(tool,'methods',emptyView()));
 assert.ok(matches(tool,'methods',{...emptyView(),category:'tools'}));
 assert.ok(matches(tool,'research',emptyView()));
 const dual=work({sections:['Methods and Toolchains / World-space and body motion'],research:{method:{slam:{family:'visual-inertial'}}}});
 assert.ok(matches(dual,'methods',emptyView()));
 assert.ok(matches(dual,'methods',{...emptyView(),category:'tools',toolTopic:'slam'}));
});

test('depth families overlap without conflating input setup, camera geometry or metric scale',()=>{
 const depth=work({sections:['Robot Learning and Evaluation / Evaluation and toolchains'],subsections:['Robot Learning and Evaluation / Evaluation and toolchains / Depth and perception'],research:{method:{inputSignals:['Vision'],perception:{families:['stereo','fisheye'],inputSetup:['stereo'],cameraGeometry:['fisheye'],scaleType:['calibrated']}}}});
 const state={...emptyView(),category:'tools',toolTopic:'depth',depthFamily:'fisheye',filters:{scale:'calibrated'}};
 assert.deepEqual(toolTopicsFor(depth),['depth']);
 assert.deepEqual(depthFamiliesFor(depth),['stereo','fisheye']);
 assert.deepEqual(depthFamiliesFor(work({research:{method:{perception:{families:['video','multiview']}}}})),['multiview']);
 assert.ok(matches(depth,'methods',state));
 assert.ok(!matches(depth,'methods',{...state,depthFamily:'monocular'}));
 assert.ok(!matches(depth,'methods',{...state,filters:{scale:'metric-predicted'}}));
 assert.ok(!matches(depth,'methods',{...state,toolTopic:'slam'}));
 assert.ok(!matches(depth,'methods',emptyView()));
 assert.deepEqual(signalsFor(depth,'methods'),['Vision']);
 assert.equal(facetsFor('methods','tools','depth'),DEPTH_FACETS);
 assert.equal(DEPTH_FACETS.length,3);
 assert.ok(!DEPTH_FACETS.some(f=>['loop','relocalization','setup','geometry'].includes(f.key)));
 // Mapping-specific restrictions do not apply to depth and vice versa.
 assert.ok(matches(depth,'methods',{...state,filters:{loop:'yes'}}));
 // A remembered IMU restriction from a core layer does not become a hidden depth filter.
 assert.ok(matches(depth,'methods',{...state,signals:['IMU']}));
 assert.ok(!matches(work(),'methods',{...emptyView(),signals:['IMU']}));
});

test('depth and SLAM family links use the selected topic and preserve legacy SLAM URLs',()=>{
 assert.deepEqual(toolSelectionFrom(new URLSearchParams('tool=depth&family=stereo')),{toolTopic:'depth',slamFamily:'all',depthFamily:'stereo'});
 assert.deepEqual(toolSelectionFrom(new URLSearchParams('family=lidar')),{toolTopic:'slam',slamFamily:'lidar',depthFamily:'all'});
 assert.deepEqual(toolSelectionFrom(new URLSearchParams('tool=depth&family=lidar')),{toolTopic:'depth',slamFamily:'all',depthFamily:'all'});
 assert.deepEqual(toolSelectionFrom(new URLSearchParams('tool=depth&family=video')),{toolTopic:'depth',slamFamily:'all',depthFamily:'multiview'});
 assert.deepEqual(toolSelectionFrom(new URLSearchParams('tool=calibration&family=stereo')),{toolTopic:'calibration',slamFamily:'all',depthFamily:'all'});
});
