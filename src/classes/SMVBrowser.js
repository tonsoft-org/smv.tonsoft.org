import SDKClient from "@/classes/SDKClient";
import {abiContract} from "@tonclient/core";
import * as smvAbi from "@/contracts/abi/SmvRoot.abi.json";
import * as smvStoreAbi from "@/contracts/abi/SmvRootStore.abi.json";
import * as padawanAbi from "@/contracts/abi/Padawan.abi.json";
import * as ttwAbi from "@/contracts/abi/TTW.abi.json";
import * as proposalFactoryAbi from "@/contracts/abi/ProposalFactory.abi.json";
import * as proposalAbi from "@/contracts/abi/Proposal.abi.json";
import * as groupAbi from "@/contracts/abi/Group.abi.json";
import ton from "ton-inpage-provider";

export default class SMVBrowser {
    constructor(client, extension, smvAddress) {
        this.userAddress = (extension) ? extension.getAddress() : '';
        this.client = client;
        this.sdk = new SDKClient(client);
        this.smvAddress = smvAddress;


        this.smvAbi = abiContract(smvAbi);
        this.smvStoreAbi = abiContract(smvStoreAbi);
        this.padawanAbi = abiContract(padawanAbi);
        this.ttwAbi = abiContract(ttwAbi);
        this.proposalFactoryAbi = abiContract(proposalFactoryAbi);
        this.proposalAbi = abiContract(proposalAbi);
        this.groupAbi = abiContract(groupAbi);

        this.smvBoc = null;
        this.padawanBoc = [];

        this.delay = ms => new Promise(res => setTimeout(res, ms));
    }

    setUserAddress(userAddress) {
        this.userAddress = userAddress;
    }

    getSMVAddress() {
        return this.smvAddress;
    }

    async getSmvBoc() {
        if (!this.smvBoc) {
            const {result} = await this.client.net.query_collection({
                collection: 'accounts',
                filter: { id: {eq: this.smvAddress} },
                result: 'id, balance, boc, code_hash'
            });

            this.smvBoc = result[0].boc;
        }

        return this.smvBoc;
    }


    async getStats() {
        const smvBoc = await this.getSmvBoc();
        return (await this.sdk.run(this.smvAddress, this.smvAbi, 'getStats', {}, smvBoc))?.decoded?.output;
    }

    async getStored() {
        const smvBoc = await this.getSmvBoc();
        return (await this.sdk.run(this.smvAddress, this.smvAbi, 'getStored', {}, smvBoc))?.decoded?.output;
    }

    async deployPadawan() {
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: this.smvAddress,
            amount: '5000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.smvAbi.value.default),
                method: 'deployPadawan',
                params: {
                    owner: this.userAddress,
                }
            }
        });

        return transaction;
    }


    async resolvePadawan(address = null) {
        if (!address && !this.userAddress) return;
        return ((await this.sdk.run(this.smvAddress, this.smvAbi, 'resolvePadawan', {
            owner: address ?? this.userAddress,
        }))).decoded.output.addrPadawan;
    }

    async checkPadawan(address) {
        return ((
            await this.client.net.query_collection({
                collection: "accounts",
                filter: {
                    id: { eq: address },
                    acc_type: { eq: 1 },
                },
                result: "id",
            })
        ).result.length !== 0);
    }

    async getPadawanBalance(padawanAddress) {
        return (await this.sdk.run(padawanAddress, this.padawanAbi, '_balances')).decoded.output._balances;
    }

    async getPadawanActiveProposals(padawanAddress) {
        return (await this.sdk.run(padawanAddress, this.padawanAbi, '_activeProposals')).decoded.output._activeProposals;
    }

    async getPadawanReclaim(padawanAddress) {
        return (await this.sdk.run(padawanAddress, this.padawanAbi, '_reclaim')).decoded.output._reclaim;
    }

    async getPadawanTokenAccounts(padawanAddress) {
        /*const padawan_boc = await this.getPadawanBoc(padawan_address);*/
        return (await this.sdk.run(padawanAddress, this.padawanAbi, '_tokenAccounts')).decoded.output._tokenAccounts;
    }

    async depositTonsToPadawan(padawanAddress, amount) {
        let amountWithFee = ((amount+1)*1000000000).toString();
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: padawanAddress,
            amount: amountWithFee,
            bounce: true,
            payload: {
                abi: JSON.stringify(this.padawanAbi.value.default),
                method: 'depositTons',
                params: {
                    tons: amount*1000000000,
                }
            }
        });

        return transaction;
    }

/*    async depositTokensToPadawan(padawan_address) {
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.user_address,
            recipient: padawan_address,
            amount: '5000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.padawan_abi.value.default),
                method: 'depositTokens',
                params: {
                    tokenRoot: this.token_root,
                }
            }
        });

        return transaction;
    }*/

/*    async createTokenAccountPadawan(padawan_address) {
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.user_address,
            recipient: padawan_address,
            amount: '2000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.padawan_abi.value.default),
                method: 'createTokenAccount',
                params: {
                    tokenRoot: this.token_root,
                }
            }
        });

        return transaction;
    }*/

    /*async transferTip3() {
        //todo
        return (
            await this.sdk.call(
                '0:4ec2a2a90cdf8fe1494c64f45ee5b3e9efa62cbe6e14a7e755211a76c455a4b0',
                this.ttwAbi,
                'transfer',
                {
                    dest: '0:6be4f46349247838b769733e4921887f24ccd6c5706f234ddf258676c883bf43',
                    tokens: 16000000,
                    grams: 100000000,
                },
                {
                    "public":"d43a3fea8ac6acbc38fcf1a37e455dd5195b6f5be9aeb64e15713ff199a5f91f",
                    "secret":"bdee36d9dbc570063820d3067c2d1e9310445586f32aa844b28edeaf917759a7"
                }
            )
        );
    }*/

    async getBalanceTip3(address) {
        return (await this.sdk.run(address, this.ttwAbi, 'getBalance'));
    }

    async deployContestProposal(title, description) {
        const proposalFactory = (await this.sdk.run(this.smvAddress, this.smvAbi, 'getStored', {})).decoded.output.proposalFactory;

        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: proposalFactory,
            amount: '8000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.proposalFactoryAbi.value.default),
                method: 'deployContestProposal',
                params: {
                    client: '0:0000000000000000000000000000000000000000000000000000000000000001',
                    title: btoa(unescape(encodeURIComponent(title))),
                    group: '0:0000000000000000000000000000000000000000000000000000000000000000',
                    specific: {
                        duration: 100,
                        description: btoa(unescape(encodeURIComponent(description)))
                    },
                }
            }
        });

        return transaction;
    }

    async resolveProposal(id) {
        return (await this.sdk.run(this.smvAddress, this.smvAbi, 'resolveProposal', {id})).decoded.output.addrProposal;
    }

    async vote(padawanAddress, proposalAddress, choice, votes) {
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: padawanAddress,
            amount: '1000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.padawanAbi.value.default),
                method: 'vote',
                params: {
                    proposal: proposalAddress,
                    choice: choice,
                    votes: votes,
                }
            }
        });

        return transaction;
    }

    async reclaimDeposit(padawanAddress, voteProvider, amount, returnTo) {
        amount = amount*1000000000;
        const { transaction } = await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: padawanAddress,
            amount: '3000000000',
            bounce: true,
            payload: {
                abi: JSON.stringify(this.padawanAbi.value.default),
                method: 'reclaimDeposit',
                params: {
                    voteProvider: voteProvider,
                    amount: amount,
                    returnTo: returnTo,
                }
            }
        });

        return transaction;
    }

    async getAllProposal(proposalAddress) {
        return await this.sdk.run(proposalAddress, this.proposalAbi, 'getAll', {});
    }

    async getProposalInfo(proposalAddress) {
        return (await this.sdk.run(proposalAddress, this.proposalAbi, 'getInfo', {})).decoded.output.info;
    }

    async calculateAddress(tvc, keys) {
        const message = await this.client.abi.encode_message({
            abi: this.smvStoreAbi,
            signer: {
                type: "Keys",
                keys: keys,
            },
            deploy_set: {
                tvc,
            },
        });

        return message.address;
    }

    async deploySmvStore(
        densRootAddr = '0:0000000000000000000000000000000000000000000000000000000000000001',
        tokenRootAddr = '0:0000000000000000000000000000000000000000000000000000000000000001',
    ) {
        let keys = await this.client.crypto.generate_random_sign_keys();
        let address = await this.calculateAddress(this.smvStoreAbi.value.default.tvc, keys);

        console.log(keys);
        console.log(address);

        await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: address,
            amount: '10000000000',
            bounce: false,
        });

        await this.delay(10000);

        await this.client.processing.process_message({
            message_encode_params: {
                abi: this.smvStoreAbi,
                signer: {
                    type: "Keys",
                    keys: keys,
                },
                deploy_set: {
                    tvc: this.smvStoreAbi.value.default.tvc,
                },
                call_set: {
                    function_name: "constructor",
                },
            },
            send_events: false,
        });

        await this.sdk.call(
            address,
            this.smvStoreAbi,
            'setProposalCode',
            await this.sdk.client.boc.get_code_from_tvc({ tvc: this.proposalAbi.value.default.tvc }),
            keys
        );

        await this.sdk.call(
            address,
            this.smvStoreAbi,
            'setPadawanCode',
            await this.sdk.client.boc.get_code_from_tvc({ tvc: this.padawanAbi.value.default.tvc }),
            keys
        );

        await this.sdk.call(
            address,
            this.smvStoreAbi,
            'setGroupCode',
            await this.sdk.client.boc.get_code_from_tvc({ tvc: this.groupAbi.value.default.tvc }),
            keys
        );


        await this.sdk.call(
            address,
            this.smvStoreAbi,
            'setDensRootAddr',
            {addr: densRootAddr},
            keys
        );

        await this.sdk.call(
            address,
            this.smvStoreAbi,
            'setTokenRootAddr',
            {addr: tokenRootAddr},
            keys
        );

        return {keys, address};
    }

    async deploySmv(smvStoreAddress) {
        let keys = await this.client.crypto.generate_random_sign_keys();
        let address = await this.calculateAddress(this.smvAbi.value.default.tvc, keys);

        await ton.rawApi.sendMessage({
            sender: this.userAddress,
            recipient: address,
            amount: '10000000000',
            bounce: false,
        });

        await this.delay(5000);

        await this.client.processing.process_message({
            message_encode_params: {
                abi: this.smvAbi,
                signer: {
                    type: "Keys",
                    keys: keys,
                },
                deploy_set: {
                    tvc: this.smvAbi.value.default.tvc,
                },
                call_set: {
                    function_name: "constructor",
                    input: {
                        addrStore: smvStoreAddress,
                        codeProposalFactory: (await this.client.boc.get_code_from_tvc({tvc: this.proposalFactoryAbi.value.default.tvc})).code,
                    }
                },
            },
            send_events: false,
        });

        return {keys, address};
    }

    fromHex(hexx, decodeURI = true) {
        if (decodeURI) {
            hexx = decodeURIComponent(escape(hexx));
        }

        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}