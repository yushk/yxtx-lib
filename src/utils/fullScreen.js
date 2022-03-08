
// 找到适合浏览器的全屏方法
export function launchFullScreen(element) {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) { // 兼容moz
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) { // 兼容webkit
    element.webkitRequestFullScreen();
  }
}

export function exitFullScreen(element) {
  if (element.exitFullscreen) {
    element.exitFullscreen();
  } else if (element.webkitCancelFullScreen) {
    element.webkitCancelFullScreen();
  } else if (element.mozCancelFullScreen) {
    element.mozCancelFullScreen();
  } else if (element.msExitFullscreen) {
    element.msExitFullscreen();
  }
}
