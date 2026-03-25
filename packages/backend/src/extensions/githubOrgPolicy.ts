import { InputError } from '@backstage/errors';
import type { createPublishGithubAction } from '@backstage/plugin-scaffolder-backend-module-github';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';

type PublishGithubAction = ReturnType<typeof createPublishGithubAction>;
type GithubPublishInput = PublishGithubAction extends {
  handler: (ctx: ActionContext<infer I, any, any>) => any;
} ? I : never;

const GITHUB_REPO_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/;
const GITHUB_REPO_RESERVED_SUFFIXES = /\.(git|atom)$/i;
const GITHUB_TOPIC_REGEX = /^[a-z0-9][a-z0-9-]{0,49}$/;
const MAX_USER_TOPICS = 19;

export function validateRepoName(repoName: string): void {
  if (repoName === '.' || repoName === '..') {
    throw new InputError(
      `Invalid repository name "${repoName}". "." and ".." are not allowed`,
    );
  }
  if (!GITHUB_REPO_NAME_REGEX.test(repoName)) {
    const sanitized = repoName.slice(0, 120).replace(/[^\x20-\x7E]/g, '?');
    throw new InputError(
      `Invalid repository name "${sanitized}". Must start with alphanumeric and contain only alphanumeric, dots, hyphens, or underscores (max 100 chars)`,
    );
  }
  if (GITHUB_REPO_RESERVED_SUFFIXES.test(repoName)) {
    throw new InputError(
      `Invalid repository name "${repoName}". Names ending in ".git" or ".atom" are reserved by GitHub`,
    );
  }
}

export function validateTopics(topics: string[]): string[] {
  if (topics.length > MAX_USER_TOPICS) {
    throw new InputError(
      `Too many topics: ${topics.length} provided, maximum is ${MAX_USER_TOPICS}`,
    );
  }
  return topics.map(topic => {
    const normalized = topic.toLowerCase().trim();
    if (!GITHUB_TOPIC_REGEX.test(normalized)) {
      throw new InputError(
        `Invalid topic "${normalized.slice(0, 60)}". Topics must be lowercase alphanumeric with hyphens, 1-50 chars`,
      );
    }
    return normalized;
  });
}

export const ORG_REPO_DEFAULTS = {
  defaultBranch: 'main',
  repoVisibility: 'private',

  protectDefaultBranch: true,
  protectEnforceAdmins: true,
  requiredApprovingReviewCount: 1,
  dismissStaleReviews: true,

  deleteBranchOnMerge: true,
  allowSquashMerge: true,
  allowMergeCommit: false,
  allowRebaseMerge: false,
  squashMergeCommitTitle: 'PR_TITLE',
  squashMergeCommitMessage: 'COMMIT_MESSAGES',

  hasIssues: true,
  hasWiki: false,
  hasProjects: false,

  collaborators: [
    { team: 'platform-team', access: 'admin' },
  ],
} satisfies Partial<GithubPublishInput>;

export const MANAGED_TOPIC = 'backstage-managed';
