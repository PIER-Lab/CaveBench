# Training-free methods

Gemini 3.8 Flash is the backbone for the three training-free rows in Table 3. ReAct can request two image inspections. Visual Sketchpad can run a visual program on successive turns and inspect the returned images. ViperGPT submits a single visual program. Both program methods can crop, enlarge, mark, assemble and compare frames, calculate RGB statistics and ask Gemini a visual question. [CaveBench, Appendix F.3](https://arxiv.org/abs/2611.32251)

## Reproduce Table 3

The three prediction files contain the recorded final control sets for all 1,180 test questions. The scorer matches each answer to the public reference by question ID. Run these commands from the repository root.

```bash
python -m pip install huggingface_hub
hf download linguanxin/CaveBench questions.jsonl labels.jsonl --repo-type dataset --local-dir data
python score.py --data data --predictions baselines/training_free/predictions/react.jsonl
python score.py --data data --predictions baselines/training_free/predictions/sketchpad.jsonl
python score.py --data data --predictions baselines/training_free/predictions/viper.jsonl
```

| Method | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k = 6 | Overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| ReAct | 64.2 | 47.9 | 37.5 | 34.0 | 26.5 | 26.0 | 39.1 |
| Visual Sketchpad | 59.5 | 34.2 | 20.0 | 15.5 | 10.0 | 8.0 | 24.2 |
| ViperGPT | 57.4 | 28.4 | 25.0 | 18.0 | 12.0 | 11.0 | 25.0 |

Values are exact-match accuracy in percent. `k` is the number of events in the question.

## Run inference

The portable runner uses the original question text, source frames, recorded system prompts, image tools and per-question protocol assignments. It reads `questions.jsonl` and the extracted test frames. ReAct uses the full released prompt. The two program methods use the question text preceding the final-answer reminder, checked against its recorded SHA-256 digest. Set `CAVEBENCH_API_KEY` for the endpoint, then run the method of interest. The example evaluates one question. Omit `--limit 1` to evaluate the full test set.

```bash
python -m pip install huggingface_hub pillow numpy opencv-python-headless
python prepare_media.py --repo linguanxin/CaveBench --data data
python baselines/training_free/run.py --data data --method react --endpoint https://openrouter.ai/api/v1/chat/completions --limit 1 --output runs/react.jsonl
python baselines/training_free/run.py --data data --method sketchpad --endpoint https://openrouter.ai/api/v1/chat/completions --limit 1 --output runs/sketchpad.jsonl
python baselines/training_free/run.py --data data --method viper --endpoint https://openrouter.ai/api/v1/chat/completions --limit 1 --output runs/viper.jsonl
```

`protocol.json` contains the decision prompts and the ReAct tool schemas. `question_protocols.csv` identifies the protocol used for each question and method. For the program methods, `wide` uses a 65,536-token request cap. The two `shared` profiles allocate 5,120 output tokens to decisions and visual queries combined, and reserve 1,024 tokens for a final choice among the legal control sets. The second pixel-tool version supports panels of up to 16 images and short-circuit conditions. The runner interprets a fixed set of visual-program operations and sends only the selected images and observations to the endpoint.
