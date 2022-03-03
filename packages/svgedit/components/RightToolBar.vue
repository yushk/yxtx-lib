<!--
 * @Author: yaolunmao
-->
<template>
  <div class="rightNav">
    <el-tabs
      type="card"
      class="components-layout-right"
    >
      <el-tab-pane
        key="1"
        label="外观"
      >
        <el-form
          layout="horizontal"
          label-width="70px"
          label-align="left"
        >
          <el-form-item
            v-if="selectSvgInfo.id"
            label="id"
          >
            <span>{{ selectSvgInfo.id }}</span>
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.typeName"
            label="类型"
          >
            <span>{{ selectSvgInfo.typeName }}</span>
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.title"
            label="名称"
          >
            <el-input
              v-model="selectSvgInfo.title"
              placeholder="请输入组件名称"
            />
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.svgPositionX"
            label="X轴坐标"
          >
            <el-input-number
              v-model="selectSvgInfo.svgPositionX"
              :min="0"
              :max="1920"
            />
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.svgPositionY"
            label="Y轴坐标"
          >
            <el-input-number
              v-model="selectSvgInfo.svgPositionY"
              :min="0"
              :max="1080"
            />
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.svgColor"
            label="颜色"
          >
            <input
              v-model="selectSvgInfo.svgColor"
              type="color"
            >
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.size"
            label="大小"
          >
            <el-input-number
              v-model="selectSvgInfo.size"
              :min="1"
              :max="3000"
              :step="0.1"
            />
          </el-form-item>
          <el-form-item
            v-if="selectSvgInfo.angle"
            label="旋转"
          >
            <el-input-number
              v-model="selectSvgInfo.angle"
              :min="0"
              :max="360"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn-sure"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        key="2"
        label="数据"
      >
        <div class="bg-code">{{ selectSvgInfo }}</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'YxRightToolBar',
  props: {
    svgInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    selectSvgInfo() {
      return this.svgInfo
    }
  },
  watch: {
    'selectSvgInfo.tableRowCount': function(newVal) {
      this.$emit(
        'setTableAttr',
        this.selectSvgInfo.id,
        newVal,
        this.selectSvgInfo.tableColCount
      )
    },
    'selectSvgInfo.tableColCount': function(newVal) {
      this.$emit(
        'setTableAttr',
        this.selectSvgInfo.id,
        this.selectSvgInfo.tableRowCount,
        newVal
      )
    }
  },
  mounted() {
    console.log('right panel this.selectSvgInfo', this.selectSvgInfo)
  }
}
</script>
<style scoped lang="scss">
  .rightNav {
    width: 100%;
    overflow: auto;
    // margin: 0 20px;
    .bg-code {
      background: #444;
      color: #fff;
      width: calc(100% - 20px);
      // margin: 20px 10px;
      border-radius: 4px;
      // padding: 10px;
    }
  }
  .components-layout-right {
    .ant-tabs-bar {
      margin-bottom: 0 !important;
    }
    .ant-form-item-label {
      width: 100px !important;
      flex-shrink: 0;
    }
    .ant-input-number,
    input {
      width: 160px;
      border-radius: 4px;
      border-color: #ddd;
    }
    .ant-form-item-control {
      line-height: 24px !important;

      p {
        margin-bottom: 0 !important;
      }
    }

    .ant-form-item {
      display: flex;
      align-items: center;
      flex-flow: nowrap;
      position: relative;
      margin-bottom: 0;
      padding: 8px 0;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 15px;
        right: 15px;
        bottom: 0;
        height: 1px;
      }

      &:last-child::after {
        content: unset;
      }
    }
  }
  .btn-sure {
    width: 100px;
    // margin: 20px;
  }
</style>
