<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10 pr-md-16 pl-md-16 pt-5">
        <v-row>
          <v-col md="10" offset-md="1">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet
                    class="v-sheet--offset pa-5 white--text default-gradient"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-file-document-outline
                  </v-icon>
                  {{ proposal.title }}
                </v-sheet>
              </v-card-text>

              <v-card-actions class="pa-5 pt-0">
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
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-10">
          <v-col md="5" offset-md="1">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  <v-icon color="white" x-large>mdi-file-document-outline</v-icon>
                  {{ $t('For') }}
                  <div class="float-right mt-2">
                    {{ proposal.votesFor }}
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions class="pa-5 pt-0">
                <v-progress-linear
                    height="10"
                    :value="(parseFloat(proposal.votesFor)*100)/(parseFloat(proposal.votesAgainst)+parseFloat(proposal.votesFor))"
                    background-color="grey"
                    class="vote-for-gradient"
                >
                </v-progress-linear>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col md="5">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  <v-icon color="white" x-large>mdi-file-document-outline</v-icon>
                  {{ $t('Against') }}
                  <div class="float-right mt-2">
                    {{ proposal.votesAgainst }}
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions class="pa-5 pt-0">
                <v-progress-linear
                    height="10"
                    :value="(parseFloat(proposal.votesAgainst)*100)/(parseFloat(proposal.votesAgainst)+parseFloat(proposal.votesFor))"
                    background-color="grey"
                    class="vote-against-gradient"
                ></v-progress-linear>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-10">
          <v-col md="6" offset-md="1">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0 pb-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  <v-icon color="white" x-large>mdi-file-document-outline</v-icon>
                  {{ $t('Description') }}
                </v-sheet>
              </v-card-text>
              <v-card-text class="pa-5">
                {{ proposal.description }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="4">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  <v-icon color="white" x-large>mdi-file-document-outline</v-icon>
                  {{ $t('Vote') }}
                </v-sheet>
              </v-card-text>

              <template v-if="(proposal.end >= (Date.now()/1000)) && !voteLoading && extension">
                <v-card-actions class="pa-5 pt-0">
                  <v-text-field v-model="voteAmount" class="center-input d-inline-block" color="#009398"></v-text-field>
                  <v-select v-model="voteToken"  :items="['TON']" disabled class="select-token d-inline-block ml-2"></v-select>
                </v-card-actions>

                <v-card-actions class="pa-5 pt-0">
                  <v-btn depressed tile :class="['width-50p', (voteValue === true) ? 'vote-for-btn' : '']" @click="voteValue = true">{{ $t('For') }}</v-btn>
                  <v-btn depressed tile :class="['width-50p', (voteValue === false) ? 'vote-against-btn' : '']" @click="voteValue = false">{{ $t('Against') }}</v-btn>
                </v-card-actions>

                <v-card-actions class="pa-5 pt-0">
                  <v-btn class="default-gradient-bg-color white--text" tile block depressed @click="vote">{{ $t('Vote') }}</v-btn>
                </v-card-actions>
              </template>
              <template v-else-if="voteLoading">
                <v-card-text>
                  <v-progress-linear
                      indeterminate
                      color="#009398"
                  ></v-progress-linear>
                </v-card-text>
              </template>
              <template v-else-if="!extension">
                <v-card-text class="pt-0">
                  <v-btn @click="$router.push({name: 'account.index'})" depressed dark block>
                    {{ $t('Login') }}
                  </v-btn>
                </v-card-text>
              </template>
              <template v-else-if="(proposal.end < (Date.now()/1000))">
                <v-card-text class="text-center grey--text display-1 font-weight-bold pt-0">
                  {{ $t('Finished') }}
                </v-card-text>
              </template>
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
import Padawan from "@/models/padawan";

export default {
  components: {BaseLayout},
  props: {
    proposalId: Number,
  },
  computed: {
    proposal: function () {
      return Proposal.query().where('id', this.proposalId).first();
    },
    padawan: function () {
      return Padawan.query().where('owner', Vue.prototype.$extension.getAddress()).first();
    },
    extension: function() {
      return Vue.prototype.$extension;
    },
  },
  data: () => ({
    voteToken: 'TON',
    voteAmount: 1,
    voteValue: null,

    voteLoading: false,
  }),
  methods: {
    vote: async function () {
      if (!this.padawan.id || !this.proposal.id || this.voteValue === null || this.voteAmount <= 0) {
        return;
      }
      this.voteLoading = true;
      await Vue.prototype.$smv.vote(
          this.padawan.id,
          this.proposal.id,
          this.voteValue,
          parseFloat(this.voteAmount),
      );
      this.voteValue = null;
      this.voteLoading = false;
    },
    getDateFromUnixTimestamp: function (unixTimestamp) {
      return (new Date(unixTimestamp * 1000)).toLocaleString();
    }
  }
}
</script>

<style scoped>
.select-token{
  width: 75px;
}
.center-input >>> input{
  text-align: center;
}
.width-50p{
  width: 50%;
}

.proposal-date-text, .proposal-votes-text {
  font-weight: bold;
  color: #bbbbbb;
  font-size: 12px;
}

.vote-against-gradient >>> .v-progress-linear__determinate {
  background-image: linear-gradient(270deg, rgb(141 24 24) 11.2%, rgb(221 96 96) 91.1% );
}

.vote-for-gradient >>> .v-progress-linear__determinate {
  background-image: linear-gradient(270deg, rgb(37 141 24) 11.2%, rgba(96,221,142,1) 91.1% );
}

.vote-for-btn {
  color: white;
  background-color: #258d18 !important;
}

.vote-against-btn {
  color: white;
  background-color: #8d1818 !important;
}
</style>