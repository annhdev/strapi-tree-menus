import { UniqueIdentifier } from '@dnd-kit/core'
import { FormikErrors } from 'formik/dist/types'
import React, { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { ValidationError } from 'yup'

import { FieldSchema } from '../../../shared/contracts/schema'
import { addErrorsToFields, createYupSchema, resetErrors, sanitizeItems } from '../../../shared/utils/validation'
import { FlattenedItem, TreeItems } from '../types'
import { flattenTree, removeChildrenOf } from './SortableTree/utilities'

interface MenuDataProviderProps {
  name: string
  value: TreeItems
  schema: FieldSchema
  children: any
  onChange: (eventOrPath: React.ChangeEvent<any> | string, value?: any) => void
  disabled?: boolean
  error?: string
}

export interface MenuDataContextProps {
  name: string
  value: TreeItems
  items: TreeItems
  setItems: Dispatch<SetStateAction<TreeItems>>
  schema: FieldSchema
  activeItem: FlattenedItem | undefined
  setActiveItem: Dispatch<SetStateAction<FlattenedItem | undefined>>
  onChange: (value: TreeItems) => void
  disabled?: boolean
  error?: string
  validate: (value: any) => any
  flattenedItems: FlattenedItem[]
  activeId?: UniqueIdentifier | null
  setActiveId: Dispatch<SetStateAction<UniqueIdentifier | undefined>>
  errors?: FormikErrors<any>
  setErrors: Dispatch<SetStateAction<FormikErrors<any>>>
}

const initialValue: MenuDataContextProps = {
  name: '',
  value: [],
  items: [],
  setItems: () => {},
  activeItem: undefined,
  schema: { attributes: [] },
  setActiveItem: () => {},
  onChange: (value) => {},
  disabled: false,
  error: undefined,
  errors: {},
  setErrors: () => {},
  validate: (value) => {
    return { data: value }
  },
  flattenedItems: [],
  activeId: null,
  setActiveId: () => {},
}

const MenuDataContext = createContext(initialValue)

const MenuDataProvider = ({ children, value, onChange, name, schema, disabled, error }: MenuDataProviderProps) => {
  const [items, setItems] = useState<TreeItems>(value)
  const [activeItem, setActiveItem] = useState<FlattenedItem | undefined>(undefined)
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(undefined)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    setItems(value)
  }, [value])

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)

    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, errors, id }) => (collapsed && children.length ? [...acc, errors, id] : acc),
      []
    )

    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems)
  }, [items])

  const validateSchema = useMemo(() => createYupSchema(schema.attributes), [schema.attributes])

  const handleValidate = useCallback(
    async (items: TreeItems) => {
      try {
        await validateSchema.validate(items, { abortEarly: false })
        console.log('validated success', items)
        // reset errors, remove all errors from items
        resetErrors(items)
        setErrors(undefined)
        return { data: items, errors: undefined }
      } catch (err: any) {
        console.log('validated error')
        if (err instanceof ValidationError) {
          // reset errors, remove all errors from items
          resetErrors(items)
          setErrors(undefined)
          // add new errors to fields
          const _items = addErrorsToFields(err, items)
          return { data: _items, errors: err.inner }
        }

        return { data: items, errors: err.message() }
      }
    },
    [validateSchema]
  )

  const handleOnChange = (items: TreeItems) => {
    const sanitizedItems = sanitizeItems(items)
    onChange(name, sanitizedItems)
  }

  return (
    <MenuDataContext.Provider
      value={{
        errors,
        setErrors,
        flattenedItems,
        activeId,
        setActiveId,
        items,
        setItems,
        activeItem,
        setActiveItem,
        onChange: handleOnChange,
        value,
        name,
        schema,
        disabled,
        error,
        validate: handleValidate,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  )
}

export { MenuDataContext }
export default MenuDataProvider
