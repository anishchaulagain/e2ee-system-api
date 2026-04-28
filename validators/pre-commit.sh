#!/bin/bash
set -e

# =============================================================================
# Pre-commit quality gate
# =============================================================================
# Runs: type check → lint → format → security audit → tests
# Exit on first failure. All checks must pass before commit.
#
# Usage:
#   sh validators/pre-commit.sh            # Full check
#   sh validators/pre-commit.sh --staged   # Staged files only (faster)
#
# Install as git hook:
#   cp validators/pre-commit.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
# =============================================================================

STAGED_ONLY=false
if [ "$1" = "--staged" ]; then
  STAGED_ONLY=true
fi

# ---- Detect test runner ----
detect_test_runner() {
  if [ -f "package.json" ]; then
    if grep -q '"vitest"' package.json 2>/dev/null; then
      echo "vitest"
    elif grep -q '"jest"' package.json 2>/dev/null; then
      echo "jest"
    else
      echo "none"
    fi
  else
    echo "none"
  fi
}

TEST_RUNNER=$(detect_test_runner)

# ---- Type checking ----
echo "▶ Type checking..."
if [ -f "tsconfig.json" ]; then
  npx tsc --noEmit
  echo "  ✓ Types OK"
else
  echo "  ⊘ Skipped (no tsconfig.json)"
fi

# ---- Linting ----
echo ""
echo "▶ Linting..."
if [ -f ".eslintrc" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc.cjs" ] || [ -f "eslint.config.js" ] || [ -f "eslint.config.mjs" ]; then
  if [ "$STAGED_ONLY" = true ]; then
    STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null || true)
    if [ -n "$STAGED_FILES" ]; then
      echo "$STAGED_FILES" | xargs npx eslint --max-warnings=0
    else
      echo "  ⊘ No staged JS/TS files to lint"
    fi
  else
    npx eslint . --max-warnings=0
  fi
  echo "  ✓ Lint OK"
else
  echo "  ⊘ Skipped (no ESLint config found)"
fi

# ---- Formatting ----
echo ""
echo "▶ Formatting check..."
if [ -f ".prettierrc" ] || [ -f ".prettierrc.js" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ] || [ -f ".prettierrc.cjs" ]; then
  if [ "$STAGED_ONLY" = true ]; then
    STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)
    if [ -n "$STAGED_FILES" ]; then
      echo "$STAGED_FILES" | xargs npx prettier --check
    else
      echo "  ⊘ No staged files to check"
    fi
  else
    npx prettier --check .
  fi
  echo "  ✓ Formatting OK"
else
  echo "  ⊘ Skipped (no Prettier config found)"
fi

# ---- Security audit ----
echo ""
echo "▶ Security audit..."
if [ -f "package-lock.json" ] || [ -f "yarn.lock" ] || [ -f "pnpm-lock.yaml" ]; then
  # --audit-level=high: only fail on high/critical vulnerabilities
  npm audit --audit-level=high 2>/dev/null || {
    echo "  ⚠ Audit found high/critical vulnerabilities. Run 'npm audit' for details."
    exit 1
  }
  echo "  ✓ No high/critical vulnerabilities"
else
  echo "  ⊘ Skipped (no lockfile found)"
fi

# ---- Tests ----
echo ""
echo "▶ Running tests..."
case "$TEST_RUNNER" in
  vitest)
    npx vitest run --passWithNoTests --coverage 2>/dev/null || npx vitest run --passWithNoTests
    echo "  ✓ Tests passed (vitest)"
    ;;
  jest)
    npx jest --passWithNoTests --coverage 2>/dev/null || npx jest --passWithNoTests
    echo "  ✓ Tests passed (jest)"
    ;;
  none)
    echo "  ⊘ Skipped (no test runner detected in package.json)"
    ;;
esac

# ---- Summary ----
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ All checks passed. Safe to commit."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
