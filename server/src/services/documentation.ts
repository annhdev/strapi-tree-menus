import { Core, UID } from '@strapi/strapi';
import { UID_MENU, UID_UPLOAD_FILE } from '../../../shared/constants';
import params from '../utils/query-params';

const SPEC_NESTING_LIMIT = 3;
const SPEC_RELATION_NESTING_LIMIT = 1;

const documentation = ({ strapi }: { strapi: Core.Strapi }) => ({
  getAttributesSpec(uid: UID.Schema, level = 1): Record<string, any> {
    const model = strapi.getModel(uid);

    if (!model) {
      return {};
    }

    return Object.entries(model.attributes).reduce((acc, [key, value]: [string, any]) => {
      let type = 'string';
      let extraProps: any = {};

      if (value.type === 'boolean') {
        type = 'boolean';
      }

      if (value.type === 'datetime') {
        extraProps.format = 'date-time';
      }

      if (value.type === 'json') {
        type = 'object';
      }

      if (value.type === 'customField' && value.customField === 'plugin::tree-menus.tree') {
        type = 'array';
        extraProps.items = {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            target: {
              type: 'string',
            },
            isProtected: {
              type: 'boolean',
            },
            children: {
              type: 'array',
              items: this.getTreeItemAttributesSpec(level + 1),
            },
          },
        };
      }

      if (['biginteger', 'decimal', 'float', 'integer'].includes(value.type)) {
        type = 'number';
      }

      if (value.type === 'media') {
        type = 'object';
        extraProps.properties = this.getRelationAttributesSpec(
          UID_UPLOAD_FILE,
          level,
          value.multiple,
        );
      }

      if (value.type === 'relation') {
        if (value.target !== 'admin::user') {
          type = 'object';
          extraProps.properties = this.getRelationAttributesSpec(
            value.target,
            level,
            value.relation.includes('Many'),
          );
        } else {
          type = 'string';
        }
      }

      return {
        ...acc,
        [key]: {
          ...extraProps,
          type,
        },
      };
    }, {});
  },
  getRelationAttributesSpec(uid: UID.Schema, level = 1, multiple = false) {
    const relationSpec = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        attributes: {
          type: 'object',
          properties: level < SPEC_RELATION_NESTING_LIMIT ? this.getAttributesSpec(uid, level + 1) : {},
        },
      },
    };

    return {
      data: multiple
        ? {
          type: 'array',
          items: relationSpec,
        }
        : relationSpec,
    };
  },
  getRequiredAttributes(uid: UID.Schema) {
    const model = strapi.getModel(uid);
    const attrs = model.attributes;

    return Object.keys(attrs).filter((attr) => attrs[attr].required);
  },
  getTreeItemAttributesSpec(level = 1) {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        target: {
          type: 'string',
        },
        isProtected: {
          type: 'boolean',
        },
        children: {
          type: 'array',
          items: level < SPEC_NESTING_LIMIT ? this.getTreeItemAttributesSpec(level + 1) : { type: 'object' },
        },
      },
    };
  },

  overrides() {
    const menuSchema = this.getAttributesSpec(UID_MENU);

    const menuRequiredAttrs = this.getRequiredAttributes(UID_MENU);

    const errorSchemas = {
      '400': {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      '404': {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      '500': {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    };

    return {
      tags: [{ name: 'Menus', description: 'Operations about menus' }],
      components: {
        schemas: {
          Menu: {
            type: 'object',
            properties:
              {
                id: {
                  type: 'number',
                },
                documentId: {
                  type: 'string',
                },
                ...menuSchema,

              },
            required: menuRequiredAttrs,
          },
          Meta: {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  page: {
                    type: 'number',
                  },
                  pageSize: {
                    type: 'number',
                  },
                  pageCount: {
                    type: 'number',
                  },
                  totalCount: {
                    type: 'number',
                  },
                },
              },
            },
          },
          Response: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/components/schemas/Menu',
              },
              meta: {
                type: 'object',
              },
            },
          },
          FindResponse: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Menu',
                },
              },
              meta: {
                $ref: '#/components/schemas/Meta',
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              status: {
                type: 'number',
              },
              name: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
              details: {
                type: 'object',
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
              },
              error: {
                type: 'object',
                items: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          UpdateRequest: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/components/schemas/Menu',
                locale: {
                  type: 'string',
                },
                localizations: {
                  type: 'array',
                },
              },
            },
          },
          BulkDeleteRequest: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  ids: {
                    type: 'array',
                    required: true,
                    items: {
                      type: 'string',
                    },
                  },
                  locale: {
                    type: 'array',
                    reuired: false,
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      paths: {
        '/tree-menus/menu': {
          get: {
            tags: ['Menus'],
            parameters: [...params],
            summary: 'Retrieve menu',
            operationId: 'findMenu',
            responses: {
              '200': {
                description: 'Menus retrieved successfully',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/FindResponse',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
          post: {
            tags: ['Menus'],
            parameters: [],
            summary: 'Create a menu',
            operationId: 'createMenu',
            responses: {
              '200': {
                description: 'Create Menus successfully',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Response',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
        },
        '/tree-menus/menu/{id}': {
          get: {
            tags: ['Menus'],
            parameters: [{
              name: `id`,
              in: 'path',
              description: '',
              deprecated: false,
              required: true,
              schema: { type: 'string' },
            }],
            summary: 'Retrieve one menu',
            operationId: 'findOneMenu',
            responses: {
              '200': {
                description: 'Menus retrieved successfully',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Response',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
          put: {
            tags: ['Menus'],
            parameters: [{
              name: `id`,
              in: 'path',
              description: '',
              deprecated: false,
              required: true,
              schema: { type: 'string' },
            }],
            summary: 'Update one menu',
            operationId: 'updateOneMenu',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Menu',
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Menus updated successfully',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Response',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
          delete: {
            tags: ['Menus'],
            parameters: [{
              name: `id`,
              in: 'path',
              description: '',
              deprecated: false,
              required: true,
              schema: { type: 'string' },
            }],
            summary: 'Delete one menu',
            operationId: 'deleteOneMenu',
            requestBody: {},
            responses: {
              '204': {
                description: 'Returns deleted menu',
                content: {
                  'application/json': {
                    schema: {
                      type: 'number',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
        },
        '/tree-menus/menu/bulk-delete': {
          post: {
            tags: ['Menus'],
            parameters: [],
            summary: 'Delete many menu',
            operationId: 'deleteManyMenu',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/BulkDeleteRequest',
                  },
                },
              },
            },
            responses: {
              '204': {
                description: 'Returns deleted menu',
                content: {
                  'application/json': {
                    schema: {
                      type: 'number',
                    },
                  },
                },
              },
              ...errorSchemas,
            },
          },
        },
      },
    };
  },
});

export type DocumentationService = ReturnType<typeof documentation>;
export default documentation;
