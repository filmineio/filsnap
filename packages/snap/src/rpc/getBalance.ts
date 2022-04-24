import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { FilecoinNumber } from "@glif/filecoin-number/dist";
import { getKeyPair } from "../filecoin/account";
import { Wallet } from "../interfaces";

export async function getBalance(
  wallet: Wallet,
  api: LotusRPC,
  address?: string
): Promise<string> {
  if (!address) {
    address = (await getKeyPair(wallet)).address;
  }
  const balance = await api.walletBalance(address);
  return new FilecoinNumber(balance, "attofil").toFil();
}
