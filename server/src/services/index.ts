import menu,{type MenuService} from './menu';
import documentation ,{type DocumentationService} from './documentation';
import config ,{type ConfigService} from './config';

export default {
  menu,
  documentation,
  config
};

export type Services = {
  menu: MenuService;
  documentation: DocumentationService;
  config: ConfigService;
};

