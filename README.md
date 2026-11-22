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

Across the 200 six-event questions, GPT-6.1 Sol scores 68.0% exact match. The best open-weight configuration reaches 12.5%. The repository includes 31,860 question-level scores across 27 configurations.

| Comparison | Results |
|---|---|
| Six-event accuracy by physical domain | [Domain table](docs/assets/domains.csv) |
| Exact match by question length | [Question-length table](docs/assets/length.csv) |
| Seven adaptation methods and their baselines | [Adaptation table](docs/assets/methods.csv) |

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

