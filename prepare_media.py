"""Materialize the CaveBench media archives from a local Hugging Face checkout or the Hub."""
import argparse
import hashlib
import json
import shutil
import tempfile
import zipfile
import zlib
from pathlib import Path


def sha256(path):
    result = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def unpack(archive_path, data):
    with zipfile.ZipFile(archive_path) as archive:
        for entry in archive.infolist():
            relative = Path(entry.filename)
            target = (data / relative).resolve()
            if relative.parts[:1] != ("media",) or not target.is_relative_to(data):
                raise ValueError(f"Unexpected archive path: {entry.filename}")
            if entry.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            if target.is_file() and target.stat().st_size == entry.file_size:
                checksum = 0
                with target.open("rb") as existing:
                    for chunk in iter(lambda: existing.read(1024 * 1024), b""):
                        checksum = zlib.crc32(chunk, checksum)
                if checksum == entry.CRC:
                    continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as output:
                temp = Path(output.name)
            try:
                with archive.open(entry) as src, temp.open("wb") as dst:
                    shutil.copyfileobj(src, dst, length=1024 * 1024)
                temp.replace(target)
            finally:
                temp.unlink(missing_ok=True)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--data", type=Path, required=True, help="Dataset root for manifests and unpacked files")
    cli.add_argument("--repo", help="Optional Hugging Face dataset ID, e.g. OWNER/CaveBench")
    cli.add_argument("--all", action="store_true", help="Fetch all 10,200 episodes, including videos")
    cli.add_argument("--scene", help="One paper scene ID, e.g. S11")
    args = cli.parse_args()
    root = args.data.resolve()
    root.mkdir(parents=True, exist_ok=True)

    def obtain(relative):
        target = root / relative
        if not target.is_file() and args.repo:
            from huggingface_hub import hf_hub_download
            hf_hub_download(repo_id=args.repo, repo_type="dataset", filename=relative, local_dir=root)
        if not target.is_file():
            raise FileNotFoundError(f"{relative} is missing. Supply --repo to download from the Hub.")
        return target

    for name in ("questions.jsonl","labels.jsonl"):
        obtain(name)
    if args.all:
        for name in ("episodes/train.jsonl", "episodes/validation.jsonl", "episodes/test.jsonl"):
            obtain(name)
    manifest = "media_manifest.json" if args.all else "test_frames_manifest.json"
    items = json.loads(obtain(manifest).read_text(encoding="utf-8"))
    items = [item for item in items if not args.scene or item["scene"] == args.scene]
    if not items:
        cli.error("No archive matches the requested scene.")
    for item in items:
        archive = obtain(item["path"])
        if sha256(archive) != item["sha256"]:
            raise ValueError(f"Archive hash mismatch: {archive}")
        unpack(archive,root)
        print(item["path"],flush=True)


if __name__=="__main__":
    main()

