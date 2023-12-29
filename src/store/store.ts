import { PersistConfig, persistReducer, persistStore, Persistor } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import userReducer, { UserState } from '../store/features/user.slice';
import passthroughReducer, { PassthroughState } from '../store/features/passthrough.slice';
import storage from 'redux-persist/lib/storage';

const persistConfig: PersistConfig<{ user: UserState; passthrough: PassthroughState }> = {
  key: 'root',
  storage: storage,
  blacklist: ['passthrough']
};

const reducers = combineReducers<{
  user: typeof userReducer;
  passthrough: typeof passthroughReducer;
}>({
  user: userReducer,
  passthrough: passthroughReducer
});

const persistedReducer = persistReducer<{ user: UserState; passthrough: PassthroughState }>(
  persistConfig,
  reducers
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistedStore: Persistor = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;
