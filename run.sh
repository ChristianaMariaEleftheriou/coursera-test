#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-8000}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "Starting local server at http://localhost:${PORT}" >&2
exec python -m http.server "$PORT" -b 0.0.0.0
