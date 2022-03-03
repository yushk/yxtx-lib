<template>
  <div id="components-layout">
    <div class="pageMain">
      <div class="pageMain-left">
        <LeftToolBar :svg-info-data="svgInfoData" />
        <div class="pageMain-left-tools">
          <span>画布宽度：</span>
          <el-input-number v-model="Bg.width" />
          <span>画布高度：</span>
          <el-input-number v-model="Bg.height" />
          <el-button
            style="width: 100px; margin-bottom: 5px"
            type="primary"
            @click="testA"
          >
            载入模板
          </el-button>
          <el-button
            style="width: 100px; margin-bottom: 5px"
            type="primary"
            @click="testH"
          >
            预览
          </el-button>
          <el-button
            style="width: 100px; margin-bottom: 5px"
            type="primary"
            @click="showAddSvgModal"
          >
            添加组件
          </el-button>
          <el-button
            style="width: 100px; margin-bottom: 5px"
            type="primary"
            @click="exportSvg"
          >
            导出svg
          </el-button>
          <el-button
            style="width: 100px; margin-bottom: 5px"
            type="primary"
            @click="exportData"
          >
            导出数据
          </el-button>
        </div>
      </div>
      <div class="centerContain">
        <div
          ref="canvas"
          class="canvansDiv"
          :style="{
            transform: `scale(${Bg.size}) translate(${Bg.x} ,${Bg.y})`,
            height: Bg.height + 'px',
            width: Bg.width + 'px',
          }"
          @mousemove="MouseMove"
          @mousedown="MousedownCanvas"
          @mouseup="MouseupCanvas"
          @dblclick="DblClick"
          @mousewheel="MouseWheel"
        >
          <!--拖动辅助线-->
          <div
            id="guide-x"
            ref="guidex_dom"
            :style="'border-top: ' + 1 / Bg.size + 'px dashed #55f'"
          />
          <div
            id="guide-y"
            ref="guidey_dom"
            :style="'border-left: ' + 1 / Bg.size + 'px dashed #55f'"
          />
          <!-- 画布 -->
          <svg
            id="svgCanvas"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            :style="{ backgroundColor: Bg.svgColor }"
            :width="Bg.width"
            :height="Bg.height"
            @mousedown="mouseDownBg"
          >
            <defs />
            <filter
              id="solid"
              x="0"
              y="0"
              width="1"
              height="1"
            >
              <feFlood flood-color="rgb(255,255,255)" />
              <feComposite in="SourceGraphic" />
            </filter>
            <g
              v-for="(item, index) in svgLists"
              :id="item.id"
              :key="item.id"
              style="cursor: pointer"
              :class="
                selectSvgInfo.id === item.id ? 'topo-layer-view-selected' : ''
              "
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
              @mousedown="
                MousedownSvg(
                  item.id,
                  index,
                  item.svgPositionX,
                  item.svgPositionY,
                  $event
                )
              "
            >
              <SvgComponents
                :component-prop="item"
                :svg-info-data="svgInfoData"
              />
            </g>
          </svg>
        </div>
      </div>
      <RightToolBar
        :svg-info="selectSvgInfo"
        style="width: 300px; flex: 0 0 auto"
        @setTableAttr="setTableAttr"
      />
    </div>
    <el-dialog
      :visible.sync="addSvgVisible"
      title="模拟添加组件"
      @ok="addSvgHandleOk"
    >
      <el-form layout="horizontal">
        <el-form-item label="类型">
          <el-input
            v-model="testAddSvg.type"
            placeholder="请输入组件类型"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="testAddSvg.title"
            placeholder="请输入组件标题"
          />
        </el-form-item>
        <el-form-item label="svg代码">
          <el-input
            v-model="testAddSvg.template"
            placeholder="请输入svg代码"
          />
        </el-form-item>
        <el-form-item label="默认颜色">
          <input
            v-model="testAddSvg.default_attr.color"
            type="color"
          >
        </el-form-item>
        <el-form-item label="预览图像">
          <el-input
            v-model="testAddSvg.priview_img"
            placeholder="请输入预览图像地址"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import LeftToolBar from './components/LeftToolBar.vue';
import RightToolBar from './components/RightToolBar.vue';
import SvgComponents from './components/SvgComponents.vue';
import coms from 'main/assets/json/InterfaceReturn.json';
import example from 'main/assets/json/example.json';
import { mapGetters } from 'vuex';
import { GenUUid } from 'main/utils/UCore.js';
export default {
  name: 'YxSvgEdit',
  components: { LeftToolBar, RightToolBar, SvgComponents },
  data() {
    return {
      testAddSvg: {
        type: 'testAddSvg',
        title: '测试新增组件',
        panel_class: 'draggable',
        template:
            '<path :fill="prop_data.svgColor" :stroke="prop_data.svgColor" stroke-width="5" style="pointer-events:inherit" d="m143.72081869586242,163.35565803158485 c14.617751633754164,-41.93617271978648 71.89058180534832,0 0,53.91793635401125 c-71.89058180534832,-53.91793635401125 -14.617751633754164,-95.85410907379776 0,-53.91793635401125 z"  fill-opacity="1" stroke-opacity="1" transform="translate(-145,-180)"></path>',
        props: ['prop_data'],
        default_attr: {
          color: '#FF0000'
        },
        create_type: 'draggable',
        priview_img: 'https://svg.yaolunmao.top/test.png'
      },
      addSvgVisible: false,
      versionModelVisible: false,
      svgInfoData: [], // 接口获取到的组件数据
      shrink: true, // 收缩状态  true收缩  false展开
      svgLists: [], // svg列表
      // 鼠标位置
      mousePosition: {
        positionX: '',
        positiony: ''
      },
      selectSvg: {
        // 要移动的svg
        ID: '',
        Index: 0,
        mPositionX: 0, // 选中svg时鼠标的x轴坐标
        mPositionY: 0, // 选中svg时鼠标的y轴坐标
        pointX: 0, // 选中svg时svg的x轴坐标
        pointY: 0 // 选中svg时svg的y轴坐标
      },
      mouseStatus: 0, // 鼠标状态 1按下； 0弹起
      selectSvgInfo: {},
      clickType: '', // 鼠标点击行为
      Bg: {
        x: 0,
        y: 0,
        height: 833,
        width: 1920,
        svgColor: '#000000',
        size: 1 // 缩放倍数
      },
      ctrlDown: false
    };
  },
  computed: {
    ...mapGetters({
      CurrentlySelectedToolBar: 'svg/CurrentlySelectedToolBar'
    })
  },
  created() {
    const _this = this;
    // 当前页面监视键盘输入
    document.onkeydown = function(e) {
      // 事件对象兼容
      const e1 = e || window.event || arguments.callee.caller.arguments[0];
      // ctrl  按下
      if (e1 && e1.ctrlKey) {
        _this.ctrlDown = true;
        e.preventDefault();
        return;
      }
      // 获取当前选中组件
      const selectSvgInfo = _this.selectSvgInfo;
      if (Object.keys(selectSvgInfo).length === 0) {
        return;
      }
      // 键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      if (e1 && e1.keyCode === 37) {
        e.preventDefault();
        selectSvgInfo.svgPositionX -= 1;
      } else if (e1 && e1.keyCode === 38) {
        e.preventDefault();
        selectSvgInfo.svgPositionY -= 1;
      } else if (e1 && e1.keyCode === 39) {
        e.preventDefault();
        selectSvgInfo.svgPositionX += 1;
      } else if (e1 && e1.keyCode === 40) {
        e.preventDefault();
        selectSvgInfo.svgPositionY += 1;
      } else if (e1 && e1.ctrlKey && e1.keyCode === 67) {
        // ctrl  c
        e.preventDefault();
        const copySvgInfoStr = JSON.stringify(selectSvgInfo);
        const copySvgInfo = JSON.parse(copySvgInfoStr);
        copySvgInfo.id = GenUUid();
        copySvgInfo.svgPositionX = selectSvgInfo.svgPositionX + 10;
        copySvgInfo.svgPositionY = selectSvgInfo.svgPositionY + 10;
        _this.svgLists.push(copySvgInfo);
        _this.selectSvgInfo = copySvgInfo;
      } else if (e1 && e1.keyCode === 46) {
        e.preventDefault();
        // 根据当前id找到当前元素的index
        const selectSvgIndex = _this.svgLists.indexOf(
          _this.svgLists.filter((f) => f.id === selectSvgInfo.id)[0]
        );
        _this.svgLists.splice(selectSvgIndex, 1);
      }
    };
    document.onkeyup = function(e) {
      _this.ctrlDown = false;
    };
    console.log('coms', coms);
    // 请求接口获取组件
    this.svgInfoData = coms;
  },
  mounted() {
    const _this = this;
    var doc = document.getElementById('main-container');
    this.Bg = Object.assign(this.Bg, {
      height: doc.clientHeight,
      width: doc.clientWidth
    });
    this.$nextTick(() => {
      const canvasdiv = _this.$refs.canvas;
      canvasdiv.addEventListener(
        'dragover',
        function(e) {
          e.preventDefault();
        },
        false
      );
      canvasdiv.addEventListener(
        'drop',
        function(e) {
          e.preventDefault();
          if (
            _this.CurrentlySelectedToolBar.Type === '' ||
              _this.CurrentlySelectedToolBar.CreateType !== 'draggable'
          ) {
            return;
          }
          const eChartsOption = _this.CurrentlySelectedToolBar.EChartsOption;
          // 根据类型和鼠标位置创建组件
          const svgItem = {
            id: GenUUid(),
            title: _this.CurrentlySelectedToolBar.Title,
            type: _this.CurrentlySelectedToolBar.Type,
            typeName: _this.CurrentlySelectedToolBar.TypeName,
            svgColor: _this.CurrentlySelectedToolBar.Color,
            svgPositionX: e.offsetX,
            svgPositionY: e.offsetY,
            echartsOption: eChartsOption ? JSON.parse(eChartsOption) : '',
            size: 1,
            angle: 0
            // translate:`translate(${this.mousePosition.positionX},${this.mousePosition.positionY})`
          };
          console.log('svgItem', svgItem);
          _this.svgLists.push(svgItem);
          _this.selectSvgInfo = svgItem;
        },
        false
      );
    });
  },
  methods: {
    showAddSvgModal() {
      this.addSvgVisible = true;
    },
    addSvgHandleOk() {
      this.svgInfoData[this.svgInfoData.length] = this.testAddSvg;
      this.addSvgVisible = false;
    },
    versionModelHandleOk() {
      this.versionModelVisible = false;
    },
    exportSvg() {
      let exportStr = document.querySelector('#svgCanvas').outerHTML;
      exportStr = exportStr
        .replace('width="100%"', 'width="1920"')
        .replace('height="100%"', 'height="1080"');
      const datastr = 'data:text;charset=utf-8,' + encodeURIComponent(exportStr);
      const download = document.createElement('a');
      download.setAttribute('href', datastr);
      download.setAttribute('download', 'download.html');
      download.click();
      download.remove();
      console.log(exportStr);
    },
    exportData() {
      localStorage.setItem('svginfo', JSON.stringify(this.svgLists));
      const datastr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(this.svgLists));
      const download = document.createElement('a');
      download.setAttribute('href', datastr);
      download.setAttribute('download', 'download.json');
      download.click();
      download.remove();
      console.log(JSON.stringify(this.svgLists));
    },
    MouseMove(e) {
      const _this = this;

      if (this.clickType === 'draggable') {
        if (this.mouseStatus === 0) {
          return;
        }
        const { clientX, clientY } = e;
        // console.log(e.offsetX,e.offsetY);
        // let svgID = this.svgLists[this.selectSvg.Index].id;
        const svgID = this.selectSvg.ID;
        // 排除当前元素剩下的所有svg元素的列表
        const anyPositionList = this.svgLists.filter(function(list) {
          return list.id !== svgID;
        });
        // 将要移动的元素坐标设备为鼠标坐标
        let svgPositionX = this.selectSvg.pointX;
        let svgPositionY = this.selectSvg.pointY;
        svgPositionX += (clientX - this.selectSvg.mPositionX) / this.Bg.size;
        svgPositionY += (clientY - this.selectSvg.mPositionY) / this.Bg.size;
        setTimeout(function() {
          // 少于十个像素自动吸附
          // 从所有的x坐标列表中查与当前坐标少于10个像素的组件是否存在
          const exitsAdsorbX = anyPositionList.filter(function(list) {
            return (
              list.svgPositionX - svgPositionX > -10 &&
                list.svgPositionX - svgPositionX < 10
            );
          });
          if (exitsAdsorbX.length > 0) {
            svgPositionX = exitsAdsorbX[0].svgPositionX;
          }
          // y轴相同 横向坐标自动吸附
          const exitsAdsorbY = anyPositionList.filter(function(list) {
            return (
              list.svgPositionY - svgPositionY > -10 &&
                list.svgPositionY - svgPositionY < 10
            );
          });
          if (exitsAdsorbY.length > 0) {
            svgPositionY = exitsAdsorbY[0].svgPositionY;
          }
          _this.svgLists[_this.selectSvg.Index].svgPositionX = svgPositionX;
          _this.svgLists[_this.selectSvg.Index].svgPositionY = svgPositionY;
          // 从所有的x坐标列表中查当前坐标是否存在
          const exitsNowX = anyPositionList.filter(function(list) {
            return list.svgPositionX === svgPositionX;
          });
          if (exitsNowX.length > 0) {
            _this.$refs.guidey_dom.style.setProperty(
              'left',
              svgPositionX - 1 / _this.Bg.size + 'px'
            );
            _this.$refs.guidey_dom.style.display = 'inline';
          } else {
            _this.$refs.guidey_dom.style.display = 'none';
          }
          // 从所有的y坐标列表中查当前坐标是否存在
          const exitsNowY = anyPositionList.filter(function(list) {
            return list.svgPositionY === svgPositionY;
          });
          if (exitsNowY.length > 0) {
            _this.$refs.guidex_dom.style.setProperty(
              'top',
              svgPositionY - 1 / _this.Bg.size + 'px'
            );
            _this.$refs.guidex_dom.style.display = 'inline';
          } else {
            _this.$refs.guidex_dom.style.display = 'none';
          }
        }, 1);
      } else if (this.clickType === 'click') {
        if (this.mouseStatus === 0) {
          return;
        }
        this.selectSvgInfo.mPoint.endX = e.offsetX;
        this.selectSvgInfo.mPoint.endY = e.offsetY;
      }
    },
    MousedownCanvas(e) {
      console.log('MousedownCanvas');
      if (this.clickType === 'draggable') {
        return;
      }
      if (
        this.CurrentlySelectedToolBar &&
          this.CurrentlySelectedToolBar.CreateType === 'click'
      ) {
        // 根据类型和鼠标位置创建组件
        const svg_id = GenUUid();
        const svgItem = {
          id: svg_id,
          title: this.CurrentlySelectedToolBar.Title,
          type: this.CurrentlySelectedToolBar.Type,
          typeName: this.CurrentlySelectedToolBar.TypeName,
          svgColor: this.CurrentlySelectedToolBar.Color,
          svgPositionX: e.offsetX,
          svgPositionY: e.offsetY,
          mPoint: {
            startX: e.offsetX,
            startY: e.offsetY,
            endX: e.offsetX,
            endY: e.offsetY
          },
          size: 1,
          angle: 0
          // translate:`translate(${this.mousePosition.positionX},${this.mousePosition.positionY})`
        };
        this.svgLists.push(svgItem);
        this.selectSvgInfo = svgItem;
        this.mouseStatus = 1;
        this.clickType = 'click';
      }
    },
    MousedownSvg(id, index, pointX, pointY, e) {
      console.log('MousedownSvg');
      this.$store.dispatch('svg/clear');
      // 从数组里面根据index找到当前元素
      this.mouseStatus = 1;
      this.selectSvg.ID = id;
      this.selectSvg.Index = index;
      this.selectSvg.mPositionX = e.clientX;
      this.selectSvg.mPositionY = e.clientY;
      this.selectSvg.pointX = pointX;
      this.selectSvg.pointY = pointY;
      this.selectSvgInfo = this.svgLists[index];
      this.clickType = 'draggable';
      e.stopPropagation();
    },
    MouseupCanvas() {
      console.log('mouseup canvas');
      if (this.mouseStatus === 0) {
        return;
      }
      this.$refs.guidex_dom.style.display = 'none';
      this.$refs.guidey_dom.style.display = 'none';
      // if (this.$store.state.CurrentlySelectedToolBar.Type != '') {
      //   return;
      // }
      // this.selectSvg.ID = '';
      this.mouseStatus = 0;
      // this.clickType = '';
      if (this.clickType === 'draggable') {
        this.clickType = '';
      }
      if (this.clickType === 'click') {
        if (
          this.selectSvgInfo.mPoint.startX ===
              this.selectSvgInfo.mPoint.endX &&
            this.selectSvgInfo.mPoint.startY === this.selectSvgInfo.mPoint.endY
        ) {
          // 根据当前id找到当前元素的index
          const selectSvgIndex = this.svgLists.indexOf(
            this.svgLists.filter((f) => f.id === this.selectSvgInfo.id)[0]
          );
          this.svgLists.splice(selectSvgIndex, 1);
          this.selectSvg = {};
          this.selectSvgInfo = {};
        }
      }
      // this.$store.state.CurrentlySelectedToolBar = {};
    },
    MouseWheel(e) {
      // ctrl + mheel  页面缩放
      if (this.ctrlDown) {
        e.preventDefault();
        const svgZoom = e.deltaY < 0 ? 0.1 : -0.1;
        this.Bg.size += svgZoom;
        this.Bg.size = parseFloat(this.Bg.size.toFixed(1));
        if (this.Bg.size < 0) {
          this.Bg.size = 0;
        }
        return;
      }

      // 获取当前选中组件
      const selectSvgInfo = this.selectSvgInfo;
      if (Object.keys(selectSvgInfo).length === 0) {
        return;
      }
      e.preventDefault();
      // 判断滚轮方向 -100是往上滑 100是下滑
      const svgZoom = e.deltaY < 0 ? 0.1 : -0.1;
      selectSvgInfo.size += svgZoom;
      selectSvgInfo.size = parseFloat(selectSvgInfo.size.toFixed(1));
      if (selectSvgInfo.size < 1) {
        selectSvgInfo.size = 1;
      }
    },
    DblClick() {
      this.selectSvgInfo = {};
      this.$store.dispatch('svg/clear');
    },
    mouseDownBg() {
      console.log('mouseDownBg');
      this.selectSvgInfo = this.Bg;
    },
    testA() {
      // 载入模板
      this.Bg = example.bg;
      this.svgLists = example.items;
      // this.$axios
      //   .get('/example.json')
      //   .then(function (response) {
      //     // console.log(response.data);
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    testH() {
      localStorage.setItem(
        'svginfo',
        JSON.stringify({ bg: this.Bg, items: this.svgLists })
      );
      this.$router.push({
        path: '/personnelManagement/svg'
      });
    },
    // 设置表格属性
    setTableAttr(id, rowCount, colCount) {
      // 根据当前id找到当前表格的index
      const tableIndex = this.svgLists.indexOf(
        this.svgLists.filter((f) => f.id === id)[0]
      );
      if (tableIndex === -1) {
        return;
      }
      const svgType = this.svgLists.filter((f) => f.id === id)[0].type;
      if (svgType !== 'TableSvg') {
        return;
      }
      const tableData = [];
      for (let r = 0; r < rowCount; r++) {
        const tableColDataList = [];
        for (let c = 0; c < colCount; c++) {
          if (
            this.svgLists[tableIndex].tableData.length >= r + 1 &&
              this.svgLists[tableIndex].tableData[r].cols.length >= c + 1
          ) {
            tableColDataList.push(
              this.svgLists[tableIndex].tableData[r].cols[c]
            );
          } else {
            const tableColData = {
              id: GenUUid(),
              val: `${r + 1}行${c + 1}列`
            };
            tableColDataList.push(tableColData);
          }
        }
        const tableRowData = {
          cols: tableColDataList
        };
        tableData.push(tableRowData);
      }
      this.svgLists[tableIndex].tableData = tableData;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #components-layout {
    width: 100%;
    height:100%;
    .pageMain {
      position: relative;
      display: flex;
      // overflow: auto;
      width: 100%;
      height: 100%;
      &-left {
        width: 260px;
        flex: 0 0 auto;
        margin-left: 10px;
        &-tools {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
        }
      }
      .centerContain {
        overflow: auto !important;
        transition: all 0.3s;
        background-color: #fff;
        width: 100%;
        height: 100%;

        &.fixed {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .canvansDiv {
          transform-origin: left top;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          -khtml-user-select: none;
          user-select: none;
        }
      }
    }
  }

  #guide-x {
    display: none;
    position: absolute;
    width: 100%;
    left: 0px;
    top: 0px;
  }

  #guide-y {
    display: none;
    position: absolute;
    height: 100%;
    left: 0px;
    top: 0px;
  }
  .topo-layer {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-origin: left top;
    overflow: auto;

    background-image: linear-gradient(
        45deg,
        #ccc 25%,
        transparent 25%,
        transparent 75%,
        #ccc 75%,
        #ccc
      ),
      linear-gradient(
        45deg,
        #ccc 25%,
        transparent 25%,
        transparent 75%,
        #ccc 75%,
        #ccc
      );
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }
  .resize-left-top {
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: white;
    border: 1px solid #0cf;
    left: -5px;
    top: -5px;
    cursor: nwse-resize;
  }

  .resize-left-bottom {
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: white;
    border: 1px solid #0cf;
    left: -5px;
    bottom: -5px;
    cursor: nesw-resize;
  }

  .resize-right-top {
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: white;
    border: 1px solid #0cf;
    right: -5px;
    top: -5px;
    cursor: nesw-resize;
  }

  .resize-right-bottom {
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: white;
    border: 1px solid #0cf;
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
  }

  .topo-layer-view-selected {
    outline: 1px solid #0cf;
  }
</style>
