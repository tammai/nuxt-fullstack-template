#!/bin/bash
set -e

echo "=== Harness Initialization ==="

echo "--- Checking pnpm ---"
command -v pnpm >/dev/null 2>&1 || { echo "pnpm not found. Install with: npm i -g pnpm"; exit 1; }

echo "--- Installing dependencies ---"
pnpm install --frozen-lockfile

echo "--- Type check ---"
pnpm typecheck

echo "--- Lint ---"
pnpm lint

echo "--- Unit tests ---"
pnpm test:unit

echo "--- Build ---"
pnpm build

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to find the next 'not-started' feature"
echo "2. Pick ONE feature to work on"
echo "3. Implement, then re-run ./init.sh before claiming done"
echo ""
echo "On-demand: pnpm test:e2e (requires dev server)"
