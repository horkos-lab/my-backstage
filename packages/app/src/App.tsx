import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';
import { ClientsPage } from './components/clients/ClientsPage';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import {
  githubAuthApiRef,
  microsoftAuthApiRef,
} from '@backstage/core-plugin-api';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { UnifiedThemeProvider } from '@backstage/theme';
import { lightTheme, darkTheme } from './themes/theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { NotificationsPage } from '@backstage/plugin-notifications';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { CostInsightsPage } from '@backstage-community/plugin-cost-insights';
import {
  AnnouncementsPage,
  NewAnnouncementBanner,
} from '@backstage-community/plugin-announcements';

const app = createApp({
  apis,
  themes: [
    {
      id: 'light',
      title: 'Light',
      variant: 'light',
      icon: <WbSunnyIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={lightTheme} themeName="light">
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      icon: <Brightness2Icon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={darkTheme} themeName="dark">
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
  ],
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        providers={[
          {
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          },
          {
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign in using Microsoft',
            apiRef: microsoftAuthApiRef,
          },
        ]}
      />
    ),
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route path="/announcements" element={<AnnouncementsPage />} />
    <Route path="/clients" element={<ClientsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <NewAnnouncementBanner />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
