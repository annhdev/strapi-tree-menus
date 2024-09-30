import type { UniqueIdentifier } from '@dnd-kit/core';
import { Modules } from '@strapi/types';
import { UID } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import type { Params } from '@strapi/types/dist/modules/documents';

import { Entity } from './entity';

/*------------------------------------------------------------------------------------------------*/
export interface Menu extends Entity {
  title: string;
  slug: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: UniqueIdentifier;
  title: string;
  url: string;
  target: string;
  isProtected: boolean;
  children: MenuItem[];
}

/*------------------------------------------------------------------------------------------------*/

export type PaginatedResult<TSchemaUID extends UID.Schema, TParams extends Params.Pick<TSchemaUID, 'fields' | 'populate'> = never> = {
  data: Document[];
  meta: {
    pagination: Pagination;
    [key: string]: any;
  };
};

type PaginatedDocuments = PaginatedResult<UID.Schema>;
type PaginationQuery = Modules.Documents.Params.Pagination.PageNotation;
type SortQuery = Modules.Documents.Params.Sort.StringNotation<UID.Schema> & string;

// Admin document response follows the same format as the document service
type Document = Modules.Documents.Document<any>;
type AT_FIELDS = 'updatedAt' | 'createdAt' | 'publishedAt';
type BY_FIELDS = 'createdBy' | 'updatedBy' | 'publishedBy';

export type AvailableLocaleDocument = Pick<Document, 'id' | 'locale' | AT_FIELDS | 'status'>;
export type AvailableStatusDocument = Pick<Document, 'id' | 'documentId' | 'locale' | BY_FIELDS | AT_FIELDS>;

export type DocumentMetadata = {
  // All status of the returned locale
  availableStatus: AvailableStatusDocument[];
  // Available locales within the same status of the returned document
  availableLocales: AvailableLocaleDocument[];
};

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

/*------------------------------------------------------------------------------------------------*/

/**
 * GET /menus - Get one the menu
 */
export declare namespace GetMenu {
  export interface Request {
    body: {};
    query: {};
  }

  export interface Params {
    documentId: Modules.Documents.ID;
  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export interface Response {
    data: Document;
    meta: DocumentMetadata;
    error?: errors.ApplicationError;
  }
}

/**
 * GET /menus - Get all the menu
 */
export declare namespace GetAllMenu {
  export interface Request {
    body: {};
    query: {
      page?: string;
      pageSize?: string;
      sort?: SortQuery;
    };
  }

  export interface Params {

  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export interface Response extends PaginatedDocuments {
    error?: errors.ApplicationError;
  }
}

/**
 * POST /menus - Create a single menu
 */
export declare namespace CreateMenu {
  export interface Request {
    query: {};
    body: Partial<Omit<Menu, keyof Entity>> ;
  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export type Response = {
    data: Document;
    meta: DocumentMetadata;
    error?: errors.ApplicationError;
  };
}

/**
 * PUT /menus/:id - Update a single menu
 */
export declare namespace UpdateMenu {
  export interface Request {
    query: {
    };

    body: { data: Partial<Omit<Menu, keyof Entity>> } ;
  }

  export interface Params {
    id: Menu['documentId'];
  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export type Response = {
    data: Document;
    meta: DocumentMetadata;
    error?: errors.ApplicationError;
  };
}

/**
 * DEL /menus/:id - Delete a single menu
 */
export declare namespace DeleteMenu {
  export interface Request {
    query: {};
    body: {};
  }

  export interface Params {
    id: Menu['documentId'];
  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export type Response = { data: null; error: errors.ApplicationError; };
}

/**
 * BULK DEL /menus/bulk-delete - Delete a many menu
 */
export declare namespace BulkDeleteMenu {
  export interface Request {
    query: {};
    body: {
      data: {
        ids: Menu['documentId'][];
        locale?: string | string[];
      }
    };
  }

  export interface Params {

  }

  /**
   * TODO: this should follow the usual `data/error` pattern.
   */
  export type Response = { data: null; error: errors.ApplicationError; };
}

