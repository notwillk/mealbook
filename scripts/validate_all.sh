#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

recipes=( $(find recipes -type f \( -name '*.recipe.json' -o -name '*.recipe.yaml' -o -name '*.recipe.yml' \) -print) )
menus=( $(find menus -type f \( -name '*.menu.json' -o -name '*.menu.yaml' -o -name '*.menu.yml' \) -print) )

status=0

if (( ${#recipes[@]} )); then
  if ./scripts/validate.sh schemas/recipe.schema.json "${recipes[@]}"; then
    :
  else
    status=1
  fi
fi

if (( ${#menus[@]} )); then
  if ./scripts/validate.sh schemas/menu.schema.json "${menus[@]}"; then
    :
  else
    status=1
  fi
fi

exit $status
