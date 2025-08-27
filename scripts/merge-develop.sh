#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/merge-develop.sh [target_branch] [upstream_remote] [upstream_branch]
# Defaults:
#   target_branch   = feat/automation
#   upstream_remote = upstream
#   upstream_branch = develop

TARGET_BRANCH="${1:-feat/automation}"
UPSTREAM_REMOTE="${2:-upstream}"
UPSTREAM_BRANCH="${3:-develop}"

# Ensure we're in a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "This is not a git repository." >&2
  exit 1
}

# Verify remote exists
if ! git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
  echo "Remote '$UPSTREAM_REMOTE' not found. Add it first, e.g.:" >&2
  echo "  git remote add upstream https://github.com/mezonai/mezon.git" >&2
  exit 1
fi

echo "==> Fetching $UPSTREAM_REMOTE"
git fetch "$UPSTREAM_REMOTE"

echo "==> Switching to target branch: $TARGET_BRANCH"
git checkout "$TARGET_BRANCH"

# Stash local changes if any
STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "==> Stashing local changes"
  git stash push -u -m "auto-merge-develop-$(date +%s)" >/dev/null 2>&1 || true
  STASHED=1
fi

echo "==> Merging $UPSTREAM_REMOTE/$UPSTREAM_BRANCH into $TARGET_BRANCH"
# Disable husky to avoid pre-commit hooks blocking merge commits
if ! HUSKY=0 git merge --no-ff --no-edit "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"; then
  echo "!! Merge has conflicts. Resolve them manually, then run:"
  echo "   HUSKY=0 git commit --no-edit"
  if [ "$STASHED" -eq 1 ]; then
    echo "   After commit, restore your work with: git stash pop"
  fi
  exit 1
fi

# Restore stash if we had any
if [ "$STASHED" -eq 1 ]; then
  echo "==> Restoring stashed changes"
  git stash pop || true
fi

echo "==> Pushing to origin/$TARGET_BRANCH"
git push origin "$TARGET_BRANCH"

echo "Done."


