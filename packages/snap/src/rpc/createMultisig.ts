import { CidMessage } from "@chainsafe/filsnap-types";
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { getKeyPair } from "../filecoin/account";
import { Wallet } from "../interfaces";


export async function createMultisig(
  wallet: Wallet,
  api: LotusRPC
): Promise<CidMessage> {
  try {
    console.log("here");
    const keypair = await getKeyPair(wallet);
    // extract gas params
    
    
    const address = keypair.address;
    const message = await api.msigCreate(
      2,
      [
        "t01020",
        "t01021",
        address,
      ],
      0,
      "0",
      "f3rvde2imgcsxza5wz7czqm4sjh5rrcq2m6fdrelfgjpx2mhqzuzisbafnrdrncrobkxflmoj652ejklirqclq",
      "1"
    );

    console.log("message: ", message);

    return message as unknown as CidMessage;
  } catch (e) {
    console.log("Multisig creation error: ", e);
    return {
      "/": "",
    };
  }
}
