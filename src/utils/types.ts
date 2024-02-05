import { Currency } from "@uniswap/sdk-core";

export class ContractData {
  address: string;
  abi: any;
}

export class Contract {
  v3_factory: ContractData;
  nonfungible_position_manager: ContractData;
  quoter: ContractData;
  quoter_v2: ContractData;
  swap_router: ContractData;
}

export class NetworkData {
  value: string;
  chain_id: number;
  native_currency: Currency;
  contract: Contract;
  icon: string;
}