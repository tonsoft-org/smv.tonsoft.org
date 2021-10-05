import { Model } from '@vuex-orm/core'

export default class SMV extends Model {
    static entity = 'smv';

    static fields () {
        return {
            id: this.attr(null),

            codePadawan: this.attr(null),
            codeProposal: this.attr(null),
            codeGroup: this.attr(null),
            addrStore: this.attr(null),
            addrDensRoot: this.attr(null),
            addrTokenRoot: this.attr(null),
            proposalFactory: this.attr(null),

            version: this.attr(null),
            deployedPadawansCounter: this.attr(null),
            deployedProposalsCounter: this.attr(null),
        }
    }
}
