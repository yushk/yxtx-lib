import SvgItem from '../svgedit/components/SvgComponents.vue'

/* istanbul ignore next */
SvgItem.install = function(Vue) {
  Vue.component(SvgItem.name, SvgItem)
}

export default SvgItem
