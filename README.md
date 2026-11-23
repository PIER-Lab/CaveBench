# CaveBench: Benchmarking Abductive Physical Reasoning from Internal Observations

Guanxin Lin<sup>∗</sup>, Chen Yang<sup>∗</sup>, Shenxiang Zeng, Honghui Zhu, Xin Li, Wenbo Deng, Jiansheng Fan, Chen Wang<sup>†</sup>

Tsinghua University  
<sup>∗</sup> Equal contribution · <sup>†</sup> Corresponding author

[Project page](https://pier-lab.github.io/CaveBench/) · [Paper](docs/papers/CaveBench.pdf) · [Supplement](docs/papers/Supplement.pdf) · [Hugging Face dataset](https://huggingface.co/datasets/linguanxin/CaveBench) · [Research video](https://pier-lab.github.io/CaveBench/#film) · [Model weights](https://github.com/PIER-Lab/CaveBench/releases/tag/cavebench-qwen35-adapters-v1)

## News

- **2026-11-23.** The public results now include tables for all six question lengths, every apparatus, and each training seed. The [dataset viewer](https://pier-lab.github.io/CaveBench/#viewer) includes a six-event question to try for each apparatus.

## Introduction

CaveBench evaluates whether a vision–language model can reconstruct the external controls applied to a physical apparatus from its internal observations. Each question contains the apparatus description, its permitted controls and an ordered sequence of images. The model identifies the set of controls applied at each event. The 20 apparatuses cover dynamics, thermal physics, electromagnetism, acoustics and optics.

![CaveBench apparatuses, internal observations and six-event model comparison](docs/assets/teaser.png)

## Dataset

The fixed evaluation contains 1,180 questions drawn from 200 episodes. Each question presents the initial frame and one response frame per event. The reference gives the complete control set at every event, in chronological order. Each of the [20 worked examples](docs/examples/) contains all seven images, the full six-event prompt, the original video, a recorded model response and its event-level evaluation. The dual-view videos show the apparatus for inspection. Model inputs use the internal frames.

## Leaderboard

Across the 200 six-event questions, GPT-6.1 Sol recovers 136 complete sequences (68.0%). The best open-weight configuration recovers 25 (12.5%). The release includes 31,860 question-level scores across 27 model configurations.

| Six-event reference or model | Type | Correct sequences | Exact match |
|---|---|---:|---:|
| GPT-6.1 Sol | Proprietary | 136 / 200 | 68.0% |
| GPT-6.1 Terra | Proprietary | 130 / 200 | 65.0% |
| GPT-6 Luna | Proprietary | 57 / 200 | 28.5% |
| Gemini 3.8 Flash | Proprietary | 43 / 200 | 21.5% |
| GPT-5.6 Luna | Proprietary | 39 / 200 | 19.5% |
| Gemini 3.6 Flash | Proprietary | 34 / 200 | 17.0% |
| Claude Sonnet 5.5 | Proprietary | 33 / 200 | 16.5% |
| Qwen3.8 Flash | Proprietary | 28 / 200 | 14.0% |
| Claude Haiku 5.5 | Proprietary | 27 / 200 | 13.5% |
| Qwen3.7 Plus | Proprietary | 23 / 200 | 11.5% |
| Seed-2.0-Lite | Proprietary | 11 / 200 | 5.5% |
| Seed 2.1 Turbo | Proprietary | 8 / 200 | 4.0% |
| Claude Sonnet 5 | Proprietary | 6 / 200 | 3.0% |
| Seed-2.0-Mini | Proprietary | 6 / 200 | 3.0% |
| GLM 5V Turbo | Proprietary | 5 / 200 | 2.5% |
| Gemini 3.5 Flash Lite | Proprietary | 2 / 200 | 1.0% |
| MiniMax M3.1 Flash | Open-weight | 25 / 200 | 12.5% |
| Qwen3.8 27B | Open-weight | 21 / 200 | 10.5% |
| GLM 5.3 Flash | Open-weight | 18 / 200 | 9.0% |
| DeepSeek V4.1 Flash | Open-weight | 13 / 200 | 6.5% |
| MiniMax M3 | Open-weight | 10 / 200 | 5.0% |
| Gemma 4 31B | Open-weight | 9 / 200 | 4.5% |
| Kimi K2.6 | Open-weight | 7 / 200 | 3.5% |
| Kimi K2.5 | Open-weight | 4 / 200 | 2.0% |
| DeepSeek V4 Flash | Open-weight | 1 / 200 | 0.5% |
| Llama 4 Maverick | Open-weight | 1 / 200 | 0.5% |
| Qwen3.5-9B | Open-weight | 1 / 200 | 0.5% |
| Uniform choice among legal control sets | Analytic reference | — | 0.0193% expected |

[All 27 configurations](results/domain_tables.md#domain-k6) · [Uniform-choice reference by domain and length](docs/assets/results/uniform_reference.csv)

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
| Preference training vs. SFT on matched question IDs | [Paired outcomes for each seed and question length](docs/assets/results/paired_training.csv) · [Interactive comparison](https://pier-lab.github.io/CaveBench/#table-paired_training) |
| Evaluation settings for the 27 leaderboard configurations | [Browse model protocols](https://pier-lab.github.io/CaveBench/#table-model_protocols) · [Download CSV](docs/assets/results/model_protocols.csv) |
| Figure 1 comparison, Figure 5 dielectric-response predictions and Figure 6 reasoning-effort experiment | [Figure 1 counts](docs/assets/results/figure1.csv) · [Figure 5 event-by-event predictions](docs/assets/results/training_case.csv) · [Figure 6 scores by model, effort and apparatus](docs/assets/results/effort_results.csv) |
| Event-position accuracy on six-event questions, single- and two-label questions, and error classifications | [Event positions](docs/assets/results/event_positions.csv) · [Control composition](docs/assets/results/compound_by_length.csv) · [Error counts](docs/assets/results/error_categories.csv) |
| Candidate-control vocabulary, uniform-choice probability and related benchmark tasks | [Apparatus statistics](docs/assets/results/scene_controls.csv) · [Uniform-choice reference](docs/assets/results/uniform_reference.csv) · [Benchmark comparison with sources](docs/assets/results/benchmark_comparison.csv) |

Exact match requires the correct control set at every event. Event accuracy counts correctly predicted sets at individual positions. The adaptation files list the training runs separately, including the two runs and their mean for each of SimPO and KTO. The reasoning-effort file gives both initial and final answers at Low, Medium and High effort. The [detailed tables](https://pier-lab.github.io/CaveBench/#detailed-results) offer both metrics.

Individual question scores are available for the [main comparison](results/question_scores.csv), [11 adaptation runs and baselines](results/adaptation_question_scores.csv), and [reasoning-effort experiment](results/effort_question_scores.csv).

From the repository root, run `python verify_results.py` to recompute the main evaluation, adaptation and reasoning-effort tables from these scores and check their numerators and denominators offline. Run `python render_result_tables.py --check` to verify the GitHub tables against the CSV files.

## Installation

Use Python 3.9 or newer. The evaluation runner and scorer use the standard library.

```sh
git clone https://github.com/PIER-Lab/CaveBench.git
cd CaveBench
python -m pip install -r requirements.txt
```

## Load the dataset

With `huggingface_hub` installed, `python prepare_media.py --repo linguanxin/CaveBench --data ./dataset` downloads the question and label files and reconstructs all test input frames. Add `--all` to download the development episodes and dual-view videos.

To inspect a question and its reference after preparing the dataset:

```python
import json
from pathlib import Path

data = Path("dataset")
with (data / "questions.jsonl").open(encoding="utf-8") as stream:
    question = json.loads(next(stream))
with (data / "labels.jsonl").open(encoding="utf-8") as stream:
    reference = next(row for row in map(json.loads, stream) if row["id"] == question["id"])
print(question["id"], question["prompt"])
print(question["images"], reference["operations"])
```

## Run an evaluation

### Chat-completions endpoint

For a chat-completions endpoint with image input, set `CAVEBENCH_API_KEY` in the environment when authentication is required. Supply the model identifier supported by your endpoint.

```sh
python run.py --data ./dataset --model MODEL_ID --endpoint https://HOST/v1/chat/completions --output predictions.jsonl
python score.py --data ./dataset --predictions predictions.jsonl
```

To score predictions produced by another inference system, record one JSON object per line with fields `id` (the question ID) and `response` (the visible answer string). Within that string, the model returns one object containing `operations`, an ordered list with one nonempty array of labels per event. Label order within an event does not affect the score. Missing predictions and invalid answers score zero. The scorer reports overall accuracy and accuracy at each question length using the full test denominators.

The [original scoring contract](contracts.py) accepts a single unambiguous, complete answer object and compares every event to its reference. The [published scores](results/question_scores.csv) include one Boolean per event as well as the exact-match result for each question.

### Local Qwen checkpoints

The [GitHub release](https://github.com/PIER-Lab/CaveBench/releases/tag/cavebench-qwen35-adapters-v1) contains the SFT adapter, the DPO adapter, two SimPO seeds and two KTO seeds. Download the SFT archive and the preference run you want to evaluate. For the first SimPO seed:

```sh
python -m pip install -r requirements-local.txt
python -m zipfile -e CaveBench-Qwen3.5-9B-SFT-20261102.zip weights/sft
python -m zipfile -e CaveBench-Qwen3.5-9B-SimPO-20261108.zip weights/simpo-20261108
python run_local.py --data ./dataset --sft weights/sft --preference weights/simpo-20261108 --output simpo.jsonl
python score.py --data ./dataset --predictions simpo.jsonl
```

The local runner loads the published revision of `Qwen/Qwen3.5-9B`, merges the SFT adapter, then loads the selected preference adapter. For SFT alone, omit `--preference`. To evaluate the base model, omit both adapter arguments. The training archive used PyTorch 2.10.0, torchvision 0.25.0, Transformers 5.22.1, PEFT 0.20.0 and Accelerate 1.15.0.

### Other models with VLMEvalKit

In a [VLMEvalKit environment](https://github.com/open-compass/VLMEvalKit), choose a registered multi-image model. The CaveBench runner sends the full prompt followed by the internal frames in chronological order. It writes the same predictions format as the other runners.

```sh
python run_vlmevalkit.py --data ./dataset --model Qwen2.5-VL-7B-Instruct --output predictions-vlmevalkit.jsonl
python score.py --data ./dataset --predictions predictions-vlmevalkit.jsonl
```

To reproduce the paired training analysis, run `python compare_training_runs.py --check`. The script pairs predictions by question ID and compares every preference-training seed with the same SFT checkpoint.

## Project page

Open `docs/index.html` through a static server to browse the scenes, play the videos and compare results.

```sh
python -m http.server 8000 --directory docs
```

## Citation

```bibtex
@misc{lin2026cavebench,
  title  = {{CaveBench}: Benchmarking Abductive Physical Reasoning from Internal Observations},
  author = {Lin, Guanxin and Yang, Chen and Zeng, Shenxiang and Zhu, Honghui and Li, Xin and Deng, Wenbo and Fan, Jiansheng and Wang, Chen},
  year   = {2026},
  url    = {https://pier-lab.github.io/CaveBench/}
}
```

## Acknowledgments

The organization of the project page and supplementary results draws on [SSI-Bench](https://github.com/PIER-Lab/SSI-Bench). GPT-6.2-Astra wrote the research video's narration, which was synthesized with the audio tools in [Sci2Video](https://github.com/BioTender-max/sci2video).

## License

CaveBench's original code uses the [MIT license](LICENSE). The dataset, model weights and third-party assets retain their respective terms.

## Contact

For questions about the data, evaluation or training results, [open a repository issue](https://github.com/PIER-Lab/CaveBench/issues).

