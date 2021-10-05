import Vue from 'vue'
import Vuex from 'vuex'
import SMV from "@/models/smv";
import VuexORM from '@vuex-orm/core'
import Padawan from "@/models/padawan";
import Proposal from "@/models/proposal";

Vue.use(Vuex);
const database = new VuexORM.Database();
database.register(SMV);
database.register(Padawan);
database.register(Proposal);

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  modules: {}
})
