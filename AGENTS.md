# Code Review Rules

## General
- KISS: simplest solution that works
- DRY: no duplicated logic
- Small functions: 20-30 lines max
- Fail fast: validate inputs early with clear error messages
- No dead code, unused imports, or TODOs without context

## TypeScript
- Use `const`/`let`, never `var`
- Strict types: no `any`, no unconstrained generics
- Use `satisfies` over type assertions (`as`) when possible
- Prefer `InputError` from `@backstage/errors` for user-facing validation errors

## Backstage
- Backend modules use `createBackendModule` with descriptive `pluginId` and `moduleId`
- Scaffolder actions use Zod schema factories (v2 API), not JSON Schema
- Config values via `config.getString()` / `config.getOptionalString()`, never hardcoded
- No secrets, tokens, or credentials in code or config files committed to git

## Security
- Sanitize user input in error messages (prevent log injection)
- Validate all external inputs at system boundaries
- Repository names, topics, and descriptions must be validated before GitHub API calls

## YAML Templates
- Templates use `publish:github:configured` (not `publish:github` directly)
- Owner comes from `appConfig.scaffolder.githubOrg`, never from user input
- Skeleton values use direct variables (`values.repoOwner`), not `parseRepoUrl`
