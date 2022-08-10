// 公共样式
export const commonStyle = {
    rotate: 0,
    opacity: 1,
  }
  
  export const commonAttr = {
    animations: [],
    events: {},
    groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
    isLock: false, // 是否锁定组件
  }
  
  // 编辑器左侧组件列表
  const list = [
    {
        component: 'v-text',
        label: '文字',
        propValue: '双击编辑文字',
        icon: 'wenben',
        style: {
            width:100,
            height:50,
            yoOpacity:"透明度",
            yoScale:"缩放比例",
            yoTextWeight:"400",
            yoDecoration:'auto',
            yoTextColor:"文字颜色",
            yoTextBgcColor:"文本背景颜色",
            yoTextBgImg:"文字背景图",
            yoTextFillet:"文本圆角",
            yoTextPadding:"文本间距",
            yoTextShadow:"文字阴影",
            yoTextSize:"24",
            yoTextStyle:"字体风格",
            yoTextFamily:"inherit",
            yoTextWriting:"排列"
        },
    },
    {
        component: 'Picture',
        label: '图片',
        icon: 'tupian',
        propValue: 'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com//image/2022/6-28/logo.png',
        style: {
            width:200,
            height:100,
            yoOpacity:"透明度",
            yoScale:"缩放比例",
            yoBorderRadius: '',
            yoSize:"字体大小",
            yoImgStyle:"样式",
            yoImgFilter:"滤镜",
        },
    },
    {
        component: 'rect-shape',
        label: '矩形',
        propValue: '&nbsp;',
        icon: 'juxing',
        style: {
            yoOpacity:"透明度",
            yoScale:"缩放比例",
            width: 200,
            height: 200,
            yoBoxBgcolor:"盒子颜色",
            yoBoxFillet:"盒子圆角",
            yoBoxBorderColor:"盒子边框颜色",
            yoBoxBorderStyle:"盒子边框 虚线/实线",
            yoBoxBorderWidth:'盒子边框宽度',
        },
    },
  ]
  
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    item.style = { ...commonStyle, ...item.style }
    list[i] = { ...commonAttr, ...item }
  }
  
  export default list
  
