declare module "@filecoin-shipyard/lotus-client-schema" {

    export type Schema = {
        methods: any;
    }

    interface mainnet {
        fullNode: Schema;
        storageMiner: Schema;
    }

    export const mainnet: mainnet;
}
