/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { consultoraPermissionModule } from './extensions/permissionModule';
import { consultoraGithubAuthModule } from './extensions/githubAuthWithHierarchy';
import { scaffolderTemplateGlobalsModule } from './extensions/scaffolderTemplateGlobals';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(scaffolderTemplateGlobalsModule);
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

backend.add(import('@roadiehq/scaffolder-backend-module-utils'));

// techdocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(consultoraGithubAuthModule);
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// Política de permisos customizada para la consultora
// Ver packages/backend/src/extensions/permissionModule.ts
backend.add(consultoraPermissionModule);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

// adr plugin
backend.add(import('@backstage-community/plugin-adr-backend'));

// announcements plugin
backend.add(import('@backstage-community/plugin-announcements-backend'));
backend.start();
