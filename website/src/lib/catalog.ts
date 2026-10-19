import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import media from "../data/media.json";
import hardwareAudit from "../data/hardware-evidence.json";
import datasetAudit from "../data/dataset-evidence.json";
import releaseAudit from "../data/release-evidence.json";
import methodAudit from "../data/method-evidence.json";
import { SITE } from "./site";
import { compareDates } from "./order";
export interface Work {
  id: string;
  name: string;
  aliases?: string[];
  title: string;
  date: string;
  year: string;
  institute: string;
  publication: string;
  keywords: string;
  paperUrl: string;
  links: { label: string; url: string }[];
  sections: string[];
  subsections?: string[];
  source: string;
  kind: string;
  stage: string;
  collections: string[];
  coverage: string;
  form: string;
  forms?: string[];
  tracking: string;
  signals: string[];
  format: string;
  dataAccess: string;
  codeAccess: string;
  imagePage?: string;
  image?: string;
  imageAlt?: string;
  imageSource?: string;
  credit?: string;
  reviewed?: string;
  summary?: string;
  coverImage?: string;
  coverAlt?: string;
  coverType?: string;
  coverSource?: string;
  coverIsPhoto?: boolean;
  hardwareImage?: string;
  hardwareImageCredit?: string;
  hardwareImageAlt?: string;
  hardwareImageSource?: string;
  hardwareImagePage?: string;
  hardwareImageType?: string;
  datasetImage?: string;
  datasetImageAlt?: string;
  datasetImageSource?: string;
  datasetImagePage?: string;
  datasetImageType?: string;
  datasetSummary?: string;
  datasetName?: string;
  openness?: string;
  commercial?: boolean;
  release?: Record<string, unknown>;
  research?: {
    method?: Record<string, unknown>;
    hardware?: Record<string, unknown>;
    dataset?: Record<string, unknown>;
  };
  tactileStatus?: string;
  forceStatus?: string;
}

const clean = (s: string) => s.replace(/\*\*|`/g, "").replace(/<br\s*\/?\s*>/gi, " ").replace(/\\\|/g, "/").trim();
const links = (s: string) => Array.from(s.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g), m => ({label: clean(m[1]), url: m[2]}));
export function getCatalog(): Work[] {
  const content = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");
  const map = new Map<string, Work>();
  let top = "", section = "", subsection = "", id = "";
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith("## ")) { top = clean(line.slice(3)); section = ""; subsection = ""; id = ""; continue; }
    if (line.startsWith("### ")) { section = clean(line.slice(4)); subsection = ""; continue; }
    if (line.startsWith("#### ")) { subsection = clean(line.slice(5)); continue; }
    const marker = line.match(/<!-- work:([a-z0-9-]+) -->/);
    if (marker) id = marker[1];
    if (!SITE.headings.includes(top) || !/^\| (?:\d{4}|—)/.test(line)) continue;
    if (!id) throw new Error("README curated row requires a stable work ID");
    const c = line.replace(/<!-- work:[a-z0-9-]+ -->/g, "").replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map(clean);
    if (c.length !== 6) throw new Error(`Expected six columns: ${id}`);
    const paper = links(c[3])[0];
    if (!paper) throw new Error(`Missing canonical link: ${id}`);
    const collection = top === "Hardware and Capture Systems" ? "hardware" : top === "Datasets" ? "datasets" : "methods";
    const source = top === "Hardware and Capture Systems" ? "Hardware" : top === "Datasets" ? "Datasets" : top === "Methods and Toolchains" ? "Methods" : "Learning";
    const location = `${top} / ${section}`;
    const old = map.get(id);
    if (old) {
      if (old.paperUrl !== paper.url || old.date !== c[0] || old.title !== paper.label) throw new Error(`Inconsistent repeated work: ${id}`);
      old.sections.push(location);
      if (subsection) (old.subsections ??= []).push(`${location} / ${subsection}`);
      if (!old.collections.includes(collection)) old.collections.push(collection);
      for (const link of links(c[5])) if (!old.links.some(l => l.url === link.url)) old.links.push(link);
    } else map.set(id, {
      id, title: paper.label, name: paper.label.split(":")[0], date: c[0], year: /^\d{4}/.test(c[0]) ? c[0].slice(0,4) : "Undated", institute: c[2], publication: c[4], keywords: c[1], paperUrl: paper.url, links: links(c[5]), sections: [location], subsections: subsection ? [`${location} / ${subsection}`] : [], source, kind: collection === "hardware" ? "System" : collection === "datasets" ? "Dataset" : "Method", collections: [collection], stage: section, form: "Not reported", coverage: "Not reported", tracking: "Not reported", signals: [], format: "Not reported", dataAccess: "Not verified", codeAccess: "Not verified",
    });
    id = "";
  }
  const seen = new Set<string>();
  for (const item of media as Array<Partial<Work> & {id: string}>) {
    const work = map.get(item.id);
    if (!work || seen.has(item.id)) throw new Error(`Media must reference a unique existing README ID: ${item.id}`);
    seen.add(item.id);
    for (const file of [item.image, item.hardwareImage, item.datasetImage, item.coverImage].filter(Boolean) as string[]) if (!existsSync(resolve(process.cwd(), "public", file))) throw new Error(`Missing preview: ${file}`);
    Object.assign(work, item);
  }
  const hardware = hardwareAudit.works as Record<string, Record<string, unknown>>;
  const datasets = datasetAudit.records as Record<string, Record<string, unknown>>;
  const methods = methodAudit.works as Record<string, Record<string, unknown>>;
  const releases = releaseAudit.works as Record<string, Record<string, unknown>>;
  for (const dict of [hardware, datasets, methods, releases]) for (const key of Object.keys(dict)) if (!map.has(key)) throw new Error(`Evidence references missing README ID: ${key}`);
  for (const work of map.values()) {
    const h = hardware[work.id], d = datasets[work.id], m = methods[work.id];
    work.research = {hardware: h, dataset: d, method: m};
    work.release = releases[work.id];
    if (work.release?.softwareStatus) work.codeAccess = String(work.release.softwareStatus);
    work.openness = String(work.release?.status ?? "unknown");
    work.commercial = work.release?.commercial === true;
    work.tactileStatus = String((h?.tactile as Record<string, unknown>)?.status ?? "unknown");
    work.forceStatus = String((h?.forceTorque as Record<string, unknown>)?.status ?? "unknown");
    if (d?.access) work.dataAccess = String(d.access);
    if (Array.isArray(d?.formats) && d.formats.length) work.format = d.formats.join(" / ");
  }
  if (!map.size) throw new Error("README contains no curated works");
  return [...map.values()].sort(compareDates);
}
