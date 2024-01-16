import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from 'src/features/auth/authSlice';
import assetSlice from 'src/features/catalog/asset/assetSlice';
import roleSlice from 'src/features/setting/role/roleSlice';
import productSlice from 'src/features/catalog/product/productSlice';
import administratorSlice from 'src/features/setting/administrator/administratorSlice';
import customerSlice from 'src/features/customer/customerSlice';
import addressSlice from 'src/features/address/addressSlice';
import categorySlice from 'src/features/catalog/category/categorySlice';
import orderSlice from 'src/features/sale/order/actionSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import colorSlice from 'src/features/catalog/color/colorSlice';
import sizeSlice from 'src/features/catalog/size/sizeSlice';
import materialSlice from 'src/features/catalog/material/materialSlice';
import waistbandSlice from 'src/features/catalog/waistband/waistbandSlice';
import employeeSlice from 'src/features/employee/employeeSlice';
import brandSlice from 'src/features/catalog/brand/brandSlice';
import billSlice from 'src/features/sale/bill/billSlice';
import selloffSlice from 'src/features/sale/saleoff/selloffSlice';
import checkoutSlice from 'src/features/sale/checkout/checkoutSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  auth: authSlice,
  asset: assetSlice,
  role: roleSlice,
  product: productSlice,
  administrator: administratorSlice,
  customer: customerSlice,
  address: addressSlice,
  category: categorySlice,
  color: colorSlice,
  size: sizeSlice,
  material: materialSlice,
  waistband: waistbandSlice,
  brand: brandSlice,
  employee: employeeSlice,
  order: orderSlice,
  bill: billSlice,
  selloff: selloffSlice,
  checkout: checkoutSlice,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;