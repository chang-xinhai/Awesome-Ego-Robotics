import type { Work } from "../lib/catalog";
import { compareDates } from "../lib/order";
import { formatScale, scaleMetrics } from "../lib/scale";
import { CATEGORIES, LENS_COPY, emptyView, facetsFor, facetOptions, facetValues, categoriesFor, signalsFor, matches, type Lens, type ViewState } from "../lib/filters";
import { TOOL_TOPICS, SLAM_FAMILIES, slamFor } from "../lib/tooling";
import { createToolMenu } from "./tool-menu";
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id)! as T;
const settings = JSON.parse($("catalog-settings").textContent!) as {
  initial: string[];
  base: string;
  endpoint: string;
  github: string;
};
const e = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const path = (p: string) =>
  settings.base.replace(/\/$/, "") + "/" + p.replace(/^\//, "");
type MediaMode = "hardware" | "datasets" | "methods";
const mode = (): MediaMode => collection === "datasets" ? "datasets" : collection === "methods" ? "methods" : "hardware";
function media(w: Work, context: MediaMode = mode()) {
  if (context === "datasets") return w.datasetImage ? {
    url: path(w.datasetImage), alt: w.datasetImageAlt ?? w.name,
    kind: w.datasetImageType ?? "Dataset overview",
    source: w.datasetImagePage ?? w.datasetImageSource ?? w.paperUrl,
  } : undefined;
  const image = context === "methods" ? w.image : w.hardwareImage ?? w.coverImage ?? w.image;
  return image ? { url: path(image), alt: context === "methods" ? w.imageAlt ?? w.name : w.hardwareImageAlt ?? w.coverAlt ?? w.imageAlt ?? w.name,
    kind: context === "methods" ? "Method overview" : w.hardwareImageType ?? w.coverType ?? "Hardware illustration",
    source: context === "methods" ? w.imagePage ?? w.paperUrl : w.hardwareImagePage ?? w.coverSource ?? w.imagePage ?? w.paperUrl,
  } : undefined;
}
const mediaKey = (w: Work, context: MediaMode = mode()) => `${context}:${w.id}`;
const previews = new Map<string, ReturnType<typeof media> | null>();
const preview = (w: Work, context: MediaMode = mode()) => previews.has(mediaKey(w, context)) ? previews.get(mediaKey(w, context)) : media(w, context);
const imageFallback = (w: Work) =>
  `<div class="card-cover image-fallback"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m4 17 5-5 4 4 3-3 4 4M8 8h.01"/></svg><span>Preview unavailable</span><button type="button" data-retry-image="${e(w.id)}">Retry image</button></div>`;
function coverHtml(w: Work) {
  const p = preview(w);
  return p
    ? `<button type="button" class="card-cover" data-detail="${e(w.id)}" aria-label="View ${e(collectionName(w))} details"><img src="${e(p.url)}" alt="${e(p.alt)}" width="640" height="360" decoding="async"/></button>`
    : `<a class="card-cover text-cover" href="${e(w.paperUrl)}" target="_blank" rel="noopener noreferrer"><span>${e(collection === "datasets" ? "Dataset" : collection === "methods" ? "Research method" : "Capture system")}</span><strong>${e(w.name)}</strong><small>Official source ↗</small></a>`;
}
const record = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
const text=(value:unknown,fallback="Not verified"):string=>{
 if(value===null||value===undefined||value==="")return fallback;
 if(Array.isArray(value))return value.map(v=>text(v,"")).filter(Boolean).join(" · ")||fallback;
 if(typeof value==="object")return Object.entries(value as Record<string,unknown>).map(([k,v])=>`${k}: ${text(v,"")}`).join("; ")||fallback;
 return String(value);
};
const search = $<HTMLInputElement>("catalog-search"),
  sort = $<HTMLSelectElement>("sort-order"),
  results = $("catalog-results");
const detail = $<HTMLDialogElement>("detail-dialog"),
  compare = $<HTMLDialogElement>("compare-dialog"),
  about = $<HTMLDialogElement>("about-dialog"),
  roadmap = $<HTMLDialogElement>("roadmap-dialog");
let works: Work[] = [],
  byId = new Map<string, Work>(),
  collection: Lens = "hardware",
  cursor = 0,
  generation = 0,
  busy = false,
  observer: IntersectionObserver | undefined,
  activeBatch: HTMLElement | undefined;
const params = new URLSearchParams(location.search);
collection = ["hardware", "datasets", "methods", "research"].includes(
  params.get("collection") ?? "",
)
  ? params.get("collection")! as Lens
  : "hardware";
if (params.get("view") === "index") collection = "research";
let view = emptyView();
view.query = params.get("q") ?? "";
view.sort = Array.from(sort.options).some(o=>o.value===params.get("sort")) ? params.get("sort")! : "newest";
view.category = CATEGORIES[collection].find(c=>c.key===(params.get("category")??params.get("layer")) || c.section===params.get("source"))?.key ?? "all";
if(collection==="methods"&&view.category==="tools"){
  view.toolTopic=TOOL_TOPICS.find(t=>t.key===params.get("tool"))?.key??"all";
  view.slamFamily=SLAM_FAMILIES.find(f=>f.key===params.get("family"))?.key??"all";
  if(view.toolTopic==="all"&&view.slamFamily!=="all")view.toolTopic="slam";
  if(!["all","slam"].includes(view.toolTopic))view.slamFamily="all";
}
for (const f of facetsFor(collection,view.category)) if(params.has(f.key)) view.filters[f.key]=params.get(f.key)!;
view.signals = (params.get("signals") ?? "").split(",").filter(Boolean);
const views = new Map<Lens,ViewState>([[collection,view]]);
search.value=view.query;
sort.value=view.sort;
let selected = new Set<string>(
  [...new Set((params.get("compare") ?? "").split(",").filter(Boolean))].slice(
    0,
    4,
  ),
);
const selections = new Map<string, Set<string>>([[collection, selected]]);
const PAGE_SIZE = 12;
const toolsMenu=createToolMenu({works:()=>works,state:()=>view,select:(topic,family)=>{
  view.category="tools";view.toolTopic=topic;view.slamFamily=family;render();
}});
function syncUrl() {
  const p = new URLSearchParams();
  if(collection!=="hardware")p.set("collection",collection);
  if(view.category!=="all")p.set("category",view.category);
  if(collection==="methods"&&view.category==="tools"){
    if(view.toolTopic&&view.toolTopic!=="all")p.set("tool",view.toolTopic);
    if(view.toolTopic==="slam"&&view.slamFamily&&view.slamFamily!=="all")p.set("family",view.slamFamily);
  }
  if(view.query.trim())p.set("q",view.query.trim());
  if(view.sort!=="newest")p.set("sort",view.sort);
  for(const f of facetsFor(collection,view.category))if(view.filters[f.key]&&view.filters[f.key]!=="all")p.set(f.key,view.filters[f.key]);
  if(view.signals.length)p.set("signals",view.signals.join(","));
  if(selected.size)p.set("compare",[...selected].join(","));
  if(detail.open&&detail.dataset.work)p.set("item",detail.dataset.work);
  history.replaceState(null,"",location.pathname+(p.size?"?"+p.toString():"")+location.hash);
}
const currentSignals = (w:Work) => signalsFor(w,collection);
function buildFilterPanel() {
  const copy=LENS_COPY[collection];
  const tooling=collection==="methods"&&view.category==="tools";
  $("filter-panel-title").textContent=tooling?"Tool filters":copy.title;
  $("filter-note").textContent=tooling?"Choose a group in Tools. Sensor requirements, calibration and scale are detailed in each entry.":copy.note;
  search.placeholder=copy.placeholder;
  const activeSignal=document.activeElement instanceof HTMLInputElement&&document.activeElement.name==="signal"?document.activeElement.value:undefined;
  const activeFacet=document.activeElement instanceof HTMLSelectElement?document.activeElement.dataset.facet:undefined;
  const scroll=$("filter-body").scrollTop;
  $("filter-fields").innerHTML=facetsFor(collection,view.category).map(f=>{
    const global=facetOptions(works,collection,f);
    if(!global.some(o=>o.value===view.filters[f.key]))delete view.filters[f.key];
    const pool=works.filter(w=>matches(w,collection,view,f.key));
    const options=facetOptions(pool,collection,f);
    const selected=global.find(o=>o.value===view.filters[f.key]);
    if(selected&&!options.some(o=>o.value===selected.value))options.push(selected);
    return `<label>${e(f.label)}<select id="${e(f.key)}-filter" data-facet="${e(f.key)}"><option value="all">Any</option>${options.map(o=>{
      const n=pool.filter(w=>facetValues(w,collection,f.key).includes(o.value)).length;
      return `<option value="${e(o.value)}"${view.filters[f.key]===o.value?' selected':''}>${e(o.label)} (${n})</option>`;
    }).join("")}</select></label>`;
  }).join("");
  if(activeFacet)$("filter-fields").querySelector<HTMLSelectElement>(`[data-facet="${activeFacet}"]`)?.focus({preventScroll:true});

  const signalPool=works.filter(w=>matches(w,collection,{...view,signals:[]}));
  const globalSignals=new Set(works.filter(w=>collection==="research"||w.collections.includes(collection)).flatMap(w=>signalsFor(w,collection)));
  view.signals=view.signals.filter(s=>globalSignals.has(s));
  const available=[...new Set([...signalPool.flatMap(w=>signalsFor(w,collection)),...view.signals])].sort();
  $("signal-filter-label").textContent=copy.signals;
  $("signal-options").innerHTML=available.map(s=>`<label><input type="checkbox" name="signal" value="${e(s)}"${view.signals.includes(s)?' checked':''}/><span>${e(s)}</span></label>`).join("");
  $("signal-filters").hidden=!available.length;
  if(activeSignal)Array.from(document.querySelectorAll<HTMLInputElement>("input[name=signal]")).find(el=>el.value===activeSignal)?.focus({preventScroll:true});
  $("filter-body").scrollTop=scroll;
}
function renderCategories() {
  const nav=$("category-options");
  const focused=document.activeElement instanceof HTMLElement&&nav.contains(document.activeElement)?document.activeElement.dataset.category:undefined;
  const state={...view,category:"all"};
  const base=works.filter(w=>matches(w,collection,state));
  const label=collection==="methods"?"All methods":collection==="datasets"?"All datasets":collection==="hardware"?"All hardware":"All research";
  const options=[{key:"all",label,description:label,section:""},...CATEGORIES[collection]];
  nav.innerHTML=options.map(c=>{
    const n=collection==="methods"&&c.key==="tools"?works.filter(w=>matches(w,collection,{...view,category:"tools",toolTopic:"all",slamFamily:"all"})).length:c.key==="all"?base.length:base.filter(w=>categoriesFor(w,collection).includes(c.key)).length;
    const code=collection==="methods"&&/^l[1-6]$/.test(c.key)?`<small>${c.key.toUpperCase()}</small>`:"";
    const tools=collection==="methods"&&c.key==="tools";
    return `<button type="button" data-category="${e(c.key)}" aria-pressed="${view.category===c.key}" title="${e(c.description)}"${tools?` aria-haspopup="dialog" aria-controls="tools-menu" aria-expanded="${toolsMenu.isOpen()}"`:""}>${code}${e(c.label)}<span>${n}</span>${tools?'<svg class="tools-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>':""}</button>`;
  }).join("");
  nav.parentElement!.setAttribute("aria-label",`${collection} categories`);
  nav.parentElement!.hidden=collection==="research";
  if(focused)nav.querySelector<HTMLButtonElement>(`[data-category="${focused}"]`)?.focus({preventScroll:true});
}
function filtered() {
  const rank=(w:Work)=>{const i=settings.initial.indexOf(w.id);return i<0?1000:i;};
  return works.filter(w=>matches(w,collection,view)).sort((a,b)=>view.sort==="name"?collectionName(a).localeCompare(collectionName(b)):view.sort==="oldest"?compareDates(a,b,"oldest"):view.sort==="newest"?compareDates(a,b):rank(a)-rank(b)||compareDates(a,b));
}
function publicStats(w:Work) {
 const d=record(w.research?.dataset),released=scaleMetrics(record(d.publicScale),true),reported=scaleMetrics(record(d.reportedScale),true);
 return (released.length?released:reported).slice(0,2).map(m=>`${m.text} ${released.length?"released":"reported"}`);
}
function card(w: Work) {
  const research = collection === "research";
  const d = record(w.research?.dataset);
  const tags =
    collection === "datasets"
      ? [...publicStats(w), text(d.access, "")].filter(Boolean).slice(0, 3)
      : [...currentSignals(w).filter((s) => s !== "Not reported").slice(0, 2),
        ...(w.commercial ? [String(w.release?.availability ?? "").includes("Announced") ? "Announced" : String(w.release?.availability ?? "").includes("project") ? "Industry" : "Commercial"] : w.openness === "open" ? ["Open source"] : [])];
  const name = collection === "datasets" ? w.datasetName ?? text(d.name, w.name) : view.filters.availability === "commercial" ? text(w.release?.productName, w.name) : w.name;
  const description = collection === "datasets" ? w.datasetSummary ?? text(d.observations, w.summary ?? w.keywords) : collection === "methods" ? text(record(w.research?.method).summary, w.summary ?? w.keywords) : w.summary ?? w.keywords;
  return `<article class="library-card feed-enter${selected.has(w.id) ? " is-selected" : ""}" data-id="${e(w.id)}">${!research ? coverHtml(w) : ""}<div class="card-copy"><p class="card-meta">${e(w.institute)} <span>·</span> ${e(w.publication === "Product" ? "Product" : w.year)}</p><h2><button type="button" data-detail="${e(w.id)}" title="${e(w.title)}">${e(research ? w.title : name)}</button></h2><p class="card-description">${e(description)}</p><div class="card-tags">${tags.map((s) => `<span title="${e(s)}"${/soon|pending/i.test(s) ? ' class="access-pending"' : ""}>${e(s === "Proprioception" ? "State" : s)}</span>`).join("")}</div><div class="card-actions"><button type="button" data-detail="${e(w.id)}">Details <span aria-hidden="true">↗</span></button><button type="button" class="compare-toggle" data-compare="${e(w.id)}" aria-label="${selected.has(w.id) ? "Remove" : "Compare"} ${e(name)}" aria-pressed="${selected.has(w.id)}" title="${selected.has(w.id) ? "Remove from comparison" : "Add to comparison"}"><span aria-hidden="true">${selected.has(w.id) ? "✓" : "+"}</span> Compare</button></div></div></article>`;
}
function skeleton() {
  return `<article class="library-card skeleton-card" aria-hidden="true"><div class="card-cover skeleton-stage"><div class="skeleton-block skeleton-cover"></div></div><div class="card-copy"><div class="skeleton-block skeleton-meta"></div><div class="skeleton-block skeleton-title"></div><div class="skeleton-block skeleton-line"></div><div class="skeleton-block skeleton-line short"></div><div class="skeleton-tags"><i class="skeleton-block"></i><i class="skeleton-block"></i></div><div class="skeleton-footer"><i class="skeleton-block"></i><i class="skeleton-block"></i></div></div></article>`;
}
function shimmerMask(batch: HTMLElement) {
  const overlay = batch.querySelector<HTMLElement>(".shared-shimmer");
  if (!overlay) return;
  const origin = batch.getBoundingClientRect();
  if (!origin.width || !origin.height) return;
  const rects = Array.from(
    batch.querySelectorAll<HTMLElement>(".skeleton-block"),
  )
    .map((el) => {
      const r = el.getBoundingClientRect();
      return `<rect x="${(r.left - origin.left).toFixed(1)}" y="${(r.top - origin.top).toFixed(1)}" width="${r.width.toFixed(1)}" height="${r.height.toFixed(1)}" rx="${Math.min(14, r.height / 3)}" fill="white"/>`;
    })
    .join("");
  const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${origin.width}' height='${origin.height}' viewBox='0 0 ${origin.width} ${origin.height}'>${rects}</svg>`)}")`;
  overlay.style.maskImage = mask;
  overlay.style.setProperty("-webkit-mask-image", mask);
}
function makeBatch(n: number) {
  const batch = document.createElement("div");
  batch.className = "feed-batch";
  batch.innerHTML =
    Array.from({ length: n }, skeleton).join("") +
    '<div class="shared-shimmer" aria-hidden="true"><div class="shimmer-light"></div></div>';
  results.append(batch);
  activeBatch = batch;
  shimmerMask(batch);
  return batch;
}
async function loadImage(url: string) {
  return await new Promise<boolean>((resolve) => {
    const im = new Image();
    let finished = false;
    const finish = (ok: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      im.onload = im.onerror = null;
      resolve(ok);
    };
    const timeout = setTimeout(() => finish(false), 10000);
    im.onload = () => {
      im.decode()
        .catch(() => {})
        .then(() => finish(true));
    };
    im.onerror = () => finish(false);
    im.src = url;
  });
}
async function preload(w: Work, force = false, context: MediaMode = mode()) {
  if (collection === "research") return;
  const key = mediaKey(w, context);
  if (previews.has(key) && !force) return;
  const candidate = media(w, context);
  if (candidate && await loadImage(candidate.url)) {
    previews.set(key, candidate);
    return;
  }
  // Keep the image's meaning: a dataset never falls back to a hardware photograph.
  previews.set(key, null);
}
let maskFrame = 0;
function queueMask(batch: HTMLElement) {
  cancelAnimationFrame(maskFrame);
  maskFrame = requestAnimationFrame(() => {
    if (batch.isConnected) shimmerMask(batch);
  });
}
function setBoundary(loading: boolean, finished: boolean) {
  $("loading-dots").hidden = !loading;
  $("feed-end").hidden = !finished;
  $("feed-error").hidden = true;
  results.setAttribute("aria-busy", String(loading));
}
async function loadNext() {
  if (busy || !works.length) return;
  const list = filtered();
  if (cursor >= list.length) {
    setBoundary(false, !!list.length);
    return;
  }
  const token = generation;
  busy = true;
  setBoundary(true, false);
  const chunk = list.slice(cursor, cursor + PAGE_SIZE);
  cursor += chunk.length;
  const batch = makeBatch(chunk.length);
  const nodes = Array.from(
    batch.querySelectorAll<HTMLElement>(".skeleton-card"),
  );
  await Promise.allSettled(
    chunk.map(async (w, i) => {
      await preload(w);
      if (token !== generation || !batch.isConnected) return;
      const template = document.createElement("template");
      template.innerHTML = card(w);
      nodes[i].replaceWith(template.content);
      queueMask(batch);
    }),
  );
  if (token !== generation) return;
  batch.querySelector(".shared-shimmer")?.remove();
  activeBatch = undefined;
  busy = false;
  setBoundary(false, cursor >= list.length);
  updateTray();
  observe();
  if (
    cursor < list.length &&
    $("feed-boundary").getBoundingClientRect().top <= innerHeight * 2
  )
    void loadNext();
}
function observe() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadNext();
    },
    { rootMargin: `0px 0px ${Math.ceil(innerHeight)}px 0px`, threshold: 0 },
  );
  observer.observe($("feed-boundary"));
}
function filterChips() {
  const chips:{key:string;value:string;label:string}[]=[];
  if(view.query.trim())chips.push({key:"q",value:"",label:view.query.trim()});
  if(collection==="methods"&&view.category==="tools"&&view.toolTopic&&view.toolTopic!=="all"){
    const topic=TOOL_TOPICS.find(t=>t.key===view.toolTopic)?.label;
    const family=view.toolTopic==="slam"&&view.slamFamily!=="all"?SLAM_FAMILIES.find(f=>f.key===view.slamFamily)?.label:undefined;
    chips.push({key:"tool",value:"",label:[topic,family].filter(Boolean).join(" · ")});
  }
  for(const f of facetsFor(collection,view.category))if(view.filters[f.key]&&view.filters[f.key]!=="all"){
    const label=facetOptions(works,collection,f).find(o=>o.value===view.filters[f.key])?.label??view.filters[f.key];
    chips.push({key:f.key,value:"",label:`${f.label}: ${label}`});
  }
  view.signals.forEach(s=>chips.push({key:"signal",value:s,label:s}));
  $("active-filters").innerHTML=chips.map(c=>`<button type="button" data-remove="${e(c.key)}" data-value="${e(c.value)}" aria-label="Remove ${e(c.label)} filter">${e(c.label)}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>`).join("");
  const n=chips.length+(view.category!=="all"?1:0);
  $("filter-count").textContent=String(n);$("filter-count").hidden=!n;
}
function render() {
  if (!works.length) {
    filterChips();
    syncUrl();
    return;
  }
  generation++;
  busy = false;
  activeBatch = undefined;
  cursor = 0;
  observer?.disconnect();
  results.replaceChildren();
  results.classList.toggle("research-view", collection === "research");
  results.classList.toggle("dataset-view", collection === "datasets");
  const list = filtered();
  $("catalog-empty").hidden = !!list.length;
  const noun = collection === "hardware" ? (list.length === 1 ? "hardware entry" : "hardware entries") : collection === "datasets" ? (list.length === 1 ? "dataset family" : "dataset families") : collection === "methods" ? (view.category==="tools"?(list.length===1?"tool / reference":"tools & references"):(list.length === 1 ? "method / learning resource" : "methods & learning resources")) : (list.length === 1 ? "research entry" : "research entries");
  $("result-count").textContent = `${list.length} ${noun}`;
  document
    .querySelectorAll<HTMLButtonElement>("[data-collection]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.collection === collection),
      ),
    );
  buildFilterPanel();
  renderCategories();
  toolsMenu.refresh();
  filterChips();
  syncUrl();
  setBoundary(false, false);
  if (list.length) void loadNext();
}
function reset() {
  toolsMenu.close();
  view=emptyView();views.set(collection,view);
  search.value="";sort.value="newest";
  buildFilterPanel();render();
}
function fitPanel() {
  const el = $("filter-panel");
  if (el.hidden) return;
  const viewport = window.visualViewport;
  const viewportTop = viewport?.offsetTop ?? 0;
  const bottom = viewport ? viewportTop + viewport.height : innerHeight;
  el.style.top = "";
  // Short windows need a taller sheet, rather than a popover squeezed under chrome.
  if (bottom - el.getBoundingClientRect().top < Math.min(540,bottom-viewportTop-24)) {
    const toolbarTop = $("library-toolbar").getBoundingClientRect().top;
    el.style.top = `${viewportTop + 12 - toolbarTop}px`;
  }
  el.style.maxHeight = `${Math.max(48, Math.floor(bottom - el.getBoundingClientRect().top - 12))}px`;
}
function panel(open: boolean) {
  const restore=!open&&!$("filter-panel").hidden&&$("filter-panel").contains(document.activeElement);
  $("filter-panel").hidden = !open;
  $("filters-toggle").setAttribute("aria-expanded", String(open));
  if (open) fitPanel();
  else if(restore)$("filters-toggle").focus({preventScroll:true});
}
window.visualViewport?.addEventListener("resize", fitPanel, { passive: true });
addEventListener("scroll", fitPanel, { passive: true });
function updateTray() {
  for (const id of selected) if (!byId.has(id) || (collection !== "research" && !byId.get(id)!.collections.includes(collection))) selected.delete(id);
  $("compare-tray").hidden = !selected.size;
  $("compare-count").textContent = `${selected.size} of 4 selected`;
  $("compare-names").textContent = [...selected]
    .map((id) => collectionName(byId.get(id)!))
    .join(" · ");
  $<HTMLButtonElement>("open-compare").disabled = selected.size < 2;
  for (const b of document.querySelectorAll<HTMLButtonElement>(
    "[data-compare]",
  )) {
    const chosen = selected.has(b.dataset.compare!);
    b.setAttribute("aria-pressed", String(chosen));
    b.innerHTML = `<span aria-hidden="true">${chosen ? "✓" : "+"}</span> Compare`;
    b.closest("article")?.classList.toggle("is-selected", chosen);
  }
  syncUrl();
}
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function announce(message: string) {
  const el = $("announcement");
  el.textContent = message;
  el.classList.add("is-visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2500);
}
function toggle(id: string) {
  if (!byId.has(id)) return;
  if (selected.has(id)) selected.delete(id);
  else if (selected.size >= 4) {
    announce("Compare up to four entries. Remove one to add another.");
    return;
  } else selected.add(id);
  updateTray();
  const b = detail.querySelector<HTMLElement>("[data-detail-compare]");
  if (b)
    b.textContent = selected.has(id)
      ? "Remove from comparison"
      : "Add to comparison";
}
function sensor(v: unknown) {
  const s = record(v);
  return s.status === "none" ? "None" : s.status === "present" ? "Yes" : s.status === "optional" ? "Optional" : "Unknown";
}
function measurement(value: unknown) {
  const m = record(value);
  if (!Object.keys(m).length) return "Unknown";
  const amount = typeof m.value === "number" ? new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(m.value) : text(m.value, "");
  const valueLabel = m.currency && typeof m.value === "number"
    ? new Intl.NumberFormat("en", {style: "currency", currency: String(m.currency), maximumFractionDigits: 2}).format(m.value)
    : `${amount}${m.tolerance ? " ± " + text(m.tolerance) : ""} ${text(m.unit ?? m.currency, "")}`;
  return `${valueLabel} · ${text(m.shortScope ?? m.scope, "scope unknown")}`;
}
const opennessLabel = (w: Work) => ({open:"Open source", partial:"Partial release", closed:"Closed source", unknown:"Unknown"})[w.openness ?? "unknown"] ?? "Unknown";
function collectionName(w:Work) {
  return collection === "datasets" ? text(w.datasetName ?? w.research?.dataset?.name,w.name) : w.name;
}
function hardwareFacts(w: Work): [string, string][] {
  const h=record(w.research?.hardware);
  return [["Form",text(h.interfaceForms,w.form)],["Body coverage",text(h.bodyCoverage,w.coverage)],
    ["Tracking",text(h.poseTracking,w.tracking)],["Cameras",text(h.cameraSpecs,h.vision?text(h.vision):"Not specified")],
    ["Tactile sensing",sensor(h.tactile)],["Force sensing",text(h.forceShort,sensor(h.forceTorque))],
    ["Measured signals",text(h.measuredSignals,text(h.observationSignals))],["Project release",opennessLabel(w)]];
}
function hardwareDataFacts(w:Work):[string,string][] {
  const h=record(w.research?.hardware);
  return [["Components",text(h.captureComponents)],["Synchronization",text(h.synchronization)],
    ["Output & export",text(h.outputs)],["Software / SDK",text(h.softwareRelease)],
    ["Hardware access",text(h.hardwareRelease)],["Configuration",text(h.configuration)]];
}
function methodFacts(w: Work): [string, string][] {
  const m=record(w.research?.method);
  if(Object.keys(slamFor(w)).length)return [["Input",text(m.input)],["Output",text(m.output)],
    ["Representation",text(m.outputRepresentation)],["Coordinate frame",text(m.coordinateFrame)]];
  return [["Research layer",text(m.stage)],["Input",text(m.input)],["Output",text(m.output)],
    ["Representation",text(m.outputRepresentation)],["Coordinate frame",text(m.coordinateFrame)],
    ["Scale",text(m.scale)],["Temporal scope",text(m.temporal)],["Supervision",text(m.supervision)]];
}
function methodEvaluationFacts(w:Work):[string,string][] {
  const m=record(w.research?.method);
  if(Object.keys(slamFor(w)).length)return [["Evaluation",text(m.evaluation)],
    ["Implementation",text(m.implementation)],["Limits",text(m.limitations)]];
  return [["Evaluation",text(m.evaluation)],["Robot evidence",text(m.robotEvidence)],
    ["Robot platform",text(m.robotPlatform,"Not evaluated / not specified")],
    ...(m.policyInput?[["Policy input",text(m.policyInput)] as [string,string]]:[]),
    ...(m.implementation?[["Implementation",text(m.implementation)] as [string,string]]:[]),
    ...(m.limitations?[["Limits",text(m.limitations)] as [string,string]]:[])];
}
function trackingFacts(w:Work):[string,string][] {
  const s=slamFor(w);if(!Object.keys(s).length)return [];
  const status=(v:unknown)=>v==="yes"?"Yes":v==="no"?"None":v==="optional"?"Optional":"Not verified";
  const mode=({online:"Online",offline:"Offline",hybrid:"Hybrid"} as Record<string,string>)[String(s.role)]??"Not specified";
  const mapping=!["calibration","evaluation"].includes(String(s.family));
  return [["System scope",text(s.systemType)],["Execution",mode],["Sensor setup",text(s.sensors)],
    ...(mapping?[["Scale source",text(s.metricScale)],["Loop closure",status(s.loopClosure)],["Relocalization",status(s.relocalization)]] as [string,string][]:[]),
    ["Calibration",text(s.calibration)],["Capture relevance",text(s.captureRelevance)]];
}
function datasetFacts(w: Work): [string, string][] {
  const d=record(w.research?.dataset);
  return [[d.dataRole==="synthetic"?"Rendered channels":"Observed streams",text(d.recordedStreams,d.observations?text(d.observations):"Not specified")],
    ...(d.dataRole==="synthetic"?[["Physical observations","None — synthetic resource"] as [string,string]]:[]),
    ["Camera setup",text(d.cameraSetup)],["Body coverage",text(d.bodyCoverage,w.coverage)],
    ["Coordinate frame",text(d.coordinateFrame)],["Calibration & timing",text(d.calibration)],
    ["Derived outputs",text(d.derivedSignals,"None specified")]];
}
function datasetAnnotationFacts(w:Work):[string,string][] {
  const d=record(w.research?.dataset);
  return [["Labels",text(d.labels)],["Label evidence",text(d.annotationEvidence)],
    ["Tasks",text(d.tasks)],["Splits",text(d.splits)]];
}
function datasetReleaseFacts(w:Work):[string,string][] {
  const d=record(w.research?.dataset);
  return [["Access",text(d.access,w.dataAccess)],["Release scope",text(d.releaseScope)],
    ["Format",text(d.formats,w.format)],["Data license",text(d.dataLicense,d.license?text(d.license):"Not verified")],
    ...(d.limitations?[["Limits",text(d.limitations)] as [string,string]]:[])];
}
function facts(w: Work): [string, string][] {
  const rows: [string,string][] = [["Date", w.date], ["Institution", w.institute], ["Publication", w.publication]];
  return [...rows, ...(collection === "datasets" ? [...datasetFacts(w),...datasetAnnotationFacts(w),...datasetReleaseFacts(w),["Reported scale",scaleText(record(w.research?.dataset?.reportedScale))],["Reported scope",text(record(w.research?.dataset?.reportedScale).scope)],["Public release",scaleText(record(w.research?.dataset?.publicScale))],["Public release scope",text(record(w.research?.dataset?.publicScale).scope)]] as [string,string][] : collection === "methods" ? [...methodFacts(w),...trackingFacts(w),...methodEvaluationFacts(w)] : collection === "research" ? [["Resource", w.collections.join(" · ")] as [string,string], ...methodFacts(w),...trackingFacts(w)] : [...hardwareFacts(w),...hardwareDataFacts(w)])];
}
const scaleText = formatScale;
const factsHtml = (rows: [string, string][]) =>
  `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join("")}</dl>`;
function sources(w:Work) {
  const h=record(w.research?.hardware),d=record(w.research?.dataset),m=record(w.research?.method);
  const items=[...(Array.isArray(h.evidence)?h.evidence:[]),...(Array.isArray(d.sources)?d.sources:[]),...(Array.isArray(m.sources)?m.sources:[]),...(Array.isArray(w.release?.evidence)?w.release.evidence:[])].map(record);
  const fields=new Map<string,Set<string>>();
  for(const evidence of [h,d,m])for(const [field,urls] of Object.entries(record(evidence.fieldSources)))if(Array.isArray(urls))for(const url of urls)if(typeof url==="string"&&/^https?:\/\//.test(url)){
    if(!fields.has(url))fields.set(url,new Set());fields.get(url)!.add(field.replace(/([A-Z])/g," $1").toLowerCase());
  }
  for(const [url,names] of fields)items.push({url,label:"Field evidence",supports:[...names].join(" · ")});
  const merged=new Map<string,Record<string,unknown>>();
  for(const item of items){const url=String(item.url??"");if(!/^https?:\/\//.test(url))continue;
    const old=merged.get(url);merged.set(url,{...old,...item,label:old?.label??item.label,supports:fields.has(url)?[...fields.get(url)!].join(" · "):item.supports??old?.supports});}
  return [...merged.values()];
}
function variantsHtml(w: Work) {
  const variants = Array.isArray(w.release?.commercialVariants) ? w.release.commercialVariants.map(record) : [];
  return variants.length ? `<div class="product-versions"><h4>Product versions</h4>${variants.map(v => {
    const image = record(v.media), joints = record(v.joints);
    const rows: [string,string][] = [
      ...(v.mass ? [["Mass", measurement(v.mass)] as [string,string]] : []),
      ...(Object.keys(joints).length ? [["Joints", `${text(joints.active)} active + ${text(joints.passive)} passive`] as [string,string]] : []),
      ...(v.form ? [["Interface", text(v.form)] as [string,string]] : []),
      ...(v.tracking ? [["Tracking", text(v.tracking)] as [string,string]] : []),
    ];
    return `<div class="product-version"><a href="${e(v.url)}" target="_blank" rel="noopener noreferrer">${e(v.name)} ↗</a>${image.image ? `<img src="${e(path(String(image.image)))}" alt="${e(image.alt ?? v.name)}" loading="lazy"/><p class="image-note"><a href="${e(image.page)}" target="_blank" rel="noopener noreferrer">${e(image.type ?? "Official product image")} ↗</a></p>` : ""}${factsHtml(rows)}</div>`;
  }).join("")}</div>` : "";
}
function showDetail(id: string) {
  const w = byId.get(id);
  if (!w) return;
  toolsMenu.close();
  panel(false);
  detail.dataset.work = id;
  const h = record(w.research?.hardware),
    d = record(w.research?.dataset);
  const links = [
    { label: w.publication === "Product" ? "Product" : w.publication === "Solution" ? "Solution" : /arxiv\.org|doi\.org|openreview\.net|proceedings/i.test(w.paperUrl) ? "Paper" : "Source", url: w.paperUrl },
    ...w.links.filter(l => !(d.datasetUrl && /dataset|^data$/i.test(l.label))).map(l => ({...l, label: /^github$|^code$|^software$|^sdk$/i.test(l.label) ? "Code" : /^project$/i.test(l.label) ? "Project" : l.label})),
    { label: "Dataset", url: String(d.datasetUrl ?? "") },
  ].filter((l) => l.url && /^https?:\/\//.test(l.url));
  const seen = new Set<string>();
  const unique = links.filter((l) => {
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });
  const sourceList = sources(w);
  const detailKind = collection === "research" ? (w.collections.includes("hardware") ? "hardware" : w.collections.includes("datasets") ? "datasets" : "methods") : collection;
  const selectedMedia=collection==="research"?media(w,detailKind):preview(w)??media(w);
  const isDataset = detailKind === "datasets";
  const mediaHtml = selectedMedia ? `<div class="detail-media"><img class="detail-cover" src="${e(selectedMedia.url)}" alt="${e(selectedMedia.alt)}"/><p class="image-note">${e(detailKind === "hardware" ? (w.hardwareImageCredit ?? w.credit ?? w.institute) : w.credit ?? w.institute)} · <a href="${e(selectedMedia.source)}" target="_blank" rel="noopener noreferrer">${e(selectedMedia.kind)} ↗</a></p></div>` : "";
  const notes = [d.annotationEvidence, record(d.reportedScale).durationUnit, record(w.research?.method).dateNote, h.observationSignalsNote, h.interfaceFormsNote, record(h.tactile).note, record(h.forceTorque).note, h.hardwareAvailability,
    record(h.cost).scope, record(h.mass).scope, d.accessNote, d.fpsScope, record(d.reportedScale).scope, record(d.publicScale).snapshotDate ? `Public release snapshot: ${text(record(d.publicScale).snapshotDate)}` : undefined, record(d.publicScale).scope, record(d.reportedScale).scope,
    ...(Array.isArray(d.scopeNotes) ? d.scopeNotes : []),
    ...(Array.isArray(w.release?.notes) ? w.release.notes : [])].filter(Boolean);
  const section=(title:string,rows:[string,string][],note="")=>`<section class="detail-section"><h3>${e(title)}</h3>${factsHtml(rows)}${note?`<p class="detail-scope-note">${e(note)}</p>`:""}</section>`;
  const hardwareSection=w.research?.hardware?section("Hardware & sensing",hardwareFacts(w))+section("Capture & data",hardwareDataFacts(w)):"";
  const tracking=trackingFacts(w);
  const methodSection=w.research?.method?section("Method at a glance",methodFacts(w))+(tracking.length?section(["calibration","evaluation"].includes(String(slamFor(w).family))?"Tool setup":"Tracking & mapping",tracking):"")+section(tracking.length?"Evaluation & implementation":"Evaluation & deployment",methodEvaluationFacts(w)):"";
  const publicScale=scaleText(record(d.publicScale)),reportedScale=scaleText(record(d.reportedScale));
  const scaleColumns=`<div class="data-scale-columns">${publicScale!=="Not verified"?`<div class="data-scale-column"><span>Public release</span><p>${e(publicScale)}</p>${record(d.publicScale).scope?`<small>${e(record(d.publicScale).scope)}</small>`:""}</div>`:""}${reportedScale!=="Not verified"?`<div class="data-scale-column"><span>Reported</span><p>${e(reportedScale)}</p>${record(d.reportedScale).scope?`<small>${e(record(d.reportedScale).scope)}</small>`:""}</div>`:""}</div>`;
  const datasetSection=w.research?.dataset?`<section class="detail-section"><h3>Dataset</h3>${scaleColumns}${factsHtml(datasetFacts(w))}</section>`+section("Annotations & tasks",datasetAnnotationFacts(w))+section("Release & access",datasetReleaseFacts(w)):"";
  const release = w.release ? `<div class="release-specifications">${factsHtml([
    ["Hardware", text(w.release.hardwareStatus, "Unknown")], ["Software", text(w.release.softwareStatus, "Unknown")],
    ...(w.commercial ? [["Availability", text(w.release?.availability, "Commercial product")] as [string, string]] : []),
  ])}</div>` : "";
  const specifications: [string, string][] = [
    ["Interface", text(h.form, "")], ["Tracking", text(h.poseTracking, "")], ["Vision", text(h.vision, "")],
    ["Tactile sensor", text(record(h.tactile).detail ?? record(h.tactile).type, "")], ["Force sensor", text(record(h.forceTorque).detail ?? record(h.forceTorque).type, "")],
    ["Actions", text(h.actionSpace ?? d.action, "")], ["Observations", text(d.observations, "")], ["Embodiments", text(d.embodiments, "")],
  ].filter(([,v]) => !!v) as [string,string][];
  $("detail-content").innerHTML = `<div class="detail-layout${selectedMedia ? "" : " no-media"}">${mediaHtml}<div class="detail-copy"><p class="detail-kicker">${e(w.institute)}${w.date === "—" ? "" : " · " + e(w.date)} · ${e(w.publication)}</p><h2>${e(isDataset ? text(d.name, w.name) : w.name)}</h2><p class="detail-paper-title">${e(isDataset ? w.datasetSummary ?? w.title : detailKind === "methods" ? text(record(w.research?.method).summary, w.title) : w.summary ?? w.title)}</p><div class="detail-links">${unique.map(l => `<a href="${e(l.url)}" target="_blank" rel="noopener noreferrer">${e(l.label)} ↗</a>`).join("")}</div>${detailKind === "methods" ? methodSection + (datasetSection ? `<details class="detail-secondary"><summary>Dataset</summary>${datasetSection}</details>` : "") : isDataset ? datasetSection + (hardwareSection ? `<details class="detail-secondary"><summary>Hardware & sensing</summary>${hardwareSection}</details>` : "") : hardwareSection + (methodSection ? `<details class="detail-secondary"><summary>Related method</summary>${methodSection}</details>` : "") + (datasetSection ? `<details class="detail-secondary"><summary>Dataset · ${e(publicStats(w)[0] ?? text(d.access))}</summary>${datasetSection}</details>` : "")}
    <details class="detail-sources"><summary>Sources & specifications${sourceList.length ? ` · ${sourceList.length} references` : ""}</summary>${factsHtml(specifications)}${release}${variantsHtml(w)}${notes.map(n => `<p class="data-note">${e(n)}</p>`).join("")}${sourceList.length ? `<ol>${sourceList.map(s => `<li><a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.label ?? new URL(String(s.url)).hostname)} ↗</a><br/>${e(s.note ?? s.supports ?? s.section)}</li>`).join("")}</ol>` : `<a href="${e(w.paperUrl)}" target="_blank" rel="noopener noreferrer">Primary source ↗</a>`}</details>
    <button class="button-dark detail-compare" data-detail-compare="${e(id)}" type="button">${selected.has(id) ? "Remove from comparison" : "Add to comparison"}</button></div></div>`;
  detail.showModal();
  document.body.classList.add("dialog-open");
  syncUrl();
}
function showCompare() {
  if (selected.size < 2) return;
  const items = [...selected].map((id) => byId.get(id)!);
  const keys = [...new Set(items.flatMap(w => facts(w).map(([k]) => k)))];
  const note = items.some(w => Object.keys(slamFor(w)).length)
    ? "Compare sensor requirements, scale, calibration and alignment. Online execution does not imply real-time performance or a complete SLAM backend."
    : collection === "datasets"
      ? "Public releases, gated data, announced corpora, and observation variants are different scopes. A reported total is not necessarily the downloadable portion."
      : collection === "methods"
        ? "Compare inputs, outputs and evaluation settings. Reported results depend on the original data and protocol."
        : "Hardware files, software and data access are verified separately. A commercial product is not necessarily closed source.";
  $("compare-content").innerHTML =
    `<div class="compare-heading"><h2>Side by side.</h2><p>Specifications and release conditions, with their original sources.</p></div><div class="compare-table-wrap" role="region" tabindex="0" aria-label="Comparison table, scroll horizontally"><table class="comparison-table" style="--compare-columns:${items.length}"><thead><tr><th scope="col">Compare</th>${items.map((w) => `<th scope="col">${preview(w) ? `<img src="${e(preview(w)?.url)}" alt="${e(preview(w)?.alt)}"/>` : ""}<strong>${e(collectionName(w))}</strong><a href="${e(w.paperUrl)}" target="_blank" rel="noopener noreferrer">Primary source ↗</a></th>`).join("")}</tr></thead><tbody>${keys.map((key) => `<tr><th scope="row">${e(key)}</th>${items.map((w) => `<td>${e(facts(w).find(([k]) => k === key)?.[1] ?? "—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="compare-footnote">${e(note)}</p>`;
  compare.showModal();
  document.body.classList.add("dialog-open");
}
function closeDialog(d: HTMLDialogElement) {
  d.close();
  if (![detail, compare, about, roadmap].some((x) => x.open))
    document.body.classList.remove("dialog-open");
  syncUrl();
}
for (const d of [detail, compare, about, roadmap]) {
  d.querySelector("[data-close]")?.addEventListener("click", () =>
    closeDialog(d),
  );
  d.addEventListener("click", (event) => {
    if (event.target === d) closeDialog(d);
  });
  d.addEventListener("close", () => {
    if (![detail, compare, about, roadmap].some((x) => x.open))
      document.body.classList.remove("dialog-open");
    syncUrl();
  });
}
results.addEventListener("click", (event) => {
  const t = event.target as HTMLElement;
  const retry = t.closest<HTMLButtonElement>("[data-retry-image]");
  if (retry) {
    const w = byId.get(retry.dataset.retryImage!);
    const article = retry.closest("article");
    if (w && article) {
      retry.disabled = true;
      retry.textContent = "Loading…";
      void preload(w, true).then(() => {
        const template = document.createElement("template");
        template.innerHTML = coverHtml(w);
        article.querySelector(".card-cover")?.replaceWith(template.content);
      });
    }
    return;
  }
  const compareButton = t.closest<HTMLElement>("[data-compare]");
  if (compareButton) toggle(compareButton.dataset.compare!);
  const b = t.closest<HTMLElement>("[data-detail]");
  if (b) showDetail(b.dataset.detail!);
});
results.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const article = img.closest<HTMLElement>("article[data-id]");
    const w = article ? byId.get(article.dataset.id!) : undefined;
    if (!w || !article) return;
    previews.set(mediaKey(w), null);
    const template = document.createElement("template");
    template.innerHTML = imageFallback(w);
    article.querySelector(".card-cover")?.replaceWith(template.content);
  },
  true,
);
detail.addEventListener("click", (event) => {
  const b = (event.target as HTMLElement).closest<HTMLElement>(
    "[data-detail-compare]",
  );
  if (b) toggle(b.dataset.detailCompare!);
});
document.querySelectorAll<HTMLButtonElement>("[data-collection]").forEach(b=>b.addEventListener("click",()=>{
  toolsMenu.close();
  views.set(collection,view);selections.set(collection,selected);
  collection=b.dataset.collection as Lens;
  view=views.get(collection)??emptyView();views.set(collection,view);
  selected=selections.get(collection)??new Set<string>();selections.set(collection,selected);
  search.value=view.query;sort.value=view.sort;
  panel(false);buildFilterPanel();render();updateTray();
}));
$("category-options").addEventListener("click",event=>{
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>("[data-category]");
  if(!button)return;
  if(collection==="methods"&&button.dataset.category==="tools"){
    const opened=toolsMenu.isOpen();view.category="tools";panel(false);render();
    if(opened)toolsMenu.close();else toolsMenu.open();
  }else{toolsMenu.close();view.category=button.dataset.category!;render();}
});
$("filter-fields").addEventListener("change",event=>{
  const control=event.target;if(!(control instanceof HTMLSelectElement)||!control.dataset.facet)return;
  view.filters[control.dataset.facet]=control.value;render();
});
$("signal-options").addEventListener("change",()=>{
  view.signals=Array.from(document.querySelectorAll<HTMLInputElement>("input[name=signal]:checked")).map(el=>el.value);render();
});
search.addEventListener("input",()=>{view.query=search.value;render();});
sort.addEventListener("change",()=>{view.sort=sort.value;render();});
$("reset-filters").addEventListener("click", reset);
$("empty-reset").addEventListener("click", reset);
$("filters-toggle").addEventListener("click", () => {toolsMenu.close();panel($("filter-panel").hidden);});
$("apply-filters").addEventListener("click", () => panel(false));
document.addEventListener("pointerdown", (event) => {
  if (!$("library-toolbar").contains(event.target as Node)) panel(false);
});
$("active-filters").addEventListener("click",event=>{
  const button=(event.target as HTMLElement).closest<HTMLElement>("[data-remove]");if(!button)return;
  const key=button.dataset.remove!;
  if(key==="q"){view.query="";search.value="";}
  else if(key==="tool"){view.toolTopic="all";view.slamFamily="all";}
  else if(key==="signal")view.signals=view.signals.filter(s=>s!==button.dataset.value);
  else delete view.filters[key];
  buildFilterPanel();render();
});
$("open-compare").addEventListener("click", showCompare);
$("clear-compare").addEventListener("click", () => {
  selected.clear();
  updateTray();
});
$("share-view").addEventListener("click", async () => {
  syncUrl();
  try {
    await navigator.clipboard.writeText(location.href);
    announce("Link copied. Filters and comparison are included.");
  } catch {
    const field = document.createElement("input");
    field.value = location.href;
    field.setAttribute("aria-label", "Copy view URL");
    $("active-filters").append(field);
    field.select();
    announce("Copy the selected link to share this view.");
  }
});
document.querySelectorAll("[data-about]").forEach((b) =>
  b.addEventListener("click", () => {
    about.showModal();
    document.body.classList.add("dialog-open");
  }),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {toolsMenu.close(true);panel(false);}
  if (
    event.key === "/" &&
    ![detail, compare, about, roadmap].some((d) => d.open) &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(
      (event.target as HTMLElement).tagName,
    )
  ) {
    event.preventDefault();
    toolsMenu.close();
    search.focus();
  }
});
let resizeFrame = 0;
addEventListener(
  "resize",
  () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (activeBatch) shimmerMask(activeBatch);
      if (works.length) observe();
      fitPanel();
    });
  },
  { passive: true },
);
async function boot() {
  generation++;
  const token = generation;
  busy = true;
  results.replaceChildren();
  makeBatch(PAGE_SIZE);
  setBoundary(true, false);
  try {
    const response = await fetch(settings.endpoint, { cache: "no-cache" });
    if (!response.ok) throw Error(`Catalog HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw Error("Empty catalog");
    if (token !== generation) return;
    works = data as Work[];
    byId = new Map(works.map((w) => [w.id, w]));
    buildFilterPanel();
    render();
    updateTray();
    const item = params.get("item");
    if (item && byId.has(item)) showDetail(item);
  } catch (error) {
    if (token !== generation) return;
    busy = false;
    activeBatch = undefined;
    results.replaceChildren();
    setBoundary(false, false);
    $("feed-error").hidden = false;
    console.error(error);
  }
}
$("retry-load").addEventListener("click", () => void boot());
void boot();

document.querySelectorAll("[data-roadmap]").forEach(b => b.addEventListener("click", () => { roadmap.showModal(); document.body.classList.add("dialog-open"); }));
