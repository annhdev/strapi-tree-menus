import {getTranslation} from './utils/getTranslation';
import {PLUGIN_ID} from './pluginId';
import {Initializer} from './components/Initializer';
import {TreeIcon} from "./components/TreeIcon";
import { PluginIcon } from './components/PluginIcon';
import { reducers } from './store/reducers';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
import { fieldSchema } from '../../shared/constants';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.addReducers(reducers);

    app.customFields.register({
      name: 'tree',
      pluginId: 'tree-menus',
      type: 'text',
      icon: TreeIcon,
      intlLabel: {
        id: getTranslation('tree-menus.label'),
        defaultMessage: 'Tree',
      },
      intlDescription: {
        id: getTranslation('tree-menus.description'),
        defaultMessage: 'Build a tree with drag and drop',
      },
      components: {
        Input: async () =>
          import('./components/TreeInput').then((module) => ({
            default: module.TreeInput,
          })),
      },
      options: {
        advanced: [
          {
            intlLabel: {
              id: getTranslation('tree-menus.options.advanced.schema'),
              defaultMessage: 'Custom schema',
            },
            name: 'options.schemas',
            type: 'json',
            defaultValue: JSON.stringify(fieldSchema,null, 2),
            description: {
              id: getTranslation('tree-menus.options.advanced.fields.description'),
              defaultMessage: 'Schema of the tree',
            },
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('tree-menus.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslation('tree-menus.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
        // validator: (args: any) => {
        //   console.log('args', args);
        //   return {
        //     title: yup.string().required('Title is required'),
        //   }
        // }

      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app: any) {
    const {locales} = app;

    return await Promise.all(
      (locales as string[]).map(async (locale: string) => {
        try {
          const {default: data} = await import(`./translations/${locale}.json`);
          return {
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale,
          };
        } catch {
          return {
            data: {},
            locale,
          };
        }
      })
    );
  },
};
