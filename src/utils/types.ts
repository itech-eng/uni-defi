import { Currency } from "@uniswap/sdk-core";

export class ContractData {
  address: string;
  // abi: any;
}

export class Contract {
  v3_factory: ContractData;
  nonfungible_position_manager: ContractData;
  quoter: ContractData;
  quoter_v2: ContractData;
  swap_router: ContractData;
}

export class CoinBasic {
  // is_native: boolean;
  code: string;
  name: string; 
  icon: string;
}

export class NetworkData {
  label: string;
  value: string;
  chain_id: number;
  native_currency_code: string;
  icon: string;
  contract?: Contract;
  coin_or_token?: NetworkCoinData;
}

export class NetworkCoinData {
  [coin_slug: string]: { 
    net_info: Currency, 
    basic: CoinBasic 
  } 
}