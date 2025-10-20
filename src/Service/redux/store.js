import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import sessionStorage from "redux-persist/lib/storage/session"; // Use sessionStorage for less critical data
import cartReducer from "./cartSlice";
import meReducer from "./meSlice";
import langReducer from "./languageSlice";
import serviceReducer from "./serviceSlice";
import commonReducer from "./commonApiSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// OPTIMIZATION: Cart data should persist in localStorage (critical user data)
const persistConfig = {
  key: "root",
  storage,
  // Throttle writes to avoid blocking main thread
  throttle: 1000, // Write to storage max once per second
};

// OPTIMIZATION: User data in localStorage (critical)
const mePersistConfig = {
  key: "me",
  storage,
  throttle: 1000,
};

// OPTIMIZATION: Language preference in localStorage (critical, small data)
const langPersistConfig = {
  key: "lang",
  storage,
  throttle: 2000,
};

// OPTIMIZATION: Service data in sessionStorage (non-critical, refreshed often)
// Using sessionStorage is faster and doesn't persist across sessions
const servicePersistConfig = {
  key: "service",
  storage: sessionStorage, // Session storage for faster read/write
  throttle: 2000,
};

// OPTIMIZATION: Common API data in sessionStorage (non-critical cache)
const commonApiPersistConfig = {
  key: "common",
  storage: sessionStorage, // Session storage for faster read/write
  throttle: 2000,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedMeReducer = persistReducer(mePersistConfig, meReducer);
const persistedLangReducer = persistReducer(langPersistConfig, langReducer);
const persistedServiceReducer = persistReducer(servicePersistConfig, serviceReducer);
const persistedCommonReducer = persistReducer(commonApiPersistConfig, commonReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    me: persistedMeReducer,
    lang: persistedLangReducer,
    service: persistedServiceReducer,
    commonApi: persistedCommonReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store); // Create persistor

export default store;
