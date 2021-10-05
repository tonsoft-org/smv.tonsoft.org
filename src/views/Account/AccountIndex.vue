<template>
  <base-layout>
    <template v-slot:main>
      <v-container fluid class="pa-md-10 pr-md-16 pl-md-16 pt-5">
        <v-row v-if="!extension">
          <v-alert
              style="background-color: #009398;background-image: linear-gradient(90deg, #009398 0%, #00e6c1 100%);"
              dark dense
              elevation="3"
              icon="mdi-school"
              prominent
          >
            {{ $t('In order for the entire functionality of the site to be available, you need to log in through the browser extension. This authorization method is one of the most secure and does not require your private key.') }}
          </v-alert>
        </v-row>
        <v-row v-if="!extension" class="mt-8">
          <v-col md="4">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  {{ $t('TON Crystal Wallet (Broxus)') }}
                </v-sheet>
              </v-card-text>

              <v-card-actions class="pa-5 pt-0">
                <v-btn
                    @click="auth('TONCrystalWallet')"
                    depressed dark block
                >
                  {{ $t('Connect') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col md="4">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  {{ $t('Surf') }}
                </v-sheet>
              </v-card-text>

              <v-card-actions class="pa-5 pt-0">
                <v-btn
                    depressed dark block
                    class="white black--text"
                >
                  {{ $t('Soon') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col md="4">
            <v-card class="mt-2 mx-auto" elevation="3" tile>
              <v-card-text class="pt-0">
                <v-sheet class="v-sheet--offset pa-4 white--text default-gradient" elevation="5">
                  {{ $t('ExtraTON') }}
                </v-sheet>
              </v-card-text>

              <v-card-actions class="pa-5 pt-0">
                <v-btn
                    depressed dark block
                    class="white black--text"
                >
                  {{ $t('Soon') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <v-alert
                prominent
                type="success"
                elevation="3"
                style="background-color: #009398;background-image: linear-gradient(90deg, #009398 0%, #00e6c1 100%);"
            >
              <v-row align="center">
                <v-col class="grow">
                  {{ $t('You are logged in as ') }}: {{ extension.getAddress() }} ({{ 'TON Crystal Wallet' }})
                </v-col>
                <v-col class="shrink">
                  <v-btn depressed @click="logout">{{ $t('Logout') }}</v-btn>
                </v-col>
              </v-row>
            </v-alert>

            <template v-if="padawan && padawan.active">
              <v-card class="mt-15 mx-auto" elevation="3">
                <v-card-text class="pt-0">
                  <v-sheet
                      class="v-sheet--offset pa-5 text-center white--text float-left default-gradient"
                      color="teal"
                      elevation="5"
                  >
                    <v-icon color="white" x-large>
                      mdi-file-document-outline
                    </v-icon>
                    {{ $t('Balances') }}
                  </v-sheet>

                  <div class="clear-both"></div>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="text-left">
                          {{ $t('Address') }}
                        </th>
                        <th class="text-center">
                          {{ $t('Total') }}
                        </th>
                        <th class="text-center">
                          {{ $t('Locked') }}
                        </th>
                        <th class="text-center">
                          {{ $t('Actions') }}
                        </th>
                      </tr>
                      </thead>
                      <tbody v-if="Object.keys(padawan.balances).length !== 0">
                        <tr
                            v-for="(item, key) in padawan.balances"
                            :key="key"
                        >
                          <td class="text-left">{{ key }}</td>
                          <td class="text-center">{{ item.total/1000000000 }}</td>
                          <td class="text-center">{{ item.locked/1000000000 }}</td>
                          <td class="text-center">
                            <v-btn text color="#009398" @click="depositAddress = key; depositDialog = true; depositAmount = 1;">
                              {{ $t('Deposit') }}
                            </v-btn>
                            <v-btn color="#009398" @click="reclaimVoteProvider = key; reclaimDialog = true; reclaimAmount = (item.total/1000000000 - item.locked/1000000000)" text>
                              {{ $t('Reclaim') }}
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr>
                          <td class="text-left">{{ '0:0000000000000000000000000000000000000000000000000000000000000000' }}</td>
                          <td class="text-center">0</td>
                          <td class="text-center">0</td>
                          <td class="text-center">
                            <v-btn text color="#009398" @click="depositAddress = '0:0000000000000000000000000000000000000000000000000000000000000000'; depositDialog = true; depositAmount = 1;">
                              {{ $t('Deposit') }}
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>

              <v-card class="mt-15 mx-auto" elevation="3">
                <v-card-text class="pt-0">
                  <v-sheet
                      class="v-sheet--offset pa-5 text-center white--text float-left default-gradient"
                      elevation="5"
                  >
                    <v-icon color="white" x-large>
                      mdi-file-document-outline
                    </v-icon>
                    {{ $t('Active proposals') }}
                  </v-sheet>

                  <div class="clear-both"></div>

                  <v-simple-table class="mt-2">
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="text-left">
                          {{ $t('Address') }}
                        </th>
                        <th class="text-center">
                          {{ $t('Votes') }}
                        </th>
                        <th class="text-center">
                          {{ $t('Actions') }}
                        </th>
                      </tr>
                      </thead>
                      <tbody v-if="padawan">
                      <tr
                          v-for="(item, key) in padawan.activeProposals"
                          :key="key"
                      >
                        <td class="text-left">{{ key }}</td>
                        <td class="text-center">{{ item.votes }}</td>
                        <td class="text-center">
                          <v-btn color="#009398" text @click="$router.push({name: 'proposals.show', params: {proposalId: key}})">
                            {{ $t('Explore') }}
                          </v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </template>
            <template v-else-if="!deployPadawanLoading">
              <v-alert prominent icon="mdi-school" elevation="3" dark dense type="info">
                <v-row align="center">
                  <v-col class="grow">
                    {{ $t('To vote, you need to create an account to which you can transfer tokens.') }}
                  </v-col>
                  <v-col class="shrink">
                    <v-btn depressed @click="deployPadawan">{{ $t('Deploy account') }}</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </template>
            <template v-else-if="deployPadawanLoading">
              <v-progress-linear
                  indeterminate
                  color="#009398"
              ></v-progress-linear>
            </template>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog
          v-model="depositDialog"
          width="500"
      >
        <v-card>
          <v-card-title class="default-gradient">
            {{ $t('Deposit') }}
          </v-card-title>

          <v-card-text class="mt-5 pb-0">
            <v-text-field
                :label="$t('Amount')"
                v-model="depositAmount"
                color="#009398"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="#009398"
                text
                @click="deposit(); depositDialog = false"
            >
              {{ $t('Deposit') }}
            </v-btn>
            <v-btn
                color="#009398"
                text
                @click="depositDialog = false"
            >
              {{ $t('Cancel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-dialog
          v-model="reclaimDialog"
          width="500"
      >
        <v-card>
          <v-card-title class="default-gradient">
            {{ $t('Reclaim') }}
          </v-card-title>

          <v-card-text class="mt-5 pb-0">
            <v-text-field
                :label="$t('Amount')"
                v-model="reclaimAmount"
                color="#009398"
            ></v-text-field>

            <v-text-field
                :label="$t('To')"
                v-model="reclaimTo"
                color="#009398"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="#009398"
                text
                @click="reclaim(); reclaimDialog = false"
            >
              {{ $t('Reclaim') }}
            </v-btn>
            <v-btn
                color="#009398"
                text
                @click="reclaimDialog = false"
            >
              {{ $t('Cancel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "../layouts/BaseLayout";
import Vue from "vue";
import TONCrystalWallet from "@/extensions/TONCrystalWallet";
import Padawan from "@/models/padawan";

export default {
  components: {BaseLayout},
  data: () => ({
    depositAmount: null,
    depositAddress: null,
    depositDialog: false,

    reclaimDialog: false,
    reclaimTo: null,
    reclaimAmount: null,
    reclaimVoteProvider: null,

    deployPadawanLoading: false,
  }),
  computed: {
    extension: function() {
      return Vue.prototype.$extension;
    },
    padawan: function () {
      return Padawan.query().where('owner', Vue.prototype.$extension.getAddress()).first();
    },
  },
  methods: {
    auth: async function (ext) {
      if (ext === 'TONCrystalWallet') {
        Vue.prototype.$extension = await new TONCrystalWallet();
        if (Vue.prototype.$extension.getAddress()) {
          localStorage.setItem('extension', 'TONCrystalWallet');
          location.replace('/');
        } else {
          location.replace('/');
        }
      }
    },
    logout: function () {
      localStorage.removeItem('extension');
      location.replace('/');
    },
    deposit: function () {
      if (this.depositAddress === '0:0000000000000000000000000000000000000000000000000000000000000000') {
        Vue.prototype.$smv.depositTonsToPadawan(this.padawan.id, parseFloat(this.depositAmount)).then(async () => {
          this.depositAmount = null;
          //todo correct delay
          await Vue.prototype.$delay(30000);
          await Padawan.update({
            where: this.padawan.id,
            data: {
              balances: await Vue.prototype.$smv.getPadawanBalance(this.padawan.id),
            }
          });
        });
      }
    },
    reclaim: function () {
      Vue.prototype.$smv.reclaimDeposit(this.padawan.id, this.reclaimVoteProvider, this.reclaimAmount, this.reclaimTo).then(async () => {
        //todo correct delay
        await Vue.prototype.$delay(30000);
        await Padawan.update({
          where: this.padawan.id,
          data: {
            balances: await Vue.prototype.$smv.getPadawanBalance(this.padawan.id),
          }
        });
      });
    },
    deployPadawan: async function () {
      this.deployPadawanLoading = true;
      await Vue.prototype.$smv.deployPadawan();
      await Vue.prototype.$delay(10000);
      await Padawan.update({
        where: this.padawan.id,
        data: {
          balances: [],
          tokenAccounts: [],
          activeProposals: [],
          active: true,
        }
      });
      this.deployPadawanLoading = false;
    }
  }
}
</script>

<style scoped>
  .depositInput {
    width: 100px;
    display: inline-block;
    text-align: center;
  }
</style>