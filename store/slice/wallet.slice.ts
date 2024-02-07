import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type walletType = {
  chain_id: number|null;
  wallet_address: string;
  balance: string;
  network_name: string;
};

const initialState: walletType = {
  chain_id: null,
  wallet_address: "",
  balance: "",
  network_name: "",
};

export const walletSlice = createSlice({
  name: "walletInfo",
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<walletType>) => {
      state.chain_id = action.payload.chain_id;
      state.wallet_address = action.payload.wallet_address;
      state.balance = action.payload.balance;
      state.network_name = action.payload.network_name;
    },
  },
});

export const { setWallet } = walletSlice.actions;
export default walletSlice.reducer;
