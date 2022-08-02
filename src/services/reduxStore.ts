import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import createSensitiveStorage from "redux-persist-sensitive-storage";
import { authReducer } from './authReducer';
import createSecureStore from "redux-persist-expo-securestore";
import { userReducer } from './userReducer';

// const sensitiveStorage = createSensitiveStorage({
//   keychainService: "myKeychain",
//   sharedPreferencesName: "mySharedPrefs"
// });

const secureStore = createSecureStore();

const unsecurePersistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: ["auth"]
};

const securePersistConfig = {
  key: "secure",
  storage: secureStore
};

const rootReducer = combineReducers({
  user: persistReducer(unsecurePersistConfig, userReducer),
  auth: persistReducer(securePersistConfig, authReducer)
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: false,
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
