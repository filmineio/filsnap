import { CidMessage } from "@chainsafe/filsnap-types";
import { LotusRPC, MsgLookup } from "@filecoin-shipyard/lotus-client-rpc";

export async function stateWaitMessage(
  api: LotusRPC,
  message: CidMessage
): Promise<MsgLookup | null> {
  try {
    // @ts-ignore
    const messageLookupResponse = await api.stateWaitMsg(message, 2);
    console.log(
      "msgLookupResponse: ",
      JSON.stringify(messageLookupResponse, null, 2)
    );

    return messageLookupResponse;
  } catch (e) {
    console.log("Multisig creation error: ", e);
    return null;
  }
}
