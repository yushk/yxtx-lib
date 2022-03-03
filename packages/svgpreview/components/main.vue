<template>
  <div style="overflow: auto; position: relative">
    <!-- <div class="svg-contain"> -->
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1920 1080"
      :style="{ backgroundColor: bg.svgColor }"
      :width="bg.width"
      :height="bg.height"
    >
      <defs />
      <g
        v-for="item in svgLists"
        :id="item.id"
        :key="item.id"
        :title="item.title"
        :transform="
          'translate(' +
            item.svgPositionX +
            ',' +
            item.svgPositionY +
            ')' +
            'rotate(' +
            item.angle +
            ')' +
            'scale(' +
            item.size +
            ')'
        "
      >
        <SvgComponents
          :component-prop="item"
          :svg-info-data="svgInfoData"
        />
      </g>
    </svg>
  </div>
</template>
<script>
import SvgComponents from '../../svgcomponents';
export default {
  name: 'SvgPreview',
  components: { SvgComponents },
  data() {
    return {
      svgLists: [],
      bg: {
        height: '100%',
        width: '100%',
        svgColor: '#000000'
      },
      svgInfoData: [],
      analogDataTimer: '', // 模拟数据定时器
      userInfo: '',
      editable: false
    };
  },
  created() {
    var data = JSON.parse(localStorage.getItem('svginfo'));
    this.bg = Object.assign(this.bg, data.bg);
    this.svgLists = data.items;
  },
  methods: {
    /**
       * @description: 此方法仅为演示使用 真正修改组件数据请判断data_type属性
       * @param {*}
       * @return {*}
       */
    testF() {
      // 找出所有断路器
      const anyCircuitBreakerList = this.svgLists.filter(
        (f) => f.type == 'CircuitBreakerSvg'
      );
      // 找出所有的电线开关
      const anyWireBreakList = this.svgLists.filter(
        (f) => f.type == 'WireBreakOnSvg' || f.type == 'WireBreakOffSvg'
      );
      // 找到所有饼图
      const anyEchartsPieList = this.svgLists.filter(
        (f) => f.type == 'EchartsPieSvg'
      );
      // 找到所有柱状图
      const anyEchartsBasicBarSvgList = this.svgLists.filter(
        (f) => f.type == 'EchartsBasicBarSvg'
      );
      this.analogDataTimer = setInterval(function() {
        anyCircuitBreakerList.forEach((anyCircuitBreaker) => {
          // 生成一个随机数
          const random = Math.round(Math.random() * 10);
          if (random < 5) {
            anyCircuitBreaker.svgColor = '#00FF00';
          } else {
            anyCircuitBreaker.svgColor = '#FF0000';
          }
        });
        anyWireBreakList.forEach((anyWireBreak) => {
          // 生成一个随机数
          const random = Math.round(Math.random() * 10);
          if (random < 5) {
            anyWireBreak.type = 'WireBreakOnSvg';
            anyWireBreak.svgColor = '#00FF00';
          } else {
            anyWireBreak.type = 'WireBreakOffSvg';
            anyWireBreak.svgColor = '#FF0000';
          }
        });
        anyEchartsPieList.forEach((anyEchartsPie) => {
          anyEchartsPie.echartsOption.series[0].data.forEach((f) => {
            // 生成一个随机数
            const random = Math.round(Math.random() * 100);
            f.value = random;
          });
        });
        anyEchartsBasicBarSvgList.forEach((anyEchartsBasicBar) => {
          const data_arr = [
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300),
            Math.round(Math.random() * 300)
          ];
          anyEchartsBasicBar.echartsOption.series[0].data = data_arr;
        });
      }, 2000);
    },
    testG() {
      clearInterval(this.analogDataTimer);
    }
  }
};
</script>
<style scoped lang="scss">
  .svg-contain {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .btns-content {
    position: fixed;
    left: 10px;
    bottom: 10px;
    button {
      margin-right: 10px;
    }
  }
</style>
