# Adaptation Results

[Table 3. Exact-match accuracy by method (%)](https://arxiv.org/html/2611.32251v1#S4.T3)

### Training-Based (Qwen3.5-9B)

| Method | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline | 23.7 | 3.2 | 4.0 | 1.0 | 1.0 | 0.5 | 5.4 |
| SFT | 78.9 | 62.6 | 47.5 | 35.0 | 21.0 | 20.0 | 43.7 |
| SFT + DPO | 86.3 | 74.2 | 69.0 | 52.5 | 29.0 | 30.5 | 56.5 |
| SFT + SimPO | 86.8 | 72.6 | 65.8 | 56.0 | 32.5 | 31.8 | 57.2 |
| SFT + KTO | 86.3 | 74.7 | 68.0 | 38.2 | 15.8 | 14.5 | 49.1 |

### Training-Free (Gemini 3.8 Flash)

| Method | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline | 60.5 | 38.4 | 36.0 | 28.5 | 25.5 | 21.5 | 34.8 |
| ReAct | 64.2 | 47.9 | 37.5 | 34.0 | 26.5 | 26.0 | 39.1 |
| Visual Sketchpad | 59.5 | 34.2 | 20.0 | 15.5 | 10.0 | 8.0 | 24.2 |
| ViperGPT | 57.4 | 28.4 | 25.0 | 18.0 | 12.0 | 11.0 | 25.0 |

<a name="preference-seeds"></a>

## Preference Training across Seeds

[Table 12. Sequence exact match across seeds (%)](https://arxiv.org/html/2611.32251v1#A6.T12)

| Method | Training seed | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SFT + SimPO | 20261108 | 87.4 | 72.6 | 65.0 | 57.0 | 32.0 | 31.5 | 57.2 |
| SFT + SimPO | 20261109 | 86.3 | 72.6 | 66.5 | 55.0 | 33.0 | 32.0 | 57.2 |
| SFT + KTO | 20261107 | 85.3 | 75.8 | 67.0 | 35.0 | 12.5 | 14.5 | 47.8 |
| SFT + KTO | 20261108 | 87.4 | 73.7 | 69.0 | 41.5 | 19.0 | 14.5 | 50.3 |

[Individual run counts](../docs/assets/results/adaptation_by_length.csv) · [Question-level scores](adaptation_question_scores.csv)
