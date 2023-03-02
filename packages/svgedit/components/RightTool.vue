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
              :min="0.1"
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
                    <el-form-item
            v-if="selectSvgInfo.width"
            label="宽度"
          >
            <el-input-number
              v-model="selectSvgInfo.width"
              :min="0"
            />
          </el-form-item>

          <el-form-item
            v-if="selectSvgInfo.height"
            label="高度"
          >
            <el-input-number
              v-model="selectSvgInfo.height"
              :min="0"
            />
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
  name: 'RightTool',
  props: {
    svgInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    selectSvgInfo() {
      return this.svgInfo;
    }
  },
  watch: {
    'selectSvgInfo.tableRowCount': function(newVal) {
      this.$emit(
        'setTableAttr',
        this.selectSvgInfo.id,
        newVal,
        this.selectSvgInfo.tableColCount
      );
    },
    'selectSvgInfo.tableColCount': function(newVal) {
      this.$emit(
        'setTableAttr',
        this.selectSvgInfo.id,
        this.selectSvgInfo.tableRowCount,
        newVal
      );
    }
  },
  mounted() {
    console.log('right panel this.selectSvgInfo', this.selectSvgInfo);
  }
};
</script>

