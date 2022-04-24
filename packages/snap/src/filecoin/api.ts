import { Wallet } from "../interfaces";
import { getConfiguration } from "../configuration";
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";
import { mainnet } from "@filecoin-shipyard/lotus-client-schema";
import { SnapConfig } from "@chainsafe/filsnap-types";

export async function getApi(wallet: Wallet): Promise<LotusRPC> {
  // console.log("wallet: ", wallet);
  const configuration = await getConfiguration(wallet);
  return getApiFromConfig(configuration);
}

export async function getApiFromConfig(
  configuration: SnapConfig
): Promise<LotusRPC> {
  const provider = new NodejsProvider(
    configuration.rpc.url,
    configuration.rpc.token ? { token: configuration.rpc.token } : {}
  );
  console.log("mainnet: ", mainnet);
  return new LotusRPC(provider, { schema: mainnet.fullNode });
}
