import {
  Message as ZMessage,
  SignedMessage,
  transactionSign,
  transactionSignRaw,
} from "@zondax/filecoin-signing-tools/js";
import { FilecoinNumber } from "@glif/filecoin-number/dist";
import { Wallet } from "../interfaces";
import { getKeyPair } from "../filecoin/account";
import { showConfirmationDialog } from "../util/confirmation";
import {
  MessageRequest,
  SignMessageResponse,
  SignRawMessageResponse,
} from "@chainsafe/filsnap-types";
import { messageCreator } from "../util/messageCreator";
import { LotusRPC, Message } from "@filecoin-shipyard/lotus-client-rpc";

export async function signMessage(
  wallet: Wallet,
  api: LotusRPC,
  messageRequest: MessageRequest
): Promise<SignMessageResponse> {
  try {
    const keypair = await getKeyPair(wallet);
    // extract gas params
    const gl =
      messageRequest.gaslimit && messageRequest.gaslimit !== 0
        ? messageRequest.gaslimit
        : 0;
    const gp =
      messageRequest.gaspremium && messageRequest.gaspremium !== "0"
        ? messageRequest.gaspremium
        : "0";
    const gfc =
      messageRequest.gasfeecap && messageRequest.gasfeecap !== "0"
        ? messageRequest.gasfeecap
        : "0";
    const nonce =
      messageRequest.nonce ?? Number(await api.mpoolGetNonce(keypair.address));
    const params = messageRequest.params || "";
    const method = messageRequest.method || 0;

    // create message object
    const message: Message = {
      From: keypair.address,
      GasFeeCap: gfc,
      GasLimit: gl,
      GasPremium: gp,
      Method: method,
      Nonce: nonce,
      Params: params,
      To: messageRequest.to,
      Value: messageRequest.value,
      Version: 2,
    };
    // estimate gas usage if gas params not provided
    if (
      message.GasLimit === 0 &&
      message.GasFeeCap === "0" &&
      message.GasPremium === "0"
    ) {
      message.GasLimit = await api.gasEstimateGasLimit(message, null);
      const messageEstimate = await api.gasEstimateMessageGas(
        message,
        { MaxFee: "0" },
        null
      );
      message.GasPremium = messageEstimate.GasPremium;
      message.GasFeeCap = messageEstimate.GasFeeCap;
    }

    // show confirmation
    const confirmation = await showConfirmationDialog(wallet, {
      description: `It will be signed with address: ${message.From}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: messageCreator([
        { message: "to:", value: message.To },
        { message: "from:", value: message.From },
        {
          message: "value:",
          value:
            message.Value !== "0" &&
            `${new FilecoinNumber(message.Value, "attofil").toFil()} FIL`,
        },
        { message: "method:", value: message.Method },
        { message: "params:", value: message.Params },
        { message: "gas limit:", value: `${message.GasLimit} aFIL` },
        { message: "gas fee cap:", value: `${message.GasFeeCap} aFIL` },
        { message: "gas premium:", value: `${message.GasPremium} aFIL` },
      ]),
    });

    let sig: SignedMessage = null;
    if (confirmation) {
      const mmm: ZMessage = {
        from: message.From,
        gasfeecap: message.GasFeeCap,
        gaslimit: message.GasLimit,
        gaspremium: message.GasPremium,
        method: message.Method,
        nonce: message.Nonce,
        params: message.Params,
        to: message.To,
        value: message.Value
      };

      sig = transactionSign(mmm, keypair.privateKey);
    }

    return { confirmed: confirmation, error: null, signedMessage: sig };
  } catch (e) {
    return { confirmed: false, error: e, signedMessage: null };
  }
}

export async function signMessageRaw(
  wallet: Wallet,
  rawMessage: string
): Promise<SignRawMessageResponse> {
  try {
    const keypair = await getKeyPair(wallet);
    const confirmation = await showConfirmationDialog(wallet, {
      description: `It will be signed with address: ${keypair.address}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: rawMessage,
    });

    let sig: string = null;
    if (confirmation) {
      sig = transactionSignRaw(rawMessage, keypair.privateKey).toString(
        "base64"
      );
    }

    return { confirmed: confirmation, error: null, signature: sig };
  } catch (e) {
    return { confirmed: false, error: e, signature: null };
  }
}
