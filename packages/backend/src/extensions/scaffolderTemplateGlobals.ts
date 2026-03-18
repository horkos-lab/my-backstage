import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export const scaffolderTemplateGlobalsModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'template-globals',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        templating: scaffolderTemplatingExtensionPoint,
      },
      async init({ config, templating }) {
        const githubOrg = config.getOptionalString('scaffolder.githubOrg') ?? '';
        templating.addTemplateGlobals({
          appConfig: {
            scaffolder: {
              githubOrg,
            },
          },
        });
      },
    });
  },
});
