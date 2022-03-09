<template>
  <div class="components-layout-left leftNav">
    <!-- <a-input-search placeholder="搜索组件" /> -->
    <el-collapse
      v-model="activeKey"
      accordion
    >
      <el-collapse-item
        key="1"
        title="拖动组件"
      >
        <ul class="svg-nav-list">
          <li
            v-for="item in draggableComponentList"
            :key="item.type"
          >
            <div class="title">{{ item.title }}</div>
            <img
              :title="item.title"
              :src="item.priview_img"
              draggable="draggable"
              @mousedown="
                Mousedown(
                  item.type,
                  item.title,
                  item.default_attr,
                  item.create_type
                )
              "
            >
          </li>
        </ul>
      </el-collapse-item>
      <el-collapse-item
        key="2"
        title="绘制组件"
        :disabled="false"
      >
        <ul class="svg-nav-list">
          <li
            v-for="item in drawComponentList"
            :key="item.type"
            :class="
              CurrentlySelectedToolBar.Type == item.type
                ? 'toolbar-selected'
                : ''
            "
          >
            <div class="title">{{ item.title }}</div>
            <img
              :title="item.title"
              :src="item.priview_img"
              @mousedown="
                Mousedown(
                  item.type,
                  item.title,
                  item.default_attr,
                  item.create_type
                )
              "
            >
          </li>
        </ul>
      </el-collapse-item>
            <el-collapse-item
        key="3"
        title="方法"
        :disabled="false"
      >
        <ul class="svg-nav-list">
          <li @click="inlineMethods('preview')" >预览</li>
          <li @click="inlineMethods('add')" >添加组件</li>
          <li @click="inlineMethods('exportsvg')" >导出svg</li>
          <li @click="inlineMethods('exportjson')" >导出数据</li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'LeftTool',
  props: {
    svgInfoData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    CurrentlySelectedToolBar: {
      type: Object,
      default: function() {
        return {
          Type: '', // 选中的工具栏svg类型
          TypeName: '', // 选中的工具栏svg类型名称
          Title: '', // 选中的工具栏svg标题
          Color: '', // 选中的工具栏svg颜色
          CreateType: '', // 选中工具栏的创建方式
          EChartsOption: '' // 选中工具栏的图表默认option
        };
      }
    }
  },
  data() {
    return {
      activeKey: ['1'], // 当前激活的key
      text: '这里是预留位置.',
      draggableComponentList: [], // 拖动组件
      drawComponentList: [], // 绘制类型组件
      chartComponentList: [] // 图表类型
    };
  },
  computed: {

  },
  watch: {
    svgInfoData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.draggableComponentList = val.filter((m) => {
          return m.panel_class === 'draggable';
        });
        this.drawComponentList = val.filter((m) => {
          return m.panel_class === 'draw';
        });
        this.chartComponentList = val.filter((m) => {
          return m.panel_class === 'chart';
        });
      }
    }
  },
  mounted() {},
  methods: {
    /**
       * @description: 点击左侧工具栏触发函数
       * @param {*} type
       * @param {*} title
       * @param {*} default_attr 属性默认值
       * @param {*} create_type 组件创建方式
       * @return {*}
       */
    Mousedown(type, title, default_attr, create_type) {
      const CurrentlySelectedToolBar = {
        Type: type, // 选中的工具栏svg类型
        TypeName: title, // 选中的工具栏svg类型名称
        Title: title, // 选中的工具栏svg标题
        Color: default_attr.color, // 选中的工具栏svg颜色
        CreateType: create_type, // 选中工具栏的创建方式
        EChartsOption: default_attr.echarts_option
      };
      this.$emit('setCurrent', CurrentlySelectedToolBar);
    },
    /**
     * @desc 内置方法
     * @param {*} type
     * */
    inlineMethods(type) {
      this.$emit('inlineMethods', type);
    }
  }
};
</script>

