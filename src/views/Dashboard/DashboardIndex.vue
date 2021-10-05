<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10 pr-md-16 pl-md-16">
        <v-row>
          <v-col md="6">
            <v-card class="mt-4 mx-auto" elevation="3">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="teal"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-file-document-outline
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Balance') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    <div v-if="padawan && padawan.balances['0:0000000000000000000000000000000000000000000000000000000000000000']">
                      {{ (padawan.balances['0:0000000000000000000000000000000000000000000000000000000000000000'].total)/1000000000 }}
                    </div>
                    <div v-else>
                      -
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="6">
            <v-card class="mt-4 mx-auto" elevation="3">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="blue"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-vote
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Active Proposals') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    <div v-if="padawan">
                      {{ Object.keys(padawan.activeProposals).length }}
                    </div>
                    <div v-else>
                      -
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col md="3" sm="6">
            <v-card class="mt-4 mx-auto" max-width="400" elevation="3">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="green"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-check-bold
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Accepted') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    -
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="3" sm="6">
            <v-card class="mt-4 mx-auto" max-width="400">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="red"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-window-minimize
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Rejected') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    -
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="3" sm="6">
            <v-card class="mt-4 mx-auto" max-width="400" elevation="3">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="teal"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-file-document-outline
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Proposals') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    {{ smv.deployedProposalsCounter }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="3" sm="6">
            <v-card class="mt-4 mx-auto" max-width="400" elevation="3">
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-8 text-center white--text display-2 float-left default-gradient"
                    color="blue"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-vote
                  </v-icon>
                </v-sheet>

                <div class="text-right pa-5">
                  <div>
                    {{ $t('Votes') }}
                  </div>
                  <div class="display-3 font-weight-light mb-2">
                    {{ votes }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "../layouts/BaseLayout";
import SMV from "@/models/smv";
import Vue from "vue";
import Proposal from "@/models/proposal";
import Padawan from "@/models/padawan";

export default {
  components: {BaseLayout},
  computed: {
    smv: function () {
      return SMV.find(Vue.prototype.$smv.getSMVAddress());
    },
    skeletonLoaderCount: function () {
      let proposals_count = (Proposal.query().count());
      return (proposals_count >= 5) ? 0 : 5-proposals_count;
    },
    proposals: function () {
      return Proposal.query().get().reverse().slice(0, 5);
    },
    votes: function () {
      let votes = 0;
      let proposals = Proposal.query().get();
      for (let index in proposals) {
        votes += parseFloat(proposals[index].votesFor);
        votes += parseFloat(proposals[index].votesAgainst);
      }
      return votes;
    },
    padawan: function () {
      if (!Vue.prototype.$extension) return;
      return Padawan.query().where('owner', Vue.prototype.$extension.getAddress()).first();
    },
  },
  data: () => ({
    showProposals: {},
    proposalsCarousel: null,
  }),
  methods: {
    showProposal: function (address) {
      if (typeof this.showProposals[address] === 'undefined') {
        Vue.set(this.showProposals, address, true);
      } else {
        Vue.set(this.showProposals, address, !this.showProposals[address]);
      }
    }
  }
}
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}

/*
.v-progress-circular__underlay {
  stroke: #ff000066 !important;
}

.v-progress-circular__info {
  display: block !important;
  text-align: center;
}

*/

</style>