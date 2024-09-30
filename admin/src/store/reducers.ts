import config from './configReducer';
import {PLUGIN_ID} from "../pluginId";

const reducers = {
  [`${PLUGIN_ID}-config`]: config,
};

export { reducers };

