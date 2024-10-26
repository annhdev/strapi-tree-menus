import { fieldSchema } from '../../../shared/constants'

export default {
  kind: 'collectionType',
  collectionName: 'menus',
  info: {
    name: 'Menu',
    singularName: 'menu',
    pluralName: 'menus',
    displayName: 'Menu',
    description: '',
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: true,
    },
    i18n: {
      localized: true,
    },
  },
  attributes: {
    title: {
      pluginOptions: {
        i18n: {
          localized: false,
        },
      },
      type: 'string',
      required: true,
      maxLength: 100,
      configurable: false,
    },
    slug: {
      pluginOptions: {
        i18n: {
          localized: true,
        },
      },
      type: 'uid',
      targetField: 'title',
      required: true,
      configurable: false,
    },
    items: {
      pluginOptions: {
        i18n: {
          localized: true,
        },
      },
      type: 'customField',
      options: {
        schemas: JSON.stringify(fieldSchema, null, 2),
      },
      required: true,
      customField: 'plugin::tree-menus.tree',
    },
  },
}
