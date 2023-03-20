## 虚拟列表

### 基本用法

:::demo 水印.
``` html
<template>
  <div class="container1" style="display:flex;flex-diection:row">
    <div style="width:400px;height:400px;border:1px solid red;position:relative">
      <yx-water-mark :content='content'/>
      <el-button @click="show">无蒙板 </el-button>
    </div>
    <div style="width:400px;height:400px;border:1px solid red;position:relative">
      <yx-water-mark content='12345水印开启蒙版' :isMark="true"/>
      <el-button @click="show">开启蒙板 </el-button>
    </div>
  </div>
</template>
<script>
    export default{
        data(){
            return {
              content:""
            }
        },
        created(){
        },
        methods:{
          show(){
            this.content=new Date().getTime()+''
          }
        }
    }
</script>
<style>
  .container{
    display:flex;
    flex-direction:row;
  }
  </style>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| content   | 水印文案     | String | — | 水印 |
| color     | 水印文案颜色  | String | — | 'rgba(0, 0, 0, 0.40)' |
| size      | 水印文案字体大小      | String | — | '20px Vedana'|
| background | 水印背景颜色       | String | — | '#fafafa' |
| opacity     | 水印透明度      | String | — | '0.3' |
| isMark     | 是否开启蒙版      | Boolean | — | false |
