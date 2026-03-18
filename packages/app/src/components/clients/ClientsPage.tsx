import { Content, Header, Page } from '@backstage/core-components';
import {
  EntityKindPicker,
  EntityListProvider,
  EntityTypePicker,
} from '@backstage/plugin-catalog-react';
import { CatalogTable } from '@backstage/plugin-catalog';

export const ClientsPage = () => (
  <EntityListProvider>
    <Page themeId="home">
      <Header title="Clientes" />
      <Content>
        <EntityKindPicker initialFilter="group" hidden />
        <EntityTypePicker initialFilter="client" hidden />
        <CatalogTable title="Clientes" />
      </Content>
    </Page>
  </EntityListProvider>
);
