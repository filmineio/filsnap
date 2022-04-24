import { Wallet } from "../interfaces";
import {
  Message,
  MessageGasEstimate,
  MessageRequest,
} from "@chainsafe/filsnap-types";
import { getKeyPair } from "../filecoin/account";
import { LotusRpcApi } from "../filecoin/types";
import { FilecoinNumber } from "@glif/filecoin-number/dist";
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";

export async function estimateMessageGas(
  wallet: Wallet,
  api: LotusRPC,
  messageRequest: MessageRequest,
  maxFee?: string
): Promise<MessageGasEstimate> {
  const keypair = await getKeyPair(wallet);
  const message: Message = {
    ...messageRequest,
    from: keypair.address,
    gasfeecap: "0",
    gaslimit: 0,
    gaspremium: "0",
    method: 0, // code for basic transaction
    nonce: 0, // dummy nonce just for gas calculation
  };

  const msg = {
    From: message.from,
    GasFeeCap: message.gasfeecap,
    GasLimit: message.gaslimit,
    GasPremium: message.gaspremium,
    Method: message.method,
    Nonce: message.nonce,
    Params: message.params,
    To: message.to,
    Value: message.value,
    Version: 2,
  };
  // estimate gas usage
  const gasLimit = await api.gasEstimateGasLimit(msg, null);
  // set max fee to 0.1 FIL if not set
  const maxFeeAttoFil = maxFee
    ? maxFee
    : new FilecoinNumber("0.1", "fil").toAttoFil();
  const messageEstimate = await api.gasEstimateMessageGas(
    msg,
    { MaxFee: maxFeeAttoFil },
    null
  );
  return {
    gasfeecap: messageEstimate.GasFeeCap,
    gaslimit: gasLimit,
    gaspremium: messageEstimate.GasPremium,
    maxfee: maxFeeAttoFil,
  };
}
