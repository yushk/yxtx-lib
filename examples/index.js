import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import routes from './route.config';
Vue.config.productionTip = false;
import Yxtx from 'main/index.js';
Vue.use(Yxtx);
Vue.use(VueRouter);
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// import ECharts from 'vue-echarts';
// Vue.component('VChart', ECharts);
// import demoBlock from './components/demo-block';
// import MainFooter from './components/footer';
import MainHeader from './components/header';
// import SideNav from './components/side-nav';
// import FooterNav from './components/footer-nav';

// Vue.component('demo-block', demoBlock);
// Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
// Vue.component('side-nav', SideNav);
// Vue.component('footer-nav', FooterNav);

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
