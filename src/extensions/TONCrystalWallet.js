import ton, { hasTonProvider } from 'ton-inpage-provider';

export default class TONCrystalWallet{
    constructor() {
        return (async () => {
            if (!(await hasTonProvider())) {
                return this;
            }

            await ton.ensureInitialized();

            const { accountInteraction } = await ton.rawApi.requestPermissions({
                permissions: ['tonClient', 'accountInteraction']
            });

            this.accountInteraction = accountInteraction;
            return this;
        })();
    }

    getAddress() {
        return this.accountInteraction?.address ?? '';
    }
}