# Reviewing cohort PRs

## Queue

```bash
make review-queue
```

Read-only. Uses `gh pr list`.

## Local comment pass

```bash
make review-pr PR=12          # print MUST FIX | NIT
make review-pr PR=12 POST=1   # post as PR comment only
```

Never approve or merge from these scripts. Human reviewers use the GitHub UI.

## Comment contract

Every review comment an agent writes on a PR follows this shape: instructor triage, a cross-lane peer review, or `make review-pr POST=1`. A comment only names problems; this contract makes it **teach the fix and say why**, so the author can act without asking.

1. **Header and verdict.** Say who wrote it (for example _"Claude Code, AI assistant, on the instructor's behalf; comment only"_), then give one verdict line: ✅ ready, 🔁 close, or ⛔ held, with the reason.
2. **✅ What's already right.** Every strength gets its rationale: _what_ is right and _why it matters_ in this stack. For example, _"a real `<button>`: native focus, screen-reader role and states, so it proves the token on a real control"_. Never a bare _"fine as is"_.
3. **❌ What to fix.** Label each item `MUST FIX`, `SHOULD` or `NIT`. Every item carries:
   - its evidence: the file and line, and how you verified it (_"built the branch; dist HTML starts with…"_);
   - its rationale: which rule, decision or user-facing effect it breaks.
4. **🛠 Step by step.** Runnable commands for the author's _actual_ situation, in order, each with a one-line _why_:
   1. **Remote:** `git remote add upstream https://github.com/ruvebal/mondrian-project.git` for fork PRs; skip it if the author pushes to this repo.
   2. **Sync:** `git fetch upstream`, `git switch <their branch>`, `git rebase upstream/main`. State how far behind they are and whether `main` touched their files, so they know whether to expect conflicts. Include the recovery commands `git add <file>` + `git rebase --continue` and `git rebase --abort`.
   3. **Fix:** point to each change, plus any `git show upstream/main:<path>` they need in order to restore original content.
   4. **Verify:** `uv sync`, `pnpm install`, `pnpm check`, then `pnpm --filter @mondrian/web dev` and the exact `http://localhost:4321/<route>` with what to look for. Assistant-run checks are not human checks.
   5. **Commit:** `git add` with explicit paths (only the lane's files), and a Conventional Commit message.
   6. **Push:** `git push --force-with-lease origin <branch>` after a rebase, and why `--force-with-lease` is the safe force.
   7. **PR body:** a checklist: tick `pnpm check`, name a human cross-lane reviewer, add `Closes #<n>`, update the AI review log.
   8. **Later syncs:** the **Update branch** button, followed by `git pull --rebase` locally.
5. **Check every command before you post it.** Run it or read the repo to confirm that each script, flag, path and parser exists. Never suggest a command that touches files outside the author's lane: for example, `pnpm format` is `prettier --write .`, which rewrites the whole repo and has no Astro parser. Compute the behind count and the overlapping files with `git rev-list --count` and `git diff --stat`.
6. **Never** approve, merge or request changes as an assistant. A comment is advice; the human decides.

## Worktree

Review large PRs in an isolated worktree so `main` stays clean:

```bash
git fetch origin
git worktree add ../mondrian-review-pr-12 origin/lane/<handle>-issue-12-<slug>
```

## Staged conflict exercise

Runnable fixture (temp git repo — never touches product `main`):

```bash
make conflict-exercise
# or: bash scripts/pr-review/fixtures/conflict-exercise.sh --auto-resolve
```

Student walk-through (leaves a real conflict to resolve by hand):

```bash
bash scripts/pr-review/fixtures/conflict-exercise.sh --demo
# follow printed cd / edit / commit steps, then:
bash scripts/pr-review/fixtures/conflict-exercise.sh --check /path/from/demo
```

Practices the CONTRIBUTING rule: resolve your own conflicts before real PR waves.
`make check` runs `--auto-resolve` so CI proves the fixture still works.
