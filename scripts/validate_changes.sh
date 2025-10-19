#!/usr/bin/env bash
set -euo pipefail

# usage: validate_changes.sh <base-sha> [<head-sha>]
# Runs schema validation for recipes and menus changed between the two commits.

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $0 <base-sha> [<head-sha>]" >&2
  exit 2
fi

BASE_SHA="$1"
HEAD_SHA="${2:-HEAD}"

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

recipes=()
menus=()

while IFS= read -r -d '' file; do
  [[ -f "$file" ]] || continue
  case "$file" in
    recipes/*.recipe.json|recipes/*.recipe.yaml|recipes/*.recipe.yml)
      recipes+=("$file")
      ;;
    menus/*.menu.json|menus/*.menu.yaml|menus/*.menu.yml)
      menus+=("$file")
      ;;
  esac
done < <(git diff --name-only --diff-filter=ACMR -z "$BASE_SHA" "$HEAD_SHA")

status=0
if (( ${#recipes[@]} )); then
  echo "Validating ${#recipes[@]} recipe file(s)..."
  ./scripts/validate.sh schemas/recipe.schema.json "${recipes[@]}" || status=1
fi
if (( ${#menus[@]} )); then
  echo "Validating ${#menus[@]} menu file(s)..."
  ./scripts/validate.sh schemas/menu.schema.json "${menus[@]}" || status=1
fi

if (( ${#recipes[@]} + ${#menus[@]} == 0 )); then
  echo "No recipes or menus changed; skipping validation."
fi

exit "$status"
