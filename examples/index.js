import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import routes from './route.config';
Vue.config.productionTip = false;
import Yxtx from 'main/index.js';
Vue.use(Yxtx);
Vue.use(VueRouter);
import ElementUI from 'element-ui';
import 'packages/theme-chalk/src/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';
import icon from './icon.json';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.prototype.$icon = icon; // Icon 列表页用

// import ECharts from 'vue-echarts';
// Vue.component('VChart', ECharts);
import demoBlock from './components/demo-block';
// import MainFooter from './components/footer';
import MainHeader from './components/header';
import SideNav from './components/side-nav';
// import FooterNav from './components/footer-nav';

Vue.component('demo-block', demoBlock);
// Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
// Vue.component('footer-nav', FooterNav);

// import Fragment from 'vue-fragment';
// Vue.use(Fragment.Plugin);

// import coms from 'main/assets/json/InterfaceReturn.json';
// coms.forEach((e) => {
//   let com1 = Vue.extend({
//     props: e.props,
//     template: `<fragment>${e.template}</fragment>`
//   });
//   Vue.component(e.type, com1);
// });

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App)
});
