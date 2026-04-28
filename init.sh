#!/bin/bash

echo "Starting Claude Code Ruleset Initialization..."

# Default contexts
CONTEXTS=(
    "\"CLAUDE.md\""
    "\"docs/architecture.md\""
    "\"docs/coding-standards.md\""
    "\"rules/always-on.md\""
    "\"rules/git.md\""
    "\"rules/testing.md\""
    "\"rules/security.md\""
    "\"rules/error-handling.md\""
    "\"rules/logging.md\""
    "\"rules/api-design.md\""
    "\"rules/database.md\""
    "\"rules/performance.md\""
    "\"rules/accessibility.md\""
)

# Common generic permissions
PERMISSIONS=(
    "\"Bash(git add *)\""
    "\"Bash(git commit *)\""
    "\"Bash(git checkout *)\""
    "\"Bash(git branch *)\""
    "\"Bash(git switch *)\""
    "\"Bash(git diff *)\""
    "\"Bash(git log *)\""
    "\"Bash(git status)\""
    "\"Bash(git stash *)\""
    "\"Bash(git merge *)\""
    "\"Bash(git rebase *)\""
    "\"Bash(git fetch *)\""
    "\"Bash(git pull *)\""
    "\"Bash(git push origin feat/*)\""
    "\"Bash(git push origin fix/*)\""
    "\"Bash(git push origin hotfix/*)\""
    "\"Bash(git push origin chore/*)\""
    "\"Bash(git push origin docs/*)\""
    "\"Bash(git push origin perf/*)\""
    "\"Bash(git push origin refactor/*)\""
    "\"Bash(sh validators/pre-commit.sh)\""
)

# Detect tech stack
if [ -f "package.json" ]; then
    echo "Detected Node.js/TypeScript environment."
    CONTEXTS+=("\"rules/stacks/typescript.md\"")
    PERMISSIONS+=("\"Bash(npm run *)\"" "\"Bash(pnpm *)\"" "\"Bash(yarn *)\"" "\"Bash(npx tsc *)\"" "\"Bash(npx eslint *)\"" "\"Bash(npx prettier *)\"" "\"Bash(npx jest *)\"" "\"Bash(npx vitest *)\"" "\"Bash(npx playwright *)\"" "\"Bash(npx prisma *)\"")
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "Pipfile" ]; then
    echo "Detected Python environment."
    CONTEXTS+=("\"rules/stacks/python.md\"")
    PERMISSIONS+=("\"Bash(pip install *)\"" "\"Bash(pytest *)\"" "\"Bash(python -m *)\"" "\"Bash(black *)\"" "\"Bash(flake8 *)\"" "\"Bash(mypy *)\"")
else
    echo "No specific tech stack detected. Proceeding with generic configurations."
fi

# Join contexts arrays
CONTEXT_STRING=$(IFS=,; echo "${CONTEXTS[*]}")
PERMISSION_STRING=$(IFS=,; echo "${PERMISSIONS[*]}")

# Write to .claude/settings.json
mkdir -p .claude
cat > .claude/settings.json <<EOF
{
  "_note": "Generated dynamically by init.sh. Remove or update the model field to use the latest version.",
  "permissions": {
    "allow": [
      $PERMISSION_STRING
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl * | sh)",
      "Bash(sudo *)",
      "Bash(git push --force *)",
      "Bash(git push -f *)",
      "Bash(git push origin main)",
      "Bash(git push origin main *)",
      "Bash(git push origin develop)",
      "Bash(git push origin develop *)",
      "Bash(git push origin master)",
      "Bash(npx prisma migrate reset *)",
      "Bash(npx prisma db push --force-reset *)"
    ]
  },
  "context_files": [
    $CONTEXT_STRING
  ]
}
EOF

# Format JSON using Node if available (just for prettiness)
if command -v npx &> /dev/null; then
    npx -p prettier prettier --write .claude/settings.json || true
fi

echo "Initialization complete! .claude/settings.json configured."
