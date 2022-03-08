## 快速上手

### 引入 yxtx-lib

你可以引入整个 yxtx-lib，或是根据需要仅引入部分组件。我们先介绍如何引入完整的 yxtx-lib。

#### 完整引入

在 main.js 中写入以下内容：

```javascript

import Vue from 'vue'
import YXTX from 'yxtx-lib'
import 'yxtx-lib/lib/theme-chalk/index.css'

import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});

```

以上代码便完成了 Element 的引入。需要注意的是，样式文件需要单独引入。

#### 按需引入

借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)，我们可以只引入需要的组件，以达到减小项目体积的目的。

首先，安装 babel-plugin-component：

```bash
npm install babel-plugin-component -D
```

然后，将 .babelrc 修改为：

```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "yxtx-lib",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

接下来，如果你只希望引入部分组件，比如 SvgEdit 和 SvgItem，那么需要在 main.js 中写入以下内容：

```javascript
import Vue from 'vue';
import { SvgEdit, SvgItem } from 'yxtx-lib';
import App from './App.vue';

Vue.component(SvgEdit.name, SvgEdit);
Vue.component(SvgItem.name, SvgItem);
/* 或写为
 * Vue.use(SvgEdit)
 * Vue.use(SvgItem)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});
```

完整组件列表和引入方式（完整组件列表以 [components.json](https://gitee.com/yushk/yxtx/blob/master/components.json) 为准）
