import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Filters,
  Table,
  useQueryParams,
  unstable_useDocument as useDocument,
  FormErrors,
} from '@strapi/strapi/admin';
import { Schema as SchemaUtils } from '@strapi/types';

import { COLLECTION_TYPES, SINGLE_TYPES, UID_MENU } from '../../../shared/constants';
import { buildValidParams } from '../utils/api';
import { Component, ComponentConfiguration } from '../../../shared/contracts/components';
import { ContentType, FindContentTypeConfiguration, Settings, Metadatas } from '../../../shared/contracts/content-types';
import { FindOne } from '../../../shared/contracts/collection-types';
import { getMainField } from '../utils/attributes';

/*----------------------------------------------------------------------------------------------------*/
type ComponentsDictionary = Record<string, Component>;
type Document = FindOne.Response['data'];
type Schema = ContentType;
type LayoutOptions = Schema['options'] & Schema['pluginOptions'] & object;

interface UseDocumentArgs {
  collectionType: string;
  model: string;
  documentId?: string;
  params?: object;
}

type UseDocument = (
  args: UseDocumentArgs,
  opts?: any,
) => {
  /**
   * These are the schemas of the components used in the content type, organised
   * by their uid.
   */
  components: ComponentsDictionary;
  document?: Document;
  meta?: FindOne.Response['meta'];
  isLoading: boolean;
  /**
   * This is the schema of the content type, it is not the same as the layout.
   */
  schema?: Schema;
  schemas?: Schema[];
  validate: (document: Document) => null | FormErrors;
  hasError?: boolean;
};

interface LayoutSettings extends Settings {
  displayName?: string;
  icon?: never;
}

interface ListLayout {
  layout: ListFieldLayout[];
  components?: never;
  metadatas: {
    [K in keyof Metadatas]: Metadatas[K]['list'];
  };
  options: LayoutOptions;
  settings: LayoutSettings;
}

interface ListFieldLayout
  extends Table.Header<Document, ListFieldLayout>,
    Pick<Filters.Filter, 'mainField'> {
  attribute: SchemaUtils.Attribute.AnyAttribute | { type: 'custom' };
}

type LayoutData = FindContentTypeConfiguration.Response['data'];
/*----------------------------------------------------------------------------------------------------*/


const useDoc = (props = { id: '', origin: '', slug: UID_MENU, collectionType: COLLECTION_TYPES }) => {

  const { origin, slug, collectionType }: any = props;
  const { id } = useParams<{ id: string }>();
  //const { id, origin, slug, collectionType }:any = { id: '', origin: '', slug: UID_MENU, collectionType: COLLECTION_TYPES, }

  const [{ query }] = useQueryParams();
  const params = useMemo(() => buildValidParams(query), [query]);

  if (!collectionType) {
    throw new Error('Could not find collectionType in url params');
  }

  if (!slug) {
    throw new Error('Could not find model in url params');
  }

  const document = useDocument(
    { documentId: origin || id, model: slug, collectionType, params },
    {
      skip: id === 'create' || (!origin && !id && collectionType !== SINGLE_TYPES),
    },
  );

  const returnId = origin || id === 'create' ? undefined : id;

  return {
    collectionType,
    model: slug,
    id: returnId,
    ...document,
  };
};

const convertListLayoutToFieldLayouts = (
  columns: LayoutData['contentType']['layouts']['list'],
  attributes: Schema['attributes'] = {},
  metadatas: ListLayout['metadatas'],
  components?: {
    configurations: Record<string, ComponentConfiguration>;
    schemas: ComponentsDictionary;
  },
  schemas: Schema[] = [],
) => {
  return columns
    .map((name) => {
      const attribute = attributes[name];

      if (!attribute) {
        return null;
      }

      const metadata = metadatas[name];

      const settings: Partial<Settings> =
        attribute.type === 'component' && components
          ? components.configurations[attribute.component].settings
          : {};

      return {
        attribute,
        label: metadata.label ?? '',
        mainField: getMainField(attribute, metadata.mainField || settings.mainField, {
          schemas,
          components: components?.schemas ?? {},
        }),
        name: name,
        searchable: metadata.searchable ?? true,
        sortable: metadata.sortable ?? true,
      } satisfies ListFieldLayout;
    })
    .filter((field) => field !== null) as ListFieldLayout[];
};

export { useDoc, useDocument, ListFieldLayout, convertListLayoutToFieldLayouts };
export type { UseDocument, UseDocumentArgs, Document, Schema, ComponentsDictionary };
