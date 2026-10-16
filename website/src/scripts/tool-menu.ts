import type { Work } from '../lib/catalog';
import { matches, type ViewState } from '../lib/filters';
import { TOOL_TOPICS, SLAM_FAMILIES, toolTopicsFor, slamFamilyFor } from '../lib/tooling';

interface Options {
  works:()=>Work[];
  state:()=>ViewState;
  select:(topic:string,family:string)=>void;
}
const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
const arrow='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>';

export function createToolMenu(options:Options) {
  const panel=document.getElementById('tools-menu')!;
  const topics=document.getElementById('tools-topics')!;
  const content=document.getElementById('tools-content')!;
  const done=document.getElementById('tools-done')!;
  const anchor=()=>document.querySelector<HTMLButtonElement>('[data-category="tools"]');
  let opened=false;
  function fit() {
    if(!opened)return;
    const viewport=window.visualViewport;
    const top=viewport?.offsetTop??0,bottom=top+(viewport?.height??innerHeight);
    panel.style.top='';
    if(bottom-panel.getBoundingClientRect().top<Math.min(440,bottom-top-24)){
      const nav=panel.parentElement!.getBoundingClientRect();
      panel.style.top=`${top+12-nav.top}px`;
    }
    panel.style.maxHeight=`${Math.max(48,Math.floor(bottom-panel.getBoundingClientRect().top-12))}px`;
  }
  function close(restore=false) {
    if(!opened)return;
    opened=false;panel.hidden=true;anchor()?.setAttribute('aria-expanded','false');
    if(restore)anchor()?.focus({preventScroll:true});
  }
  function refresh() {
    const state=options.state();
    if(state.category!=='tools'){close();return;}
    const focused=panel.contains(document.activeElement)?(document.activeElement as HTMLElement).dataset:undefined;
    const scroll=document.getElementById('tools-body')!.scrollTop;
    const pool=options.works().filter(w=>matches(w,'methods',{...state,category:'tools',toolTopic:'all',slamFamily:'all'}));
    const topic=TOOL_TOPICS.find(t=>t.key===state.toolTopic)??TOOL_TOPICS[0];
    const family=state.slamFamily??'all';
    topics.innerHTML=TOOL_TOPICS.map(t=>{
      const n=t.key==='all'?pool.length:pool.filter(w=>toolTopicsFor(w).includes(t.key)).length;
      return `<button type="button" data-tool-topic="${t.key}" aria-pressed="${topic.key===t.key}"><span>${escape(t.label)}</span><small>${n}</small>${arrow}</button>`;
    }).join('');
    if(topic.key==='all'||topic.key==='slam'){
      const slam=pool.filter(w=>toolTopicsFor(w).includes('slam'));
      content.innerHTML=`<p class="tools-eyebrow">SLAM & reconstruction</p><div class="tools-families" role="group" aria-label="SLAM families">${SLAM_FAMILIES.map(f=>{
        const n=f.key==='all'?slam.length:slam.filter(w=>slamFamilyFor(w)===f.key).length;
        return `<button type="button" data-slam-family="${f.key}" aria-pressed="${topic.key==='slam'&&family===f.key}"><span>${escape(f.label)}<small>${n}</small></span><em>${escape(f.description)}</em></button>`;
      }).join('')}</div>`;
    }else{
      const n=pool.filter(w=>toolTopicsFor(w).includes(topic.key)).length;
      content.innerHTML=`<div class="tools-topic-summary"><p class="tools-eyebrow">${escape(topic.label)}</p><h3>${n}<span> resources</span></h3><p>${escape(topic.description)}</p><p class="tools-context">Sensor requirements, outputs and sources are available in each entry.</p></div>`;
    }
    done.textContent=`View ${options.works().filter(w=>matches(w,'methods',{...state,category:'tools'})).length} resources`;
    document.getElementById('tools-selection')!.textContent=topic.key==='slam'?(SLAM_FAMILIES.find(f=>f.key===family)?.label??'All references'):topic.label;
    if(focused?.toolTopic)topics.querySelector<HTMLButtonElement>(`[data-tool-topic="${focused.toolTopic}"]`)?.focus({preventScroll:true});
    else if(focused?.slamFamily)content.querySelector<HTMLButtonElement>(`[data-slam-family="${focused.slamFamily}"]`)?.focus({preventScroll:true});
    document.getElementById('tools-body')!.scrollTop=scroll;
    anchor()?.setAttribute('aria-expanded',String(opened));
    fit();
  }
  function open() {
    opened=true;panel.hidden=false;refresh();fit();
    topics.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({preventScroll:true});
  }
  topics.addEventListener('click',event=>{
    const b=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-tool-topic]');
    if(b)options.select(b.dataset.toolTopic!,'all');
  });
  content.addEventListener('click',event=>{
    const b=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-slam-family]');
    if(b)options.select('slam',b.dataset.slamFamily!);
  });
  panel.addEventListener('keydown',event=>{
    const target=event.target as HTMLElement;
    if(event.key==='Escape'){event.stopPropagation();close(true);}
    else if(event.key==='ArrowRight'&&target.dataset.toolTopic==='slam'){
      event.preventDefault();content.querySelector<HTMLButtonElement>('[data-slam-family]')?.focus();
    }else if(event.key==='ArrowLeft'&&target.dataset.slamFamily){
      event.preventDefault();topics.querySelector<HTMLButtonElement>('[data-tool-topic="slam"]')?.focus();
    }
  });
  document.getElementById('tools-close')!.addEventListener('click',()=>close(true));
  done.addEventListener('click',()=>close(true));
  document.addEventListener('pointerdown',event=>{
    if(opened&&!panel.contains(event.target as Node)&&!anchor()?.contains(event.target as Node))close();
  });
  window.visualViewport?.addEventListener('resize',fit,{passive:true});
  addEventListener('scroll',fit,{passive:true});
  addEventListener('resize',fit,{passive:true});
  return {open,close,refresh,isOpen:()=>opened};
}
