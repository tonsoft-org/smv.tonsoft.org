<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10">
        <v-row>
          <v-col md="8" offset-md="2">
            <v-stepper v-model="step">
              <v-stepper-header class="elevation-1">
                <v-stepper-step
                    :complete="step > 1"
                    step="1"
                    color="#02aab0"
                >
                  {{ $t('Deploy SMV Store') }}
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="step > 2"
                    step="2"
                    color="#02aab0"
                >
                  {{ $t('Deploy SMV Root') }}
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    step="3"
                    color="#02aab0"
                >
                  {{ $t('Done') }}
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="0" class="text-center">
                  <v-progress-linear
                      indeterminate
                      color="#02aab0"
                  ></v-progress-linear>
                </v-stepper-content>

                <v-stepper-content step="1" class="text-center">
                  <v-btn
                      @click="deploySmvStore"
                      depressed dark
                  >
                    {{ $t('Deploy') }}
                  </v-btn>
                  <v-btn text>
                    {{ $t('Cancel') }}
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2" class="text-center">
                  <v-btn
                      @click="deploySmv()"
                      depressed dark
                  >
                    {{ $t('Deploy') }}
                  </v-btn>
                  <v-btn text>
                    {{ $t('Cancel') }}
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3" class="text-center">
                  <div>
                    {{ $t('SMV address') }}: {{ smv.address }}
                  </div>

                  <v-btn
                      depressed dark
                      @click="step = 1; $router.push({name: 'dashboard.index'})"
                  >
                    {{ $t('Continue') }}
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
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
  data: () => ({
    step: 1,
    smvStore: {},
    smv: {},
    loading: false,
  }),
  methods: {
    deploySmvStore: async function () {
      this.loading = true;
      this.step = 0;
      this.smvStore = await Vue.prototype.$smv.deploySmvStore();
      this.step = 2;
      this.loading = false;
    },
    deploySmv: async function () {
      this.loading = true;
      this.step = 0;
      this.smv = await Vue.prototype.$smv.deploySmv(this.smvStore.address);
      this.step = 3;
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.normal-text-size {
  font-size: 14px !important;
}
</style>