# Adaptation results by physical domain

Each column gives sequence exact match (%) within a physical domain. Overall pools all questions at that length. For SimPO and KTO, the two-seed mean gives equal weight to the two runs.

[1 event](#adaptation-k1) · [2 events](#adaptation-k2) · [3 events](#adaptation-k3) · [4 events](#adaptation-k4) · [5 events](#adaptation-k5) · [6 events](#adaptation-k6)

[Download correct counts, denominators and event accuracy](../docs/assets/results/adaptation_by_domain.csv) · [Results for individual apparatuses](adaptation_tables.md) · [Question-level scores](adaptation_question_scores.csv)

<a name="adaptation-k1"></a>

## 1 event

190 questions per run, with 30 in electromagnetism and 40 in each other domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k1)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 25.0 | 25.0 | 6.67 | 25.0 | 32.5 | 23.68 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 72.5 | 70.0 | 66.67 | 92.5 | 90.0 | 78.95 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 95.0 | 72.5 | 80.0 | 92.5 | 90.0 | 86.32 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 95.0 | 72.5 | 86.67 | 92.5 | 90.0 | 87.37 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 95.0 | 72.5 | 80.0 | 92.5 | 90.0 | 86.32 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 95.0 | 72.5 | 83.33 | 92.5 | 90.0 | 86.84 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 97.5 | 75.0 | 66.67 | 97.5 | 85.0 | 85.26 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 95.0 | 80.0 | 73.33 | 95.0 | 90.0 | 87.37 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 96.25 | 77.5 | 70.0 | 96.25 | 87.5 | 86.32 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 85.0 | 52.5 | 53.33 | 70.0 | 40.0 | 60.53 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 92.5 | 62.5 | 46.67 | 70.0 | 45.0 | 64.21 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 75.0 | 52.5 | 63.33 | 62.5 | 45.0 | 59.47 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 80.0 | 47.5 | 63.33 | 65.0 | 32.5 | 57.37 |

<a name="adaptation-k2"></a>

## 2 events

190 questions per run, with 30 in electromagnetism and 40 in each other domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k2)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 2.5 | 2.5 | 0.0 | 2.5 | 7.5 | 3.16 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 67.5 | 57.5 | 40.0 | 75.0 | 67.5 | 62.63 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 90.0 | 60.0 | 63.33 | 77.5 | 77.5 | 74.21 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 95.0 | 60.0 | 56.67 | 75.0 | 72.5 | 72.63 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 95.0 | 60.0 | 56.67 | 75.0 | 72.5 | 72.63 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 95.0 | 60.0 | 56.67 | 75.0 | 72.5 | 72.63 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 85.0 | 65.0 | 76.67 | 82.5 | 70.0 | 75.79 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 82.5 | 72.5 | 70.0 | 77.5 | 65.0 | 73.68 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 83.75 | 68.75 | 73.33 | 80.0 | 67.5 | 74.74 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 70.0 | 30.0 | 30.0 | 40.0 | 20.0 | 38.42 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 75.0 | 55.0 | 26.67 | 55.0 | 22.5 | 47.89 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 62.5 | 40.0 | 30.0 | 20.0 | 17.5 | 34.21 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 52.5 | 35.0 | 20.0 | 15.0 | 17.5 | 28.42 |

<a name="adaptation-k3"></a>

## 3 events

200 questions per run, with 40 in each domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k3)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 2.5 | 2.5 | 10.0 | 2.5 | 2.5 | 4.0 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 45.0 | 45.0 | 47.5 | 65.0 | 35.0 | 47.5 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 75.0 | 57.5 | 65.0 | 75.0 | 72.5 | 69.0 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 72.5 | 55.0 | 55.0 | 80.0 | 62.5 | 65.0 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 77.5 | 55.0 | 55.0 | 80.0 | 65.0 | 66.5 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 75.0 | 55.0 | 55.0 | 80.0 | 63.75 | 65.75 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 75.0 | 67.5 | 65.0 | 72.5 | 55.0 | 67.0 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 77.5 | 70.0 | 60.0 | 75.0 | 62.5 | 69.0 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 76.25 | 68.75 | 62.5 | 73.75 | 58.75 | 68.0 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 62.5 | 22.5 | 45.0 | 37.5 | 12.5 | 36.0 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 55.0 | 30.0 | 40.0 | 37.5 | 25.0 | 37.5 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 27.5 | 20.0 | 35.0 | 2.5 | 15.0 | 20.0 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 40.0 | 25.0 | 37.5 | 7.5 | 15.0 | 25.0 |

<a name="adaptation-k4"></a>

## 4 events

200 questions per run, with 40 in each domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k4)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 0.0 | 0.0 | 5.0 | 0.0 | 0.0 | 1.0 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 27.5 | 40.0 | 35.0 | 35.0 | 37.5 | 35.0 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 47.5 | 42.5 | 60.0 | 62.5 | 50.0 | 52.5 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 60.0 | 42.5 | 62.5 | 65.0 | 55.0 | 57.0 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 60.0 | 40.0 | 62.5 | 62.5 | 50.0 | 55.0 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 60.0 | 41.25 | 62.5 | 63.75 | 52.5 | 56.0 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 27.5 | 30.0 | 37.5 | 57.5 | 22.5 | 35.0 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 42.5 | 32.5 | 45.0 | 57.5 | 30.0 | 41.5 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 35.0 | 31.25 | 41.25 | 57.5 | 26.25 | 38.25 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 42.5 | 20.0 | 37.5 | 25.0 | 17.5 | 28.5 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 55.0 | 22.5 | 30.0 | 32.5 | 30.0 | 34.0 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 12.5 | 20.0 | 30.0 | 2.5 | 12.5 | 15.5 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 22.5 | 17.5 | 32.5 | 10.0 | 7.5 | 18.0 |

<a name="adaptation-k5"></a>

## 5 events

200 questions per run, with 40 in each domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k5)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 0.0 | 0.0 | 5.0 | 0.0 | 0.0 | 1.0 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 20.0 | 25.0 | 30.0 | 15.0 | 15.0 | 21.0 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 37.5 | 27.5 | 45.0 | 25.0 | 10.0 | 29.0 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 35.0 | 32.5 | 45.0 | 35.0 | 12.5 | 32.0 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 37.5 | 30.0 | 47.5 | 35.0 | 15.0 | 33.0 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 36.25 | 31.25 | 46.25 | 35.0 | 13.75 | 32.5 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 15.0 | 2.5 | 22.5 | 17.5 | 5.0 | 12.5 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 25.0 | 5.0 | 35.0 | 30.0 | 0.0 | 19.0 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 20.0 | 3.75 | 28.75 | 23.75 | 2.5 | 15.75 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 47.5 | 10.0 | 30.0 | 27.5 | 12.5 | 25.5 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 40.0 | 17.5 | 32.5 | 20.0 | 22.5 | 26.5 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 5.0 | 10.0 | 27.5 | 2.5 | 5.0 | 10.0 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 17.5 | 10.0 | 27.5 | 0.0 | 5.0 | 12.0 |

<a name="adaptation-k6"></a>

## 6 events

200 questions per run, with 40 in each domain. [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k6)

| Model and method | Dynamics | Thermal | Electromagnetism | Acoustics | Optics | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](adaptation_tables.md#qwen3-5-9b-baseline-baseline) | 0.0 | 0.0 | 2.5 | 0.0 | 0.0 | 0.5 |
| [Qwen3.5-9B · SFT · seed 20261102](adaptation_tables.md#qwen3-5-9b-sft-20261102) | 25.0 | 30.0 | 30.0 | 10.0 | 5.0 | 20.0 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](adaptation_tables.md#qwen3-5-9b-sft-dpo-20261106) | 42.5 | 35.0 | 40.0 | 22.5 | 12.5 | 30.5 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261108) | 40.0 | 32.5 | 42.5 | 25.0 | 17.5 | 31.5 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](adaptation_tables.md#qwen3-5-9b-sft-simpo-20261109) | 42.5 | 35.0 | 42.5 | 22.5 | 17.5 | 32.0 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-simpo-mean) | 41.25 | 33.75 | 42.5 | 23.75 | 17.5 | 31.75 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](adaptation_tables.md#qwen3-5-9b-sft-kto-20261107) | 17.5 | 15.0 | 25.0 | 12.5 | 2.5 | 14.5 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](adaptation_tables.md#qwen3-5-9b-sft-kto-20261108) | 10.0 | 15.0 | 30.0 | 15.0 | 2.5 | 14.5 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](adaptation_tables.md#qwen3-5-9b-sft-kto-mean) | 13.75 | 15.0 | 27.5 | 13.75 | 2.5 | 14.5 |
| [Gemini 3.8 Flash · Baseline](adaptation_tables.md#gemini-3-8-flash-baseline-baseline) | 40.0 | 7.5 | 32.5 | 15.0 | 12.5 | 21.5 |
| [Gemini 3.8 Flash · ReAct](adaptation_tables.md#gemini-3-8-flash-react-published) | 37.5 | 17.5 | 25.0 | 25.0 | 25.0 | 26.0 |
| [Gemini 3.8 Flash · Visual Sketchpad](adaptation_tables.md#gemini-3-8-flash-visual-sketchpad-published) | 2.5 | 7.5 | 25.0 | 0.0 | 5.0 | 8.0 |
| [Gemini 3.8 Flash · ViperGPT](adaptation_tables.md#gemini-3-8-flash-vipergpt-published) | 12.5 | 10.0 | 25.0 | 5.0 | 2.5 | 11.0 |
