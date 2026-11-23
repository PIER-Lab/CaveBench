# CaveBench

**Benchmarking Abductive Physical Reasoning from Internal Observations**

Guanxin Lin<sup>*</sup>, Chen Yang<sup>*</sup>, Shenxiang Zeng, Honghui Zhu, Xin Li, Wenbo Deng, Jiansheng Fan, Chen Wang<sup>†</sup>

Tsinghua University  
<sup>*</sup> Equal contribution · <sup>†</sup> Corresponding author

[Project page](https://pier-lab.github.io/CaveBench/) · [Paper](docs/papers/CaveBench.pdf) · [Supplement](docs/papers/Supplement.pdf) · [Dataset](https://huggingface.co/datasets/linguanxin/CaveBench) · [Scene examples](docs/examples/index.json) · [Results](results/question_scores.csv)

CaveBench evaluates whether a vision–language model can reconstruct the external controls applied to a physical apparatus from its internal observations. Each question contains the apparatus description, its permitted controls and an ordered sequence of images. The model identifies the set of controls applied at each event. The 20 apparatuses cover dynamics, thermal physics, electromagnetism, acoustics and optics.

## Dataset

The fixed evaluation contains 1,180 questions drawn from 200 episodes. Each question presents the initial frame and one response frame per event. The reference gives the complete control set at every event, in chronological order. Each of the [20 worked examples](docs/examples/) contains all seven images, the full six-event prompt, the original video, a recorded model response and its event-level evaluation. The dual-view videos show the apparatus for inspection. Model inputs use the internal frames.

## Results

Across the 200 six-event questions, GPT-6.1 Sol recovers 136 complete sequences (68.0%). The best open-weight configuration recovers 25 (12.5%). The release includes 31,860 question-level scores across 27 model configurations.

**Accuracy by physical domain.** Each of the six tables gives the accuracy of all 27 configurations in dynamics, thermal physics, electromagnetism, acoustics and optics. For one and two events, 190 questions contribute to each table. Each longer question length has 200 questions. The project page can download each displayed table as a CSV.

| Events per question | One | Two | Three | Four | Five | Six |
|---|---|---|---|---|---|---|
| GitHub | [k = 1](results/domain_tables.md#domain-k1) | [k = 2](results/domain_tables.md#domain-k2) | [k = 3](results/domain_tables.md#domain-k3) | [k = 4](results/domain_tables.md#domain-k4) | [k = 5](results/domain_tables.md#domain-k5) | [k = 6](results/domain_tables.md#domain-k6) |
| Project page | [k = 1](https://pier-lab.github.io/CaveBench/#domain-k1) | [k = 2](https://pier-lab.github.io/CaveBench/#domain-k2) | [k = 3](https://pier-lab.github.io/CaveBench/#domain-k3) | [k = 4](https://pier-lab.github.io/CaveBench/#domain-k4) | [k = 5](https://pier-lab.github.io/CaveBench/#domain-k5) | [k = 6](https://pier-lab.github.io/CaveBench/#domain-k6) |

**Accuracy by apparatus.** Select any of the 20 apparatuses to compare models at all six question lengths. Each reported cell has ten eligible questions. S11 (dielectric response) begins at three events, so its one- and two-event cells have zero eligible questions and empty accuracy fields. [Read all 20 tables on GitHub](results/apparatus_tables.md) · [Browse by apparatus on the project page](https://pier-lab.github.io/CaveBench/#apparatus-S01)

| Results and underlying counts | Data |
|---|---|
| Main leaderboard by domain, apparatus and question length | [Domain × length](docs/assets/results/domain_by_length.csv) · [Apparatus × length](docs/assets/results/scene_by_length.csv) · [Overall by length](docs/assets/length.csv) |
| SFT, DPO, SimPO and KTO on Qwen3.5-9B, plus ReAct, Visual Sketchpad and ViperGPT on Gemini 3.8 Flash | [Read all runs by apparatus and length](results/adaptation_tables.md) · [CSV by run and length](docs/assets/results/adaptation_by_length.csv) · [CSV by apparatus](docs/assets/results/adaptation_by_scene.csv) · [Published summary](docs/assets/methods.csv) |
| Evaluation settings for the 27 leaderboard configurations | [Browse model protocols](https://pier-lab.github.io/CaveBench/#table-model_protocols) · [Download CSV](docs/assets/results/model_protocols.csv) |
| Figure 1 comparison, Figure 5 dielectric-response predictions and Figure 6 reasoning-effort experiment | [Figure 1 counts](docs/assets/results/figure1.csv) · [Figure 5 event-by-event predictions](docs/assets/results/training_case.csv) · [Figure 6 scores by model, effort and apparatus](docs/assets/results/effort_results.csv) |
| Event-position accuracy on six-event questions, single- and two-label questions, and error classifications | [Event positions](docs/assets/results/event_positions.csv) · [Control composition](docs/assets/results/compound_by_length.csv) · [Error counts](docs/assets/results/error_categories.csv) |
| Candidate-control vocabulary, uniform-choice probability and related benchmark tasks | [Apparatus statistics](docs/assets/results/scene_controls.csv) · [Uniform-choice reference](docs/assets/results/uniform_reference.csv) · [Benchmark comparison with sources](docs/assets/results/benchmark_comparison.csv) |

Exact match requires the correct control set at every event. Event accuracy counts correctly predicted sets at individual positions. The adaptation files list the training runs separately, including the two runs and their mean for each of SimPO and KTO. The reasoning-effort file gives both initial and final answers at Low, Medium and High effort. The [detailed tables](https://pier-lab.github.io/CaveBench/#detailed-results) offer both metrics.

Individual question scores are available for the [main comparison](results/question_scores.csv), [11 adaptation runs and baselines](results/adaptation_question_scores.csv), and [reasoning-effort experiment](results/effort_question_scores.csv).

From the repository root, run `python verify_results.py` to recompute the main evaluation, adaptation and reasoning-effort tables from these scores and check their numerators and denominators offline. Run `python render_result_tables.py --check` to verify the GitHub tables against the CSV files.

## Evaluation

With `huggingface_hub` installed, `python prepare_media.py --repo linguanxin/CaveBench --data ./dataset` downloads the question and label files and reconstructs all test input frames. Add `--all` to download the development episodes and dual-view videos.

Use Python 3.9 or newer. Place the dataset in a local directory containing `questions.jsonl`, `labels.jsonl` and the media paths named in the questions. The runner and scorer use the Python standard library.

For a chat-completions endpoint with image input, set `CAVEBENCH_API_KEY` in the environment when authentication is required. Supply the model identifier supported by your endpoint.

```sh
python run.py --data ./dataset --model MODEL_ID --endpoint https://HOST/v1/chat/completions --output predictions.jsonl
python score.py --data ./dataset --predictions predictions.jsonl
```

To score predictions produced by another inference system, record one JSON object per line with fields `id` (the question ID) and `response` (the visible answer string). Within that string, the model returns one object containing `operations`, an ordered list with one nonempty array of labels per event. Label order within an event does not affect the score. Missing predictions and invalid answers score zero. The scorer reports overall accuracy and accuracy at each question length using the full test denominators.

The [original scoring contract](contracts.py) accepts a single unambiguous, complete answer object and compares every event to its reference. The [published scores](results/question_scores.csv) include one Boolean per event as well as the exact-match result for each question.

## Project page

Open `docs/index.html` through a static server to browse the scenes, play the videos and compare results.

```sh
python -m http.server 8000 --directory docs
```

