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
        schemas: '',
      },
      required: true,
      customField: 'plugin::tree-menus.tree',
    },
  },
};
