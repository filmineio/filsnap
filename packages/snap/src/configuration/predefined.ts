import {SnapConfig} from "@chainsafe/filsnap-types";

export const filecoinMainnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/461'/0'/0/0",
  network: "f",
  rpc: {
    token: "",
    url: "https://api.node.glif.io",
  },
  unit: {
    decimals: 6,
    image: `https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007`,
    symbol: "FIL"
  }
};

// devnet configuration replaces testnet for now
export const filecoinTestnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/1'/0'/0/0",
  network: "t",
  rpc: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.RVUNXjTmfjfgUgSW9rVHcpdFLKgHTL-CK4Fgk_w30ss",
    url: `https://indivar.filmine.io/rpc/v0`,
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.MDBRCM0rQMdFhZWfyO3zGJJVReB9L-w1qYMK_Q5fvqI",
    // url: `https://23.88.3.90:8124/rpc/v0`
  },
  unit: {
    decimals: 6,
    image: `https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007`,
    symbol: "FIL",
    // custom view url ?
  }
};

export const defaultConfiguration: SnapConfig = filecoinMainnetConfiguration;
