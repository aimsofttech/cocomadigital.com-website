import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as the default storage
import cartReducer from "./cartSlice"; // Your cart reducer
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

const persistConfig = {
  key: "root", // Key for the persisted store
  storage, // This will use localStorage
};

const mePersistConfig = {
  key: "me",
  storage,
};

const langPersistConfig = {
  key: "lang",
  storage,
};

const servicePersistConfig = {
  key: "service",
  storage,
};

const commonApiPersistConfig = {
  key: "common",
  storage,
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
