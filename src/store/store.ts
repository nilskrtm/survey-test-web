import { PersistConfig, persistReducer, persistStore, Persistor } from 'redux-persist';
import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import authenticationReducer, { AuthenticationState } from './features/authentication.slice';
import userReducer, { UserState } from '../store/features/user.slice';
import passthroughReducer, { PassthroughState } from '../store/features/passthrough.slice';
import storage from 'redux-persist/lib/storage';

type RawState = {
  authentication: AuthenticationState;
  user: UserState;
  passthrough: PassthroughState;
};

const persistConfig: PersistConfig<RawState> = {
  key: 'root',
  storage: storage,
  whitelist: ['authentication', 'user'],
  blacklist: ['passthrough']
};

const reducers = combineReducers<{
  authentication: typeof authenticationReducer;
  user: typeof userReducer;
  passthrough: typeof passthroughReducer;
}>({
  authentication: authenticationReducer,
  user: userReducer,
  passthrough: passthroughReducer
});

const persistedReducer = persistReducer<RawState>(persistConfig, reducers);

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
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
