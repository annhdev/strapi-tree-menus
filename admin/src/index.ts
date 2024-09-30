import {getTranslation} from './utils/getTranslation';
import {PLUGIN_ID} from './pluginId';
import {Initializer} from './components/Initializer';
import {TreeIcon} from "./components/TreeIcon";
import './styles/global.css';
import { PluginIcon } from './components/PluginIcon';
import { reducers } from './store/reducers';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

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
            defaultValue: "{\n" +
              "  \"attributes\": [\n" +
              "    {\n" +
              "      \"id\": \"title\",\n" +
              "      \"label\": \"Title\",\n" +
              "      \"placeholder\": \"Enter item title\",\n" +
              "      \"type\": \"text\",\n" +
              "      \"validationType\": \"string\",\n" +
              "      \"value\": \"Title\",\n" +
              "      \"validations\": [\n" +
              "        {\n" +
              "          \"type\": \"required\",\n" +
              "          \"params\": [\n" +
              "            \"this field is required\"\n" +
              "          ]\n" +
              "        },\n" +
              "        {\n" +
              "          \"type\": \"max\",\n" +
              "          \"params\": [\n" +
              "            100,\n" +
              "            \"Title cannot be more than 100 characters\"\n" +
              "          ]\n" +
              "        }\n" +
              "      ]\n" +
              "    },\n" +
              "    {\n" +
              "      \"id\": \"url\",\n" +
              "      \"label\": \"Url\",\n" +
              "      \"placeholder\": \"Enter url\",\n" +
              "      \"type\": \"text\",\n" +
              "      \"validationType\": \"string\",\n" +
              "      \"value\": \"Url\",\n" +
              "      \"validations\": [\n" +
              "        {\n" +
              "          \"type\": \"required\",\n" +
              "          \"params\": [\n" +
              "            \"this field is required\"\n" +
              "          ]\n" +
              "        },\n" +
              "        {\n" +
              "          \"type\": \"max\",\n" +
              "          \"params\": [\n" +
              "            200,\n" +
              "            \"Url cannot be more than 200 characters\"\n" +
              "          ]\n" +
              "        }\n" +
              "      ]\n" +
              "    },\n" +
              "    {\n" +
              "      \"id\": \"target\",\n" +
              "      \"label\": \"Target\",\n" +
              "      \"placeholder\": \"Enter target\",\n" +
              "      \"type\": \"text\",\n" +
              "      \"validationType\": \"mixed\",\n" +
              "      \"value\": \"Target\",\n" +
              "      \"validations\": [\n" +
              "        {\n" +
              "          \"type\": \"oneOf\",\n" +
              "          \"params\": [\n" +
              "            [\n" +
              "              \"_blank\",\n" +
              "              \"_parent\",\n" +
              "              \"_self\",\n" +
              "              \"_top\"\n" +
              "            ],\n" +
              "            \"this field needs to be one of the following: _blank, _parent, _self, _top\"\n" +
              "          ]\n" +
              "        }\n" +
              "      ]\n" +
              "    },\n" +
              "    {\n" +
              "      \"id\": \"isProtected\",\n" +
              "      \"label\": \"isProtected\",\n" +
              "      \"placeholder\": \"Choose isProtected\",\n" +
              "      \"type\": \"boolean\",\n" +
              "      \"validationType\": \"boolean\",\n" +
              "      \"value\": \"isProtected\",\n" +
              "      \"validations\": [\n" +
              "        {\n" +
              "          \"type\": \"required\",\n" +
              "          \"params\": [\n" +
              "            \"Need to choose isProtected\"\n" +
              "          ]\n" +
              "        }\n" +
              "      ]\n" +
              "    }\n" +
              "  ]\n" +
              "}",
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
