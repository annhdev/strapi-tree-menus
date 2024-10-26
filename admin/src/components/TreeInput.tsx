import { Box, Field, Grid } from '@strapi/design-system'
import { type FieldValue, type InputProps } from '@strapi/strapi/admin'
import React from 'react'

import { fieldSchema } from '../../../shared/constants'
import { FieldSchema } from '../../../shared/contracts/schema'
import FormLayout from './FormLayout'
import MenuDataProvider from './MenuDataProvider'
import { SortableTree } from './SortableTree'

type TreeInputProps = InputProps &
  FieldValue & {
    labelAction?: React.ReactNode
    attribute: FieldAttribute
  }

export interface FieldAttribute {
  pluginOptions: PluginOptions
  type: string
  options: Options
  customField: string
}

export interface Options {
  schemas: string

  [key: string]: any
}

export interface FieldOptions {
  attribute: FieldAttribute
  placeholder?: string
  unique?: boolean
  type?: string
}

export interface PluginOptions {
  i18n: I18n
}

export interface I18n {
  localized: boolean
}

const TreeInput = React.forwardRef<HTMLButtonElement, TreeInputProps>(
  (
    { hint, disabled = false, labelAction, label, name, required = false, onChange, value = [], error, ...props },
    forwardedRef
  ) => {
    const {
      attribute: {
        options: { schemas },
      },
    }: FieldOptions = props

    let _schemas: FieldSchema
    if (!schemas) {
      console.log('no schema')
      _schemas = fieldSchema
    } else {
      console.log('schema from options')
      _schemas = JSON.parse(schemas)
    }

    return (
      <>
        <MenuDataProvider
          name={name}
          value={value}
          onChange={onChange}
          schema={_schemas}
          disabled={disabled}
          error={error}
        >
          <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
            <Field.Label action={labelAction}>{label}</Field.Label>
            <Grid.Root gap={4} marginTop={10}>
              <Grid.Item col={8} s={12} xs={12} alignItems='start' justifyContent={'start'}>
                <ul style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
                  <SortableTree collapsible indicator removable />
                </ul>
              </Grid.Item>
              <Grid.Item col={4} s={12} xs={12} direction='column' alignItems='stretch'>
                <Box>
                  <FormLayout />
                </Box>
              </Grid.Item>
            </Grid.Root>
          </Field.Root>
        </MenuDataProvider>
      </>
    )
  }
)

export { TreeInput }
