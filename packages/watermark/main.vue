<template>
    <div :style="style">
    </div>
</template>
<script>
export default {
  name: 'WaterMark',
  data() {
    return {
        style:{
            top:  '0px',
            left:  '0px',
            position:  'absolute',
            zIndex:  '100000',
            width:  '100%',
            height:  '100%',
            opacity:'',
            background:'',
            pointerEvents:'',
        }
    };
  },
  props: {
    content:{
        type: String,
        default:'水印'
    },
    color:{
        type:String,
        default:'rgba(0, 0, 0, 0.40)'
    }, 
    size:{
        type:String,
        default:'20px Vedana'
    },
    opacity:{
        type:String,
        default:'0.3'
    },
    background:{
        type:String,
        default:'#fafafa'
    },
    isMark:{
        type:Boolean,
        default:false
    },
  },
  mounted() {
    this.setWatermark()
  },
  methods: {
    setWatermark()  {
        // 创建一个画布
        const can = document.createElement('canvas')
        // 设置画布的长宽
        can.width = this.content.length*30
        can.height = 200
        const cans = can.getContext('2d')
        cans.fillStyle = this.background
        cans.fillRect(0, 0, can.width, can.height)
        // 旋转角度
        cans.rotate(-10 * Math.PI / 180)
        cans.font = this.size
        // 设置填充绘画的颜色、渐变或者模式
        cans.fillStyle = this.color
        // 设置文本内容的当前对齐方式
        cans.textAlign = 'left'
        // 设置在绘制文本时使用的当前文本基线
        cans.textBaseline = 'Middle'
        // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
        cans.fillText(this.content, 0, can.height / 2)
        if(this.isMark){
            this.style.pointerEvents = ''
        }else{
            this.style.pointerEvents = 'none'
        }
        this.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
        this.style.opacity = this.opacity // 水印的透明度
    }
  }
};
</script>
