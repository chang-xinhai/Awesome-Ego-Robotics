import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES,FACETS,emptyView,matches,signalsFor,coverageFor,facetOptions } from '../src/lib/filters.ts';
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
