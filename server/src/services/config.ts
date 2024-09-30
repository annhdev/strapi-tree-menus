import { Core } from '@strapi/strapi';
import { pluginId } from '../utils/pluginId';
import defaultConfig from '../config'
import { UID_MENU } from '../../../shared/constants';

const config = ({ strapi }: { strapi: Core.Strapi }) => ({
  get() {
    return strapi.config.get(`plugin.${pluginId}`, defaultConfig);
  },
  async schema() {
    const menuModel = strapi.getModel(UID_MENU);

    return {
      menu: menuModel.attributes,
    };
  },
});

export type ConfigService = ReturnType<typeof config>;
export default config;
