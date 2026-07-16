#!/usr/bin/env python3
"""Publish generated model and dataset artifacts to Hugging Face Hub."""

from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path

from huggingface_hub import HfApi


def write_files(root: Path, files: dict[str, str], replacements: dict[str, str]) -> None:
    for relative_path, content in files.items():
        destination = root / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        rendered = content
        for source, replacement in replacements.items():
            rendered = rendered.replace(source, replacement)
        destination.write_text(rendered, encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: publish_huggingface.py MANIFEST.json")

    token = os.environ.get("HF_TOKEN")
    if not token:
        raise SystemExit("HF_TOKEN is required")

    manifest = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    api = HfApi(token=token)
    identity = api.whoami()
    namespace = os.environ.get("HF_NAMESPACE") or identity["name"]
    private = os.environ.get("HF_REPOSITORY_VISIBILITY", "public") == "private"

    dataset_id = f'{namespace}/{manifest["dataset"]["name"]}'
    model_id = f'{namespace}/{manifest["model"]["name"]}'
    replacements = {
        "{{HF_NAMESPACE}}": namespace,
        "{{DATASET_REPO}}": dataset_id,
        "{{MODEL_REPO}}": model_id,
    }

    published = {}
    with tempfile.TemporaryDirectory(prefix="daily-project-hf-") as temp:
        root = Path(temp)
        for repo_type, repo_id in (("dataset", dataset_id), ("model", model_id)):
            spec = manifest[repo_type]
            folder = root / repo_type
            write_files(folder, spec["files"], replacements)
            api.create_repo(
                repo_id=repo_id,
                repo_type=repo_type,
                private=private,
                exist_ok=True,
            )
            api.upload_folder(
                folder_path=str(folder),
                repo_id=repo_id,
                repo_type=repo_type,
                commit_message=f'Publish artifacts for {manifest["project"]}',
            )
            prefix = "datasets/" if repo_type == "dataset" else ""
            published[repo_type] = f"https://huggingface.co/{prefix}{repo_id}"

    print(json.dumps({"namespace": namespace, **published}, separators=(",", ":")))


if __name__ == "__main__":
    main()
