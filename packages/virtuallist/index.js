import VirtualList from './main.vue';

/* istanbul ignore next */
VirtualList.install = function(Vue) {
  Vue.component(VirtualList.name, VirtualList);
};

export default VirtualList;
