<div align="center">
<h1 id="awesome-ego-robotics">Awesome-Ego-Robotics</h1>
<p><strong>Egocentric & Wearable Capture, Data, and Learning for Robotics</strong></p>
<p>面向机器人的第一视角与可穿戴采集、数据及学习</p>
<p><a href="#hardware-and-capture-systems">Hardware 硬件</a> · <a href="#datasets">Datasets 数据集</a> · <a href="#methods-and-toolchains">Methods 方法</a> · <a href="#robot-learning-and-evaluation">Robot learning 机器人学习</a></p>
</div>

> **Website preview:** the visual atlas is under local review. Run the instructions in [website/README.md](website/README.md); public website deployment is pending preview approval.

## About

A curated map of human experience as a source of robot skills: first-person
cameras, wearable sensing, hand and body motion, interaction datasets,
demonstration translation, and learning from human data.

The scope extends from hands to whole body and from vision to depth, IMU, gaze,
audio, EMG, touch and force. Supporting gloves, EMG bands and mocap systems can
be included without an ego camera when their role in capture or robot learning
is explicit. Reference-only or synthetic resources are labeled; they are not
presented as synchronized human egocentric recordings.

The README is the canonical collection. The website adds credited figures,
faceted browsing, compact details, source evidence and context-specific
comparison, using the visual system of [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI).

<p align="center"><img src="assets/dexcap-hardware.webp" alt="DexCap (Stanford) capture hardware" width="850"><br><sub>Wearable capture: DexCap combines hand motion capture and scene sensing. Source: <a href="https://arxiv.org/html/2403.07788v1">official project / paper</a>. Figure rights remain with the original authors.</sub></p>
<p align="center"><img src="assets/hot3d-datasets.webp" alt="HOT3D dataset examples and annotations" width="850"><br><sub>Dataset view: HOT3D captures hand–object interactions and reference geometry. Source: <a href="https://facebookresearch.github.io/hot3d/">official project / paper</a>. Figure rights remain with the original authors.</sub></p>

## Must Read

| Question | Starting points |
| :-- | :-- |
| What can an ego capture platform actually record? | [Project Aria tools](https://github.com/facebookresearch/projectaria_tools), [HOT3D](https://facebookresearch.github.io/hot3d/) |
| Where are large first-person video corpora? | [Ego4D](https://ego4d-data.org/), [Ego-Exo4D](https://ego-exo4d-data.org/), [EPIC-KITCHENS](https://epic-kitchens.github.io/) |
| What data support hands, objects and whole-body recovery? | [EgoDex](https://github.com/apple-aiml-research/ml-egodex), [ARCTIC](https://arctic.is.tue.mpg.de/), [Nymeria](https://github.com/facebookresearch/nymeria_dataset) |
| How do reconstruction stages differ? | [HaMeR](https://geopavlakos.github.io/hamer/), [HaWoR](https://hawor-project.github.io/), [EgoAllo](https://egoallo.github.io/) |
| How can demonstrations reach a robot? | [DexCap](https://dex-cap.github.io/), [EgoMimic](https://egomimic.github.io/) |
| How should the larger ecosystem connect? | [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI), [Awesome-Robot-Data-Engine](https://github.com/chang-xinhai/Awesome-Robot-Data-Engine) |

## News

- **2026-10-16** — Initialized the single-README collection and local visual atlas with independent hardware, dataset and method views.

## Contents

- [About · 关于](#about)
- [Must Read · 阅读入口](#must-read)
- [Overview and Taxonomy · 概览与分类](#overview-and-taxonomy)
  - [Independent Dimensions · 独立分类维度](#independent-dimensions)
  - [Research Roadmap · 研究路线](#research-roadmap)
  - [Evidence and Inclusion · 证据与收录](#evidence-and-inclusion)
- [Hardware and Capture Systems · 硬件与采集系统](#hardware-and-capture-systems)
  - [Egocentric cameras and headsets · 第一视角相机与头戴设备](#egocentric-cameras-and-headsets)
  - [Gloves and hand capture · 手套与手部采集](#gloves-and-hand-capture)
  - [EMG and neural interfaces · 肌电与神经接口](#emg-and-neural-interfaces)
  - [Whole-body and hybrid capture · 全身与混合采集](#whole-body-and-hybrid-capture)
  - [Contact and tactile capture · 接触与触觉采集](#contact-and-tactile-capture)
- [Datasets · 数据集](#datasets)
  - [Video and activity · 视频与活动](#video-and-activity)
  - [Hand-object geometry and pose · 手物几何与姿态](#hand-object-geometry-and-pose)
  - [Whole-body and multimodal · 全身与多模态](#whole-body-and-multimodal)
  - [Touch force and EMG · 触觉、力与肌电](#touch-force-and-emg)
  - [Robot demonstration and transfer · 机器人示范与迁移](#robot-demonstration-and-transfer)
- [Methods and Toolchains · 方法与工具链](#methods-and-toolchains)
  - [Hand reconstruction · 手部重建](#hand-reconstruction)
  - [World-space and body motion · 世界坐标与身体运动](#world-space-and-body-motion)
  - [Hand-object interaction · 手物交互](#hand-object-interaction)
  - [Demonstration translation · 机器人示范转换](#demonstration-translation)
  - [Representation and latent actions · 表征与隐式动作](#representation-and-latent-actions)
- [Robot Learning and Evaluation · 机器人学习与评测](#robot-learning-and-evaluation)
  - [Policy learning from human data · 从人类数据学习策略](#policy-learning-from-human-data)
  - [Evaluation and toolchains · 评测与工具链](#evaluation-and-toolchains)
- [Citation · 引用](#citation)
- [Acknowledgement · 致谢](#acknowledgement)

## Overview and Taxonomy

概览与分类。The three collection views describe resource types; the dimensions
below remain independent so that a glove can be commercial, full-body-compatible,
and IMU/EMG-enabled without being forced into one exclusive category.

### Independent Dimensions

| Dimension / 维度 | Values and interpretation / 取值与解释 |
| :-- | :-- |
| Resource / 资源类型 | Hardware, dataset, reconstruction/toolchain, policy/evaluation |
| Form / 设备形态 | Glasses, headset, headband, chest camera, wristband, glove, suit, hybrid rig |
| Signals / 采集信号 | RGB/vision, depth, IMU, EMG, gaze, audio, tactile, force; derived estimates labeled separately |
| Body coverage / 身体范围 | One/both hands, upper body, whole body; scene capture does not imply body tracking |
| Interaction / 交互形态 | Natural manipulation, tools, contact-rich actions, locomotion, teleoperation |
| Geometry / 几何表示 | 2D joints, camera-relative 3D, world-space trajectories, metric scale, objects/contact |
| Learning role / 学习用途 | Pretraining, co-training, robotization, rewards, policy inputs, evaluation |
| Access / 开放状态 | Hardware files, licensed software, dataset download/conditions, commercial availability — separately |

### Research Roadmap

The **Ego Data Pyramid** is one way to survey methods inside this larger field.
It is a reading route, not a claim that every policy must reconstruct 3D.

```mermaid
flowchart LR
    A[Capture & Datasets 采集与数据] --> B[Hand Reconstruction 手部重建]
    B --> C[World Motion 世界运动]
    C --> D[Hand-Object Interaction 手物交互]
    D --> E[Robot Demonstrations 机器人示范]
    E --> F[Policy & Evaluation 策略与评测]
    A --> G[Representations / Latent Actions 表征与隐式动作]
    G --> F
```

Full-body, EMG, tactile and force can enter at capture, supervision, interaction,
or policy stages. They are not limited to an extra tag on hand reconstruction.

### Evidence and Inclusion

- **Observation ≠ estimate ≠ reference label ≠ policy input.** Measured depth is
  different from monocular predicted depth; optical flow or contact prediction
  is different from a tactile sensor. Haptic feedback is not measured touch.
- **Camera frame ≠ world frame ≠ metric scale.** Inspect calibration, scale,
  timing and drift before assuming trajectories can drive a robot.
- **Retargeting ≠ executable action ground truth.** Distinguish kinematic
  translation, simulation, playback and closed-loop real-robot policy evidence.
- **Reported scale ≠ released scale.** Subsets, access conditions, licenses and
  derived annotations remain explicit in dataset evidence.
- **Commercial ≠ closed source.** Product availability and hardware/software/data
  release are separate. Product claims are manufacturer-reported.
- Every entry is linked to a primary paper or official public resource. Dates
  use arXiv **v1** where available; `—` means no verified publication date.
  Partial dates retain their original precision. For older papers uploaded to
  arXiv later (e.g. MANO), the venue year can precede the Date column.
- Keep UMI tool interfaces primarily in [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI).
  Include them here when a distinct ego/wearable contribution is central.

## Hardware and Capture Systems

硬件与采集系统。Research rigs and commercial devices are both included. A commercial listing does not establish availability in every region or an independently tested tracking accuracy.

### Egocentric cameras and headsets

第一视角相机与头戴设备。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-08-08 | Headband, Vision, IMU | FPV Labs | [Ego-OSCAR: Egocentric Open source Stereo CAptuRe System](https://arxiv.org/abs/2608.08285) | arXiv | [Code & hardware](https://github.com/fpv-labs/ego-oscar) / [Dataset](https://huggingface.co/datasets/fpvlabs/stereo-550) <!-- work:ego-oscar --> |
| 2025-12-04 | Hybrid, Vision, Depth, Tactile, State | Lightwheel | [EgoSuite multimodal human data capture](https://lightwheel.ai/egosuite) | Product | — <!-- work:lightwheel-egosuite --> |
| — | Glasses, Vision, IMU, Gaze, Audio | Meta | [Project Aria Gen 1 research glasses](https://facebookresearch.github.io/projectaria_tools/docs/tech_spec/hardware_spec) | Official resource | [Tools](https://github.com/facebookresearch/projectaria_tools) <!-- work:project-aria-gen1 --> |
| — | Glasses, Vision, IMU, Gaze, Audio | Meta | [Project Aria Gen 2 research glasses](https://facebookresearch.github.io/projectaria_tools/gen2/technical-specs/device/hardware) | Official resource | [Tools](https://github.com/facebookresearch/projectaria_tools) / [Research kit](https://ai.meta.com/aria-application/) <!-- work:project-aria-gen2 --> |
| — | Glasses, Vision, IMU, Gaze, Audio | Pupil Labs | [Neon wearable eye tracker](https://pupil-labs.com/products/neon) | Product | [Documentation](https://docs.pupil-labs.com/neon/) <!-- work:pupil-neon --> |
| — | Glasses, Vision, IMU, Gaze, Audio | Tobii | [Tobii Pro Glasses 3 wearable eye tracker](https://www.tobii.com/products/eye-trackers/wearables/tobii-pro-glasses-3) | Product | — <!-- work:tobii-pro-glasses-3 --> |
| — | Headband, Vision, State | Kinetix AI | [Kai Ego Suite human demonstration capture](https://www.kinetixai.tech/zh/KaiEgo) | Product | [Documentation](https://www.kinetixai.tech/zh/docs/kaiego) <!-- work:kai-ego --> |
| — | Headband, Vision, IMU, Audio | GenRobot | [DAS Ego head-mounted capture system](https://docs.genrobot.ai/products/das-ego) | Product | [Data format](https://docs.genrobot.ai/guides/das-ego-data-introduction) / [Dataset](https://huggingface.co/datasets/genrobot2025/Gen-HumanEgo) <!-- work:das-ego --> |
| — | Headband, Vision, Depth, IMU, State | Lumos Robotics | [Lumos Ego head-mounted multimodal recorder](https://www.lumosbot.tech/products/ego/) | Product | — <!-- work:lumos-ego --> |
| — | Hybrid, Vision | Maniformer | [MEgo View human demonstration capture kit](https://maniformer.ai/mego) | Product | — <!-- work:mego-view --> |
| — | Headband, Vision, IMU, Audio | General Intelligence Labs | [Global-shutter stereo egocentric headset](https://www.gilabs.xyz/products/ego1gs) | Product | — <!-- work:gi-ego1gs --> |

### Gloves and hand capture

手套与手部采集。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2025-05-12 | Hybrid, Vision, State | Carnegie Mellon | [DexWild: Dexterous Human Interactions for In-the-Wild Robot Policies](https://arxiv.org/abs/2505.07813) | RSS 2025 | [Project](https://dexwild.github.io/) / [Code](https://github.com/dexwild/dexwild) / [Dataset](https://huggingface.co/datasets/boardd/dexwild-dataset) / [Code](https://github.com/dexwild/dexwild-training) / [Project](https://dexwild.github.io) <!-- work:dexwild --> |
| — | Glove, State | MANUS | [EMF finger-tracking gloves for robotics](https://www.manus-meta.com/products/metagloves-pro) | Product | [Licenses](https://www.manus-meta.com/software) <!-- work:manus-metagloves-pro --> |
| — | Glove, State | MANUS | [Legacy Quantum motion-capture gloves](https://www.manus-meta.com/products/quantum-metagloves) | Product | — <!-- work:manus-quantum-metagloves --> |
| — | Glove, State | StretchSense | [StretchSense human manipulation data capture](https://www.stretchsense.com/robotics) | Product | [Hardware](https://www.stretchsense.com/hardware) / [API](https://www.stretchsense.com/api-integrations) <!-- work:stretchsense-pro --> |
| — | Glove, IMU, State | Rokoko | [Inertial hand and finger capture gloves](https://www.rokoko.com/products/smartgloves-ii) | Product | [Device SDK](https://sdk.rokoko.com/) <!-- work:rokoko-smartgloves-ii --> |

### EMG and neural interfaces

肌电与神经接口。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-06-24 | Wristband, Vision, EMG, IMU, Force | Amazon FAR | [ForceBand: Learning Forceful Manipulation with sEMG](https://arxiv.org/abs/2606.26093) | arXiv | [Project](https://forceband-emg.github.io/) / [Code & BOM](https://github.com/Bottle101/ForceBand) <!-- work:forceband --> |
| 2026-05-07 | Hybrid, Vision, Depth, IMU, EMG, State | Tsinghua | [EgoEMG: A Multimodal Egocentric Dataset with Bilateral EMG and Vision for Hand Pose Estimation](https://arxiv.org/abs/2605.05712) | arXiv | [Code](https://github.com/zhenqis123/EgoEMG) <!-- work:egoemg --> |
| 2025-09-17 | Wristband, EMG, IMU | Meta | [Wrist EMG interface for wearable computing](https://www.meta.com/en-gb/emerging-tech/emg-wearable-technology/) | Product | [Launch](https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/) <!-- work:meta-neural-band --> |
| — | Armband, EMG, IMU | MindRove | [MindRove EMG Armband wearable EMG capture](https://mindrove.com/product/emg-armband/) | Product | [SDK](https://docs.mindrove.com/main/index.html) <!-- work:mindrove-armband --> |
| — | Hybrid, EMG, IMU | Delsys | [Delsys Trigno Avanti wearable EMG capture](https://delsys.com/trigno/) | Product | [SDK manual](https://www.delsys.com/downloads/USERSGUIDE/trigno/sdk.pdf) <!-- work:delsys-trigno-avanti --> |

### Whole-body and hybrid capture

全身与混合采集。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-10-12 | Headset, Vision, State | Zhongguancun Academy | [EgoWholeView: Camera-Only Head-Mounted Capture of Body and Bimanual Hand Motion for Embodied Demonstrations](https://arxiv.org/abs/2610.16256) | arXiv | — <!-- work:egowholeview --> |
| 2025-03-14 | Headset, Vision, State | MPI Informatics | [Bring Your Rear Cameras for Egocentric 3D Human Pose Estimation](https://arxiv.org/abs/2503.11652) | ICCV 2025 | [Code](https://github.com/hiroyasuakada/EgoRear) <!-- work:egorear --> |
| 2024-03-12 | Hybrid, Vision, Depth, State | Stanford | [DexCap: Scalable and Portable Mocap Data Collection System for Dexterous Manipulation](https://arxiv.org/abs/2403.07788) | RSS 2024 | [Project](https://dex-cap.github.io/) / [Code](https://github.com/j96w/DexCap) / [Project](https://dex-cap.github.io) <!-- work:dexcap --> |
| 2016-09-23 | Headset, Vision, State | — | [EgoCap: Egocentric Marker-less Motion Capture with Two Fisheye Cameras](https://arxiv.org/abs/1609.07306) | SIGGRAPH Asia 2016 | — <!-- work:egocap --> |
| — | Suit, IMU, State | Xsens | [Xsens Link inertial full-body capture](https://www.xsens.com/motion-capture/xsens-link-specifications) | Product | [Robotics context](https://www.xsens.com/products/motion-capture) <!-- work:xsens-link --> |
| — | Suit, IMU, State | Xsens | [Xsens Awinda wireless body tracking](https://www.xsens.com/motion-capture/xsens-mvn-awinda) | Product | — <!-- work:xsens-awinda --> |
| — | Suit, IMU, State | Rokoko | [Wireless inertial full-body mocap suit](https://www.rokoko.com/products/smartsuit-pro) | Product | [Device SDK](https://sdk.rokoko.com/) <!-- work:rokoko-smartsuit-pro-ii --> |
| — | Suit, IMU, State | Sony | [Portable sparse-inertial full-body capture](https://xyn.sony.net/en/developer/technical/mocopi/aboutmocopi) | Product | — <!-- work:sony-mocopi --> |

### Contact and tactile capture

接触与触觉采集。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2025-12-09 | Glove, Tactile, Magnetic flux | Meta FAIR | [OSMO: Open-Source Tactile Glove for Human-to-Robot Skill Transfer](https://arxiv.org/abs/2512.08920) | arXiv | [Project](https://jessicayin.github.io/osmo_tactile_glove/) / [Hardware & code](https://github.com/jessicayin/osmo_tactile_glove) <!-- work:osmo --> |
| 2024-09-03 | Hybrid, Vision, Depth, Tactile, State | ETH Zürich | [EgoPressure: A Dataset for Hand Pressure and Pose Estimation in Egocentric Vision](https://arxiv.org/abs/2409.02224) | CVPR 2025 | [Project](https://yiming-zhao.github.io/EgoPressure/) / [Project](https://siplab.org/projects/EgoPressure) / [GitHub](https://github.com/eth-siplab/EgoPressure) / [Dataset](https://dataset.egopressure.inf.ethz.ch/) <!-- work:egopressure --> |

## Datasets

数据集。Video, pose, whole-body, touch/force/EMG and robot-transfer assets. Reference and synthetic resources are explicitly marked in keywords; their signal pairing and evidence differ.

### Video and activity

视频与活动。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2025-03-05 | Video and activity, RGB, Audio, Daily activity and environment | NTU S-Lab | [EgoLife: Towards Egocentric Life Assistant](https://arxiv.org/abs/2503.03803) | CVPR 2025 | [Project](https://egolife-ai.github.io/blog/) / [Dataset](https://huggingface.co/collections/lmms-lab/egolife-67c04574c2a9b64ab312c342) <!-- work:egolife --> |
| 2025-02-06 | Video and activity, RGB, Monochrome, IMU, Eye tracking, Audio, Hands and environment | University of Bristol | [HD-EPIC: A Highly-Detailed Egocentric Video Dataset](https://arxiv.org/abs/2502.04144) | CVPR 2025 | [Project](https://hd-epic.github.io/site/) / [GitHub](https://github.com/hd-epic/hd-epic-annotations) / [Dataset](https://hd-epic.github.io/site/#download) <!-- work:hd-epic --> |
| 2023-11-30 | Video and activity, RGB, Monochrome, IMU, Eye tracking, Audio, Hands and whole body | Ego-Exo4D consortium | [Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives](https://arxiv.org/abs/2311.18259) | CVPR 2024 | [Project](https://ego-exo4d-data.org/) / [GitHub](https://github.com/facebookresearch/Ego4d) / [Dataset](https://docs.ego-exo4d-data.org/) <!-- work:ego-exo4d --> |
| 2022-03-28 | Video and activity, RGB, Monochrome, Bimanual | Assembly101 collaboration | [Assembly101: A Large-Scale Multi-View Video Dataset for Understanding Procedural Activities](https://arxiv.org/abs/2203.14712) | CVPR 2022 | [Project](https://assembly-101.github.io/) / [GitHub](https://github.com/assembly-101/assembly101-annotations) / [Dataset](https://huggingface.co/datasets/cvml-nus/assembly101) <!-- work:assembly101 --> |
| 2021-10-13 | Video and activity, RGB, Audio, Hands and daily activity | Ego4D consortium | [Ego4D: Around the World in 3,000 Hours of Egocentric Video](https://arxiv.org/abs/2110.07058) | CVPR 2022 | [Project](https://ego4d-data.org/) / [GitHub](https://github.com/facebookresearch/Ego4d) / [Dataset](https://ego4d-data.org/docs/start-here/) <!-- work:ego4d --> |
| 2020-06-23 | Video and activity, RGB, Audio, Hands and daily activity | University of Bristol | [Rescaling Egocentric Vision](https://arxiv.org/abs/2006.13256) | IJCV 2022 | [Project](https://epic-kitchens.github.io/2025) / [GitHub](https://github.com/epic-kitchens/epic-kitchens-100-annotations) / [Dataset](https://epic-kitchens.github.io/2025#downloads) <!-- work:epic-kitchens --> |
| 2018-02-21 | Video and activity, RGB, Depth, Hands | Chinese Academy of Sciences | [EgoGesture](https://nlpr.ia.ac.cn/iva/yfzhang/datasets/egogesture.html) | IEEE TMM 2018 | — <!-- work:egogesture --> |

### Hand-object geometry and pose

手物几何与姿态。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-03-30 | Hand-object geometry and pose, Monochrome, Bimanual | Meta Reality Labs | [SHOW3D: Capturing Scenes of 3D Hands and Objects in the Wild](https://arxiv.org/abs/2603.28760) | CVPR 2026 | [Project](https://show3d-dataset.github.io/) / [GitHub](https://github.com/facebookresearch/show3d) / [Dataset](https://huggingface.co/datasets/facebook/show3d-dataset) <!-- work:show3d --> |
| 2026-03-14 | 12 views, Fisheye, Stereo views, WebDataset, Parquet | Meta Reality Labs | [Ego-1K -- A Large-Scale Multiview Video Dataset for Egocentric Vision](https://arxiv.org/abs/2603.13741) | arXiv 2026 | [Project](https://huggingface.co/datasets/facebook/ego-1k) <!-- work:ego-1k --> |
| 2024-11-28 | Hand-object geometry and pose, RGB, Monochrome, Eye tracking, Bimanual | Meta Reality Labs | [HOT3D: Hand and Object Tracking in 3D from Egocentric Multi-View Videos](https://arxiv.org/abs/2411.19167) | CVPR 2025 | [Project](https://facebookresearch.github.io/hot3d/) / [GitHub](https://github.com/facebookresearch/hot3d) / [Dataset](https://huggingface.co/datasets/projectaria/hot3d) <!-- work:hot3d --> |
| 2024-06-10 | Hand-object geometry and pose, RGB, Depth, Hands and objects | UT Dallas | [HO-Cap: A Capture System and Dataset for 3D Reconstruction and Pose Tracking of Hand-Object Interaction](https://arxiv.org/abs/2406.06843) | NeurIPS 2025 Datasets & Benchmarks | [Project](https://irvlutd.github.io/HOCap/) / [GitHub](https://github.com/IRVLUTD/HO-Cap) / [Dataset](https://irvlutd.github.io/HOCap/#data) <!-- work:hocap --> |
| 2024-03-28 | Hand-object geometry and pose, RGB, Bimanual and upper body | Shanghai Jiao Tong University | [OAKINK2: A Dataset of Bimanual Hands-Object Manipulation in Complex Task Completion](https://arxiv.org/abs/2403.19417) | CVPR 2024 | [Project](https://oakink.net/v2/) / [GitHub](https://github.com/oakink/OakInk2) <!-- work:oakink2 --> |
| 2024-01-16 | Hand-object geometry and pose, RGB, Bimanual | Tsinghua University | [TACO: Benchmarking Generalizable Bimanual Tool-ACtion-Object Understanding](https://arxiv.org/abs/2401.08399) | CVPR 2024 | [Project](https://taco2024.github.io/) / [GitHub](https://github.com/leolyliu/TACO-Instructions) <!-- work:taco --> |
| 2023-04-24 | Hand-object geometry and pose, RGB, Monochrome, Bimanual | Meta | [AssemblyHands: Towards Egocentric Activity Understanding via 3D Hand Pose Estimation](https://arxiv.org/abs/2304.12301) | CVPR 2023 | [Project](https://assemblyhands.github.io/) / [GitHub](https://github.com/facebookresearch/assemblyhands-toolkit) <!-- work:assemblyhands --> |
| 2022-08-07 | Hand-object geometry and pose, RGB, Hands and objects | — | [Fine-Grained Egocentric Hand-Object Segmentation: Dataset, Model, and Applications](https://arxiv.org/abs/2208.03826) | ECCV 2022 | [Project](https://github.com/owenzlz/EgoHOS) <!-- work:egohos --> |
| 2022-04-28 | Hand-object geometry and pose, RGB, Bimanual | Max Planck Institute for Intelligent Systems | [ARCTIC: A Dataset for Dexterous Bimanual Hand-Object Manipulation](https://arxiv.org/abs/2204.13662) | CVPR 2023 | [Project](https://arctic.is.tue.mpg.de/) / [GitHub](https://github.com/zc-alexfan/arctic) <!-- work:arctic --> |
| 2022-03-03 | Hand-object geometry and pose, RGB, Depth, Hands and objects | — | [HOI4D: A 4D Egocentric Dataset for Category-Level Human-Object Interaction](https://arxiv.org/abs/2203.01577) | CVPR 2022 | [Project](https://hoi4d.github.io/) / [GitHub](https://github.com/leolyliu/HOI4D-Instructions) <!-- work:hoi4d --> |
| 2021-04-22 | Hand-object geometry and pose, RGB, Depth, Bimanual | ETH Zürich | [H2O: Two Hands Manipulating Objects for First Person Interaction Recognition](https://arxiv.org/abs/2104.11181) | ICCV 2021 | [Project](https://taeinkwon.com/projects/h2o/) / [GitHub](https://github.com/taeinkwon/h2odataset) / [Dataset](https://h2odataset.ethz.ch/) <!-- work:h2o --> |
| 2020-08-21 | Hand-object geometry and pose, RGB, Bimanual, Reference data | Facebook Reality Labs | [InterHand2.6M: A Dataset and Baseline for 3D Interacting Hand Pose Estimation from a Single RGB Image](https://arxiv.org/abs/2008.09309) | ECCV 2020 | [Project](https://mks0601.github.io/InterHand2.6M/) / [GitHub](https://github.com/facebookresearch/InterHand2.6M) / [Dataset](https://mks0601.github.io/InterHand2.6M/#download) <!-- work:interhand26m --> |
| 2017-04-08 | Hand-object geometry and pose, RGB, Depth, Single hand | — | [First-Person Hand Action Benchmark with RGB-D Videos and 3D Hand Pose Annotations](https://arxiv.org/abs/1704.02463) | CVPR 2018 | [Project](https://guiggh.github.io/publications/first-person-hands/) / [GitHub](https://github.com/guiggh/hand_pose_action) <!-- work:fpha --> |

### Whole-body and multimodal

全身与多模态。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2025-10-17 | Whole-body and multimodal, RGB, Monochrome, IMU, Eye tracking, Audio, PPG, Head hands and environment | Meta Reality Labs | [Aria Gen 2 Pilot Dataset](https://arxiv.org/abs/2510.16134) | arXiv 2025 | [Project](https://www.projectaria.com/datasets/gen2pilot/) / [GitHub](https://github.com/facebookresearch/projectaria_tools) <!-- work:aria-gen2-pilot --> |
| 2024-06-14 | Whole-body and multimodal, RGB, Monochrome, IMU, Eye tracking, Audio, Whole body | Meta Reality Labs | [Nymeria: A Massive Collection of Multimodal Egocentric Daily Motion in the Wild](https://arxiv.org/abs/2406.09905) | ECCV 2024 | [Project](https://github.com/facebookresearch/nymeria_dataset) / [Dataset](https://www.projectaria.com/datasets/nymeria/) <!-- work:nymeria --> |
| 2024-02-20 | Whole-body and multimodal, RGB, Monochrome, IMU, Eye tracking, Audio, Head and environment | Meta Reality Labs | [Aria Everyday Activities Dataset](https://arxiv.org/abs/2402.13349) | arXiv 2024 | [Project](https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset) / [GitHub](https://github.com/facebookresearch/projectaria_tools) / [Dataset](https://huggingface.co/datasets/projectaria/aria-everyday-activities) <!-- work:aria-everyday-activities --> |
| 2024-01-16 | Whole-body and multimodal, RGB, Depth, Whole body and environment | ETH Zürich | [EgoGen: An Egocentric Synthetic Data Generator](https://arxiv.org/abs/2401.08739) | CVPR 2024 | [Project](https://ego-gen.github.io/) / [GitHub](https://github.com/ligengen/EgoGen) <!-- work:ego-gen --> |
| 2023-09-29 | Whole-body and multimodal, RGB, Depth, IMU, Eye tracking, Audio, Hands and upper body | Microsoft | [HoloAssist: an Egocentric Human Interaction Dataset for Interactive AI Assistants in the Real World](https://arxiv.org/abs/2309.17024) | ICCV 2023 | [Project](https://holoassist.github.io/) / [GitHub](https://github.com/Ember-HoloAssist/holoassist-release) <!-- work:holoassist --> |
| 2023-09-21 | Stereo video, IMU, Navigation, Mixed real/synthetic | Google Research | [SANPO: A Scene Understanding, Accessibility and Human Navigation Dataset](https://arxiv.org/abs/2309.12172) | arXiv 2023 | [Project](https://google-research-datasets.github.io/sanpo_dataset/) / [GitHub](https://github.com/google-research-datasets/sanpo_dataset) <!-- work:sanpo --> |
| 2023-06-10 | Whole-body and multimodal, RGB, Monochrome, IMU, Eye tracking, Whole body and environment | Meta Reality Labs | [Aria Digital Twin: A New Benchmark Dataset for Egocentric 3D Machine Perception](https://arxiv.org/abs/2306.06362) | ICCV 2023 | [Project](https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset) / [GitHub](https://github.com/facebookresearch/projectaria_tools) / [Dataset](https://huggingface.co/datasets/projectaria/aria-digital-twin) <!-- work:aria-digital-twin --> |
| 2021-12-14 | Whole-body and multimodal, RGB, Depth, Eye tracking, Whole body | ETH Zürich | [EgoBody: Human Body Shape and Motion of Interacting People from Head-Mounted Devices](https://arxiv.org/abs/2112.07642) | ECCV 2022 | [Project](https://sanweiliti.github.io/egobody/egobody.html) / [GitHub](https://github.com/sanweiliti/EgoBody) / [Dataset](https://sanweiliti.github.io/egobody/egobody.html#dataset-download) <!-- work:egobody --> |

### Touch force and EMG

触觉、力与肌电。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-10-07 | RGB-D, IMU, Bimanual pressure, 100 h public subset | Texas A&M University | [TouchScale: 500 Hours of Human Vision and Touch for Visual-Tactile Learning](https://arxiv.org/abs/2610.10288) | arXiv 2026 | [Project](https://touch-scale.github.io/) / [GitHub](https://github.com/phai-lab/touchscale) / [Dataset](https://huggingface.co/datasets/2077AIDataFoundation/TouchScale) <!-- work:touchscale --> |
| 2026-05-13 | Touch force and EMG, RGB, Pressure, Bimanual | HIT Shenzhen | [TouchAnything: A Dataset and Framework for Bimanual Tactile Estimation from Egocentric Video](https://arxiv.org/abs/2605.13083) | arXiv 2026 | [Project](https://jianyi2004.github.io/TouchAnything-Website/) / [GitHub](https://github.com/Jianyi2004/TouchAnything) / [Dataset](https://huggingface.co/datasets/zhouzhoujy/EgoTouch) <!-- work:egotouch --> |
| 2026-05-07 | Touch force and EMG, RGB, EMG, IMU, Bimanual | Tsinghua | [EgoEMG: A Multimodal Egocentric Dataset with Bilateral EMG and Vision for Hand Pose Estimation](https://arxiv.org/abs/2605.05712) | arXiv | [Code](https://github.com/zhenqis123/EgoEMG) <!-- work:egoemg --> |
| 2024-12-02 | Touch force and EMG, EMG, Single-hand samples, Reference data | Meta Reality Labs | [emg2pose: A Large and Diverse Benchmark for Surface Electromyographic Hand Pose Estimation](https://arxiv.org/abs/2412.02725) | NeurIPS 2024 | [Project](https://github.com/facebookresearch/emg2pose) / [Dataset](https://fb-ctrl-oss.s3.amazonaws.com/emg2pose/emg2pose_dataset.tar) <!-- work:emg2pose --> |
| 2024-09-03 | Touch force and EMG, RGB, Depth, Pressure, Single hand | ETH Zürich | [EgoPressure: A Dataset for Hand Pressure and Pose Estimation in Egocentric Vision](https://arxiv.org/abs/2409.02224) | CVPR 2025 | [Project](https://yiming-zhao.github.io/EgoPressure/) / [Project](https://siplab.org/projects/EgoPressure) / [GitHub](https://github.com/eth-siplab/EgoPressure) / [Dataset](https://dataset.egopressure.inf.ethz.ch/) <!-- work:egopressure --> |
| 2022-11-22 | Touch force and EMG, RGB, Tactile, Probe-mediated touch | University of Michigan | [Touch and Go: Learning from Human-Collected Vision and Touch](https://arxiv.org/abs/2211.12498) | NeurIPS 2022 | [Project](https://touch-and-go.github.io/) / [GitHub](https://github.com/fredfyyang/Touch-and-Go) / [Dataset](https://drive.google.com/drive/folders/1NDasyshDCL9aaQzxjn_-Q5MBURRT360B) <!-- work:touch-and-go --> |

### Robot demonstration and transfer

机器人示范与迁移。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-04-08 | Robot demonstration and transfer, RGB, Bimanual | EgoVerse consortium | [EgoVerse: An Egocentric Human Dataset for Robot Learning from Around the World](https://arxiv.org/abs/2604.07607) | arXiv 2026 | [Project](https://egoverse.ai/) / [GitHub](https://github.com/GaTech-RL2/EgoVerse) / [Dataset](https://egoverse-research-workbench.vercel.app/) <!-- work:egoverse --> |
| 2025-12-30 | RGB/IR, IMU, Glove motion, Bimanual | TARS Robotics | [World In Your Hands: A Large-Scale and Open-Source Ecosystem for Learning Human-Centric Manipulation in the Wild](https://arxiv.org/abs/2512.24310) | arXiv 2025 | [Project](https://wiyh.tars-ai.com/) / [GitHub](https://github.com/tars-robotics/World-In-Your-Hands) <!-- work:world-in-your-hands --> |
| 2025-05-16 | Robot demonstration and transfer, RGB, Hands and upper body | Apple | [EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video](https://arxiv.org/abs/2505.11709) | ICLR 2026 | [Project](https://github.com/apple-aiml-research/ml-egodex) / [Dataset](https://github.com/apple-aiml-research/ml-egodex#dataset-access-and-download) <!-- work:egodex --> |

## Methods and Toolchains

方法与工具链。Organized by the transformation they perform; inputs, output frame/scale, supervision and evidence are available in the visual atlas.

### Hand reconstruction

手部重建。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-09-28 | Hand reconstruction, Human video, Hand, RGB, Stereo | City University of Hong Kong | [ESTHER: Egocentric Stereo Hand Estimation and Reconstruction in the Wild](https://arxiv.org/abs/2609.34817) | arXiv | — <!-- work:esther --> |
| 2026-09-15 | Hand reconstruction, Wearable capture, Hand, Event | Keio University | [EventEgoHands++: Event-based Egocentric 3D Hand Mesh Reconstruction with Real Dataset](https://arxiv.org/abs/2609.17189) | IEEE Access 2026 | [Code](https://github.com/ryhara/EventEgoHandsV2) / [Project](https://ryhara.github.io/EventEgoHandsV2/) <!-- work:eventegohands-plus-plus --> |
| 2026-08-20 | Hand reconstruction, Wearable capture, Hand, RGB | Shanghai Jiao Tong University | [ACE-Ego-Hand: Repurposing Video Diffusion Models for Occlusion-Robust Egocentric 3D Hand Motion Recovery](https://arxiv.org/abs/2608.20308) | arXiv | [Code](https://github.com/ggxxii/ACE-Ego-Hand) <!-- work:ace-ego-hand --> |
| 2026-06-29 | Hand reconstruction, Human video, Hand, RGB | Nanyang Technological University | [The Surprising Effectiveness of Video Diffusion Models for Hand Motion Reconstruction](https://arxiv.org/abs/2606.30308) | arXiv | [Code](https://github.com/NTUYWANG103/ViDiHand) / [Project](https://vidihand.github.io) <!-- work:vidihand --> |
| 2026-01-27 | Hand reconstruction, Wearable capture, Hand, RGB | The Chinese University of Hong Kong | [EgoHandICL: Egocentric 3D Hand Reconstruction with In-Context Learning](https://arxiv.org/abs/2601.19850) | arXiv | [Code](https://github.com/Nicous20/EgoHandICL) <!-- work:egohandicl --> |
| 2024-09-18 | Hand reconstruction, Wearable capture, Hand, RGB | Imperial College London | [WiLoR: End-to-end 3D Hand Localization and Reconstruction in-the-wild](https://arxiv.org/abs/2409.12259) | CVPR 2025 | [Code](https://github.com/rolpotamias/WiLoR) / [Project](https://rolpotamias.github.io/WiLoR) / [proceedings](https://openaccess.thecvf.com/content/CVPR2025/html/Potamias_WiLoR_End-to-end_3D_Hand_Localization_and_Reconstruction_in-the-wild_CVPR_2025_paper.html) <!-- work:wilor --> |
| 2024-07-12 | Hand reconstruction, Wearable capture, Hand, RGB | Carnegie Mellon University | [Hamba: Single-view 3D Hand Reconstruction with Graph-guided Bi-Scanning Mamba](https://arxiv.org/abs/2407.09646) | arXiv | [Code](https://github.com/humansensinglab/Hamba) / [Project](https://humansensinglab.github.io/Hamba/) <!-- work:hamba --> |
| 2024-05-30 | Hand reconstruction, Human video, Hand, RGB | Beijing Normal University | [OmniHands: Towards Robust 4D Hand Mesh Recovery via A Versatile Transformer](https://arxiv.org/abs/2405.20330) | arXiv | [Code](https://github.com/LinDixuan/OmniHands) / [Project](https://OmniHand.github.io) <!-- work:omnihands --> |
| 2023-12-11 | Hand reconstruction, Wearable capture, Hand, RGB | UIUC | [3D Hand Pose Estimation in Everyday Egocentric Images](https://arxiv.org/abs/2312.06583) | arXiv | [Code](https://github.com/ap229997/hands) <!-- work:wildhands --> |
| 2023-12-08 | Hand reconstruction, Wearable capture, Hand, RGB | UC Berkeley | [Reconstructing Hands in 3D with Transformers](https://arxiv.org/abs/2312.05251) | CVPR 2024 | [Code](https://github.com/geopavlakos/hamer) / [Project](https://geopavlakos.github.io/hamer/) / [proceedings](https://openaccess.thecvf.com/content/CVPR2024/html/Pavlakos_Reconstructing_Hands_in_3D_with_Transformers_CVPR_2024_paper.html) <!-- work:hamer --> |
| 2022-03-28 | Hand reconstruction, Wearable capture, Hand, RGB | Seoul National University | [HandOccNet: Occlusion-Robust 3D Hand Mesh Estimation Network](https://arxiv.org/abs/2203.14564) | arXiv | [Code](https://github.com/namepllet/HandOccNet) <!-- work:handoccnet --> |
| 2022-01-07 | Hand reconstruction, Wearable capture, Hand | Max Planck Institute for Intelligent Systems | [Embodied Hands: Modeling and Capturing Hands and Bodies Together](https://arxiv.org/abs/2201.02610) | SIGGRAPH Asia 2017 | [Project](http://mano.is.tue.mpg.de) <!-- work:mano --> |

### World-space and body motion

世界坐标与身体运动。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-09-28 | World-space and body motion, Wearable capture, Hand, RGB | Shanghai AI Laboratory | [InfiniHand: Streaming World-Space Hand Motion Estimation from Egocentric Video](https://arxiv.org/abs/2609.35743) | arXiv | [Code](https://github.com/infinihand/InfiniHand) <!-- work:infinihand --> |
| 2026-09-04 | World-space and body motion, Human video, Hand, RGB | ShanghaiTech University | [MINT: A Unified Model for World-Space Camera and Hand Motion Estimation from Scalable Egocentric Pipeline Supervision](https://arxiv.org/abs/2609.04958) | arXiv | [Code](https://github.com/wuji-technology/wuji-ego-mint) <!-- work:mint --> |
| 2026-02-05 | Whole body, Wearable capture, Reconstruction, RGB, Depth, Pose | — | [EgoPoseVR: Spatiotemporal Multi-Modal Reasoning for Egocentric Full-Body Pose in Virtual Reality](https://arxiv.org/abs/2602.05590) | arXiv | — <!-- work:egoposevr --> |
| 2025-02-11 | Whole body, Wearable capture, Reconstruction, Event | Max Planck Institute for Informatics | [EventEgo3D++: 3D Human Motion Capture from a Head-Mounted Event Camera](https://arxiv.org/abs/2502.07869) | arXiv | [Project](https://eventego3d.mpi-inf.mpg.de/) <!-- work:eventego3d-plus-plus --> |
| 2025-01-06 | World-space and body motion, Human video, Hand, RGB | Shanghai Jiao Tong University | [HaWoR: World-Space Hand Motion Reconstruction from Egocentric Videos](https://arxiv.org/abs/2501.02973) | CVPR 2025 | [Code](https://github.com/ThunderVVV/HaWoR) / [Project](https://hawor-project.github.io/) / [proceedings](https://openaccess.thecvf.com/content/CVPR2025/html/Zhang_HaWoR_World-Space_Hand_Motion_Reconstruction_from_Egocentric_Videos_CVPR_2025_paper.html) <!-- work:hawor --> |
| 2024-12-17 | World-space and body motion, Human video, Hand, RGB | Imperial College London | [Dyn-HaMR: Recovering 4D Interacting Hand Motion from a Dynamic Camera](https://arxiv.org/abs/2412.12861) | arXiv | [Code](https://github.com/ZhengdiYu/Dyn-HaMR) / [Project](https://dyn-hamr.github.io/) <!-- work:dyn-hamr --> |
| 2024-10-04 | World-space and body motion, Wearable capture, Whole body, RGB, SLAM | UC Berkeley | [Estimating Body and Hand Motion in an Ego-sensed World](https://arxiv.org/abs/2410.03665) | arXiv | [Code](https://github.com/brentyi/egoallo) / [Project](https://egoallo.github.io/) <!-- work:egoallo --> |
| 2023-08-12 | Whole body, Wearable capture, Reconstruction, Pose | ETH Zurich | [EgoPoser: Robust Real-Time Egocentric Pose Estimation from Sparse and Intermittent Observations Everywhere](https://arxiv.org/abs/2308.06493) | arXiv | [Project](https://siplab.org/projects/EgoPoser) <!-- work:egoposer --> |
| 2023-05-02 | Whole body, Wearable capture, Reconstruction, IMU, RGB | — | [EgoLocate: Real-time Motion Capture, Localization, and Mapping with Sparse Body-mounted Sensors](https://arxiv.org/abs/2305.01599) | arXiv | [Code](https://github.com/Xinyu-Yi/EgoLocate) <!-- work:egolocate --> |
| 2022-12-09 | Whole body, Wearable capture, Reconstruction, RGB | Stanford University | [Ego-Body Pose Estimation via Ego-Head Pose Estimation](https://arxiv.org/abs/2212.04636) | arXiv | [Code](https://github.com/lijiaman/egoego_release) <!-- work:egoego --> |
| 2022-10-31 | World-space and body motion, Wearable capture, Hand | Meta Reality Labs | [UmeTrack: Unified multi-view end-to-end hand tracking for VR](https://arxiv.org/abs/2211.00099) | arXiv | [Code](https://github.com/facebookresearch/UmeTrack) <!-- work:umetrack --> |

### Hand-object interaction

手物交互。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-10-01 | Hand-object interaction, Human video, Hand, RGB | Shanghai Jiao Tong University | [EgoFound3R: End-to-End Egocentric Hand Reconstruction in World Space with Point-Wise Interaction Attributes](https://arxiv.org/abs/2610.01210) | arXiv | [Project](https://mint-sjtu.github.io/EgoFound3R.io/) <!-- work:egofound3r --> |
| 2026-09-17 | Hand-object interaction, Human video, Hand, RGB | Tsinghua University | [TouchSight: Bare-Handed Tactile Prediction from Egocentric Video via Generative Visual Augmentation](https://arxiv.org/abs/2609.20414) | arXiv | — <!-- work:touchsight --> |
| 2026-08-15 | Hand-object interaction, Human video, Hand, RGB | Shanghai Qi Zhi Institute | [EgoTac: In-the-wild Tactile Prediction from Egocentric Vision](https://arxiv.org/abs/2608.15060) | arXiv | [Code](https://github.com/Mr-Zwkid/EgoTac) <!-- work:egotac --> |
| 2026-04-13 | Hand-object interaction, Human video, Hand, RGB | Simon Fraser University | [EgoFun3D: Modeling Interactive Objects from Egocentric Videos using Function Templates](https://arxiv.org/abs/2604.11038) | arXiv | [Code](https://github.com/3dlg-hcvc/EgoFun3D) <!-- work:egofun3d --> |
| 2026-02-25 | Hand-object interaction, Human video, Hand, RGB | Stanford University | [WHOLE: World-Grounded Hand-Object Lifted from Egocentric Videos](https://arxiv.org/abs/2602.22209) | arXiv | [Project](https://judyye.github.io/whole-www) <!-- work:whole --> |
| 2026-01-03 | Hand-object interaction, Human video, Hand, RGB | Shanghai Jiao Tong University | [EgoGrasp: World-Space Hand-Object Interaction Estimation from Egocentric Videos](https://arxiv.org/abs/2601.01050) | arXiv | [Code](https://github.com/MINT-SJTU/EgoGrasp) <!-- work:egograsp --> |

### Demonstration translation

机器人示范转换。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-09-09 | Demonstration translation, Human video, Hand, RGB | RLWRLD | [HuRo: Robotizing Human Videos for Scalable VLA Pretraining](https://arxiv.org/abs/2609.10706) | arXiv | [Code](https://github.com/3587jjh/HuRo) / [Project](https://3587jjh.github.io/HuRo) <!-- work:huro --> |
| 2026-09-07 | Demonstration translation, Wearable capture, Hand, Tactile | Tsinghua University | [Dex-X: Learning Visual-Tactile Dexterous Manipulation From Human Videos with Simulated Interaction](https://arxiv.org/abs/2609.07747) | arXiv | [Code](https://github.com/gcfy63821/dexx_lab) <!-- work:dex-x --> |
| 2026-08-03 | Demonstration translation, Human video, Hand, RGB | Renmin University of China | [Ego2Robot: Scalable Robot Data Synthesis from Egocentric Human Data](https://arxiv.org/abs/2608.02580) | arXiv | [Project](https://www-ye.github.io/ego2robot_blog/) <!-- work:ego2robot --> |
| 2026-06-10 | Demonstration translation, Human video, Hand, RGB | Georgia Institute of Technology | [EgoEngine: From Egocentric Human Videos to High-Fidelity Dexterous Robot Demonstrations](https://arxiv.org/abs/2606.12604) | arXiv | [Project](https://egoengine.github.io) <!-- work:egoengine --> |
| 2026-06-06 | Demonstration translation, Wearable capture, Hand, RGB, Depth | Harbin Institute of Technology | [EgoAERO: Learning Dexterous Manipulation from a Single Egocentric Video without Object Assets](https://arxiv.org/abs/2606.08057) | arXiv | — <!-- work:egoaero --> |
| 2024-09-12 | Demonstration translation, Human video, Hand, RGB | UC Berkeley | [Hand-Object Interaction Pretraining from Videos](https://arxiv.org/abs/2409.08273) | arXiv | [Code](https://github.com/hgaurav2k/hop) / [Project](https://hgaurav2k.github.io/hop/) <!-- work:hop --> |
| 2024-04-24 | Demonstration translation, Human video, Hand, RGB | Inria | [ViViDex: Learning Vision-based Dexterous Manipulation from Human Videos](https://arxiv.org/abs/2404.15709) | arXiv | [Code](https://github.com/zerchen/vividex_mujoco) <!-- work:vividex --> |
| 2024-03-12 | Demonstration translation, Wearable capture, Hand, SLAM, Mocap | Stanford | [DexCap: Scalable and Portable Mocap Data Collection System for Dexterous Manipulation](https://arxiv.org/abs/2403.07788) | RSS 2024 | [Project](https://dex-cap.github.io/) / [Code](https://github.com/j96w/DexCap) / [Project](https://dex-cap.github.io) <!-- work:dexcap --> |
| 2021-08-12 | Demonstration translation, Human video, Hand, RGB | UC San Diego | [DexMV: Imitation Learning for Dexterous Manipulation from Human Videos](https://arxiv.org/abs/2108.05877) | arXiv | [Code](https://github.com/yzqin/dexmv-sim) / [Project](https://yzqin.github.io/dexmv) <!-- work:dexmv --> |

### Representation and latent actions

表征与隐式动作。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-07-08 | Representation and latent actions, Human video, Hand, RGB | — | [EgoWAM: World Action Models Beyond Pixels with In-the-Wild Egocentric Human Data](https://arxiv.org/abs/2607.08436) | arXiv | [Code](https://github.com/GaTech-RL2/EgoWAM) / [Project](https://gatech-rl2.github.io/egowam.github.io) <!-- work:egowam --> |
| 2025-12-15 | Representation and latent actions, Human video, Hand, RGB | — | [World Models for Learning Dexterous Hand-Object Interactions from Human Videos](https://arxiv.org/abs/2512.13644) | arXiv | [Code](https://github.com/facebookresearch/dexwm) <!-- work:dexwm --> |
| 2025-05-09 | Representation and latent actions, Human video, Hand, RGB, Language | — | [UniVLA: Learning to Act Anywhere with Task-centric Latent Actions](https://arxiv.org/abs/2505.06111) | arXiv | [Code](https://github.com/OpenDriveLab/UniVLA) <!-- work:univla --> |
| 2024-12-05 | Representation and latent actions, Human video, Hand, RGB | — | [Moto: Latent Motion Token as the Bridging Language for Learning Robot Manipulation from Videos](https://arxiv.org/abs/2412.04445) | arXiv | [Code](https://github.com/TencentARC/Moto) <!-- work:moto --> |
| 2024-10-15 | Representation and latent actions, Human video, Hand, RGB | — | [Latent Action Pretraining from Videos](https://arxiv.org/abs/2410.11758) | arXiv | [Code](https://github.com/LatentActionPretraining/LAPA) <!-- work:lapa --> |
| 2024-09-24 | Representation and latent actions, Human video, Hand, RGB, Language | — | [Gen2Act: Human Video Generation in Novel Scenarios enables Generalizable Robot Manipulation](https://arxiv.org/abs/2409.16283) | arXiv | [Project](https://homangab.github.io/gen2act/) <!-- work:gen2act --> |
| 2024-03-19 | Representation and latent actions, Human video, Hand, RGB | — | [Vid2Robot: End-to-end Video-conditioned Policy Learning with Cross-Attention Transformers](https://arxiv.org/abs/2403.12943) | arXiv | [Project](https://vid2robot.github.io) <!-- work:vid2robot --> |
| 2023-02-24 | Representation and latent actions, Human video, Hand, RGB | — | [MimicPlay: Long-Horizon Imitation Learning by Watching Human Play](https://arxiv.org/abs/2302.12422) | arXiv | [Code](https://github.com/j96w/MimicPlay) / [Project](https://mimic-play.github.io) <!-- work:mimicplay --> |
| 2022-09-30 | Representation and latent actions, Human video, Hand, RGB | — | [VIP: Towards Universal Visual Reward and Representation via Value-Implicit Pre-Training](https://arxiv.org/abs/2210.00030) | arXiv | [Code](https://github.com/facebookresearch/vip) <!-- work:vip --> |
| 2022-03-23 | Representation and latent actions, Human video, Hand, RGB, Language | — | [R3M: A Universal Visual Representation for Robot Manipulation](https://arxiv.org/abs/2203.12601) | arXiv | [Code](https://github.com/facebookresearch/r3m) / [Project](https://tinyurl.com/robotr3m) <!-- work:r3m --> |

## Robot Learning and Evaluation

机器人学习与评测。Learning directly from human data, translating to robot skills, and the tools and evidence needed to evaluate the transfer.

### Policy learning from human data

从人类数据学习策略。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| 2026-09-30 | Policy learning from human data, Human video, Hand, RGB | XPENG Robotics | [IronMind: Scaling Humanoid Dexterous Manipulation via Camera-Space Ego-Centric Pretraining](https://arxiv.org/abs/2609.39403) | arXiv | [Project](https://xpeng-robotics.github.io/ironmind/) <!-- work:ironmind --> |
| 2026-09-29 | Policy learning from human data, Wearable capture, Whole body | OpenDriveLab | [EgoHumanoid-V2: Human-to-Humanoid Transfer of Coordinated Whole-Body Skills for Loco-Manipulation](https://arxiv.org/abs/2609.37181) | arXiv | [Project](https://opendrivelab.com/EgoHumanoid-V2/) <!-- work:egohumanoid-v2 --> |
| 2026-09-28 | Policy learning from human data, Wearable capture, Whole body, Stereo | HKUST | [DexRoam: Learning Mobile Bimanual Dexterous Manipulation from Egocentric Whole-Body Human Demonstrations](https://arxiv.org/abs/2609.35761) | CoRL 2026 | [Code](https://github.com/zhourui9813/DexRoam-Policy-Training) / [Project](https://dexroam.github.io/) <!-- work:dexroam --> |
| 2026-09-20 | Policy learning from human data, Human video, Hand, RGB | The University of Hong Kong | [EgoWild2Dex: Learning Dexterous Robotic Manipulation from In-the-Wild Human Experience](https://arxiv.org/abs/2609.23755) | arXiv | [Project](https://mmlab.hk/egowild2dex) <!-- work:egowild2dex --> |
| 2026-06-21 | Policy learning from human data, Human video, Hand, RGB | — | [EgoSteer: An Open-Source Full-Stack System Towards Steerable Dexterous Manipulation from Egocentric Videos](https://arxiv.org/abs/2607.09701) | arXiv | [Code](https://github.com/egosteer/egosteer) / [Project](https://egosteer.github.io/) <!-- work:egosteer --> |
| 2026-05-24 | Policy learning from human data, Human video, Hand, RGB | — | [HumanEgo: Zero-Shot Robot Learning from Minutes of Human Egocentric Videos](https://arxiv.org/abs/2605.24934) | arXiv | [Code](https://github.com/TX-Leo/HumanEgo) <!-- work:humanego --> |
| 2026-02-18 | Policy learning from human data, Human video, Hand, RGB | NVIDIA | [EgoScale: Scaling Dexterous Manipulation with Diverse Egocentric Human Data](https://arxiv.org/abs/2602.16710) | arXiv | [Project](https://research.nvidia.com/labs/gear/egoscale/) <!-- work:egoscale --> |
| 2026-02-10 | Policy learning from human data, Wearable capture, Whole body | — | [EgoHumanoid: Unlocking In-the-Wild Loco-Manipulation with Robot-Free Egocentric Demonstration](https://arxiv.org/abs/2602.10106) | arXiv | [Code](https://github.com/OpenDriveLab/EgoHumanoid) <!-- work:egohumanoid --> |
| 2026-01-19 | Policy learning from human data, Wearable capture, Hand | BeingBeyond | [Being-H0.5: Scaling Human-Centric Robot Learning for Cross-Embodiment Generalization](https://arxiv.org/abs/2601.12993) | arXiv | [Code](https://github.com/BeingBeyond/Being-H) <!-- work:being-h05 --> |
| 2025-11-21 | Policy learning from human data, Wearable capture, Hand | Peking University | [METIS: Multi-Source Egocentric Training for Integrated Dexterous Vision-Language-Action Model](https://arxiv.org/abs/2511.17366) | arXiv | [Code](https://github.com/AureleoPKU/Metis) <!-- work:metis --> |
| 2025-09-23 | Policy learning from human data, Wearable capture, Hand | Georgia Institute of Technology | [EgoBridge: Domain Adaptation for Generalizable Imitation from Egocentric Human Data](https://arxiv.org/abs/2509.19626) | arXiv | [Project](https://ego-bridge.github.io) <!-- work:egobridge --> |
| 2025-09-22 | Policy learning from human data, Wearable capture, Hand | Tsinghua University | [MotionTrans: Human VR Data Enable Motion-Level Learning for Robotic Manipulation Policies](https://arxiv.org/abs/2509.17759) | arXiv | [Code](https://github.com/michaelyuancb/motiontrans) / [Project](https://motiontrans.github.io/) <!-- work:motiontrans --> |
| 2025-09-04 | Policy learning from human data, Wearable capture, Whole body | — | [EMMA: Scaling Mobile Manipulation via Egocentric Human Data](https://arxiv.org/abs/2509.04443) | arXiv | [Project](https://ego-moma.github.io/) <!-- work:emma --> |
| 2025-07-21 | Policy learning from human data, Human video, Hand, RGB, Mocap | — | [Being-H0: Vision-Language-Action Pretraining from Large-Scale Human Videos](https://arxiv.org/abs/2507.15597) | arXiv | [Code](https://github.com/BeingBeyond/Being-H0) / [Project](https://beingbeyond.github.io/Being-H0) <!-- work:being-h0 --> |
| 2025-07-16 | Policy learning from human data, Human video, Hand, RGB | MIT | [EgoVLA: Learning Vision-Language-Action Models from Egocentric Human Videos](https://arxiv.org/abs/2507.12440) | arXiv | [Code](https://github.com/RchalYang/EgoVLA_Release) / [Project](https://rchalyang.github.io/EgoVLA) <!-- work:egovla --> |
| 2025-05-26 | Policy learning from human data, Wearable capture, Hand | — | [EgoZero: Robot Learning from Smart Glasses](https://arxiv.org/abs/2505.20290) | arXiv | [Code](https://github.com/vliu15/egozero) / [Project](https://egozero-robot.github.io) <!-- work:egozero --> |
| 2025-05-12 | Policy learning from human data, Wearable capture, Hand | Carnegie Mellon | [DexWild: Dexterous Human Interactions for In-the-Wild Robot Policies](https://arxiv.org/abs/2505.07813) | RSS 2025 | [Project](https://dexwild.github.io/) / [Code](https://github.com/dexwild/dexwild) / [Dataset](https://huggingface.co/datasets/boardd/dexwild-dataset) / [Code](https://github.com/dexwild/dexwild-training) / [Project](https://dexwild.github.io) <!-- work:dexwild --> |
| 2024-10-31 | Policy learning from human data, Human video, Hand, RGB | Georgia Institute of Technology | [EgoMimic: Scaling Imitation Learning via Egocentric Video](https://arxiv.org/abs/2410.24221) | arXiv | [Code](https://github.com/SimarKareer/EgoMimic) / [Project](https://egomimic.github.io/) <!-- work:egomimic --> |
| 2022-12-08 | Policy learning from human data, Human video, Hand, RGB | Carnegie Mellon University | [VideoDex: Learning Dexterity from Internet Videos](https://arxiv.org/abs/2212.04498) | arXiv | [Project](https://video-dex.github.io) <!-- work:videodex --> |
| 2022-02-01 | Policy learning from human data, Human video, Hand, RGB | — | [DexVIP: Learning Dexterous Grasping with Human Hand Pose Priors from Video](https://arxiv.org/abs/2202.00164) | arXiv | [Project](https://vision.cs.utexas.edu/projects/dexvip-dexterous-grasp-pose-prior) <!-- work:dexvip --> |

### Evaluation and toolchains

评测与工具链。

| Date | Keywords | Institute (first) | Paper / Resource | Publication | Others |
| :--: | :------: | :---------------: | :--- | :---------: | :----: |
| — | Retargeting, Toolchain, Hand | — | [Dexterous Hand Retargeting](https://github.com/dexsuite/dex-retargeting) | Open-source tool | — <!-- work:dex-retargeting --> |
| — | Aria, SLAM, Calibration, Data processing | Meta | [Project Aria Tools and Machine Perception Services](https://github.com/facebookresearch/projectaria_tools) | Open-source tool | [Documentation](https://facebookresearch.github.io/projectaria_tools/gen2/) <!-- work:projectaria-tools --> |

## Citation

Please cite the original papers and datasets when using their work. To reference
this index, cite the repository URL with an access date. Inclusion here does not
change the authors' licenses or endorse product claims.

```bibtex
@misc{awesome_ego_robotics,
  author = {Chang, Xinhai},
  title = {Awesome-Ego-Robotics},
  year = {2026},
  howpublished = {\url{https://github.com/chang-xinhai/Awesome-Ego-Robotics}}
}
```

## Acknowledgement

Built alongside [Awesome-UMI](https://github.com/chang-xinhai/Awesome-UMI) and
[Awesome-Robot-Data-Engine](https://github.com/chang-xinhai/Awesome-Robot-Data-Engine).
Thanks to the original authors, dataset contributors, hardware teams and the
open research community. Third-party figures remain credited to their original
projects in the website manifests; the repository license does not relicense
them. See [AGENTS.md](AGENTS.md) for source and maintenance rules.
