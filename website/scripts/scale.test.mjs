import test from 'node:test';
import assert from 'node:assert/strict';
import {formatScale,scaleMetrics} from '../src/lib/scale.ts';
test('multiview and ego frame counts are distinct, not discarded or summed',()=>{
 const result=formatScale({multiViewFrames:571645,egocentricFrames:114329,participants:4,scope:'five synchronized cameras'});
 assert.ok(result.includes('571,645 multi-view frames'));assert.ok(result.includes('114,329 egocentric frames'));
 assert.ok(!result.includes('685,974'));assert.ok(!result.includes('five synchronized'));
});
test('prequalified units are not printed twice',()=>{
 assert.equal(formatScale({images:'3.0M annotated images'}),'3.0M annotated images');
 assert.equal(formatScale({frames:'2.1M camera frames'}),'2.1M camera frames');
});
test('duration and new sourced scale dimensions preserve meaning',()=>{
 assert.equal(formatScale({hours:1286.3,durationUnit:'ego + exo video hours'}),'1,286.3 ego + exo video hours');
 const result=formatScale({atomicAnnotationHours:600,atomicEpisodes:'~100K',futureSampleDimension:42});
 assert.ok(result.includes('600 hours with atomic annotations'));assert.ok(result.includes('~100K atomic episodes'));assert.ok(result.includes('42 future sample dimension'));
});
test('metadata-only public scale is not mistaken for a released quantity',()=>{
 assert.equal(formatScale({scope:'preview size not established',snapshotDate:'2026-10-16'}),'Not verified');
 assert.deepEqual(scaleMetrics({scope:'not established'}),[]);
});
