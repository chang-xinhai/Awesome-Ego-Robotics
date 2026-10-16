# AGENTS.md

## Mission

Maintain **Awesome-Ego-Robotics**: egocentric and wearable capture, datasets,
methods, and learning for robotics. Cover natural human demonstrations from
hands to whole body, including vision, depth, IMU, EMG, gaze, touch, and force.
A supporting glove or wristband need not contain an ego camera; explain its role
in a capture or robot-learning system. Avoid a generic CV or VLA bibliography.

## Canonical content and repository structure

- `README.md` is the only canonical curated list. Do not split papers into `contents/` or topic Markdown files.
- `AGENTS.md` defines scope, sourcing, taxonomy and maintenance.
- `LICENSE` covers repository code and original text; third-party figures retain original rights.
- `website/` is the Astro visual atlas, adapted from Awesome-UMI.
- `.github/workflows/` contains validation and a manual-only deployment workflow.
- Optional `assets/` contains credited static assets.

Website manifests may supplement existing README IDs with summaries, images,
source-backed facts, release evidence, and image attribution. They cannot
introduce canonical works or override titles, dates, institutions, publications,
or links from README. IDs are explicit `<!-- work:stable-slug -->` markers inside the final table column. Reuse an ID only for distinct assets of the same canonical work.

## Canonical section layout

Keep these five top-level sections and a multi-level bilingual contents list:
1. Overview and Taxonomy — 概览与分类
2. Hardware and Capture Systems — 硬件与采集系统
3. Datasets — 数据集
4. Methods and Toolchains — 方法与工具链
5. Robot Learning and Evaluation — 机器人学习与评测

Also retain About, Must Read, News, Contents, Citation and Acknowledgement.
The Ego Data Pyramid is a roadmap through methods, not the entire taxonomy.
Direct representation, latent-action and video-learning routes can bypass
explicit reconstruction. Do not force every work into a serial 3D pipeline.

## Independent classification dimensions

Do not mix these into exclusive sibling categories:
- resource: hardware, dataset, method, policy/evaluation, reference/tool
- form: glasses, headset, headband, chest camera, wristband, glove, suit, hybrid
- observed signals: RGB/vision, depth, IMU, EMG, gaze, audio, tactile, force
- body coverage: hands, upper body, whole body; scene-only capture may be unknown
- task: natural manipulation, tool-mediated capture, teleoperation, locomotion
- availability: research prototype, commercial product, announced system
- release: hardware files, software license, data license/access, each separately

## Inclusion and neighboring repositories

Include resources with a primary-source-supported role in human egocentric or
wearable capture, human motion/interaction recovery, robot demonstration
translation, or learning/evaluation from these data. Mark exocentric reference
datasets and signal-only resources as reference/adjacent, not paired ego data.
For UMI grippers and tool-based interfaces, link to Awesome-UMI; include a full
entry here only for a substantive ego/wearable contribution. Generic simulation
benchmarks belong in their own survey unless they directly assess this transfer.
Awesome-Robot-Data-Engine remains a cross-source overview.

## Source priority and verification

1. Official paper (arXiv, proceedings, journal), author project or dataset site.
2. Author/lab/company GitHub, manufacturer documentation and product pages.
3. Secondary awesome lists and daily feeds for discovery only.

Verify every canonical work against primary public evidence. Never copy private
research proposals, budgets, strategy, personal notes or unpublished claims into
this public repository. Do not guess URLs, venue, affiliation, dates, licensing,
measurements, availability or resource scale. Missing values stay unknown.
A product page is evidence of a listed product, not independent performance
validation, retail availability, or proof of closed source.

## Entry format and ordering

Use the same compact six columns as Awesome-UMI:

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |

- Dates use arXiv **v1**, never revisions or conference acceptance. Use original
  proceedings/publication dates when no arXiv exists. Partial YYYY-MM/YYYY
  precision is preferable to an invented day. Undated products use `—`.
- Institute is the first confirmed institution or official organization; unknown `—`.
- Paper/resource title and links must identify the actual item. Product and
  Official resource labels prevent products being mistaken for papers.
- Sort every subsection newest first, undated last. Website defaults to Newest.
- Use stable explicit IDs and stable headings; never use verification date as publication date.
- One canonical full entry per principal asset. A separate hardware/dataset
  placement is allowed only when genuinely released as distinct assets; reuse ID
  and metadata. Prefer cross-links for methods already represented elsewhere.

## Evidence and modality rules

Keep raw observations, derived estimates, reference/teacher labels, and actual
policy inputs separate. Camera-relative hand mesh is not world trajectory;
world coordinates do not guarantee metric scale; monocular estimated depth is
not measured RGB-D. Visual contact inference is not a tactile/force sensor.
Retargeted human motion is not executable robot-action ground truth. Playback
is not closed-loop policy learning. Simulation evidence is not real deployment.

Dataset evidence separates reported paper scale from released/downloadable
scale. Record observation streams, labels, coordinate frames, format, access,
and primary sources when verified. Do not sum hours across overlapping corpora.
Release evidence separates hardware source, software and datasets. `open`
requires appropriate licensed sources for the relevant artifact; `partial`,
`closed`, and `unknown` remain distinct. Selling a device does not prove `closed`.
Unknown absence is not None; use Yes/None/Optional/Reference/Unknown concise display values.

## Images and website

Hardware covers must show the device, rig, or labeled hardware diagram.
Dataset covers show environments, example sequences, interaction coverage or
overviews. Method covers can show method figures. Never use a pipeline as a
hardware photograph. Prefer official paper HTML/project media, optimize locally,
and preserve source page, original URL, credit, alt text and review date. Do not
relicense third-party figures. Inspect images visually before inclusion.

Preserve the UMI design system: serif headline, white surfaces, soft corners,
responsive filtering, keyboard access, concise details, source evidence,
comparison, shared diagonal skeleton sweep, one-viewport-ahead loading, three
loading dots, final `end`, and reduced-motion support. Existing cards keep DOM
and scroll position during append. Hardware/dataset/method compare fields differ.

## Maintenance and validation

News records milestones, not routine additions. Conventional Commits:
`docs:`, `feat:`, `fix:`, `refactor:`, `chore:`.
Before finishing: check primary links, README IDs, six-column schema, dates,
ordering, manifest IDs/local images, `npm test`, `npm run check`, `npm run build`, and browser
search/filter/details/compare/shared URL on desktop and mobile. Review design
and source quality with subagents when the task requests parallel review.

## Deployment policy

The current website is a **local review draft**. Do not enable GitHub Pages,
trigger deployment, add push-triggered deployment, or advertise a live website
until the user approves the local preview. Source pushes and validation CI are
allowed. Keep deployment manual (`workflow_dispatch`) until approval.

## Collection filters and evidence presentation

Keep category bars and facet definitions separate by hardware/datasets/methods.
Methods must expose L1–L6 plus tools; L6 remains parallel, not another required
step in explicit reconstruction. Never mix hardware forms and dataset families
into a method dropdown. Limit each panel to five relevant facets; compute option
counts from the active category and other filters. Preserve each collection's
query, sort, category, facets, signals and comparison separately.

Use explicit output/representation, validation and learning classifications;
real-robot trajectory execution is not automatically a closed-loop policy.
Project release is not automatically hardware design openness. Rendered channels
can be filtered for synthetic data but must stay separate from physical signals.
Preserve field-level source URLs, measurement scope, unit qualifiers and new
scale dimensions. Empty lists must render an honest unknown, never a blank fact.
Restore keyboard focus when replacing filter controls and after closing sheets.
