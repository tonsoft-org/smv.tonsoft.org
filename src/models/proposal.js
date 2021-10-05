import { Model } from '@vuex-orm/core'

export default class Proposal extends Model {
    static entity = 'proposals';

    static fields () {
        return {
            id: this.attr(null),
            end: this.attr(null),
            proposalType: this.attr(null),
            specific: this.attr(null),
            start: this.attr(null),
            state: this.attr(null),
            title: this.attr(null),
            totalVotes: this.attr(null),
            votesAgainst: this.attr(null),
            votesFor: this.attr(null),

            description: this.attr(null),
        }
    }
}