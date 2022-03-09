<template>
  <div id="components-layout">
    <div class="pageMain">
      <div class="pageMain-left">
        <yx-left-tool :svg-info-data="svgInfoData" @setCurrent="setCurrent" @inlineMethods="clickMethods"/>
        <slot name="tools">
        </slot>
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
              <yx-svg-item
                :component-prop="item"
                :svg-info-data="svgInfoData"
              />
            </g>
          </svg>
        </div>
      </div>
      <yx-right-tool
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
import example from 'main/assets/json/example.json';
import { GenUUid } from 'main/utils/UCore.js';
import { launchFullScreen } from 'main/utils/fullScreen.js';

export default {
  name: 'SvgEdit',
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
        height: this.height,
        width: this.width,
        svgColor: '#000000',
        size: 1
      },
      ctrlDown: false, // ctrl 按下
      CurrentlySelectedToolBar: {
        Type: '', // 选中的工具栏svg类型
        TypeName: '', // 选中的工具栏svg类型名称
        Title: '', // 选中的工具栏svg标题
        Color: '', // 选中的工具栏svg颜色
        CreateType: '', // 选中工具栏的创建方式
        EChartsOption: '' // 选中工具栏的图表默认option
      }
    };
  },
  props: {
    coms: {
      type: Array,
      default: function() {
        return [];
      }
    },
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 540
    }
  },
  computed: {
    svgInfoData() {
      return this.coms;
    }
  },
  created() {
    const _this = this;
    // 当前页面监视键盘输入
    document.onkeydown = function(e) {
      // 事件对象兼容
      const e1 = e || window.event;
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
  },
  mounted() {
    const _this = this;
    // var doc = document.getElementById('components-layout');
    // this.Bg = Object.assign(this.Bg, {
    //   height: doc.clientHeight,
    //   width: doc.clientWidth
    // });
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
          console.log('canvas drop', _this.CurrentlySelectedToolBar);
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
    setCurrent(e) {
      console.log('set setCurrent  item', e);
      this.CurrentlySelectedToolBar = e;
    },
    clear() {
      this.CurrentlySelectedToolBar = {
        Type: '', // 选中的工具栏svg类型
        TypeName: '', // 选中的工具栏svg类型名称
        Title: '', // 选中的工具栏svg标题
        Color: '', // 选中的工具栏svg颜色
        CreateType: '', // 选中工具栏的创建方式
        EChartsOption: '' // 选中工具栏的图表默认option
      };
    },
    showAddSvgModal() {
      this.addSvgVisible = true;
    },
    addSvgHandleOk() {
      this.addSvgVisible = false;
      this.$emit('addSvgHandleOk', this.testAddSvg);
    },
    versionModelHandleOk() {
      this.versionModelVisible = false;
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
      this.clear();
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
      this.clear();
    },
    mouseDownBg() {
      console.log('mouseDownBg');
      this.selectSvgInfo = this.Bg;
    },
    /**
     * @type api
     * @desc 导出数据为json文件
     * */
    exportDataJson() {
      localStorage.setItem('svginfo', JSON.stringify(this.svgLists));
      const datastr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify({bg: this.Bg, items: this.svgLists}));
      const download = document.createElement('a');
      download.setAttribute('href', datastr);
      download.setAttribute('download', 'download.json');
      download.click();
      download.remove();
      console.log(JSON.stringify(this.svgLists));
    },
    /**
     * @type api
     * @desc 导出数据
     * */
    getJsonData() {
      return {bg: this.Bg, items: this.svgLists};
    },
    /**
     * @type api
     * @desc 导出svg
     * */
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
    /**
     * @type api
     * @desc 载入本地模板
     * */
    loadTemplate(json) {
      if (json) {
        console.log('模板为空');
        return false;
      }
      if (!Object.hasOwn(json, 'bg') || !Object.hasOwn(json, 'items')) {
        console.log('模板格式错误，缺少bg 或items属性');
        return false;
      }
      // 载入模板
      this.Bg = example.bg;
      this.svgLists = example.items;
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
    },
    /**
     * @type api
     * @desc 预览方法
     * */
    Preview() {
      launchFullScreen(this.$refs.canvas);
    },
    clickMethods(e) {
      switch (e) {
        case 'exportsvg':
          this.exportSvg();
          break;
        case 'exportjson':
          this.exportDataJson();
          break;
        case 'preview':
          this.Preview();
          break;
        case 'add':
          this.showAddSvgModal();
          break;
      }
    }

  }
};
</script>
