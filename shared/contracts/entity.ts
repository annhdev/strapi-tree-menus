import { Data } from '@strapi/types';

/**
 * QUERY PARAMS
 */
export type Params = {
  where?: any;
  filters?: any;
  select?: any;
  populate?: any;
  orderBy?: any;
  _q?: string;
  data?: any;
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
  count?: boolean;
};

export type FindOneParams = Pick<Params, 'where' | 'select' | 'populate' | '_q' | 'orderBy'>;

/*---------------------------------------------------------------------------------------------------*/

/**
 * ENTITY
 */
export interface Entity {
  id: Data.ID;
  documentId: Data.DocumentID;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

