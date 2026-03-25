import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import {
  scaffolderActionsExtensionPoint,
  createTemplateAction,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrations, DefaultGithubCredentialsProvider } from '@backstage/integration';
import { createPublishGithubAction } from '@backstage/plugin-scaffolder-backend-module-github';
import {
  ORG_REPO_DEFAULTS,
  MANAGED_TOPIC,
  validateRepoName,
  validateTopics,
} from './githubOrgPolicy';

export const consultoraGithubPublishModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'consultora-github-publish',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        actions: scaffolderActionsExtensionPoint,
      },
      async init({ config, logger, actions }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const githubCredentialsProvider = DefaultGithubCredentialsProvider.fromIntegrations(integrations);

        const githubOrg = config.getOptionalString('scaffolder.githubOrg');
        if (!githubOrg) {
          logger.warn(
            'publish:github:configured — scaffolder.githubOrg is not configured — publish:github:configured action will reject all requests until config is provided',
          );
        }

        const publishGithubAction = createPublishGithubAction({
          integrations,
          config,
          githubCredentialsProvider,
        });

        const publishWithGovernanceAction = createTemplateAction({
          id: 'publish:github:configured',
          description:
            'Creates a GitHub repository with enforced organization policies: branch protection, squash-only merges, and platform-team admin access',
          schema: {
            input: {
              repoName: z => z.string().describe('Name of the repository to create'),
              description: z => z.string().max(350).optional().describe('Repository description'),
              topics: z =>
                z
                  .array(z.string())
                  .optional()
                  .describe('Additional GitHub topics (backstage-managed is always included)'),
              gitCommitMessage: z => z.string().max(500).optional().describe('Initial commit message'),
            },
            output: {
              remoteUrl: z => z.string().describe('The remote URL of the repository'),
              repoContentsUrl: z => z.string().describe('URL to the repository contents'),
              commitHash: z => z.string().describe('The hash of the initial commit'),
            },
          },
          async handler(ctx) {
            if (!githubOrg) {
              throw new Error(
                'publish:github:configured is unavailable: scaffolder.githubOrg is not configured',
              );
            }

            validateRepoName(ctx.input.repoName);

            const repoFullName = `${githubOrg}/${ctx.input.repoName}`;
            const logMeta = {
              action: 'publish:github:configured',
              org: githubOrg,
              repoName: ctx.input.repoName,
              taskId: ctx.workspacePath,
            };

            logger.info(`publish:github:configured — creating repository ${repoFullName}`, logMeta);

            try {
              await publishGithubAction.handler({
                ...ctx,
                input: {
                  ...ORG_REPO_DEFAULTS,
                  repoUrl: `github.com?owner=${githubOrg}&repo=${ctx.input.repoName}`,
                  description: ctx.input.description ?? '',
                  gitCommitMessage:
                    ctx.input.gitCommitMessage ?? 'chore: initial scaffold',
                  topics: [MANAGED_TOPIC, ...validateTopics(ctx.input.topics ?? [])],
                },
              } as Parameters<typeof publishGithubAction.handler>[0]);
            } catch (error) {
              logger.error(`publish:github:configured — failed to create repository ${repoFullName}`, {
                ...logMeta,
                error: String(error),
              });
              throw error;
            }

            logger.info(
              `publish:github:configured — repository ${repoFullName} created`,
              logMeta,
            );
          },
        });

        actions.addActions(publishWithGovernanceAction);
      },
    });
  },
});
