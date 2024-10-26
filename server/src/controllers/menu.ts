/**
 * menu controller
 */

import { Core, factories } from '@strapi/strapi'
import { UID_MENU } from '../../../shared/constants'
import { Menu } from '../../../shared/contracts/menus'
import { requestDataYupSchema } from '../../../shared/utils/validation'
import { sanitizeInputRequest } from '../utils'
import { getService } from '../utils/getService'
import { get, omit } from 'lodash'

const menu = factories.createCoreController(UID_MENU, ({ strapi }: { strapi: Core.Strapi }) => ({
  async configuration(ctx) {
    const config = getService('config').get()
    const schema = await getService('config').schema()

    ctx.send({
      config,
      schema,
    })
  },
  /**
   * Find all menus
   * @param ctx
   */
  async find(ctx) {
    let query: any = await this.sanitizeQuery(ctx)

    const limit: number = get(query, 'pageSize', 10)
    const start: number = get(query, 'page', 1) * limit - limit

    ctx.request.query = omit(query, ['page', 'pageSize'])
    ctx.request.query.start = start
    ctx.request.query.limit = limit

    return super.find(ctx)
  },

  /**
   * Find one menu
   * @param ctx
   */
  async findOne(ctx) {
    return super.findOne(ctx)
  },

  /**
   * Create a menu
   * @param ctx
   */
  async create(ctx) {
    const body = ctx.request.body as any
    const { data }: { data: Menu } = body || {}

    // Validate the request data
    const validated = await requestDataYupSchema().validate(data, { abortEarly: false })
    validated.items = sanitizeInputRequest(validated.items)
    ctx.request.body.data = validated

    return super.create(ctx)
  },

  /**
   * Update a menu
   * @param ctx
   */
  async update(ctx) {
    const { data }: { data: Menu } = ctx.request.body || {}

    const validated = await requestDataYupSchema().validate(data, { abortEarly: false })
    validated.items = sanitizeInputRequest(validated.items)
    ctx.request.body.data = validated

    return super.update(ctx, data)
  },

  /**
   * Delete a menu
   * @param ctx
   */
  async delete(ctx) {
    return super.delete(ctx)
  },

  /**
   * Delete many menus
   * @param ctx
   */
  async deleteMany(ctx: any) {
    const { query } = ctx.request
    const body = ctx.request.body as any
    const { data }: { data: { ids: string[]; locale: string } } = body || {}
    const ids = data.ids
    const locale = get('locale', query) || get('locale', body.data) || undefined

    return getService('menu').deleteMany(ids, locale)
  },
}))
export default menu
