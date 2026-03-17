import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  PolicyDecision,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy, PolicyQuery } from '@backstage/plugin-permission-node';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';

export class ConsultoraPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (!user) return { result: AuthorizeResult.DENY };

    const ownershipRefs = user.identity.ownershipEntityRefs ?? [];
    const isPlatformTeam = ownershipRefs.includes('group:default/platform-team');

    if (isPlatformTeam) return { result: AuthorizeResult.ALLOW };

    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
        {
          anyOf: [
            catalogConditions.isEntityKind({ kinds: ['template', 'location'] }),
            catalogConditions.isEntityOwner({ claims: ownershipRefs }),
          ],
        },
      );
    }

    const allowedScaffolderPermissions = [
      'scaffolder.task.create',
      'scaffolder.task.read',
      'scaffolder.task.cancel',
      'scaffolder.template.parameter.read',
      'scaffolder.template.step.read',
    ];

    if (allowedScaffolderPermissions.includes(request.permission.name)) {
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.DENY };
  }
}
