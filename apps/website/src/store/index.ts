import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { lobbyApi } from './lobby';
import { userSlice } from './user';

const reducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [lobbyApi.reducerPath]: lobbyApi.reducer,
});

const persistConfig = {
  key: 'root',
  whitelist: [userSlice.name],
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const isServer = typeof window === 'undefined';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: true,
  });
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: isServer ? reducer : persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(lobbyApi.middleware)
      .concat(middlewares),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
