import { Contract } from "../types";

//Eth Mainnet, Goerli, Arbitrum, Optimism, Polygon
export const CommonContractData: Contract = {
  quoter: {
    address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  },
  quoter_v2: {
    address: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
  },
  swap_router: {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  },
  v3_factory: {
    address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  },
  nonfungible_position_manager: {
    address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
};
