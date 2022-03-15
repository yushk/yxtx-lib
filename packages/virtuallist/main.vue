<template>
  <div class="outer-container" :style="{height}">
    <div ref="list" :style="{height}" class="infinite-list-container" @scroll="scrollEvent($event)">
      <div ref="phantom" class="infinite-list-phantom" :style="{ height: estimatedItemSize*listData.length + 'px' }" />
      <div ref="content" class="infinite-list">
        <div v-for="item in visibleData" :id="item._index" ref="items" :key="item._index" class="infinite-list-item">
          <slot :row="item.item" >{{item.item}}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'VirtualList',
  props: {
    // 所有列表数据
    listData: {
      type: Array,
      default: () => []
    },
    // 预估高度
    estimatedItemSize: {
      type: Number,
      required: true
    },
    // 缓冲区比例
    bufferScale: {
      type: Number,
      default: 1
    },
    // 容器高度 100px or 50vh
    height: {
      type: String,
      default: '100px'
    },
    isRoll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 可视区域高度
      screenHeight: 0,
      // 起始索引
      start: 0,
      // 结束索引
      end: 0,
      timer: null
    };
  },
  computed: {
    _listData() {
      this.initPositions();
      return this.listData.map((item, index) => {
        return {
          _index: `_${index}`,
          item
        };
      });
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount);
    },
    belowCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount);
    },
    visibleData() {
      const start = this.start - this.aboveCount;
      const end = this.end + this.belowCount;
      // console.log('start', start);
      // console.log('end', end);
      return this._listData.slice(start, end);
    }
  },
  created() {

  },
  mounted() {
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
    if (this.isRoll) {
      this.roll(50);
    }
  },
  updated() {
    this.$nextTick(function() {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      // 获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize();
      // 更新列表总高度
      const height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = height + 'px';
      // 更新真实偏移量
      this.setStartOffset();
    });
  },
  beforeDestroy() {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    initPositions() {
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      })
      );
    },
    // 获取列表起始索引
    getStartIndex(scrollTop = 0) {
      // 二分法查找
      return this.binarySearch(this.positions, scrollTop);
    },
    binarySearch(list, value) {
      // console.log('list',list)
      // console.log('this.listData',this.listData)
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;

      while (start <= end) {
        // eslint-disable-next-line radix
        const midIndex = parseInt((start + end) / 2);
        const midValue = list[midIndex].bottom;
        if (midValue === value) {
          return midIndex + 1;
        } else if (midValue < value) {
          start = midIndex + 1;
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
    },
    // 获取列表项的当前尺寸
    updateItemsSize() {
      const nodes = this.$refs.items;
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const height = rect.height;
        const index = +node.id.slice(1);
        const oldHeight = this.positions[index].height;
        const dValue = oldHeight - height;
        // 存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          this.positions[index].height = height;
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }
      });
    },
    // 获取当前的偏移量
    setStartOffset() {
      let startOffset;
      if (this.start >= 1) {
        const size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0);
        startOffset = this.positions[this.start - 1].bottom - size;
      } else {
        startOffset = 0;
      }
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`;
    },
    // 滚动事件
    scrollEvent() {
      // 当前滚动位置
      const scrollTop = this.$refs.list.scrollTop;
      // let startBottom = this.positions[this.start - ]
      // 此时的开始索引
      this.start = this.getStartIndex(scrollTop);
      // 此时的结束索引
      this.end = this.start + this.visibleCount;
      // 此时的偏移量
      this.setStartOffset();
    },
    roll(t) {
      this.timer = setInterval(this.rollStart, t); // 设置定时器，参数t用在这为间隔时间（单位毫秒），参数t越小，滚动速度越快
      // 鼠标移入div时暂停滚动
      this.$refs.list.onmouseover = () => {
        clearInterval(this.timer);
      };
      // 鼠标移出div后继续滚动
      this.$refs.list.onmouseout = () => {
        this.timer = setInterval(this.rollStart, t);
      };
    },

    // 开始滚动函数
    rollStart() {
    //  console.log(this.$refs.list)
      if (this.$refs.list) {
        // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
        if (this.$refs.list.scrollTop >= this.estimatedItemSize * this.listData.length - this.screenHeight) {
          this.$refs.list.scrollTop = 0;
        } else {
          this.$refs.list.scrollTop++;
        }
      }
    }
  }
};
</script>

