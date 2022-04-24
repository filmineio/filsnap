import { MessageStatus, SignedMessage } from "@chainsafe/filsnap-types";
import { Wallet } from "../interfaces";
import { LotusRpcApi } from "../filecoin/types";
import { updateMessageInState } from "../filecoin/message";
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";

export async function sendMessage(
  wallet: Wallet,
  api: LotusRPC,
  signedMessage: SignedMessage
): Promise<MessageStatus> {
  const message = {
    From: signedMessage.message.from,
    GasFeeCap: signedMessage.message.gasfeecap,
    GasLimit: signedMessage.message.gaslimit,
    GasPremium: signedMessage.message.gaspremium,
    Method: signedMessage.message.method,
    Nonce: signedMessage.message.nonce,
    Params: signedMessage.message.params,
    To: signedMessage.message.to,
    Value: signedMessage.message.value,
    // Version: 2,
  };

  const signature = {
    Data: signedMessage.signature.data,
    Type: signedMessage.signature.type,
  };
  const response = await api.mpoolPush({
    // @ts-ignore
    Message: message,
    Signature: signature,
  });
  const messageStatus = {
    cid: response["/"],
    message: signedMessage.message,
  };
  updateMessageInState(wallet, messageStatus);
  return messageStatus;
}
