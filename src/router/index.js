import Vue from 'vue'
import Router from 'vue-router'
import Lab from '@/components/Lab'
import Main2048 from '@/components/Main2048'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lab',
      component: Lab
    },
    {
      path: '/2048',
      name: 'Main2048',
      component: Main2048
    }
  ]
})
