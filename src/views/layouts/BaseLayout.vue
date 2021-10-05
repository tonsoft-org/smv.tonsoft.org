<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app class="grey darken-4">
      <v-list dark>
        <v-list-item>
          <v-list-item-icon>
            <v-icon v-text="'mdi-diamond'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Free TON'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dark>
        <v-list-item-group v-model="model">
          <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="{name:item.link}"
              exact
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app elevation="1" color="white" height="80" class="d-lg-none">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer />
<!--      <span class="grey&#45;&#45;text">
        {{ smvAddress }}
      </span>-->
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="hidden-sm-and-down"
            :color="(extension) ? 'green' : 'red'"
            size="40"
            v-bind="attrs"
            v-on="on"
            @click="$router.push({name: 'account.index'})"
          >
            mdi-account
          </v-icon>
        </template>
        <span v-if="extension && extension.getAddress()">{{ extension.getAddress().substring(0, 5) }}...{{ extension.getAddress().substring(60) }}</span>
        <span v-else>{{ $t('Authorization required') }}</span>
      </v-tooltip>
    </v-app-bar>

    <v-main class="grey lighten-4 pt-0">
      <slot name="main"></slot>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

export default {
  name: "BaseLayout",

  data: () => ({
    smvAddress: Vue.prototype.$smv.getSMVAddress(),
    smvAddresses: [Vue.prototype.$smv.getSMVAddress()],
    drawer: null,
    items: [
      {
        icon: 'mdi-inbox',
        text: 'Dashboard',
        link: 'dashboard.index',
      },
      {
        icon: 'mdi-account',
        text: 'Account',
        link: 'account.index',
      },
      {
        icon: 'mdi-file-document-outline',
        text: 'Proposals',
        link: 'proposals.index',
      },
      {
        icon: 'mdi-hammer',
        text: 'SMV Builder',
        link: 'smv.build',
      },
      {
        icon: 'mdi-cog',
        text: 'Settings',
        link: 'settings.index',
      },
    ],
    model: 0,
  }),
  created() {},
  computed: {
    extension: function() {
      return Vue.prototype.$extension;
    }
  },
};
</script>

<style>
.clear-both {
  clear: both;
}

.default-gradient-color {
  color: #02AAB0 !important;
}

.default-gradient-bg-color {
  background-color: #02AAB0 !important;
}

.default-gradient-bg {
  background-color: #02AAB0 !important;
  background-image: linear-gradient(to right, #02AAB0 0%, #00CDAC  51%, #02AAB0  100%) !important;
}

.default-gradient {
  background-color: #02AAB0;
  background-image: linear-gradient(to right, #02AAB0 0%, #00CDAC  51%, #02AAB0  100%) !important;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  font-size: 22px !important;
}
.default-gradient:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;
}
</style>