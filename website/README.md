# Awesome Ego Robotics · visual atlas

A published visual atlas using the approved [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI) visual system and Astro stack.
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
npm test
npm run check
npm run build
npm run preview -- --host 0.0.0.0 --port 4342
```

## Organization

- `src/lib/catalog.ts`: README parsing, deduplication and validation.
- `src/lib/tooling.ts`: README-derived tool subgroups and SLAM families.
- `src/scripts/tool-menu.ts`: accessible, responsive split menu for Tools.
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

## Deployment

The approved public atlas is available at
<https://chang-xinhai.github.io/Awesome-Ego-Robotics/>. GitHub Pages uses GitHub
Actions. `validate.yml` tests, checks and builds source pushes;
`deploy-website.yml` publishes reviewed `main` revisions through its manual
`workflow_dispatch` trigger. Local development and preview remain available.

```sh
gh workflow run deploy-website.yml --ref main
```

## Verification

Build validation rejects missing IDs, malformed tables, inconsistent repeated
metadata, evidence pointing to absent works, and missing local images.
Before release, verify desktop/mobile browsing, each collection, combined
filters, details, context-specific comparisons, shared URLs, empty/error states,
keyboard operation, infinite loading and reduced motion. Review the rendered
site against Awesome-UMI for typography, palette, spacing, image fit, controls
and responsive behavior.

## Collection-specific discovery

Each lens has a visible category bar and at most five dedicated facets.
Hardware uses device families, form, coverage, availability and project release.
Datasets use data families, coverage, annotation evidence, data scope and access.
Methods use L1 hand reconstruction, L2 world/body motion, L3 interaction, L4
robotization, L5 policy learning, L6 direct video-learning routes, and tools.
Their additional filters cover output/representation, validation and learning.
Tools opens an on-demand split menu for SLAM, calibration/synchronization,
trajectory evaluation, Ego/UMI workflows and Others. SLAM further separates
visual/inertial, learned/dense, LiDAR/fusion and capture-workflow references.
Streaming reconstruction and geometry foundations have independent groups;
card labels distinguish full SLAM, odometry, streaming/offline reconstruction,
and geometry models. Optional backend features remain explicit in Details.
This view uses execution mode, loop closure, relocalization, project release
and year as its five facets. `tool=` and `family=` preserve the nested selection
in shared URLs; switching collections retains each collection's state.
Year is shared. Options/counts narrow to the category and other active filters.
Query, sort, categories, facets, signals and comparison are remembered separately
for each lens. Shared URLs contain only the active view; legacy `source=` links
migrate to the equivalent category. Newest remains the default.

Every hardware/dataset/method placement has a real credited local preview.
Hardware videos are explicitly credited as original video frames. Rich details
separate capture/export, raw versus derived observations, annotations and
release scope, or method geometry versus robot evaluation. `fieldSources`
records primary evidence per field. Synthetic modalities remain separate from
physical recordings. Scale formatting preserves new dimensions and avoids
repeating units already present in source values.

SLAM details and comparisons also show system scope, actual sensor requirements,
online/offline execution, scale source, calibration and capture relevance.
Odometry, complete SLAM, offline reconstruction and point-map methods remain
explicitly distinct. README fourth-level tool headings supply the canonical
subgroup. Sourced SLAM cross-references can expose a work already indexed in
another research layer without duplicating its canonical row.
