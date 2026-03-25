# Code Review Rules

## General

REJECT if:
- Code duplication (DRY violation)
- Functions longer than 30 lines
- Missing error handling or empty catch blocks
- Dead code, unused imports, or TODOs without context

PREFER:
- KISS: simplest solution that works
- Fail fast: validate inputs early with clear error messages

## TypeScript

REJECT if:
- `var` used → use `const`/`let`
- `any` type or unconstrained generics
- Type assertions (`as`) without justification → use `satisfies`

PREFER:
- `InputError` from `@backstage/errors` for user-facing validation errors

## Backstage

REJECT if:
- Backend module missing `pluginId` or `moduleId` in `createBackendModule`
- Scaffolder actions using JSON Schema → use Zod schema factories (v2 API)
- Hardcoded config values → use `config.getString()` / `config.getOptionalString()`
- Secrets, tokens, or credentials in code

## Security

REJECT if:
- Hardcoded secrets, tokens, or credentials
- User input in error messages without sanitization (log injection)
- Missing validation on external inputs at system boundaries
- Repository names, topics, or descriptions not validated before GitHub API calls

## YAML Templates

REJECT if:
- `publish:github` used directly → use `publish:github:configured`
- Owner from user input → must come from `appConfig.scaffolder.githubOrg`
- `parseRepoUrl` in skeleton values → use direct variables (`values.repoOwner`)

## Response Format

FIRST LINE must be exactly:
STATUS: PASSED
or
STATUS: FAILED

If FAILED, list: `file:line - rule violated - issue`
