/**
 *  router
 */

export default [
  {
    method: 'GET',
    path: '/menu',
    handler: 'plugin::tree-menus.menu.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/menu',
    handler: 'plugin::tree-menus.menu.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/menu/bulk-delete',
    handler: 'plugin::tree-menus.menu.deleteMany',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/menu/:id',
    handler: 'plugin::tree-menus.menu.delete',
    config: {
      policies: [],
    },
  },

];
