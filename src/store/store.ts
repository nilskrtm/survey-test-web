import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import userReducer, { UserState } from '../store/features/user.slice';
import storage from 'redux-persist/lib/storage';

const persistConfig: PersistConfig<{ user: UserState }> = {
  key: 'root',
  storage: storage,
  blacklist: []
};

const reducers = combineReducers<{ user: typeof userReducer }>({
  user: userReducer
});

const persistedReducer = persistReducer<{ user: UserState }>(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;
