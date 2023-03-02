<template>
  <component :is="componentProp.type" :prop_data="componentProp"></component>
</template>
<script>
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart
]);
export default {
  name: 'SvgItem',
  props: {
    svgInfoData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    componentProp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      componentTag: ''
    };
  },
  beforeCreate() {
    // try {
    //   this.svgInfoData.forEach((f) => {
    //     let componentInfo = Vue.extend({
    //       template: `<fragment>${f.template}</fragment>`,
    //       props: f.props
    //     });
    //     Vue.component(f.type, componentInfo);
    //     // importComponents[f.type] = componentInfo;
    //   });
    // } catch (e) {
    //   console.log('error', e);
    // }
  },
  created() {

  },
  methods: {}
};
</script>
