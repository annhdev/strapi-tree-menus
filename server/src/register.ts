import type { Core } from '@strapi/strapi';
import { getService } from './utils/getService';
import path from 'path';
import fs from 'fs';
import * as console from 'node:console';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase

  /**
   * Register the custom field for the tree
   */
  strapi.customFields.register({
    name: 'tree',
    plugin: 'tree-menus',
    type: 'json',
  });

  /**
   * Register the overrides for the documentation plugin
   */
  if (strapi.plugin('documentation')) {
    const overrides = getService('documentation').overrides();

    strapi
      .plugin('documentation')
      .service('override')
      .registerOverride(overrides,{
        // pluginOrigin: 'tree-menus',
        // excludeFromGeneration: ['tree-menus'],
      });
  }
};

export default register;
