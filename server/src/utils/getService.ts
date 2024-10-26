import { Core } from '@strapi/strapi'

import { PLUGIN_ID } from '../../../admin/src/pluginId'
import { Services } from '../services'

const getService = <TName extends keyof Services>(name: TName, { strapi }: { strapi: Core.Strapi } = { strapi: global.strapi }): Services[TName] => {
  return strapi.plugin(PLUGIN_ID).service<Services[TName]>(name)
}

const getCMService = (name: string, { strapi }: { strapi: Core.Strapi } = { strapi: global.strapi }) => {
  return strapi.plugin('content-manager').service(name)
}

export { getService, getCMService }
