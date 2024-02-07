import { combineReducers, configureStore } from "@reduxjs/toolkit";
import walletSlice from "./slice/wallet.slice";

const rootReducer = combineReducers({
  wallet: walletSlice,
});

export default configureStore({
  reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
