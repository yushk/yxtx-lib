## 虚拟列表

### 基本用法

:::demo 虚拟列表demo.
``` html
<template>
  <yx-virtual-list :list-data="relDev" :estimated-item-size="36" :buffer-scale="1" :is-roll="true" height="100px" >
    <template v-slot:default="{row}">
      <div>{{row}}</div>
    </template>
  </yx-virtual-list>
</template>
<script>
    export default{
        data(){
            return {
              relDev: [
                  "1",
                  "2",
                  "3",
                  "4",
                  "1",
                  "2",
                  "3",
                  "4",
              ],
            }
        },
        created(){
        }
    }
</script>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| list-data     | 数据列表     | Array | — | — |
| estimated-item-size  | 行预估高度  | Number | — | 50 |
| is-roll     | 是否自动滚动       | boolean | — | true |
| height     | 画布高度      | Number|String | — | 100% |
| buffer-scale     | 缓冲区比例 头部预渲染 尾部预渲染 与容器高度渲染数目的比例      | Number|String | — | 1 |


### Slot

| Name | Description |
|------|--------|
| — | 描述 |
| 默认插槽 | 回调参数 {row} |