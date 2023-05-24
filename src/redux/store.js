import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userRedux';
import productReducer from './productRedux';
import orderReducer from './orderRedux';
import messageReducer from './messageRedux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  purgeStoredState
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const appReducer = combineReducers({ 
  user: userReducer, 
  product: productReducer, 
  order: orderReducer,
  message: messageReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logoutSuccess') {
    storage.removeItem('persist:root');
    storage.removeItem('i18nextLng');
    purgeStoredState(persistConfig);
    state = undefined;
  };

  return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);