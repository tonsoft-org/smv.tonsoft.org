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
                    mdi-cog
                  </v-icon>
                  {{ $t('Settings') }}
                </v-sheet>
              </v-card-text>

              <v-card-text>
                <v-text-field
                    color="#02AAB0"
                    class="mt-3 ml-5"
                    v-model="smvAddress"
                    :label="$t('SMV address')"
                    @keydown.enter="setSMVAddress">
                </v-text-field>

                <v-text-field
                    color="#02AAB0"
                    class="mt-3 ml-5"
                    v-model="serverAddress"
                    :label="$t('Server address')"
                    @keydown.enter="setServerAddress">
                </v-text-field>
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

export default {
  components: {BaseLayout},

  computed: {},

  data: () => {
    return {
      smvAddress: Vue.prototype.$smv.getSMVAddress(),
      serverAddress: localStorage.getItem('server_address') || 'net.ton.dev',
    }
  },

  methods: {
    setSMVAddress: function (e) {
      localStorage.setItem('smv_address', e.target.value);
      window.location.replace('/');
    },
    setServerAddress: function (e) {
      localStorage.setItem('server_address', e.target.value);
      window.location.replace('/');
    }
  }
}
</script>