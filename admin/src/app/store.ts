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
import promotionSlice from 'src/features/promotion/promotionSlice';

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
  promotion: promotionSlice,
  order: orderSlice
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