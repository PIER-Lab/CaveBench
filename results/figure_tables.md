# Benchmark and Experiment Tables

## Visual Evidence and Inference Targets

[Published table](https://arxiv.org/html/2611.32251v1#A2.T4)

| Benchmark | Evidence supplied | Inference target |
| --- | --- | --- |
| Physion | Initial segment of a simulated interaction | Whether two designated objects will touch later |
| IntPhys 2019 | Matched clips with possible or impossible events | Physical plausibility of each clip |
| QuantiPhy | Video and a physical quantity supplied as context | A requested measurement, such as speed or size |
| CLEVRER | Video of moving and colliding objects | Descriptive, explanatory, predictive, or counterfactual event questions |
| ComPhy | Target video and four reference clips with recurring objects | Hidden properties such as mass and charge, and their effects on events |
| BlackSwanSuite | Video before and after an unseen event (Detective task) | The unexpected event connecting the visible segments |
| PHYRE | Initial arrangement and a specified goal in a simulator | A placement of objects that achieves the goal |
| CaveBench | Apparatus description and ordered internal observations | All applied external controls, grouped by interval |

## Test Questions and Recorded Events

[Published table](https://arxiv.org/html/2611.32251v1#A4.T5)

| Domain | Apparatuses | Questions | One-label events | Two-label events |
| --- | --- | --- | --- | --- |
| Dynamics | S01–S04 | 240 | 140 | 100 |
| Thermal physics | S05–S08 | 240 | 68 | 172 |
| Electromagnetism | S09–S12 | 220 | 203 | 37 |
| Acoustics | S13–S16 | 240 | 108 | 132 |
| Optics | S17–S20 | 240 | 179 | 61 |
| Total |  | 1180 | 698 | 502 |

<a name="reasoning-effort"></a>

## Accuracy and Mean Token Use by Reasoning Effort

[Published table](https://arxiv.org/html/2611.32251v1#A6.T13)

| Model | Effort | Initial exact (%) | Final exact (%) | Final event accuracy (%) | Output tokens | Reasoning tokens |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6.1 Sol | Low | 59.5 | 59.5 | 82.33 | 520.4 | 471.9 |
| GPT-6.1 Sol | Medium | 67.0 | 67.0 | 85.92 | 1266.1 | 1217.6 |
| GPT-6.1 Sol | High | 73.0 | 74.0 | 88.42 | 3330.1 | 3287.4 |
| Gemini 3.8 Flash | Low | 14.0 | 15.5 | 45.58 | 1841.2 | 1785.9 |
| Gemini 3.8 Flash | Medium | 20.5 | 21.5 | 50.67 | 5345.2 | 5279.5 |
| Gemini 3.8 Flash | High | 6.0 | 8.0 | 38.92 | 5869.8 | 5773.1 |

## Figure Data

- [Figure 1. Six-event exact match](../docs/assets/results/figure1.csv)
- [Figure 6. Reasoning effort by apparatus](../docs/assets/results/effort_results.csv)
- [Figure 7. Error categories](../docs/assets/results/error_categories.csv)
