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

const ALLOWED_PERMISSIONS = new Set([
  'scaffolder.task.create',
  'scaffolder.task.read',
  'scaffolder.task.cancel',
  'scaffolder.template.parameter.read',
  'scaffolder.template.step.read',
  'scaffolder.action.execute',
  'catalog.location.create',
  'catalog.location.read',
  'catalog.entity.create',
]);

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
            catalogConditions.isEntityKind({ kinds: ['template', 'location', 'group'] }),
            catalogConditions.isEntityOwner({ claims: ownershipRefs }),
          ],
        },
      );
    }

    if (ALLOWED_PERMISSIONS.has(request.permission.name)) {
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.DENY };
  }
}
