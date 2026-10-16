# Awesome Ego Robotics · visual atlas

A local review draft using the approved [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI) visual system and Astro stack.
The canonical curated collection is `../README.md`. Titles, dates, institutions,
publications, links, and taxonomy are parsed from its six-column tables. A
`<!-- work:stable-slug -->` comment inside every row’s final column supplies its persistent ID.
The website does not maintain a second bibliography.

## Local preview

Requires Node.js 22.22+.

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4342
```

Open <http://localhost:4342/Awesome-Ego-Robotics/>. `explore/` is an alternate entry
point. `catalog.json` is the static README-derived catalog.

```sh
npm run check
npm run build
npm run preview -- --host 0.0.0.0 --port 4342
```

## Organization

- `src/lib/catalog.ts`: README parsing, deduplication and validation.
- `src/data/media.json`: display names, short summaries, modality and coverage
  facets, credited context-specific preview paths. Existing README IDs only.
- `src/data/hardware-evidence.json`: capture form, tracking and measured sensing.
- `src/data/dataset-evidence.json`: observed streams, annotations, access,
  reported versus public scale, and formats.
- `src/data/method-evidence.json`: inputs, outputs, supervision and actual robot
  evidence; reconstruction is not automatically a real-robot policy result.
- `src/data/release-evidence.json`: artifact release status, commercial products
  and source evidence. Unknown is separate from closed source.
- `public/images/catalog/`: locally optimized official figures with provenance
  retained in the manifests. Third-party media retain their owners' rights.
- `src/assets/fonts/`: locally hosted Source Serif 4 and its SIL OFL license.

Hardware, Datasets and Methods each have a visual feed; Research index retains
all canonical resources. A separate roadmap includes hand/world/interaction
reconstruction, translation and policy learning, plus direct video routes.
Device form, body coverage and signal modalities are independent filters.
Methods use input/output/evidence comparisons; datasets compare observations,
labels, release and scale; hardware compares actual sensing and release.

The default is Newest (undated products last). Search, combined filters, details,
comparison and URL sharing work locally with no backend. Infinite loading
prefetches one viewport before the end, appends existing DOM without scroll
replacement, uses one masked diagonal shimmer per skeleton batch, shows three
loading dots and finishes with `end`. Reduced motion disables sweep and bounce.
No remote runtime image requests or web fonts are required.

## Image maintenance

Use hardware photos/rig diagrams for hardware; dataset task examples or
coverage overviews for datasets; method figures only for methods. Preserve
image URL, original source page, alt text and review date. No available verified
figure means a source card, not a fabricated image or unrelated fallback.

## Deployment is pending preview approval

`validate.yml` only checks/builds source. `deploy-website.yml` is manual-only and
has not been run. GitHub Pages must remain disabled until the user approves the
local preview. When approved, enable Pages with GitHub Actions and dispatch the
manual workflow; adding automatic deployment is a separate choice.

## Verification

Build validation rejects missing IDs, malformed tables, inconsistent repeated
metadata, evidence pointing to absent works, and missing local images.
Before release, verify desktop/mobile browsing, each collection, combined
filters, details, context-specific comparisons, shared URLs, empty/error states,
keyboard operation, infinite loading and reduced motion. Review the rendered
site against Awesome-UMI for typography, palette, spacing, image fit, controls
and responsive behavior.
