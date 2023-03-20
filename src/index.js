/* Automatically generated by './build/bin/build-entry.js' */

import Svgedit from '../packages/svgedit/index.js';
import Svgitem from '../packages/svgitem/index.js';
import Svgleft from '../packages/svgleft/index.js';
import Svgpreview from '../packages/svgpreview/index.js';
import Svgright from '../packages/svgright/index.js';
import Virtuallist from '../packages/virtuallist/index.js';
import Charge from '../packages/charge/index.js';
import Load from '../packages/load/index.js';
import Clock from '../packages/clock/index.js';
import Watermark from '../packages/watermark/index.js';
import Test from './utils/test.js';


const components = [
  Svgedit,
  Svgitem,
  Svgleft,
  Svgpreview,
  Svgright,
  Virtuallist,
  Charge,
  Load,
  Clock,
  Watermark
];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component('yx' + component.name, component);
  });

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.1.2-1',
  install,
  Svgedit,
  Svgitem,
  Svgleft,
  Svgpreview,
  Svgright,
  Virtuallist,
  Charge,
  Load,
  Clock,
  Watermark,
Test
};
