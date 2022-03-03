import SvgPreview from './components/main.vue'

/* istanbul ignore next */
SvgPreview.install = function(Vue) {
  Vue.component(SvgPreview.name, SvgPreview)
}

export default SvgPreview
