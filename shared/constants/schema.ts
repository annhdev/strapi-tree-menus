import { FieldSchema } from '../contracts/schema'

export const fieldSchema: FieldSchema = {
  attributes: [
    {
      id: 'title',
      label: 'Title',
      placeholder: 'Enter item title',
      type: 'text',
      validationType: 'string',
      value: 'New items',
      required: true,
      validations: [
        {
          type: 'required',
          params: ['this field is required'],
        },
        {
          type: 'max',
          params: [100, 'Title cannot be more than 100 characters'],
        },
        {
          type: 'default',
          params: ['New items'],
        },
      ],
    },
    {
      id: 'url',
      label: 'Url',
      placeholder: 'Enter url',
      type: 'text',
      validationType: 'string',
      value: '/',
      required: true,
      validations: [
        {
          type: 'required',
          params: ['this field is required'],
        },
        {
          type: 'max',
          params: [200, 'Url cannot be more than 200 characters'],
        },
        {
          type: 'default',
          params: ['/'],
        },
      ],
    },
    {
      id: 'target',
      label: 'Target',
      placeholder: 'Enter target',
      type: 'select',
      validationType: 'mixed',
      value: '_self',
      required: true,
      validations: [
        {
          type: 'oneOf',
          params: [
            ['_blank', '_parent', '_self', '_top'],
            'this field needs to be one of the following: _blank, _parent, _self, _top',
          ],
        },
        {
          type: 'default',
          params: ['_self'],
        },
      ],
      options: [
        {
          key: '_blank',
          value: '_blank',
          metadatas: {
            intlLabel: {
              id: 'tree-menus.target.options._blank',
              defaultMessage: 'New window (_blank)',
            },
            disabled: false,
            hidden: false,
          },
        },
        {
          key: '_parent',
          value: '_parent',
          metadatas: {
            intlLabel: {
              id: 'tree-menus.target.options._parent',
              defaultMessage: 'Parent window (_parent)',
            },
            disabled: false,
            hidden: false,
          },
        },
        {
          key: '_self',
          value: '_self',
          metadatas: {
            intlLabel: {
              id: 'tree-menus.target.options._self',
              defaultMessage: 'Same window (_self)',
            },
            disabled: false,
            hidden: false,
          },
        },
        {
          key: '_top',
          value: '_top',
          metadatas: {
            intlLabel: {
              id: 'tree-menus.target.options._top',
              defaultMessage: 'Top window (_top)',
            },
            disabled: false,
            hidden: false,
          },
        },
      ],
    },
    {
      id: 'isProtected',
      label: 'isProtected',
      placeholder: 'Choose isProtected',
      type: 'bool',
      validationType: 'boolean',
      value: false,
      required: true,
      validations: [
        {
          type: 'required',
          params: ['Need to choose isProtected'],
        },
        {
          type: 'default',
          params: [false],
        },
      ],
    },
  ],
}
