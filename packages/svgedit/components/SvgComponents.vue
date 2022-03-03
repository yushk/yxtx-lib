<!--
 * @Author: yaolunmao
-->
<template>
  <component :is="componentProp.type" :prop_data="componentProp"></component>
</template>
<script>
  import { use } from 'echarts/core'
  import { SVGRenderer } from 'echarts/renderers'
  import { PieChart, BarChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  } from 'echarts/components'
  import { THEME_KEY } from 'vue-echarts'
  use([
    SVGRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    BarChart,
  ])
  export default {
    components: {},
    provide: {
      [THEME_KEY]: 'dark',
    },
    props: {
      svgInfoData: {
        type: Array,
        default: function () {
          return []
        },
      },
      componentProp: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data() {
      return {
        componentTag: '',
      }
    },
    created() {
      // this.svgInfoData.forEach((f) => {
      //   let componentInfo = {
      //     template: f.template,
      //     props: f.props,
      //   }
      //   importComponents[f.type] = componentInfo
      // })
    },
    methods: {},
  }
</script>
<style scoped></style>
