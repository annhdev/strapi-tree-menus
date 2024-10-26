import type { Store } from '@strapi/strapi/admin'
import { TypedUseSelectorHook,useDispatch, useSelector } from 'react-redux'

type RootState = ReturnType<Store['getState']> & {
  ['content-manager']: any
  ['tree-menus-config']: any
}

const useTypedDispatch = useDispatch
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export { useTypedSelector, useTypedDispatch }
