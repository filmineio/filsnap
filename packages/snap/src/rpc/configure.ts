import {MetamaskState, Wallet} from "../interfaces";
import deepmerge from "deepmerge";
import {getDefaultConfiguration} from "../configuration";
import {SnapConfig} from "@chainsafe/filsnap-types";
import {LotusRpcApi} from "../filecoin/types";
import {getApiFromConfig} from "../filecoin/api";
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";

export interface ConfigureResponse {
  api: LotusRPC,
  snapConfig: SnapConfig
}

export async function configure(wallet: Wallet, networkName: string, overrides?: unknown): Promise<ConfigureResponse> {
  const defaultConfig = getDefaultConfiguration('t');
  console.log('defaultConfig: ', defaultConfig);
  const configuration = overrides ? deepmerge(defaultConfig, overrides) : defaultConfig;
  console.log('configuration: ', configuration);
  const [, , coinType, , , ] = configuration.derivationPath.split('/');
  const bip44Code = coinType.replace("\'", "");
  // instatiate new api
  const api = await getApiFromConfig(configuration);
  const apiNetworkName = await api.stateNetworkName();
  console.log('apiNetworkName: ', apiNetworkName);
  // check if derivation path is valid
  if (configuration.network == "f" && apiNetworkName == "mainnet") {
    // if on mainet, coin type needs to be 461
    if(bip44Code != '461') {
      throw new Error("Wrong CoinType in derivation path");
    }
  } else if (configuration.network == "t" && apiNetworkName != "mainnet") {
    if(bip44Code != '1') {
      throw new Error("Wrong CoinType in derivation path");
    }
  }// else {
  //   throw new Error("Mismatch between configured network and network provided by RPC");
  // }
  const state = await wallet.request({ method: 'snap_manageState', params: ['get'] }) as MetamaskState;
  console.log('state: ', state);
  state.filecoin.config = configuration;
  wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  });
  return {api, snapConfig: configuration};
}
