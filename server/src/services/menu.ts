/**
 * menu service
 */

import { Core, factories } from '@strapi/strapi';
import * as console from 'node:console';
import { Params } from '../../../shared/contracts/entity';
import { Menu } from '../../../shared/contracts/menus';

const menu = factories.createCoreService('plugin::tree-menus.menu', ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Find all menus
   * @param ctx
   */
  async find(ctx: any) {
    return await super.find(ctx);
  },

  /**
   * Find one menu
   * @param ctx
   */
  async findOne(ctx: any) {
    return await super.findOne(ctx);
  },

  /**
   * Create a menu
   * @param ctx
   */
  async create(ctx: any) {
    return await super.create(ctx);
  },

  /**
   *
   * @param ctx
   * @param data
   */
  async update(ctx: any, data: Menu) {
    return await super.update(ctx, data);
  },

  /**
   * Delete a menu
   * @param args
   */
  async delete(args: Params) {
    return await super.delete(args);
  },

  /**
   * Delete many menus
   * @param ids
   * @param locale
   */
  async deleteMany(ids: string[], locale?: string) {
    return await strapi.db.transaction(async ({ rollback, commit }) => {
      try {
        for (const id of ids) {
          await super.delete(id, { locale });
        }
        await commit();
        return ids.length;
      } catch (e) {
        console.error('menu service deleteMany', e);
        await rollback();
      }
    });
  },
}));

export type MenuService = ReturnType<typeof menu>;
export default menu;
