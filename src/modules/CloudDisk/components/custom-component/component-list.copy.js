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
          width: 150,
          height: 22,
      },
  },
  {
      component: 'Picture',
      label: '图片',
      icon: 'tupian',
      propValue: 'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com//image/2022/6-28/logo.png',
      style: {
          width: 300,
          height: 200,
          borderRadius: '',
      },
  },
  {
      component: 'rect-shape',
      label: '矩形',
      propValue: '&nbsp;',
      icon: 'juxing',
      style: {
          width: 200,
          height: 200,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '',
          letterSpacing: 0,
          textAlign: 'center',
          color: '',
          borderColor: '#000',
          borderWidth: 1,
          backgroundColor: '',
          borderStyle: 'solid',
          borderRadius: '',
          verticalAlign: 'middle',
      },
  },
]

for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  list[i] = { ...commonAttr, ...item }
}

export default list
