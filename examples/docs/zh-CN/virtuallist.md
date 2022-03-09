## 虚拟列表

### 基本用法

:::demo svg`coms`属性导入基础svg`icon`。
``` html
<template>
  <yx-virtual-list :list-data="relDev" :estimated-item-size="36" :buffer-scale="1" :is-roll="false" height="100px" >
    <template slot-scope="data">
      <div>{{data}}</div>
    </template>
  </yx-virtual-list>
</template>
<script>
    export default{
        data(){
            return {
              relDev: [
                {
                    "note": "2022-01-01 15：54：01"
                },
                {
                    "note": "2022-01-03 10：54：01"
                },
                {
                    "note": "2022-01-06 1：54：01"
                },
                {
                    "note": "2022-02-11 08：54：01"
                },
                {
                    "note": "2022-01-01 15：54：01"
                },
                {
                    "note": "2022-01-03 10：54：01"
                },
                {
                    "note": "2022-01-06 1：54：01"
                },
                {
                    "note": "2022-02-11 08：54：01"
                }
            ],
            }
        },
        created(){
        }
    }
</script>
```