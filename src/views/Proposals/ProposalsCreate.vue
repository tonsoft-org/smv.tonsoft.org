<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10 pr-md-16 pl-md-16 pt-5">
        <v-row>
          <v-col md="10" offset-md="1">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0 pb-0">
                <v-sheet
                    class="v-sheet--offset pa-6 white--text default-gradient"
                    elevation="5"
                >
                  <v-icon color="white" x-large>
                    mdi-file-document-outline
                  </v-icon>
                  {{ $t('Create proposal') }}
                </v-sheet>
              </v-card-text>

              <v-card-text class="pa-5" v-if="!deployContestProposalLoading">
                <v-text-field
                    v-model="title"
                    :label="$t('Title')"
                    color="#009398"
                ></v-text-field>

                <v-textarea
                    v-model="description"
                    :label="$t('Description')"
                    color="#009398"
                ></v-textarea>

                <v-btn depressed dark @click="deployContestProposal">
                  {{ $t('Create') }}
                </v-btn>
              </v-card-text>
              <v-card-text v-else>
                <v-progress-linear
                    indeterminate
                    color="#009398"
                ></v-progress-linear>
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
import Vue from "vue";
import Proposal from "@/models/proposal";

export default {
  components: {BaseLayout},
  computed: {},
  data: () => ({
    title: null,
    description: null,
    deployContestProposalLoading: false,
  }),
  methods: {
    deployContestProposal: function () {
      if (this.title && this.description) {
        this.deployContestProposalLoading = true;
        Vue.prototype.$smv.deployContestProposal(this.title, this.description).then(async () => {
          await Vue.prototype.$delay(60000);
          Vue.prototype.$smv.resolveProposal(Proposal.query().count()).then((address) => {
            Vue.prototype.$smv.getProposalInfo(address).then((result) => {
              result.title = Vue.prototype.$smv.fromHex(result.title);
              //todo correct decode
              result.specific = atob(result.specific).slice(24);
              result.description = this.cleanString(result.specific);
              Proposal.insert({
                data: {...{id: address}, ...result}
              }).then(() => {
                this.$router.push({name: 'proposals.show', params: {proposalId: address}});
              });
              this.deployContestProposalLoading = false;
            });
          });
        });
      }
    },
    cleanString(input) {
      let output = "";
      for (let i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 32) {
          output += input.charAt(i);
        }
      }
      return output;
    }
  }
}
</script>