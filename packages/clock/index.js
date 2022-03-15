import Clock from './main.vue';

/* istanbul ignore next */
Clock.install = function(Vue) {
  Vue.component(Clock.name, Clock);
};

export default Clock;
