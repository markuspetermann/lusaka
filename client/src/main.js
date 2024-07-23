import Vue from "vue";
import router from "./router";
import axios from "axios";
import VueMoment from "vue-moment";

import lusaka from "./lusaka.vue";

Vue.config.productionTip = false;

if(process.env.VUE_APP_DEV) { // development build
  axios.defaults.baseURL = "http://localhost:3002";
  axios.defaults.withCredentials = true;
} else { // production build
  Vue.config.silent = true;
  axios.defaults.baseURL = window.location.origin;
}

Vue.prototype.$http = axios;
Vue.prototype.$filters = Vue.options.filters;
Vue.use(VueMoment);

Vue.filter("formatname", n => n.replace(/__/g," / ").replace(/_/g," ").replace(/#/g,"_"));

new Vue({
  router,
  render: h => h(lusaka),
}).$mount("#app")
