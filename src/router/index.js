import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardIndex from "@/views/Dashboard/DashboardIndex";
import AccountIndex from "@/views/Account/AccountIndex";
import ProposalsIndex from "@/views/Proposals/ProposalsIndex";
import ProposalsShow from "@/views/Proposals/ProposalsShow";
import SMVBuild from "@/views/SMV/SMVBuild";
import SettingsIndex from "@/views/Settings/SettingsIndex";
import ProposalsCreate from "@/views/Proposals/ProposalsCreate";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard.index',
    component: DashboardIndex
  },
  {
    path: '/account',
    name: 'account.index',
    component: AccountIndex
  },
  {
    path: '/proposals',
    name: 'proposals.index',
    component: ProposalsIndex
  },
  {
    path: '/proposals/create',
    name: 'proposals.create',
    component: ProposalsCreate
  },
  {
    path: '/proposals/:proposalId',
    name: 'proposals.show',
    component: ProposalsShow,
    props: true,
  },
  {
    path: '/smv/build',
    name: 'smv.build',
    component: SMVBuild
  },
  {
    path: '/settings',
    name: 'settings.index',
    component: SettingsIndex
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
