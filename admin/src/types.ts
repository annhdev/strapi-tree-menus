import type {MutableRefObject} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import { Modules } from '@strapi/strapi';

export interface TreeItem {
  id: UniqueIdentifier
  title?: string,
  url?: string,
  target?: string,
  isProtected?: boolean,
  children: TreeItem[]
  collapsed?: boolean
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
  errors?: any;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;

export interface I18nBaseQuery {
  plugins?: {
    i18n?: {
      locale?: string;
      relatedEntityId?: Modules.Documents.ID;
    };
  };
}


