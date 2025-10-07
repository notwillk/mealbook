#!/usr/bin/env bash
set -euo pipefail

# Validate recipe/menu files against a JSON Schema using Docker + ajv-cli.
# Usage: ./scripts/validate.sh [--debug] <schema.(json|yml|yaml)> <data1> [data2...]

DEBUG=0
if [ "${1:-}" = "--debug" ]; then
  DEBUG=1
  shift
fi

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 [--debug] <schema.(json|yml|yaml)> <data...>" >&2
  exit 2
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required but not available in PATH." >&2
  exit 127
fi

SCHEMA_PATH="$1"
shift

IMG="mealbook-ajv-validator:latest"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cat >"$TMP_DIR/Dockerfile" <<'EOF'
FROM node:20-alpine
RUN apk add --no-cache bash jq yq
RUN npm i -g ajv-cli@5 ajv-formats@3
COPY entrypoint.sh /usr/local/bin/validate
RUN chmod +x /usr/local/bin/validate
ENTRYPOINT ["/usr/local/bin/validate"]
EOF

cat >"$TMP_DIR/entrypoint.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: validate <schema.(json|yml|yaml)> <data...>" >&2
  exit 2
fi

debug="${VALIDATE_DEBUG:-0}"

make_json_tmp() {
  local base
  base="$(mktemp /tmp/"$1".XXXXXX)"
  mv "$base" "$base.json"
  printf '%s\n' "$base.json"
}

tojson() {
  case "$1" in
    *.yaml|*.yml) yq -o=json '.' "$1" ;;
    *) cat "$1" ;;
  esac
}

schema="$1"
shift
schema_json="$(make_json_tmp schema)"
cleanup_files=("$schema_json")
tojson "$schema" >"$schema_json"

status=0
for data in "$@"; do
  if [ ! -f "$data" ]; then
    echo "FAIL: $data (file not found)" >&2
    status=1
    continue
  fi

  data_json="$(make_json_tmp data)"
  cleanup_files+=("$data_json")
  tojson "$data" >"$data_json"

  if [ "$debug" -eq 1 ]; then
    if ajv validate --spec=draft2020 --strict=false -c ajv-formats \
        -s "$schema_json" -d "$data_json"; then
      echo "OK  : $data"
    else
      echo "FAIL: $data" >&2
      status=1
    fi
  else
    log_file="$(mktemp /tmp/ajv.XXXXXX)"
    cleanup_files+=("$log_file")
    if ajv validate --spec=draft2020 --strict=false -c ajv-formats \
        -s "$schema_json" -d "$data_json" >"$log_file" 2>&1; then
      echo "OK  : $data"
    else
      echo "FAIL: $data" >&2
      status=1
    fi
  fi
done

rm -f "${cleanup_files[@]}"
exit $status
EOF

if [ "$DEBUG" -eq 1 ]; then
  docker build -t "$IMG" "$TMP_DIR"
else
  docker build -t "$IMG" "$TMP_DIR" >/dev/null 2>&1
fi

run_env=( "-e" "VALIDATE_DEBUG=$DEBUG" )
docker run --rm -v "$PWD":/workspace -w /workspace "${run_env[@]}" "$IMG" "$SCHEMA_PATH" "$@"
