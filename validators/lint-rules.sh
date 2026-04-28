#!/bin/bash
# =============================================================================
# Rule file integrity linter
# =============================================================================
# Validates that all cross-references between CLAUDE.md, settings.json,
# and rule/workflow/agent files are consistent and resolve to existing files.
#
# Usage: sh validators/lint-rules.sh
# =============================================================================

set -e

ERRORS=0
WARNINGS=0

error() {
  echo "  ❌ ERROR: $1"
  ERRORS=$((ERRORS + 1))
}

warn() {
  echo "  ⚠  WARN: $1"
  WARNINGS=$((WARNINGS + 1))
}

ok() {
  echo "  ✓ $1"
}

# ---- Check context_files in settings.json ----
echo "▶ Checking settings.json context_files..."
if [ -f ".claude/settings.json" ]; then
  # Extract file paths from context_files array
  CONTEXT_FILES=$(grep -oP '(?<=")\S+\.md(?=")' .claude/settings.json 2>/dev/null || true)
  for file in $CONTEXT_FILES; do
    if [ -f "$file" ]; then
      ok "$file exists"
    else
      error "$file listed in context_files but does not exist"
    fi
  done
else
  error ".claude/settings.json not found"
fi

# ---- Check files referenced in CLAUDE.md ----
echo ""
echo "▶ Checking CLAUDE.md references..."
if [ -f "CLAUDE.md" ]; then
  # Extract markdown-style references like `rules/testing.md` and `workflows/feature.md`
  REFS=$(grep -oP '`[a-zA-Z0-9_\-/]+\.(md|sh|json)`' CLAUDE.md | tr -d '`' | sort -u)
  for ref in $REFS; do
    if [ -f "$ref" ]; then
      ok "$ref exists"
    else
      error "$ref referenced in CLAUDE.md but does not exist"
    fi
  done
else
  error "CLAUDE.md not found in project root"
fi

# ---- Check all rule files have a heading ----
echo ""
echo "▶ Checking rule file structure..."
for file in rules/*.md; do
  if [ -f "$file" ]; then
    FIRST_LINE=$(head -1 "$file" | tr -d '\r')
    if echo "$FIRST_LINE" | grep -q '^# '; then
      ok "$file has a top-level heading"
    else
      warn "$file does not start with a # heading"
    fi
  fi
done

# ---- Check all workflow files have YAML frontmatter ----
echo ""
echo "▶ Checking workflow frontmatter..."
for file in workflows/*.md; do
  if [ -f "$file" ]; then
    FIRST_LINE=$(head -1 "$file" | tr -d '\r')
    if [ "$FIRST_LINE" = "---" ]; then
      ok "$file has YAML frontmatter"
    else
      warn "$file is missing YAML frontmatter (---)"
    fi
  fi
done

# ---- Check agent files exist ----
echo ""
echo "▶ Checking agent files..."
for agent in planner reviewer test-writer debugger; do
  if [ -f "agents/$agent.md" ]; then
    ok "agents/$agent.md exists"
  else
    error "agents/$agent.md referenced in CLAUDE.md but does not exist"
  fi
done

# ---- Check validator files exist ----
echo ""
echo "▶ Checking validator files..."
for validator in pre-commit.sh pr-checklist.md; do
  if [ -f "validators/$validator" ]; then
    ok "validators/$validator exists"
  else
    error "validators/$validator does not exist"
  fi
done

# ---- Check slash commands exist ----
echo ""
echo "▶ Checking slash commands..."
for cmd in pr review ticket; do
  if [ -f ".claude/commands/$cmd.md" ]; then
    ok ".claude/commands/$cmd.md exists"
  else
    warn ".claude/commands/$cmd.md does not exist"
  fi
done

# ---- Summary ----
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -gt 0 ]; then
  echo "✗ FAILED: $ERRORS error(s), $WARNINGS warning(s)"
  exit 1
else
  echo "✓ PASSED: 0 errors, $WARNINGS warning(s)"
  exit 0
fi
