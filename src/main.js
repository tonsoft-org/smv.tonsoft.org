import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import TONCrystalWallet from "@/extensions/TONCrystalWallet";
import {/*abiContract, */TonClient} from "@tonclient/core";
import {libWeb} from "@tonclient/lib-web";

Vue.config.productionTip = false;

TonClient.useBinaryLibrary(libWeb);
Vue.prototype.$client = new TonClient({network: { server_address: localStorage.getItem('server_address') || 'net.ton.dev' }});
Vue.prototype.$delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  if (localStorage.getItem('extension') === "TONCrystalWallet") {
    Vue.prototype.$extension = await new TONCrystalWallet();
    //todo
    if (!Vue.prototype.$extension.getAddress()) {
      Vue.prototype.$extension = null;
    }
  } else {
    Vue.prototype.$extension = null;
  }

  new Vue({
    el: "#app",
    router,
    store,
    vuetify,
    i18n,
    render: h => h(App)
  });
})();