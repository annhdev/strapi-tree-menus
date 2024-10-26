import { PLUGIN_ID } from '../pluginId'
import config from './configReducer'

const reducers = {
  [`${PLUGIN_ID}-config`]: config,
}

export { reducers }
