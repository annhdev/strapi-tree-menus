/**
 *  router
 */

export default [
  {
    method: 'GET',
    path: '/configuration',
    handler: 'plugin::tree-menus.menu.configuration',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/menu',
    handler: 'plugin::tree-menus.menu.find',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.findOne',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/menu',
    handler: 'plugin::tree-menus.menu.create',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/menu/bulk-delete',
    handler: 'plugin::tree-menus.menu.deleteMany',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'PUT',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.update',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'DELETE',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.delete',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
]
