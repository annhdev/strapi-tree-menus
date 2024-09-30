import type { MessageDescriptor, PrimitiveType } from 'react-intl';

interface TranslationMessage extends MessageDescriptor {
  values?: Record<string, PrimitiveType>;
}

export interface FieldSchema {
  attributes: Attribute[]
}

interface Attribute {
  id: string
  label: string
  placeholder: string
  type: string
  validationType: string
  value: any
  validations: Validation[],
  required?: boolean
  options?: Option[]
}

export interface Option {
  key: string
  value: string
  metadatas: Metadatas
}

export interface Metadatas {
  intlLabel: TranslationMessage
  disabled: boolean
  hidden: boolean
}

export interface Validation {
  type: string
  params: any[]
}
