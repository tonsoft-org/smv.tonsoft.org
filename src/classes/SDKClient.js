export default class SDKClient {
    constructor(client) {
        this.client = client;
    }

    async run(address, abi, function_name, input = {}, boc = null) {
        if (boc === null) {
            const {result} = await this.client.net.query_collection({
                collection: 'accounts',
                filter: { id: {eq: address} },
                result: 'boc'
            });
            boc = result[0]?.boc;
        }

        const { message } = await this.client.abi.encode_message({
            abi: abi,
            address: address,
            call_set: {
                function_name: function_name,
                input: input,
            },
            signer: {type: 'None'}
        });

        return await this.client.tvm.run_tvm({
            message,
            account:boc,
            abi: abi,
        });
    }

    async call(address, abi, function_name, input, keys = null) {
        return await this.client.processing.process_message({
            message_encode_params: {
                abi: abi,
                address: address,
                signer: keys
                    ? {
                        type: "Keys",
                        keys: keys,
                    }
                    : {
                        type: "None",
                    },
                call_set: {
                    function_name: function_name,
                    input,
                },
            },
            send_events: true,
        });
    }

    async encodeMessageBody(abi, function_name, input) {
        const { body } = await this.client.abi.encode_message_body({
            abi: abi,
            signer: { type: "None" },
            is_internal: true,
            call_set: {
                function_name: function_name,
                input,
            },
        });

        return body;
    }
}