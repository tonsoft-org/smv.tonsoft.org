<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10 pr-md-16 pl-md-16 pt-5">
        <v-row>
          <v-col md="10" offset-md="1">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-6 white--text default-gradient"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-file-document-outline
                  </v-icon>
                  {{ $t('Proposals') }}
                  <v-icon color="white" @click="$router.push({name: 'proposals.create'})">
                    mdi-plus
                  </v-icon>
                  <div class="float-right mt-n3">
                    <v-text-field
                        v-model="search"
                        :label="$t('search')"
                        append-icon="mdi-magnify"
                        class="d-inline-block"
                        color="white"
                    ></v-text-field>
                    <v-btn icon>
                      <v-icon>mdi-filter</v-icon>
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
            </v-card>

            <v-card elevation="1" class="mx-auto pa-2 proposal-card" tile v-for="proposal in proposals" :key="proposal.id">
              <v-card-title
                  @click="$router.push({name: 'proposals.show', params: {proposalId: proposal.id}})"
                  class="cursor-pointer pb-1 pl-2"
              >
                {{ proposal.title }}
              </v-card-title>
              <v-card-actions class="pt-0">
                <v-chip color="#02AAB0" outlined small v-if="proposal.end >= (Date.now()/1000)">
                  <v-icon left>mdi-check-bold</v-icon>
                  {{ $t('Active') }}
                </v-chip>
                <v-chip color="black" outlined small v-else>
                  <v-icon left>mdi-close</v-icon>
                  {{ $t('Finished') }}
                </v-chip>
                <span class="proposal-votes-text ml-3">
                &bull;
                {{ parseFloat(proposal.votesFor)+parseFloat(proposal.votesAgainst) }}
                </span>
                <span class="proposal-date-text ml-1">
                &bull;
                {{ getDateFromUnixTimestamp(proposal.end) }}
                </span>
                <v-spacer></v-spacer>
                <v-btn icon @click="showProposal(proposal.id)" class="mt-n10">
                  <v-icon>{{ showProposals[proposal.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-expand-transition>
                <div v-show="showProposals[proposal.id]">
                  <v-divider></v-divider>
                  <v-card-text>
                    {{ proposal.id }}
                  </v-card-text>
                </div>
              </v-expand-transition>
              <div class="clear-both"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "../layouts/BaseLayout";
import Proposal from "@/models/proposal";
import Vue from "vue";

export default {
  components: {BaseLayout},

  computed: {
    skeletonLoaderCount: function () {
      let proposals_count = (Proposal.query().count());
      return (proposals_count >= 5) ? 0 : 5-proposals_count;
    },
    proposals: function () {
      return Proposal.query()
          .where((proposal) => {
            return proposal.id.includes(this.search)
          })
          .get()
          .reverse();
    },
  },
  data: () => ({
    showProposals: {},
    search: '',
  }),
  methods: {
    showProposal: function (address) {
      if (typeof this.showProposals[address] === 'undefined') {
        Vue.set(this.showProposals, address, true);
      } else {
        Vue.set(this.showProposals, address, !this.showProposals[address]);
      }
    },
    getDateFromUnixTimestamp: function (unixTimestamp) {
      return (new Date(unixTimestamp * 1000)).toLocaleString();
    }
  }
}
</script>

<style scoped>
.proposal-card {
  border-bottom: 1px solid #f5f5f5;
  border-left: 2px solid transparent;
}
.proposal-card:hover {
  border-left: 2px solid #02AAB0;
}
.proposal-date-text, .proposal-votes-text {
  font-weight: bold;
  color: #bbbbbb;
  font-size: 12px;
}
.cursor-pointer {
  cursor: pointer;
}
</style>