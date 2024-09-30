import { useDispatch, useSelector,TypedUseSelectorHook} from 'react-redux';
import type { Store } from '@strapi/strapi/admin';

type RootState = ReturnType<Store['getState']> & {
  ['content-manager']: any;
  ['tree-menus-config']: any;
};

const useTypedDispatch = useDispatch;
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export {useTypedSelector, useTypedDispatch};
