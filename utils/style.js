import { sin, cos } from './translate';

export const styleData = [
    { key: 'yoTextWeight', label: '字体粗细' },
    { key: 'yoDecoration', label: '横线' },
    { key: 'yoTextColor', label: '文字颜色' },
    { key: 'yoTextBgcColor', label: '文本背景颜色' },
    { key: 'yoTextBgImg', label: '文字背景图' },
    { key: 'yoTextFillet', label: '文本圆角' },
    { key: 'yoTextPadding', label: '文本间距' },
    { key: 'yoTextShadow', label: '文本阴影' },
    { key: 'yoLineHeight' , label: '文字行间距'},
    { key: 'yoTextSize', label: '文字大小' },
    { key: 'yoTextStyle', label: '字体风格' },
    { key: 'yoTextFamily', label: '字体类型' },
    { key: 'yoTextWriting', label: '排列' },

    { key: 'yoImgStyle', label: '图片样式' },
    { key: 'yoImgFilter', label: '滤镜' },
  
    { key: 'yoBoxBgcolor', label: '背景色' },
    { key: 'yoBoxFillet', label: '圆角' },
    { key: 'yoBoxBorderColor', label: '背景颜色' },
    { key: 'yoBoxBorderStyle', label: '边框颜色' },
    { key: 'yoBoxBorderWidth', label: '边框宽度' },

]

export function getStyle(style, filter = []) {
    const needUnit = [
        'fontSize',
        'width',
        'height',
        'top',
        'left',
        'borderWidth',
        'letterSpacing',
        'borderRadius',
    ]

    const result = {}
    Object.keys(style).forEach(key => {
        if (!filter.includes(key)) {
            if (key !== 'rotate') {
                result[key] = style[key]

                if (needUnit.includes(key)) {
                    result[key] += 'px'
                }
            } else {
                result.transform = key + '(' + style[key] + 'deg)'
            }
        }
    })

    return result
}

// 获取一个组件旋转 rotate 后的样式
export function getComponentRotatedStyle(style) {
    style = { ...style }
    if (style.rotate !== 0) {
        const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate)
        const diffX = (style.width - newWidth) / 2 // 旋转后范围变小是正值，变大是负值
        style.left += diffX
        style.right = style.left + newWidth

        const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate)
        const diffY = (newHeight - style.height) / 2 // 始终是正
        style.top -= diffY
        style.bottom = style.top + newHeight

        style.width = newWidth
        style.height = newHeight
    } else {
        style.bottom = style.top + style.height
        style.right = style.left + style.width
    }

    return style
}
