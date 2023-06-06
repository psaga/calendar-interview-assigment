import Vue from 'vue'
import App from '@/views/App/App.vue';
import { router, store } from '@/utils';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Notifications from "vue-notification";
import Vuex from "vuex";


// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './styles.scss'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuex);
Vue.use(Notifications);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
