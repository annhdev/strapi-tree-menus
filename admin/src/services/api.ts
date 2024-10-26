import { adminApi } from '@strapi/strapi/admin'

import {
  BulkDeleteMenu,
  CreateMenu,
  DeleteMenu,
  GetAllMenu,
  GetMenu,
  UpdateMenu,
} from '../../../shared/contracts/menus'

const api = adminApi
  .enhanceEndpoints({
    addTagTypes: ['TreeMenu'],
  })
  .injectEndpoints({
    endpoints: (builder) => {
      return {
        getAllMenus: builder.query<
          GetAllMenu.Response,
          GetAllMenu.Params & { params?: GetAllMenu.Request['query'] } & { [key: string]: any }
        >({
          query: ({ params }) => ({
            url: '/tree-menus/menu',
            method: 'GET',
            config: {
              params,
            },
          }),
          providesTags: ['TreeMenu'],
        }),
        getMenu: builder.query<
          GetMenu.Response,
          GetMenu.Params & { params?: GetMenu.Request['query'] } & { [key: string]: any }
        >({
          query: ({ id, params }) => ({
            url: `/menu/${id}`,
            method: 'GET',
            config: {
              params,
            },
          }),
          providesTags: ['TreeMenu'],
        }),
        createTreeMenu: builder.mutation<CreateMenu.Response, CreateMenu.Request['body']>({
          query: (data) => ({
            url: '/tree-menus/menu',
            method: 'POST',
            data,
          }),
          invalidatesTags: ['TreeMenu'],
        }),
        updateTreeMenu: builder.mutation<UpdateMenu.Response, UpdateMenu.Request['body'] & UpdateMenu.Params>({
          query: ({ id, data }) => ({
            url: `/tree-menus/menu/${id}`,
            method: 'PUT',
            data,
          }),
          invalidatesTags: ['TreeMenu'],
        }),
        deleteTreeMenu: builder.mutation<DeleteMenu.Response, DeleteMenu.Params['id']>({
          query: (id) => ({
            url: `/tree-menus/menu/${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: ['TreeMenu'],
        }),
        bulkDeleteMenu: builder.mutation<BulkDeleteMenu.Response, BulkDeleteMenu.Request['body']>({
          query: ({ data }) => ({
            url: `/tree-menus/menu/bulk-delete`,
            method: 'POST',
            data,
          }),
          invalidatesTags: ['TreeMenu'],
        }),
      }
    },
  })

export const {
  useGetMenuQuery,
  useGetAllMenusQuery,
  useCreateTreeMenuMutation,
  useUpdateTreeMenuMutation,
  useDeleteTreeMenuMutation,
} = api
