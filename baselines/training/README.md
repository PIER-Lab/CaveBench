# Training Qwen3.5-9B on CaveBench

The supervised baseline trains a language-side LoRA on complete episodes and then on prefixes. DPO, KTO and SimPO start from the resulting supervised model. The [paper](https://arxiv.org/abs/2611.32251) reports exact-match accuracy on 1,180 test questions.

## Prepare the inputs

Run the commands below from the repository root on a CUDA machine. The [dataset](https://huggingface.co/datasets/linguanxin/CaveBench) provides the frames and the three episode manifests. The training records in this directory provide the original messages, preference targets and validation question IDs.

```bash
P=baselines/training
python -m pip install -r "$P/requirements.txt"
hf download Qwen/Qwen3.5-9B --revision c202236235762e1c871ad0ccb60c8ee5ba337b9a --local-dir runs/qwen-base
python prepare_media.py --repo linguanxin/CaveBench --data dataset --all
python "$P/prepare.py" --data dataset --output runs/inputs
```

| Input | Records | Use |
| --- | ---: | --- |
| `sft_full.jsonl` | 9,000 | One six-event example per training episode |
| `sft_prefix.jsonl` | 9,000 | One prefix per training episode, balanced over supported lengths within each apparatus |
| `validation.jsonl` | 1,000 | Full episodes for supervised validation |
| `pairs.jsonl` | 1,076 | Chosen and rejected answers for DPO and SimPO |
| `kto.jsonl` | 5,475 | Individually labeled answers for KTO |
| `dev100.jsonl` | 100 | Fixed six-event validation questions for preference checkpoint selection |

## Supervised training

Each stage runs for one epoch with an effective batch size of 16. Pass `--gpus 0,1` to use two GPUs. The launcher adjusts gradient accumulation to preserve the effective batch size. Add `--dry-run` to print the resolved SWIFT command. The configurations in `configs/` specify the optimizer schedule, LoRA settings and seeds.

```bash
python "$P/train.py" sft_k6 --model runs/qwen-base --inputs runs/inputs --output runs/sft-k6
last_adapter() { find "$1" -maxdepth 1 -type d -name 'checkpoint-*' | sort -V | tail -1; }
K6=$(last_adapter runs/sft-k6)
python "$P/train.py" sft_prefix --model runs/qwen-base --warm-adapter "$K6" --inputs runs/inputs --output runs/sft-prefix
SFT=$(last_adapter runs/sft-prefix)
python "$P/merge.py" --base runs/qwen-base --adapter "$SFT" --output runs/sft-merged
```

## Preference training and evaluation

Each method trains a fresh adapter on the merged supervised model for two epochs. The checkpoint selector ranks epochs by correct validation sequences, then by correct events, and retains the earlier epoch on a tie. The test set contains 200 episodes.

```bash
for trial in dpo:20261106 kto:20261107 kto:20261108 simpo:20261108 simpo:20261109; do
  method=${trial%:*}
  seed=${trial#*:}
  run=runs/$method-$seed
  python "$P/train.py" "$method" --model runs/sft-merged --inputs runs/inputs --output "$run" --seed "$seed" || exit 1
  python "$P/select_checkpoint.py" --data dataset --inputs runs/inputs --model runs/sft-merged --run "$run" > "$run/selection.jsonl" || exit 1
  adapter=$(python -c 'import json,sys; print(json.loads(open(sys.argv[1]).read().splitlines()[-1])["selected"])' "$run/selection.jsonl")
  python run_local.py --data dataset --base runs/qwen-base --sft "$SFT" --preference "$adapter" --output "$run/test.jsonl" || exit 1
  python score.py --data dataset --predictions "$run/test.jsonl" || exit 1
done
```

For the supervised baseline, pass `--sft "$SFT"` to `run_local.py`. Average the two seed-level accuracy values for each reported KTO and SimPO result.
