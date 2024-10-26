import * as yup from 'yup'
import { TreeItems } from '../../admin/src/types'
import traverse from 'traverse'
import { getIn, setIn } from 'formik'
import { fieldSchema } from '../constants'
import { getService } from '../../server/src/utils/getService'

export const createYupSchema = (schemas: any[]): yup.Schema<any> => {
  const fieldsSchema = schemas.reduce((schema: any, current: any) => {
    const { id, validationType, validations = [] } = current
    if (!(yup as any)[validationType]) {
      return schema
    }

    let validator = (yup as any)[validationType]()
    validations.forEach((validation: any) => {
      const { params, type } = validation
      if (!validator[type]) {
        return
      }
      validator = validator[type](...params)
    })
    schema[id] = validator
    return schema
  }, {})
  const itemSchema: any = yup.object().shape({ ...fieldsSchema, children: yup.array().of(yup.lazy(() => itemSchema)) })
  return yup.array().of(itemSchema)
}

export const resetErrors = (items: TreeItems): void => {
  traverse(items).forEach(function (value) {
    if (this.key === 'errors') {
      this.remove()
    }
  })
}

export const addErrorsToFields = (errors: any, items: TreeItems): TreeItems => {
  errors.inner.forEach((error: any) => {
    let path = error.path

    // get path of errored node
    path = path.split('.').slice(0, -1).join('.')

    const item = getIn(items, path)

    if (item) {
      item.errors = error.message
      setIn(items, path, item)
    }
  })
  return items
}

export const sanitizeItems = (items: TreeItems): TreeItems => {
  return traverse(items).map(function (value) {
    if (
      this.key === 'errors' ||
      this.key === 'collapsed' ||
      this.key === 'parentId' ||
      this.key === 'depth' ||
      this.key === 'index'
    ) {
      this.remove()
    }
  })
}

export const requestDataYupSchema = (): yup.Schema<any> => {
  const config = getService('config').get()
  let itemSchema: yup.Schema<any, any, any, ''>
  if (config.fieldSchema.attributes) {
    itemSchema = createYupSchema(config.fieldSchema.attributes)
  } else {
    itemSchema = createYupSchema(fieldSchema.attributes)
  }

  return yup.object().shape({
    title: yup.string().max(100).required(),
    slug: yup.string().required(),
    items: yup.lazy(() => itemSchema),
  })
}
