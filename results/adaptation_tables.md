# Adaptation results by run and apparatus

Sequence exact match counts questions with every event correct. Event accuracy counts individual events whose predicted controls match the recorded set. SimPO and KTO have two seeds each.

Question length (`k`) ranges from one to six events. There are ten questions per apparatus at each available length. Dielectric response (S11) begins at three events, giving 190 questions each at one and two events and 200 each at three through six.

[Counts by run and length](../docs/assets/results/adaptation_by_length.csv) · [Counts by run and apparatus](../docs/assets/results/adaptation_by_scene.csv) · [Question-level scores](adaptation_question_scores.csv) · [Six-event results by event position](#event-positions)

## All runs

**Sequence exact match (%)**

| Model and method | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| [Qwen3.5-9B · Baseline](#qwen3-5-9b-baseline-baseline) | 23.7 | 3.2 | 4.0 | 1.0 | 1.0 | 0.5 | 5.4 |
| [Qwen3.5-9B · SFT · seed 20261102](#qwen3-5-9b-sft-20261102) | 78.9 | 62.6 | 47.5 | 35.0 | 21.0 | 20.0 | 43.7 |
| [Qwen3.5-9B · SFT + DPO · seed 20261106](#qwen3-5-9b-sft-dpo-20261106) | 86.3 | 74.2 | 69.0 | 52.5 | 29.0 | 30.5 | 56.5 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261108](#qwen3-5-9b-sft-simpo-20261108) | 87.4 | 72.6 | 65.0 | 57.0 | 32.0 | 31.5 | 57.2 |
| [Qwen3.5-9B · SFT + SimPO · seed 20261109](#qwen3-5-9b-sft-simpo-20261109) | 86.3 | 72.6 | 66.5 | 55.0 | 33.0 | 32.0 | 57.2 |
| [Qwen3.5-9B · SFT + SimPO · two-seed mean](#qwen3-5-9b-sft-simpo-mean) | 86.8 | 72.6 | 65.8 | 56.0 | 32.5 | 31.8 | 57.2 |
| [Qwen3.5-9B · SFT + KTO · seed 20261107](#qwen3-5-9b-sft-kto-20261107) | 85.3 | 75.8 | 67.0 | 35.0 | 12.5 | 14.5 | 47.8 |
| [Qwen3.5-9B · SFT + KTO · seed 20261108](#qwen3-5-9b-sft-kto-20261108) | 87.4 | 73.7 | 69.0 | 41.5 | 19.0 | 14.5 | 50.3 |
| [Qwen3.5-9B · SFT + KTO · two-seed mean](#qwen3-5-9b-sft-kto-mean) | 86.3 | 74.7 | 68.0 | 38.2 | 15.8 | 14.5 | 49.1 |
| [Gemini 3.8 Flash · Baseline](#gemini-3-8-flash-baseline-baseline) | 60.5 | 38.4 | 36.0 | 28.5 | 25.5 | 21.5 | 34.8 |
| [Gemini 3.8 Flash · ReAct](#gemini-3-8-flash-react-published) | 64.2 | 47.9 | 37.5 | 34.0 | 26.5 | 26.0 | 39.1 |
| [Gemini 3.8 Flash · Visual Sketchpad](#gemini-3-8-flash-visual-sketchpad-published) | 59.5 | 34.2 | 20.0 | 15.5 | 10.0 | 8.0 | 24.2 |
| [Gemini 3.8 Flash · ViperGPT](#gemini-3-8-flash-vipergpt-published) | 57.4 | 28.4 | 25.0 | 18.0 | 12.0 | 11.0 | 25.0 |

<details><summary>Event accuracy across all apparatuses</summary>

| Model and method | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Qwen3.5-9B · Baseline | 23.7 | 18.4 | 23.0 | 19.0 | 18.8 | 19.1 | 19.7 |
| Qwen3.5-9B · SFT · seed 20261102 | 78.9 | 73.7 | 66.3 | 57.4 | 49.2 | 54.5 | 58.3 |
| Qwen3.5-9B · SFT + DPO · seed 20261106 | 86.3 | 82.9 | 82.2 | 68.1 | 56.1 | 67.3 | 69.2 |
| Qwen3.5-9B · SFT + SimPO · seed 20261108 | 87.4 | 82.1 | 80.0 | 73.4 | 63.1 | 67.5 | 71.6 |
| Qwen3.5-9B · SFT + SimPO · seed 20261109 | 86.3 | 82.1 | 81.0 | 72.0 | 61.0 | 66.9 | 70.8 |
| Qwen3.5-9B · SFT + SimPO · two-seed mean | 86.8 | 82.1 | 80.5 | 72.7 | 62.0 | 67.2 | 71.2 |
| Qwen3.5-9B · SFT + KTO · seed 20261107 | 85.3 | 83.9 | 80.8 | 51.1 | 33.4 | 57.0 | 57.4 |
| Qwen3.5-9B · SFT + KTO · seed 20261108 | 87.4 | 83.4 | 82.7 | 59.8 | 47.7 | 58.4 | 63.2 |
| Qwen3.5-9B · SFT + KTO · two-seed mean | 86.3 | 83.7 | 81.8 | 55.4 | 40.5 | 57.7 | 60.3 |
| Gemini 3.8 Flash · Baseline | 60.5 | 56.3 | 58.0 | 55.9 | 52.5 | 53.3 | 54.9 |
| Gemini 3.8 Flash · ReAct | 64.2 | 62.6 | 60.7 | 59.5 | 53.7 | 55.6 | 57.6 |
| Gemini 3.8 Flash · Visual Sketchpad | 59.5 | 50.8 | 43.5 | 42.4 | 37.7 | 35.3 | 40.9 |
| Gemini 3.8 Flash · ViperGPT | 57.4 | 44.7 | 47.8 | 43.2 | 39.0 | 37.3 | 42.0 |

</details>

<a name="simpo-seeds"></a>

## Which sequences do both SimPO runs recover?

Each of the 200 six-event questions appears once. A run recovers a sequence when it predicts every event correctly.

| SFT result | Both SimPO runs correct | Only seed 20261108 correct | Only seed 20261109 correct | Neither run correct | Questions |
| --- | ---: | ---: | ---: | ---: | ---: |
| Correct | 35 | 1 | 2 | 2 | 40 |
| Incorrect | 26 | 1 | 1 | 132 | 160 |

[Question-level scores](adaptation_question_scores.csv)

<a name="event-positions"></a>

## Event accuracy by position on six-event questions

Each column scores one position in the same 200 six-event questions. An event is correct when the predicted controls match the full recorded set. Each training seed has its own row.

| Model and method | Event 1 (%) | Event 2 (%) | Event 3 (%) | Event 4 (%) | Event 5 (%) | Event 6 (%) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Qwen3.5-9B · Baseline | 25.5 | 14.0 | 23.0 | 19.0 | 14.5 | 18.5 |
| Qwen3.5-9B · SFT · seed 20261102 | 81.5 | 73.5 | 57.5 | 41.0 | 36.0 | 37.5 |
| Qwen3.5-9B · SFT + DPO · seed 20261106 | 86.0 | 84.0 | 82.0 | 60.0 | 45.0 | 47.0 |
| Qwen3.5-9B · SFT + SimPO · seed 20261108 | 86.5 | 83.0 | 81.0 | 57.0 | 48.0 | 49.5 |
| Qwen3.5-9B · SFT + SimPO · seed 20261109 | 85.0 | 82.5 | 78.5 | 60.0 | 46.5 | 49.0 |
| Qwen3.5-9B · SFT + KTO · seed 20261107 | 86.0 | 78.5 | 73.5 | 46.0 | 26.0 | 32.0 |
| Qwen3.5-9B · SFT + KTO · seed 20261108 | 84.5 | 78.5 | 75.0 | 48.5 | 27.0 | 37.0 |
| Gemini 3.8 Flash · Baseline | 58.5 | 53.5 | 52.0 | 53.5 | 54.0 | 48.5 |
| Gemini 3.8 Flash · ReAct | 62.0 | 53.5 | 57.0 | 52.5 | 55.0 | 53.5 |
| Gemini 3.8 Flash · Visual Sketchpad | 46.5 | 38.0 | 34.5 | 33.0 | 35.5 | 24.5 |
| Gemini 3.8 Flash · ViperGPT | 46.0 | 37.5 | 39.0 | 36.0 | 32.0 | 33.5 |

At event 3, Qwen3.5-9B recovered the complete control set in 115 of 200 questions after SFT (57.5%) and in 164 after DPO (82.0%).

[Counts and denominators](../docs/assets/results/adaptation_by_position.csv) · [Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_position)

<a name="qwen3-5-9b-baseline-baseline"></a>

## Qwen3.5-9B · Baseline

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S02 · Rotation & gas | 70.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 15.0 |
| S03 · Driven pendulums | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S04 · Tray impact | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S05 · Moving heat source | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S06 · Layered liquids | 50.0 | 0.0 | 10.0 | 0.0 | 0.0 | 0.0 | 10.0 |
| S07 · Heated gas bulbs | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S08 · Bimetal supports | 30.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 5.0 |
| S09 · Magnetic coils | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S10 · Electric dipoles | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S11 · Dielectric response | — | — | 40.0 | 20.0 | 20.0 | 10.0 | 22.5 |
| S12 · Conducting wires | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S13 · Standing waves | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S14 · Wave scattering | 40.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 6.7 |
| S15 · Doppler response | 30.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 8.3 |
| S16 · Two-source ripples | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S17 · Photoelastic load | 60.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 13.3 |
| S18 · Double reflection | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S19 · Graded refraction | 30.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 5.0 |
| S20 · Double-slit fringes | 30.0 | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 8.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 0.0 | 10.0 | 10.0 | 10.0 | 8.0 | 16.7 | 11.0 |
| S02 · Rotation & gas | 70.0 | 50.0 | 53.3 | 27.5 | 32.0 | 25.0 | 35.7 |
| S03 · Driven pendulums | 10.0 | 25.0 | 26.7 | 25.0 | 38.0 | 36.7 | 31.0 |
| S04 · Tray impact | 20.0 | 5.0 | 13.3 | 10.0 | 20.0 | 13.3 | 13.8 |
| S05 · Moving heat source | 10.0 | 15.0 | 23.3 | 17.5 | 20.0 | 13.3 | 17.1 |
| S06 · Layered liquids | 50.0 | 25.0 | 33.3 | 25.0 | 26.0 | 26.7 | 28.1 |
| S07 · Heated gas bulbs | 10.0 | 20.0 | 13.3 | 30.0 | 16.0 | 10.0 | 16.7 |
| S08 · Bimetal supports | 30.0 | 10.0 | 20.0 | 12.5 | 6.0 | 6.7 | 11.0 |
| S09 · Magnetic coils | 20.0 | 5.0 | 16.7 | 15.0 | 12.0 | 16.7 | 14.3 |
| S10 · Electric dipoles | 0.0 | 10.0 | 20.0 | 10.0 | 22.0 | 10.0 | 13.8 |
| S11 · Dielectric response | — | — | 66.7 | 47.5 | 50.0 | 38.3 | 48.3 |
| S12 · Conducting wires | 0.0 | 0.0 | 10.0 | 17.5 | 14.0 | 18.3 | 13.3 |
| S13 · Standing waves | 20.0 | 20.0 | 10.0 | 7.5 | 10.0 | 8.3 | 10.5 |
| S14 · Wave scattering | 40.0 | 10.0 | 20.0 | 2.5 | 14.0 | 16.7 | 14.3 |
| S15 · Doppler response | 30.0 | 45.0 | 40.0 | 22.5 | 22.0 | 33.3 | 30.5 |
| S16 · Two-source ripples | 10.0 | 10.0 | 13.3 | 15.0 | 10.0 | 13.3 | 12.4 |
| S17 · Photoelastic load | 60.0 | 40.0 | 36.7 | 25.0 | 16.0 | 33.3 | 30.0 |
| S18 · Double reflection | 10.0 | 5.0 | 3.3 | 10.0 | 4.0 | 8.3 | 6.7 |
| S19 · Graded refraction | 30.0 | 15.0 | 13.3 | 12.5 | 14.0 | 13.3 | 14.3 |
| S20 · Double-slit fringes | 30.0 | 30.0 | 16.7 | 37.5 | 22.0 | 23.3 | 25.7 |

</details>

<a name="qwen3-5-9b-sft-20261102"></a>

## Qwen3.5-9B · SFT · seed 20261102

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 70.0 | 20.0 | 10.0 | 0.0 | 10.0 | 35.0 |
| S02 · Rotation & gas | 30.0 | 40.0 | 30.0 | 20.0 | 20.0 | 40.0 | 30.0 |
| S03 · Driven pendulums | 60.0 | 80.0 | 60.0 | 40.0 | 20.0 | 20.0 | 46.7 |
| S04 · Tray impact | 100.0 | 80.0 | 70.0 | 40.0 | 40.0 | 30.0 | 60.0 |
| S05 · Moving heat source | 80.0 | 50.0 | 40.0 | 30.0 | 0.0 | 0.0 | 33.3 |
| S06 · Layered liquids | 90.0 | 80.0 | 60.0 | 80.0 | 70.0 | 70.0 | 75.0 |
| S07 · Heated gas bulbs | 70.0 | 80.0 | 60.0 | 50.0 | 30.0 | 30.0 | 53.3 |
| S08 · Bimetal supports | 40.0 | 20.0 | 20.0 | 0.0 | 0.0 | 20.0 | 16.7 |
| S09 · Magnetic coils | 80.0 | 40.0 | 30.0 | 20.0 | 10.0 | 30.0 | 35.0 |
| S10 · Electric dipoles | 100.0 | 60.0 | 40.0 | 20.0 | 20.0 | 20.0 | 43.3 |
| S11 · Dielectric response | — | — | 90.0 | 80.0 | 60.0 | 40.0 | 67.5 |
| S12 · Conducting wires | 20.0 | 20.0 | 30.0 | 20.0 | 30.0 | 30.0 | 25.0 |
| S13 · Standing waves | 90.0 | 80.0 | 30.0 | 20.0 | 0.0 | 0.0 | 36.7 |
| S14 · Wave scattering | 100.0 | 70.0 | 60.0 | 20.0 | 30.0 | 20.0 | 50.0 |
| S15 · Doppler response | 90.0 | 60.0 | 70.0 | 30.0 | 20.0 | 20.0 | 48.3 |
| S16 · Two-source ripples | 90.0 | 90.0 | 100.0 | 70.0 | 10.0 | 0.0 | 60.0 |
| S17 · Photoelastic load | 100.0 | 90.0 | 40.0 | 50.0 | 10.0 | 0.0 | 48.3 |
| S18 · Double reflection | 70.0 | 40.0 | 20.0 | 20.0 | 10.0 | 0.0 | 26.7 |
| S19 · Graded refraction | 100.0 | 80.0 | 30.0 | 20.0 | 20.0 | 20.0 | 45.0 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 50.0 | 60.0 | 20.0 | 0.0 | 46.7 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 85.0 | 50.0 | 55.0 | 20.0 | 51.7 | 50.0 |
| S02 · Rotation & gas | 30.0 | 40.0 | 43.3 | 40.0 | 46.0 | 56.7 | 46.2 |
| S03 · Driven pendulums | 60.0 | 80.0 | 76.7 | 65.0 | 50.0 | 70.0 | 65.7 |
| S04 · Tray impact | 100.0 | 90.0 | 83.3 | 57.5 | 70.0 | 70.0 | 72.9 |
| S05 · Moving heat source | 80.0 | 65.0 | 66.7 | 60.0 | 30.0 | 36.7 | 48.6 |
| S06 · Layered liquids | 90.0 | 80.0 | 73.3 | 82.5 | 80.0 | 78.3 | 79.5 |
| S07 · Heated gas bulbs | 70.0 | 80.0 | 70.0 | 50.0 | 40.0 | 65.0 | 58.6 |
| S08 · Bimetal supports | 40.0 | 50.0 | 46.7 | 25.0 | 10.0 | 50.0 | 34.8 |
| S09 · Magnetic coils | 80.0 | 65.0 | 53.3 | 57.5 | 46.0 | 58.3 | 56.2 |
| S10 · Electric dipoles | 100.0 | 70.0 | 63.3 | 55.0 | 64.0 | 46.7 | 59.5 |
| S11 · Dielectric response | — | — | 93.3 | 90.0 | 88.0 | 73.3 | 84.4 |
| S12 · Conducting wires | 20.0 | 30.0 | 36.7 | 30.0 | 38.0 | 41.7 | 35.7 |
| S13 · Standing waves | 90.0 | 90.0 | 66.7 | 50.0 | 26.0 | 45.0 | 51.0 |
| S14 · Wave scattering | 100.0 | 85.0 | 76.7 | 45.0 | 70.0 | 55.0 | 64.8 |
| S15 · Doppler response | 90.0 | 75.0 | 83.3 | 60.0 | 62.0 | 60.0 | 66.7 |
| S16 · Two-source ripples | 90.0 | 95.0 | 100.0 | 85.0 | 60.0 | 53.3 | 73.3 |
| S17 · Photoelastic load | 100.0 | 95.0 | 73.3 | 77.5 | 62.0 | 55.0 | 69.5 |
| S18 · Double reflection | 70.0 | 60.0 | 40.0 | 40.0 | 36.0 | 16.7 | 35.7 |
| S19 · Graded refraction | 100.0 | 90.0 | 56.7 | 47.5 | 34.0 | 53.3 | 53.8 |
| S20 · Double-slit fringes | 90.0 | 75.0 | 73.3 | 75.0 | 52.0 | 53.3 | 63.8 |

</details>

<a name="qwen3-5-9b-sft-dpo-20261106"></a>

## Qwen3.5-9B · SFT + DPO · seed 20261106

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 90.0 | 40.0 | 40.0 | 0.0 | 10.0 | 46.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 70.0 | 70.0 | 70.0 | 81.7 |
| S03 · Driven pendulums | 80.0 | 80.0 | 80.0 | 50.0 | 20.0 | 30.0 | 56.7 |
| S04 · Tray impact | 100.0 | 90.0 | 100.0 | 30.0 | 60.0 | 60.0 | 73.3 |
| S05 · Moving heat source | 80.0 | 60.0 | 50.0 | 40.0 | 0.0 | 0.0 | 38.3 |
| S06 · Layered liquids | 80.0 | 80.0 | 80.0 | 90.0 | 60.0 | 70.0 | 76.7 |
| S07 · Heated gas bulbs | 90.0 | 80.0 | 80.0 | 40.0 | 20.0 | 40.0 | 58.3 |
| S08 · Bimetal supports | 40.0 | 20.0 | 20.0 | 0.0 | 30.0 | 30.0 | 23.3 |
| S09 · Magnetic coils | 90.0 | 60.0 | 60.0 | 40.0 | 20.0 | 30.0 | 50.0 |
| S10 · Electric dipoles | 100.0 | 90.0 | 60.0 | 60.0 | 30.0 | 30.0 | 61.7 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 60.0 | 90.0 |
| S12 · Conducting wires | 50.0 | 40.0 | 40.0 | 40.0 | 30.0 | 40.0 | 40.0 |
| S13 · Standing waves | 80.0 | 70.0 | 50.0 | 20.0 | 0.0 | 0.0 | 36.7 |
| S14 · Wave scattering | 100.0 | 90.0 | 70.0 | 50.0 | 60.0 | 60.0 | 71.7 |
| S15 · Doppler response | 100.0 | 60.0 | 80.0 | 80.0 | 30.0 | 30.0 | 63.3 |
| S16 · Two-source ripples | 90.0 | 90.0 | 100.0 | 100.0 | 10.0 | 0.0 | 65.0 |
| S17 · Photoelastic load | 100.0 | 100.0 | 80.0 | 30.0 | 0.0 | 0.0 | 51.7 |
| S18 · Double reflection | 70.0 | 70.0 | 60.0 | 40.0 | 20.0 | 10.0 | 45.0 |
| S19 · Graded refraction | 100.0 | 80.0 | 70.0 | 60.0 | 10.0 | 20.0 | 56.7 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 80.0 | 70.0 | 10.0 | 20.0 | 55.0 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 95.0 | 76.7 | 65.0 | 14.0 | 53.3 | 55.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 87.5 | 90.0 | 90.0 | 91.4 |
| S03 · Driven pendulums | 80.0 | 85.0 | 90.0 | 62.5 | 38.0 | 71.7 | 66.2 |
| S04 · Tray impact | 100.0 | 95.0 | 100.0 | 45.0 | 82.0 | 83.3 | 80.0 |
| S05 · Moving heat source | 80.0 | 70.0 | 76.7 | 70.0 | 36.0 | 50.0 | 57.6 |
| S06 · Layered liquids | 80.0 | 80.0 | 86.7 | 90.0 | 84.0 | 88.3 | 86.2 |
| S07 · Heated gas bulbs | 90.0 | 80.0 | 80.0 | 47.5 | 28.0 | 68.3 | 58.6 |
| S08 · Bimetal supports | 40.0 | 55.0 | 60.0 | 42.5 | 54.0 | 70.0 | 56.7 |
| S09 · Magnetic coils | 90.0 | 80.0 | 70.0 | 67.5 | 52.0 | 65.0 | 65.7 |
| S10 · Electric dipoles | 100.0 | 90.0 | 83.3 | 72.5 | 58.0 | 63.3 | 71.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 83.3 | 94.4 |
| S12 · Conducting wires | 50.0 | 50.0 | 46.7 | 45.0 | 34.0 | 48.3 | 44.3 |
| S13 · Standing waves | 80.0 | 85.0 | 73.3 | 32.5 | 26.0 | 48.3 | 48.6 |
| S14 · Wave scattering | 100.0 | 90.0 | 83.3 | 60.0 | 88.0 | 88.3 | 82.9 |
| S15 · Doppler response | 100.0 | 80.0 | 90.0 | 87.5 | 68.0 | 70.0 | 78.1 |
| S16 · Two-source ripples | 90.0 | 95.0 | 100.0 | 100.0 | 70.0 | 56.7 | 79.5 |
| S17 · Photoelastic load | 100.0 | 100.0 | 93.3 | 75.0 | 64.0 | 58.3 | 73.8 |
| S18 · Double reflection | 70.0 | 80.0 | 73.3 | 55.0 | 58.0 | 55.0 | 61.4 |
| S19 · Graded refraction | 100.0 | 90.0 | 80.0 | 70.0 | 28.0 | 66.7 | 63.8 |
| S20 · Double-slit fringes | 90.0 | 75.0 | 86.7 | 87.5 | 50.0 | 68.3 | 71.9 |

</details>

<a name="qwen3-5-9b-sft-simpo-20261108"></a>

## Qwen3.5-9B · SFT + SimPO · seed 20261108

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 50.0 | 50.0 | 0.0 | 10.0 | 51.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 70.0 | 70.0 | 70.0 | 60.0 | 78.3 |
| S03 · Driven pendulums | 80.0 | 80.0 | 80.0 | 80.0 | 10.0 | 30.0 | 60.0 |
| S04 · Tray impact | 100.0 | 100.0 | 90.0 | 40.0 | 60.0 | 60.0 | 75.0 |
| S05 · Moving heat source | 80.0 | 60.0 | 40.0 | 40.0 | 10.0 | 0.0 | 38.3 |
| S06 · Layered liquids | 90.0 | 80.0 | 80.0 | 80.0 | 70.0 | 70.0 | 78.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 80.0 | 50.0 | 20.0 | 40.0 | 58.3 |
| S08 · Bimetal supports | 40.0 | 20.0 | 20.0 | 0.0 | 30.0 | 20.0 | 21.7 |
| S09 · Magnetic coils | 100.0 | 60.0 | 40.0 | 60.0 | 20.0 | 40.0 | 53.3 |
| S10 · Electric dipoles | 100.0 | 80.0 | 50.0 | 50.0 | 20.0 | 30.0 | 55.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 60.0 | 90.0 |
| S12 · Conducting wires | 60.0 | 30.0 | 30.0 | 40.0 | 40.0 | 40.0 | 40.0 |
| S13 · Standing waves | 80.0 | 70.0 | 60.0 | 20.0 | 0.0 | 0.0 | 38.3 |
| S14 · Wave scattering | 100.0 | 80.0 | 70.0 | 60.0 | 70.0 | 60.0 | 73.3 |
| S15 · Doppler response | 100.0 | 60.0 | 90.0 | 80.0 | 50.0 | 40.0 | 70.0 |
| S16 · Two-source ripples | 90.0 | 90.0 | 100.0 | 100.0 | 20.0 | 0.0 | 66.7 |
| S17 · Photoelastic load | 100.0 | 90.0 | 80.0 | 50.0 | 0.0 | 0.0 | 53.3 |
| S18 · Double reflection | 70.0 | 60.0 | 40.0 | 50.0 | 10.0 | 20.0 | 41.7 |
| S19 · Graded refraction | 100.0 | 80.0 | 60.0 | 50.0 | 20.0 | 40.0 | 58.3 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 70.0 | 70.0 | 20.0 | 10.0 | 53.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 80.0 | 72.5 | 16.0 | 55.0 | 59.0 |
| S02 · Rotation & gas | 100.0 | 100.0 | 90.0 | 90.0 | 92.0 | 88.3 | 91.4 |
| S03 · Driven pendulums | 80.0 | 85.0 | 90.0 | 92.5 | 52.0 | 68.3 | 74.3 |
| S04 · Tray impact | 100.0 | 100.0 | 93.3 | 60.0 | 84.0 | 83.3 | 82.9 |
| S05 · Moving heat source | 80.0 | 70.0 | 70.0 | 75.0 | 56.0 | 53.3 | 63.3 |
| S06 · Layered liquids | 90.0 | 80.0 | 86.7 | 82.5 | 80.0 | 88.3 | 84.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 80.0 | 62.5 | 36.0 | 68.3 | 62.9 |
| S08 · Bimetal supports | 40.0 | 55.0 | 53.3 | 37.5 | 54.0 | 63.3 | 52.9 |
| S09 · Magnetic coils | 100.0 | 80.0 | 60.0 | 80.0 | 68.0 | 71.7 | 72.9 |
| S10 · Electric dipoles | 100.0 | 85.0 | 76.7 | 67.5 | 58.0 | 61.7 | 68.1 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 83.3 | 94.4 |
| S12 · Conducting wires | 60.0 | 40.0 | 43.3 | 45.0 | 44.0 | 48.3 | 45.7 |
| S13 · Standing waves | 80.0 | 85.0 | 83.3 | 37.5 | 38.0 | 48.3 | 53.8 |
| S14 · Wave scattering | 100.0 | 90.0 | 83.3 | 72.5 | 92.0 | 88.3 | 86.2 |
| S15 · Doppler response | 100.0 | 80.0 | 93.3 | 92.5 | 78.0 | 75.0 | 83.3 |
| S16 · Two-source ripples | 90.0 | 95.0 | 100.0 | 100.0 | 80.0 | 61.7 | 83.3 |
| S17 · Photoelastic load | 100.0 | 95.0 | 93.3 | 82.5 | 64.0 | 58.3 | 74.8 |
| S18 · Double reflection | 70.0 | 75.0 | 63.3 | 62.5 | 56.0 | 55.0 | 60.5 |
| S19 · Graded refraction | 100.0 | 90.0 | 76.7 | 72.5 | 54.0 | 68.3 | 70.5 |
| S20 · Double-slit fringes | 90.0 | 75.0 | 83.3 | 82.5 | 60.0 | 61.7 | 71.0 |

</details>

<a name="qwen3-5-9b-sft-simpo-20261109"></a>

## Qwen3.5-9B · SFT + SimPO · seed 20261109

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 50.0 | 50.0 | 0.0 | 10.0 | 51.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 90.0 | 70.0 | 70.0 | 70.0 | 83.3 |
| S03 · Driven pendulums | 80.0 | 80.0 | 80.0 | 80.0 | 10.0 | 30.0 | 60.0 |
| S04 · Tray impact | 100.0 | 100.0 | 90.0 | 40.0 | 70.0 | 60.0 | 76.7 |
| S05 · Moving heat source | 80.0 | 60.0 | 40.0 | 40.0 | 0.0 | 0.0 | 36.7 |
| S06 · Layered liquids | 90.0 | 80.0 | 80.0 | 80.0 | 70.0 | 70.0 | 78.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 80.0 | 40.0 | 20.0 | 50.0 | 58.3 |
| S08 · Bimetal supports | 40.0 | 20.0 | 20.0 | 0.0 | 30.0 | 20.0 | 21.7 |
| S09 · Magnetic coils | 90.0 | 60.0 | 40.0 | 60.0 | 20.0 | 30.0 | 50.0 |
| S10 · Electric dipoles | 100.0 | 80.0 | 50.0 | 50.0 | 30.0 | 30.0 | 56.7 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 70.0 | 92.5 |
| S12 · Conducting wires | 50.0 | 30.0 | 30.0 | 40.0 | 40.0 | 40.0 | 38.3 |
| S13 · Standing waves | 80.0 | 70.0 | 60.0 | 20.0 | 0.0 | 0.0 | 38.3 |
| S14 · Wave scattering | 100.0 | 80.0 | 70.0 | 50.0 | 70.0 | 50.0 | 70.0 |
| S15 · Doppler response | 100.0 | 60.0 | 90.0 | 80.0 | 50.0 | 40.0 | 70.0 |
| S16 · Two-source ripples | 90.0 | 90.0 | 100.0 | 100.0 | 20.0 | 0.0 | 66.7 |
| S17 · Photoelastic load | 100.0 | 90.0 | 80.0 | 40.0 | 0.0 | 0.0 | 51.7 |
| S18 · Double reflection | 70.0 | 60.0 | 50.0 | 50.0 | 20.0 | 20.0 | 45.0 |
| S19 · Graded refraction | 100.0 | 80.0 | 60.0 | 40.0 | 20.0 | 40.0 | 56.7 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 70.0 | 70.0 | 20.0 | 10.0 | 53.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 80.0 | 72.5 | 14.0 | 55.0 | 58.6 |
| S02 · Rotation & gas | 100.0 | 100.0 | 96.7 | 87.5 | 90.0 | 86.7 | 91.0 |
| S03 · Driven pendulums | 80.0 | 85.0 | 90.0 | 85.0 | 52.0 | 68.3 | 72.9 |
| S04 · Tray impact | 100.0 | 100.0 | 93.3 | 55.0 | 86.0 | 83.3 | 82.4 |
| S05 · Moving heat source | 80.0 | 70.0 | 70.0 | 75.0 | 40.0 | 51.7 | 59.0 |
| S06 · Layered liquids | 90.0 | 80.0 | 86.7 | 82.5 | 80.0 | 88.3 | 84.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 83.3 | 47.5 | 28.0 | 71.7 | 59.5 |
| S08 · Bimetal supports | 40.0 | 55.0 | 53.3 | 45.0 | 54.0 | 63.3 | 54.3 |
| S09 · Magnetic coils | 90.0 | 80.0 | 63.3 | 80.0 | 68.0 | 63.3 | 70.5 |
| S10 · Electric dipoles | 100.0 | 85.0 | 76.7 | 67.5 | 60.0 | 61.7 | 68.6 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 86.7 | 95.6 |
| S12 · Conducting wires | 50.0 | 40.0 | 36.7 | 45.0 | 44.0 | 48.3 | 44.3 |
| S13 · Standing waves | 80.0 | 85.0 | 83.3 | 37.5 | 24.0 | 48.3 | 50.5 |
| S14 · Wave scattering | 100.0 | 90.0 | 83.3 | 65.0 | 90.0 | 81.7 | 82.4 |
| S15 · Doppler response | 100.0 | 80.0 | 96.7 | 92.5 | 74.0 | 76.7 | 83.3 |
| S16 · Two-source ripples | 90.0 | 95.0 | 100.0 | 100.0 | 80.0 | 61.7 | 83.3 |
| S17 · Photoelastic load | 100.0 | 95.0 | 93.3 | 77.5 | 64.0 | 58.3 | 73.8 |
| S18 · Double reflection | 70.0 | 75.0 | 70.0 | 67.5 | 58.0 | 53.3 | 62.4 |
| S19 · Graded refraction | 100.0 | 90.0 | 80.0 | 70.0 | 54.0 | 70.0 | 71.0 |
| S20 · Double-slit fringes | 90.0 | 75.0 | 83.3 | 87.5 | 60.0 | 60.0 | 71.4 |

</details>

<a name="qwen3-5-9b-sft-simpo-mean"></a>

## Qwen3.5-9B · SFT + SimPO · two-seed mean

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 50.0 | 50.0 | 0.0 | 10.0 | 51.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 70.0 | 70.0 | 65.0 | 80.8 |
| S03 · Driven pendulums | 80.0 | 80.0 | 80.0 | 80.0 | 10.0 | 30.0 | 60.0 |
| S04 · Tray impact | 100.0 | 100.0 | 90.0 | 40.0 | 65.0 | 60.0 | 75.8 |
| S05 · Moving heat source | 80.0 | 60.0 | 40.0 | 40.0 | 5.0 | 0.0 | 37.5 |
| S06 · Layered liquids | 90.0 | 80.0 | 80.0 | 80.0 | 70.0 | 70.0 | 78.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 80.0 | 45.0 | 20.0 | 45.0 | 58.3 |
| S08 · Bimetal supports | 40.0 | 20.0 | 20.0 | 0.0 | 30.0 | 20.0 | 21.7 |
| S09 · Magnetic coils | 95.0 | 60.0 | 40.0 | 60.0 | 20.0 | 35.0 | 51.7 |
| S10 · Electric dipoles | 100.0 | 80.0 | 50.0 | 50.0 | 25.0 | 30.0 | 55.8 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 65.0 | 91.2 |
| S12 · Conducting wires | 55.0 | 30.0 | 30.0 | 40.0 | 40.0 | 40.0 | 39.2 |
| S13 · Standing waves | 80.0 | 70.0 | 60.0 | 20.0 | 0.0 | 0.0 | 38.3 |
| S14 · Wave scattering | 100.0 | 80.0 | 70.0 | 55.0 | 70.0 | 55.0 | 71.7 |
| S15 · Doppler response | 100.0 | 60.0 | 90.0 | 80.0 | 50.0 | 40.0 | 70.0 |
| S16 · Two-source ripples | 90.0 | 90.0 | 100.0 | 100.0 | 20.0 | 0.0 | 66.7 |
| S17 · Photoelastic load | 100.0 | 90.0 | 80.0 | 45.0 | 0.0 | 0.0 | 52.5 |
| S18 · Double reflection | 70.0 | 60.0 | 45.0 | 50.0 | 15.0 | 20.0 | 43.3 |
| S19 · Graded refraction | 100.0 | 80.0 | 60.0 | 45.0 | 20.0 | 40.0 | 57.5 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 70.0 | 70.0 | 20.0 | 10.0 | 53.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 100.0 | 80.0 | 72.5 | 15.0 | 55.0 | 58.8 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 88.8 | 91.0 | 87.5 | 91.2 |
| S03 · Driven pendulums | 80.0 | 85.0 | 90.0 | 88.8 | 52.0 | 68.3 | 73.6 |
| S04 · Tray impact | 100.0 | 100.0 | 93.3 | 57.5 | 85.0 | 83.3 | 82.6 |
| S05 · Moving heat source | 80.0 | 70.0 | 70.0 | 75.0 | 48.0 | 52.5 | 61.2 |
| S06 · Layered liquids | 90.0 | 80.0 | 86.7 | 82.5 | 80.0 | 88.3 | 84.3 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 81.7 | 55.0 | 32.0 | 70.0 | 61.2 |
| S08 · Bimetal supports | 40.0 | 55.0 | 53.3 | 41.2 | 54.0 | 63.3 | 53.6 |
| S09 · Magnetic coils | 95.0 | 80.0 | 61.7 | 80.0 | 68.0 | 67.5 | 71.7 |
| S10 · Electric dipoles | 100.0 | 85.0 | 76.7 | 67.5 | 59.0 | 61.7 | 68.3 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 85.0 | 95.0 |
| S12 · Conducting wires | 55.0 | 40.0 | 40.0 | 45.0 | 44.0 | 48.3 | 45.0 |
| S13 · Standing waves | 80.0 | 85.0 | 83.3 | 37.5 | 31.0 | 48.3 | 52.1 |
| S14 · Wave scattering | 100.0 | 90.0 | 83.3 | 68.8 | 91.0 | 85.0 | 84.3 |
| S15 · Doppler response | 100.0 | 80.0 | 95.0 | 92.5 | 76.0 | 75.8 | 83.3 |
| S16 · Two-source ripples | 90.0 | 95.0 | 100.0 | 100.0 | 80.0 | 61.7 | 83.3 |
| S17 · Photoelastic load | 100.0 | 95.0 | 93.3 | 80.0 | 64.0 | 58.3 | 74.3 |
| S18 · Double reflection | 70.0 | 75.0 | 66.7 | 65.0 | 57.0 | 54.2 | 61.4 |
| S19 · Graded refraction | 100.0 | 90.0 | 78.3 | 71.2 | 54.0 | 69.2 | 70.7 |
| S20 · Double-slit fringes | 90.0 | 75.0 | 83.3 | 85.0 | 60.0 | 60.8 | 71.2 |

</details>

<a name="qwen3-5-9b-sft-kto-20261107"></a>

## Qwen3.5-9B · SFT + KTO · seed 20261107

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 90.0 | 70.0 | 20.0 | 0.0 | 0.0 | 46.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 60.0 | 30.0 | 30.0 | 66.7 |
| S03 · Driven pendulums | 90.0 | 60.0 | 80.0 | 10.0 | 0.0 | 20.0 | 43.3 |
| S04 · Tray impact | 100.0 | 90.0 | 70.0 | 20.0 | 30.0 | 20.0 | 55.0 |
| S05 · Moving heat source | 70.0 | 50.0 | 80.0 | 40.0 | 0.0 | 0.0 | 40.0 |
| S06 · Layered liquids | 90.0 | 80.0 | 90.0 | 70.0 | 10.0 | 10.0 | 58.3 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 90.0 | 10.0 | 0.0 | 50.0 | 58.3 |
| S08 · Bimetal supports | 40.0 | 30.0 | 10.0 | 0.0 | 0.0 | 0.0 | 13.3 |
| S09 · Magnetic coils | 100.0 | 80.0 | 70.0 | 30.0 | 10.0 | 20.0 | 51.7 |
| S10 · Electric dipoles | 70.0 | 90.0 | 70.0 | 10.0 | 20.0 | 20.0 | 46.7 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 60.0 | 30.0 | 72.5 |
| S12 · Conducting wires | 30.0 | 60.0 | 20.0 | 10.0 | 0.0 | 30.0 | 25.0 |
| S13 · Standing waves | 90.0 | 70.0 | 60.0 | 10.0 | 0.0 | 0.0 | 38.3 |
| S14 · Wave scattering | 100.0 | 90.0 | 70.0 | 60.0 | 30.0 | 20.0 | 61.7 |
| S15 · Doppler response | 100.0 | 70.0 | 60.0 | 70.0 | 30.0 | 30.0 | 60.0 |
| S16 · Two-source ripples | 100.0 | 100.0 | 100.0 | 90.0 | 10.0 | 0.0 | 66.7 |
| S17 · Photoelastic load | 100.0 | 100.0 | 80.0 | 20.0 | 0.0 | 0.0 | 50.0 |
| S18 · Double reflection | 80.0 | 40.0 | 10.0 | 0.0 | 0.0 | 0.0 | 21.7 |
| S19 · Graded refraction | 90.0 | 80.0 | 50.0 | 30.0 | 20.0 | 10.0 | 46.7 |
| S20 · Double-slit fringes | 70.0 | 60.0 | 80.0 | 40.0 | 0.0 | 0.0 | 41.7 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 95.0 | 90.0 | 47.5 | 0.0 | 45.0 | 48.6 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 85.0 | 54.0 | 75.0 | 78.1 |
| S03 · Driven pendulums | 90.0 | 75.0 | 90.0 | 37.5 | 8.0 | 51.7 | 48.1 |
| S04 · Tray impact | 100.0 | 95.0 | 86.7 | 30.0 | 66.0 | 63.3 | 65.7 |
| S05 · Moving heat source | 70.0 | 55.0 | 90.0 | 47.5 | 12.0 | 50.0 | 47.6 |
| S06 · Layered liquids | 90.0 | 85.0 | 93.3 | 90.0 | 62.0 | 76.7 | 79.5 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 90.0 | 10.0 | 0.0 | 80.0 | 51.9 |
| S08 · Bimetal supports | 40.0 | 50.0 | 40.0 | 25.0 | 18.0 | 20.0 | 27.1 |
| S09 · Magnetic coils | 100.0 | 90.0 | 86.7 | 42.5 | 16.0 | 65.0 | 56.2 |
| S10 · Electric dipoles | 70.0 | 90.0 | 83.3 | 17.5 | 40.0 | 55.0 | 52.4 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 80.0 | 78.3 | 87.2 |
| S12 · Conducting wires | 30.0 | 65.0 | 30.0 | 20.0 | 2.0 | 43.3 | 28.6 |
| S13 · Standing waves | 90.0 | 85.0 | 83.3 | 22.5 | 6.0 | 45.0 | 42.9 |
| S14 · Wave scattering | 100.0 | 95.0 | 76.7 | 65.0 | 66.0 | 76.7 | 74.8 |
| S15 · Doppler response | 100.0 | 85.0 | 83.3 | 87.5 | 44.0 | 66.7 | 71.0 |
| S16 · Two-source ripples | 100.0 | 100.0 | 100.0 | 97.5 | 64.0 | 60.0 | 79.5 |
| S17 · Photoelastic load | 100.0 | 100.0 | 93.3 | 55.0 | 56.0 | 55.0 | 67.1 |
| S18 · Double reflection | 80.0 | 60.0 | 33.3 | 25.0 | 22.0 | 18.3 | 29.5 |
| S19 · Graded refraction | 90.0 | 90.0 | 80.0 | 40.0 | 28.0 | 55.0 | 54.3 |
| S20 · Double-slit fringes | 70.0 | 80.0 | 93.3 | 77.5 | 24.0 | 60.0 | 61.9 |

</details>

<a name="qwen3-5-9b-sft-kto-20261108"></a>

## Qwen3.5-9B · SFT + KTO · seed 20261108

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 90.0 | 80.0 | 20.0 | 0.0 | 0.0 | 48.3 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 50.0 | 60.0 | 0.0 | 65.0 |
| S03 · Driven pendulums | 90.0 | 60.0 | 90.0 | 60.0 | 10.0 | 20.0 | 55.0 |
| S04 · Tray impact | 90.0 | 80.0 | 60.0 | 40.0 | 30.0 | 20.0 | 53.3 |
| S05 · Moving heat source | 90.0 | 80.0 | 80.0 | 50.0 | 10.0 | 0.0 | 51.7 |
| S06 · Layered liquids | 90.0 | 80.0 | 80.0 | 50.0 | 10.0 | 10.0 | 53.3 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 100.0 | 30.0 | 0.0 | 50.0 | 63.3 |
| S08 · Bimetal supports | 40.0 | 30.0 | 20.0 | 0.0 | 0.0 | 0.0 | 15.0 |
| S09 · Magnetic coils | 90.0 | 70.0 | 50.0 | 40.0 | 10.0 | 30.0 | 48.3 |
| S10 · Electric dipoles | 70.0 | 80.0 | 60.0 | 20.0 | 20.0 | 20.0 | 45.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 50.0 | 87.5 |
| S12 · Conducting wires | 60.0 | 60.0 | 30.0 | 20.0 | 10.0 | 20.0 | 33.3 |
| S13 · Standing waves | 90.0 | 80.0 | 60.0 | 20.0 | 0.0 | 0.0 | 41.7 |
| S14 · Wave scattering | 100.0 | 90.0 | 80.0 | 50.0 | 40.0 | 20.0 | 63.3 |
| S15 · Doppler response | 90.0 | 50.0 | 60.0 | 60.0 | 10.0 | 20.0 | 48.3 |
| S16 · Two-source ripples | 100.0 | 90.0 | 100.0 | 100.0 | 70.0 | 20.0 | 80.0 |
| S17 · Photoelastic load | 100.0 | 100.0 | 90.0 | 50.0 | 0.0 | 0.0 | 56.7 |
| S18 · Double reflection | 70.0 | 20.0 | 30.0 | 0.0 | 0.0 | 0.0 | 20.0 |
| S19 · Graded refraction | 100.0 | 80.0 | 50.0 | 30.0 | 0.0 | 10.0 | 45.0 |
| S20 · Double-slit fringes | 90.0 | 60.0 | 80.0 | 40.0 | 0.0 | 0.0 | 45.0 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 95.0 | 93.3 | 55.0 | 12.0 | 46.7 | 53.8 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 82.5 | 78.0 | 65.0 | 80.5 |
| S03 · Driven pendulums | 90.0 | 75.0 | 96.7 | 65.0 | 32.0 | 56.7 | 61.4 |
| S04 · Tray impact | 90.0 | 90.0 | 83.3 | 55.0 | 76.0 | 65.0 | 71.9 |
| S05 · Moving heat source | 90.0 | 85.0 | 90.0 | 52.5 | 32.0 | 51.7 | 57.6 |
| S06 · Layered liquids | 90.0 | 85.0 | 86.7 | 80.0 | 78.0 | 78.3 | 81.0 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 100.0 | 30.0 | 4.0 | 75.0 | 56.7 |
| S08 · Bimetal supports | 40.0 | 65.0 | 53.3 | 37.5 | 34.0 | 26.7 | 38.6 |
| S09 · Magnetic coils | 90.0 | 85.0 | 76.7 | 67.5 | 30.0 | 66.7 | 62.4 |
| S10 · Electric dipoles | 70.0 | 80.0 | 76.7 | 37.5 | 54.0 | 56.7 | 58.1 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 86.7 | 95.6 |
| S12 · Conducting wires | 60.0 | 75.0 | 46.7 | 35.0 | 16.0 | 36.7 | 37.6 |
| S13 · Standing waves | 90.0 | 90.0 | 86.7 | 32.5 | 22.0 | 48.3 | 50.5 |
| S14 · Wave scattering | 100.0 | 95.0 | 86.7 | 62.5 | 84.0 | 80.0 | 81.0 |
| S15 · Doppler response | 90.0 | 70.0 | 76.7 | 77.5 | 56.0 | 58.3 | 66.7 |
| S16 · Two-source ripples | 100.0 | 95.0 | 100.0 | 100.0 | 92.0 | 78.3 | 91.4 |
| S17 · Photoelastic load | 100.0 | 100.0 | 96.7 | 80.0 | 66.0 | 58.3 | 75.7 |
| S18 · Double reflection | 70.0 | 40.0 | 36.7 | 20.0 | 28.0 | 25.0 | 30.0 |
| S19 · Graded refraction | 100.0 | 90.0 | 80.0 | 52.5 | 20.0 | 55.0 | 55.2 |
| S20 · Double-slit fringes | 90.0 | 70.0 | 93.3 | 72.5 | 40.0 | 53.3 | 62.9 |

</details>

<a name="qwen3-5-9b-sft-kto-mean"></a>

## Qwen3.5-9B · SFT + KTO · two-seed mean

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 90.0 | 75.0 | 20.0 | 0.0 | 0.0 | 47.5 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 55.0 | 45.0 | 15.0 | 65.8 |
| S03 · Driven pendulums | 90.0 | 60.0 | 85.0 | 35.0 | 5.0 | 20.0 | 49.2 |
| S04 · Tray impact | 95.0 | 85.0 | 65.0 | 30.0 | 30.0 | 20.0 | 54.2 |
| S05 · Moving heat source | 80.0 | 65.0 | 80.0 | 45.0 | 5.0 | 0.0 | 45.8 |
| S06 · Layered liquids | 90.0 | 80.0 | 85.0 | 60.0 | 10.0 | 10.0 | 55.8 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 95.0 | 20.0 | 0.0 | 50.0 | 60.8 |
| S08 · Bimetal supports | 40.0 | 30.0 | 15.0 | 0.0 | 0.0 | 0.0 | 14.2 |
| S09 · Magnetic coils | 95.0 | 75.0 | 60.0 | 35.0 | 10.0 | 25.0 | 50.0 |
| S10 · Electric dipoles | 70.0 | 85.0 | 65.0 | 15.0 | 20.0 | 20.0 | 45.8 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 80.0 | 40.0 | 80.0 |
| S12 · Conducting wires | 45.0 | 60.0 | 25.0 | 15.0 | 5.0 | 25.0 | 29.2 |
| S13 · Standing waves | 90.0 | 75.0 | 60.0 | 15.0 | 0.0 | 0.0 | 40.0 |
| S14 · Wave scattering | 100.0 | 90.0 | 75.0 | 55.0 | 35.0 | 20.0 | 62.5 |
| S15 · Doppler response | 95.0 | 60.0 | 60.0 | 65.0 | 20.0 | 25.0 | 54.2 |
| S16 · Two-source ripples | 100.0 | 95.0 | 100.0 | 95.0 | 40.0 | 10.0 | 73.3 |
| S17 · Photoelastic load | 100.0 | 100.0 | 85.0 | 35.0 | 0.0 | 0.0 | 53.3 |
| S18 · Double reflection | 75.0 | 30.0 | 20.0 | 0.0 | 0.0 | 0.0 | 20.8 |
| S19 · Graded refraction | 95.0 | 80.0 | 50.0 | 30.0 | 10.0 | 10.0 | 45.8 |
| S20 · Double-slit fringes | 80.0 | 60.0 | 80.0 | 40.0 | 0.0 | 0.0 | 43.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 100.0 | 95.0 | 91.7 | 51.2 | 6.0 | 45.8 | 51.2 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 83.8 | 66.0 | 70.0 | 79.3 |
| S03 · Driven pendulums | 90.0 | 75.0 | 93.3 | 51.2 | 20.0 | 54.2 | 54.8 |
| S04 · Tray impact | 95.0 | 92.5 | 85.0 | 42.5 | 71.0 | 64.2 | 68.8 |
| S05 · Moving heat source | 80.0 | 70.0 | 90.0 | 50.0 | 22.0 | 50.8 | 52.6 |
| S06 · Layered liquids | 90.0 | 85.0 | 90.0 | 85.0 | 70.0 | 77.5 | 80.2 |
| S07 · Heated gas bulbs | 100.0 | 100.0 | 95.0 | 20.0 | 2.0 | 77.5 | 54.3 |
| S08 · Bimetal supports | 40.0 | 57.5 | 46.7 | 31.2 | 26.0 | 23.3 | 32.9 |
| S09 · Magnetic coils | 95.0 | 87.5 | 81.7 | 55.0 | 23.0 | 65.8 | 59.3 |
| S10 · Electric dipoles | 70.0 | 85.0 | 80.0 | 27.5 | 47.0 | 55.8 | 55.2 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 90.0 | 82.5 | 91.4 |
| S12 · Conducting wires | 45.0 | 70.0 | 38.3 | 27.5 | 9.0 | 40.0 | 33.1 |
| S13 · Standing waves | 90.0 | 87.5 | 85.0 | 27.5 | 14.0 | 46.7 | 46.7 |
| S14 · Wave scattering | 100.0 | 95.0 | 81.7 | 63.8 | 75.0 | 78.3 | 77.9 |
| S15 · Doppler response | 95.0 | 77.5 | 80.0 | 82.5 | 50.0 | 62.5 | 68.8 |
| S16 · Two-source ripples | 100.0 | 97.5 | 100.0 | 98.8 | 78.0 | 69.2 | 85.5 |
| S17 · Photoelastic load | 100.0 | 100.0 | 95.0 | 67.5 | 61.0 | 56.7 | 71.4 |
| S18 · Double reflection | 75.0 | 50.0 | 35.0 | 22.5 | 25.0 | 21.7 | 29.8 |
| S19 · Graded refraction | 95.0 | 90.0 | 80.0 | 46.2 | 24.0 | 55.0 | 54.8 |
| S20 · Double-slit fringes | 80.0 | 75.0 | 93.3 | 75.0 | 32.0 | 56.7 | 62.4 |

</details>

<a name="gemini-3-8-flash-baseline-baseline"></a>

## Gemini 3.8 Flash · Baseline

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 60.0 | 40.0 | 40.0 | 10.0 | 0.0 | 10.0 | 26.7 |
| S02 · Rotation & gas | 100.0 | 90.0 | 90.0 | 80.0 | 90.0 | 90.0 | 90.0 |
| S03 · Driven pendulums | 90.0 | 50.0 | 40.0 | 20.0 | 40.0 | 0.0 | 40.0 |
| S04 · Tray impact | 90.0 | 100.0 | 80.0 | 60.0 | 60.0 | 60.0 | 75.0 |
| S05 · Moving heat source | 80.0 | 50.0 | 60.0 | 30.0 | 20.0 | 20.0 | 43.3 |
| S06 · Layered liquids | 70.0 | 50.0 | 30.0 | 10.0 | 20.0 | 0.0 | 30.0 |
| S07 · Heated gas bulbs | 60.0 | 20.0 | 0.0 | 40.0 | 0.0 | 10.0 | 21.7 |
| S08 · Bimetal supports | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S09 · Magnetic coils | 80.0 | 60.0 | 60.0 | 50.0 | 20.0 | 30.0 | 50.0 |
| S10 · Electric dipoles | 10.0 | 20.0 | 10.0 | 0.0 | 0.0 | 0.0 | 6.7 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 70.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 15.0 |
| S13 · Standing waves | 80.0 | 50.0 | 40.0 | 20.0 | 10.0 | 0.0 | 33.3 |
| S14 · Wave scattering | 100.0 | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 20.0 |
| S15 · Doppler response | 80.0 | 80.0 | 90.0 | 80.0 | 90.0 | 60.0 | 80.0 |
| S16 · Two-source ripples | 20.0 | 10.0 | 20.0 | 0.0 | 10.0 | 0.0 | 10.0 |
| S17 · Photoelastic load | 50.0 | 50.0 | 30.0 | 40.0 | 30.0 | 10.0 | 35.0 |
| S18 · Double reflection | 20.0 | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 5.0 |
| S19 · Graded refraction | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S20 · Double-slit fringes | 70.0 | 20.0 | 20.0 | 30.0 | 20.0 | 40.0 | 33.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 60.0 | 60.0 | 66.7 | 65.0 | 40.0 | 51.7 | 54.8 |
| S02 · Rotation & gas | 100.0 | 95.0 | 93.3 | 92.5 | 90.0 | 98.3 | 94.3 |
| S03 · Driven pendulums | 90.0 | 75.0 | 70.0 | 52.5 | 54.0 | 50.0 | 58.6 |
| S04 · Tray impact | 90.0 | 100.0 | 90.0 | 75.0 | 86.0 | 85.0 | 85.7 |
| S05 · Moving heat source | 80.0 | 65.0 | 83.3 | 70.0 | 66.0 | 68.3 | 70.5 |
| S06 · Layered liquids | 70.0 | 75.0 | 70.0 | 42.5 | 52.0 | 40.0 | 52.4 |
| S07 · Heated gas bulbs | 60.0 | 50.0 | 40.0 | 62.5 | 48.0 | 51.7 | 51.4 |
| S08 · Bimetal supports | 0.0 | 30.0 | 36.7 | 40.0 | 50.0 | 60.0 | 44.8 |
| S09 · Magnetic coils | 80.0 | 75.0 | 73.3 | 77.5 | 66.0 | 68.3 | 71.4 |
| S10 · Electric dipoles | 10.0 | 30.0 | 30.0 | 35.0 | 32.0 | 40.0 | 33.3 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 70.0 | 45.0 | 40.0 | 37.5 | 30.0 | 43.3 | 40.0 |
| S13 · Standing waves | 80.0 | 65.0 | 56.7 | 52.5 | 42.0 | 48.3 | 51.9 |
| S14 · Wave scattering | 100.0 | 60.0 | 53.3 | 47.5 | 40.0 | 40.0 | 48.1 |
| S15 · Doppler response | 80.0 | 90.0 | 96.7 | 92.5 | 94.0 | 73.3 | 87.1 |
| S16 · Two-source ripples | 20.0 | 10.0 | 23.3 | 10.0 | 16.0 | 15.0 | 15.2 |
| S17 · Photoelastic load | 50.0 | 65.0 | 56.7 | 60.0 | 58.0 | 48.3 | 55.7 |
| S18 · Double reflection | 20.0 | 20.0 | 6.7 | 12.5 | 18.0 | 8.3 | 12.9 |
| S19 · Graded refraction | 20.0 | 20.0 | 20.0 | 22.5 | 16.0 | 10.0 | 16.7 |
| S20 · Double-slit fringes | 70.0 | 40.0 | 53.3 | 70.0 | 52.0 | 66.7 | 59.5 |

</details>

<a name="gemini-3-8-flash-react-published"></a>

## Gemini 3.8 Flash · ReAct

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 70.0 | 40.0 | 20.0 | 20.0 | 20.0 | 20.0 | 31.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 100.0 | 80.0 | 80.0 | 30.0 | 81.7 |
| S03 · Driven pendulums | 100.0 | 80.0 | 40.0 | 60.0 | 0.0 | 10.0 | 48.3 |
| S04 · Tray impact | 100.0 | 80.0 | 60.0 | 60.0 | 60.0 | 90.0 | 75.0 |
| S05 · Moving heat source | 70.0 | 80.0 | 50.0 | 40.0 | 20.0 | 30.0 | 48.3 |
| S06 · Layered liquids | 70.0 | 70.0 | 50.0 | 40.0 | 30.0 | 30.0 | 48.3 |
| S07 · Heated gas bulbs | 100.0 | 70.0 | 20.0 | 10.0 | 20.0 | 10.0 | 38.3 |
| S08 · Bimetal supports | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S09 · Magnetic coils | 70.0 | 60.0 | 40.0 | 20.0 | 30.0 | 0.0 | 36.7 |
| S10 · Electric dipoles | 10.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 5.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 60.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 13.3 |
| S13 · Standing waves | 80.0 | 80.0 | 50.0 | 50.0 | 20.0 | 10.0 | 48.3 |
| S14 · Wave scattering | 100.0 | 40.0 | 0.0 | 10.0 | 0.0 | 0.0 | 25.0 |
| S15 · Doppler response | 80.0 | 90.0 | 80.0 | 60.0 | 60.0 | 90.0 | 76.7 |
| S16 · Two-source ripples | 20.0 | 10.0 | 20.0 | 10.0 | 0.0 | 0.0 | 10.0 |
| S17 · Photoelastic load | 70.0 | 50.0 | 50.0 | 50.0 | 40.0 | 40.0 | 50.0 |
| S18 · Double reflection | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S19 · Graded refraction | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S20 · Double-slit fringes | 80.0 | 40.0 | 50.0 | 70.0 | 50.0 | 60.0 | 58.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 70.0 | 60.0 | 66.7 | 70.0 | 62.0 | 63.3 | 64.8 |
| S02 · Rotation & gas | 100.0 | 100.0 | 100.0 | 92.5 | 86.0 | 65.0 | 85.2 |
| S03 · Driven pendulums | 100.0 | 90.0 | 70.0 | 75.0 | 44.0 | 55.0 | 63.8 |
| S04 · Tray impact | 100.0 | 90.0 | 86.7 | 85.0 | 88.0 | 96.7 | 90.5 |
| S05 · Moving heat source | 70.0 | 90.0 | 80.0 | 67.5 | 64.0 | 58.3 | 68.1 |
| S06 · Layered liquids | 70.0 | 85.0 | 80.0 | 75.0 | 62.0 | 76.7 | 73.8 |
| S07 · Heated gas bulbs | 100.0 | 85.0 | 63.3 | 50.0 | 58.0 | 58.3 | 61.9 |
| S08 · Bimetal supports | 10.0 | 25.0 | 30.0 | 17.5 | 12.0 | 31.7 | 22.4 |
| S09 · Magnetic coils | 70.0 | 75.0 | 73.3 | 62.5 | 62.0 | 60.0 | 64.8 |
| S10 · Electric dipoles | 10.0 | 35.0 | 33.3 | 30.0 | 30.0 | 33.3 | 31.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 60.0 | 35.0 | 43.3 | 25.0 | 32.0 | 23.3 | 31.4 |
| S13 · Standing waves | 80.0 | 90.0 | 63.3 | 77.5 | 60.0 | 46.7 | 63.8 |
| S14 · Wave scattering | 100.0 | 65.0 | 53.3 | 47.5 | 48.0 | 38.3 | 50.0 |
| S15 · Doppler response | 80.0 | 95.0 | 86.7 | 87.5 | 82.0 | 93.3 | 88.1 |
| S16 · Two-source ripples | 20.0 | 15.0 | 26.7 | 27.5 | 16.0 | 36.7 | 25.7 |
| S17 · Photoelastic load | 70.0 | 65.0 | 63.3 | 67.5 | 68.0 | 66.7 | 66.7 |
| S18 · Double reflection | 20.0 | 10.0 | 3.3 | 17.5 | 8.0 | 6.7 | 9.5 |
| S19 · Graded refraction | 10.0 | 15.0 | 10.0 | 27.5 | 12.0 | 13.3 | 15.2 |
| S20 · Double-slit fringes | 80.0 | 65.0 | 80.0 | 87.5 | 80.0 | 88.3 | 82.4 |

</details>

<a name="gemini-3-8-flash-visual-sketchpad-published"></a>

## Gemini 3.8 Flash · Visual Sketchpad

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 40.0 | 30.0 | 0.0 | 0.0 | 0.0 | 0.0 | 11.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 30.0 | 30.0 | 10.0 | 10.0 | 46.7 |
| S03 · Driven pendulums | 90.0 | 60.0 | 40.0 | 20.0 | 10.0 | 0.0 | 36.7 |
| S04 · Tray impact | 70.0 | 60.0 | 40.0 | 0.0 | 0.0 | 0.0 | 28.3 |
| S05 · Moving heat source | 60.0 | 30.0 | 20.0 | 10.0 | 0.0 | 0.0 | 20.0 |
| S06 · Layered liquids | 50.0 | 70.0 | 40.0 | 40.0 | 10.0 | 20.0 | 38.3 |
| S07 · Heated gas bulbs | 90.0 | 60.0 | 20.0 | 30.0 | 30.0 | 10.0 | 40.0 |
| S08 · Bimetal supports | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S09 · Magnetic coils | 70.0 | 60.0 | 20.0 | 20.0 | 10.0 | 0.0 | 30.0 |
| S10 · Electric dipoles | 50.0 | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 10.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 70.0 | 20.0 | 20.0 | 0.0 | 0.0 | 0.0 | 18.3 |
| S13 · Standing waves | 40.0 | 30.0 | 0.0 | 10.0 | 10.0 | 0.0 | 15.0 |
| S14 · Wave scattering | 100.0 | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 20.0 |
| S15 · Doppler response | 80.0 | 20.0 | 10.0 | 0.0 | 0.0 | 0.0 | 18.3 |
| S16 · Two-source ripples | 30.0 | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 6.7 |
| S17 · Photoelastic load | 70.0 | 50.0 | 50.0 | 50.0 | 20.0 | 10.0 | 41.7 |
| S18 · Double reflection | 40.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 6.7 |
| S19 · Graded refraction | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S20 · Double-slit fringes | 70.0 | 20.0 | 10.0 | 0.0 | 0.0 | 10.0 | 18.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 40.0 | 45.0 | 23.3 | 22.5 | 16.0 | 26.7 | 25.2 |
| S02 · Rotation & gas | 100.0 | 100.0 | 60.0 | 67.5 | 46.0 | 48.3 | 60.5 |
| S03 · Driven pendulums | 90.0 | 75.0 | 63.3 | 55.0 | 46.0 | 45.0 | 54.8 |
| S04 · Tray impact | 70.0 | 75.0 | 63.3 | 37.5 | 40.0 | 30.0 | 44.8 |
| S05 · Moving heat source | 60.0 | 45.0 | 46.7 | 37.5 | 36.0 | 26.7 | 37.1 |
| S06 · Layered liquids | 50.0 | 85.0 | 76.7 | 72.5 | 62.0 | 63.3 | 68.1 |
| S07 · Heated gas bulbs | 90.0 | 70.0 | 56.7 | 60.0 | 52.0 | 50.0 | 57.1 |
| S08 · Bimetal supports | 10.0 | 25.0 | 6.7 | 12.5 | 22.0 | 21.7 | 17.6 |
| S09 · Magnetic coils | 70.0 | 75.0 | 60.0 | 65.0 | 42.0 | 36.7 | 51.9 |
| S10 · Electric dipoles | 50.0 | 35.0 | 10.0 | 30.0 | 12.0 | 18.3 | 21.0 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 70.0 | 50.0 | 53.3 | 25.0 | 40.0 | 26.7 | 37.6 |
| S13 · Standing waves | 40.0 | 50.0 | 33.3 | 37.5 | 38.0 | 35.0 | 37.6 |
| S14 · Wave scattering | 100.0 | 60.0 | 40.0 | 37.5 | 36.0 | 23.3 | 38.6 |
| S15 · Doppler response | 80.0 | 40.0 | 26.7 | 30.0 | 36.0 | 21.7 | 31.9 |
| S16 · Two-source ripples | 30.0 | 10.0 | 16.7 | 17.5 | 8.0 | 11.7 | 13.3 |
| S17 · Photoelastic load | 70.0 | 65.0 | 63.3 | 72.5 | 66.0 | 58.3 | 64.8 |
| S18 · Double reflection | 40.0 | 10.0 | 16.7 | 12.5 | 14.0 | 5.0 | 12.4 |
| S19 · Graded refraction | 0.0 | 0.0 | 3.3 | 20.0 | 8.0 | 16.7 | 11.0 |
| S20 · Double-slit fringes | 70.0 | 50.0 | 50.0 | 35.0 | 34.0 | 41.7 | 41.9 |

</details>

<a name="gemini-3-8-flash-vipergpt-published"></a>

## Gemini 3.8 Flash · ViperGPT

**Sequence exact match (%)**

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 40.0 | 30.0 | 10.0 | 10.0 | 10.0 | 0.0 | 16.7 |
| S02 · Rotation & gas | 100.0 | 100.0 | 80.0 | 60.0 | 60.0 | 20.0 | 70.0 |
| S03 · Driven pendulums | 90.0 | 30.0 | 60.0 | 20.0 | 0.0 | 10.0 | 35.0 |
| S04 · Tray impact | 90.0 | 50.0 | 10.0 | 0.0 | 0.0 | 20.0 | 28.3 |
| S05 · Moving heat source | 60.0 | 30.0 | 10.0 | 20.0 | 0.0 | 0.0 | 20.0 |
| S06 · Layered liquids | 50.0 | 50.0 | 50.0 | 10.0 | 30.0 | 40.0 | 38.3 |
| S07 · Heated gas bulbs | 80.0 | 60.0 | 40.0 | 40.0 | 10.0 | 0.0 | 38.3 |
| S08 · Bimetal supports | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| S09 · Magnetic coils | 80.0 | 50.0 | 40.0 | 30.0 | 10.0 | 0.0 | 35.0 |
| S10 · Electric dipoles | 20.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 90.0 | 10.0 | 10.0 | 0.0 | 0.0 | 0.0 | 18.3 |
| S13 · Standing waves | 60.0 | 20.0 | 0.0 | 10.0 | 0.0 | 0.0 | 15.0 |
| S14 · Wave scattering | 90.0 | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 16.7 |
| S15 · Doppler response | 100.0 | 30.0 | 20.0 | 30.0 | 0.0 | 20.0 | 33.3 |
| S16 · Two-source ripples | 10.0 | 0.0 | 10.0 | 0.0 | 0.0 | 0.0 | 3.3 |
| S17 · Photoelastic load | 50.0 | 40.0 | 40.0 | 30.0 | 20.0 | 10.0 | 31.7 |
| S18 · Double reflection | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S19 · Graded refraction | 10.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.7 |
| S20 · Double-slit fringes | 60.0 | 30.0 | 20.0 | 0.0 | 0.0 | 0.0 | 18.3 |

<details><summary>Event accuracy by apparatus</summary>

| Apparatus | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 · Cabin inertia | 40.0 | 50.0 | 36.7 | 30.0 | 42.0 | 23.3 | 34.3 |
| S02 · Rotation & gas | 100.0 | 100.0 | 93.3 | 77.5 | 78.0 | 65.0 | 79.5 |
| S03 · Driven pendulums | 90.0 | 55.0 | 73.3 | 55.0 | 58.0 | 58.3 | 61.0 |
| S04 · Tray impact | 90.0 | 70.0 | 56.7 | 37.5 | 30.0 | 43.3 | 45.7 |
| S05 · Moving heat source | 60.0 | 40.0 | 43.3 | 65.0 | 38.0 | 23.3 | 41.0 |
| S06 · Layered liquids | 50.0 | 70.0 | 76.7 | 57.5 | 68.0 | 68.3 | 66.7 |
| S07 · Heated gas bulbs | 80.0 | 80.0 | 66.7 | 65.0 | 44.0 | 26.7 | 51.4 |
| S08 · Bimetal supports | 0.0 | 40.0 | 13.3 | 20.0 | 18.0 | 25.0 | 21.0 |
| S09 · Magnetic coils | 80.0 | 65.0 | 60.0 | 67.5 | 44.0 | 51.7 | 56.7 |
| S10 · Electric dipoles | 20.0 | 15.0 | 23.3 | 10.0 | 18.0 | 15.0 | 16.2 |
| S11 · Dielectric response | — | — | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| S12 · Conducting wires | 90.0 | 25.0 | 40.0 | 22.5 | 18.0 | 21.7 | 27.1 |
| S13 · Standing waves | 60.0 | 40.0 | 26.7 | 37.5 | 26.0 | 26.7 | 31.4 |
| S14 · Wave scattering | 90.0 | 50.0 | 40.0 | 37.5 | 32.0 | 28.3 | 37.6 |
| S15 · Doppler response | 100.0 | 35.0 | 36.7 | 47.5 | 34.0 | 36.7 | 41.0 |
| S16 · Two-source ripples | 10.0 | 0.0 | 26.7 | 7.5 | 14.0 | 5.0 | 10.5 |
| S17 · Photoelastic load | 50.0 | 50.0 | 63.3 | 47.5 | 42.0 | 50.0 | 49.5 |
| S18 · Double reflection | 10.0 | 5.0 | 6.7 | 10.0 | 6.0 | 6.7 | 7.1 |
| S19 · Graded refraction | 10.0 | 15.0 | 10.0 | 12.5 | 28.0 | 16.7 | 17.1 |
| S20 · Double-slit fringes | 60.0 | 45.0 | 63.3 | 57.5 | 42.0 | 55.0 | 52.9 |

</details>
