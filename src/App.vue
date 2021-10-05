<template>
  <router-view v-if="loaded"/>
  <div v-else>
    <div v-if="error">
      <div class="alert-block">
        <v-text-field
            v-model="serverAddress"
            :label="$t('Server address')"
            @keydown.enter="setServerAddress"
        ></v-text-field>
        <v-text-field
            v-model="smvAddress"
            :label="$t('SMV address')"
            @keydown.enter="setSMVAddress"
        ></v-text-field>
        <v-alert dense outlined type="error">{{ error }}</v-alert>
      </div>
    </div>
    <div v-else class="loading">
      {{ $t('Loading...') }}
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import SMV from "@/models/smv";
import Padawan from "@/models/padawan";
import Proposal from "@/models/proposal"
import SMVBrowser from "@/classes/SMVBrowser";

export default {
  async mounted() {
    try {
      this.smvAddress = localStorage.getItem('smv_address') || '0:d4b373226df0c351346bcbd7dbe3e89b9f6704f3f986c6bf3472cb15659d4589';

      Vue.prototype.$smv = await new SMVBrowser(
          Vue.prototype.$client,
          Vue.prototype.$extension,
          this.smvAddress
      );

      this.smvStats = await Vue.prototype.$smv.getStats();
      this.smvStore  = await Vue.prototype.$smv.getStored();

      await SMV.insert({
        data: {
          id: this.smvAddress,

          codePadawan: this.smvStore.codePadawan,
          codeProposal: this.smvStore.codeProposal,
          codeGroup: this.smvStore.codeGroup,
          addrStore: this.smvStore.addrStore,
          addrDensRoot: this.smvStore.addrDensRoot,
          addrTokenRoot: this.smvStore.addrTokenRoot,
          proposalFactory: this.smvStore.proposalFactory,

          version: this.smvStats.version,
          deployedPadawansCounter: this.smvStats.deployedPadawansCounter,
          deployedProposalsCounter: this.smvStats.deployedProposalsCounter,
        }
      });

      this.loaded = true;
    } catch (error) {
      this.error = this.$t('Invalid SMV address');
    }

    if (Vue.prototype.$extension) {
      Vue.prototype.$smv.resolvePadawan(Vue.prototype.$extension.getAddress()).then(async (result) => {
        const padawanCheck = await Vue.prototype.$smv.checkPadawan(result);
        if (!padawanCheck) {
          await Padawan.insert({
            data: {
              id: result,
              owner: Vue.prototype.$extension.getAddress(),
              balances: [],
              tokenAccounts: [],
              activeProposals: [],
              active: false,
            }
          });
        } else {
          const padawanBalance = await Vue.prototype.$smv.getPadawanBalance(result);
          const activeProposals = await Vue.prototype.$smv.getPadawanActiveProposals(result);
          const reclaim = await Vue.prototype.$smv.getPadawanReclaim(result);
          const tokenAccounts = await Vue.prototype.$smv.getPadawanTokenAccounts(result);
          await Padawan.insert({
            data: {
              id: result,
              owner: Vue.prototype.$extension.getAddress(),
              balances: padawanBalance,
              tokenAccounts: tokenAccounts,
              activeProposals: activeProposals,
              reclaim: reclaim,
              active: true,
            }
          });
        }
      });
    }

    Vue.prototype.$smv.getStats().then((stats) => {
      const proposalsCount = Number(stats?.deployedProposalsCounter) ?? 0;
      for (let i = 0; i < proposalsCount; i++) {
        Vue.prototype.$smv.resolveProposal(i).then((address) => {
          Vue.prototype.$smv.getProposalInfo(address).then((result) => {
            result.title = Vue.prototype.$smv.fromHex(result.title);
            //todo correct decode
            result.specific = atob(result.specific).slice(24);
            result.description = this.cleanString(result.specific);
            Proposal.insert({
              data: {...{id: address}, ...result}
            });
          });
        });
      }
    });
  },
  data: () => {
    return {
      loaded: false,
      error: null,
      smvAddress: null,
      smvStats: null,
      smvStore: null,
      serverAddress: localStorage.getItem('server_address') || 'net.ton.dev',
    };
  },
  computed: {
    console: () => console,
  },
  methods: {
    setSMVAddress: function (e) {
      localStorage.setItem('smv_address', e.target.value);
      window.location.replace('/');
    },
    setServerAddress: function (e) {
      localStorage.setItem('server_address', e.target.value);
      window.location.replace('/');
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

<style scoped>
.loading {
  color: blue;
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-block{
  padding: 25px;
  width: 600px;
  margin: auto;
}
</style>