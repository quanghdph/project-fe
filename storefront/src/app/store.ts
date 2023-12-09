import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from 'src/features/auth/authSlice';
import cartSlice from 'src/features/cart/cartSlice';
import checkoutSlice from 'src/features/checkout/checkoutSlice';
import addressSlice from 'src/features/address/addressSlice';
import orderSlice from 'src/features/order/orderSlice';
import ratingSlice from 'src/features/rating/ratingSlice';
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
  cart: cartSlice,
  checkout: checkoutSlice,
  address: addressSlice,
  order: orderSlice,
  rating: ratingSlice,
  promotion: promotionSlice
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