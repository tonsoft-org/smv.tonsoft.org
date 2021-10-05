import { Model } from '@vuex-orm/core'

export default class Padawan extends Model {
    static entity = 'padawans';

    static fields () {
        return {
            id: this.attr(null),
            owner: this.attr(null),
            balances: this.attr(null),
            tokenAccounts: this.attr(null),
            activeProposals: this.attr(null),
            reclaim: this.attr(null),

            active: this.attr(null),
        }
    }
}
