const borderData = [
  { type: 'solid', radius: '50%' },
  { type: 'dashed', radius: '50%' },
  { type: 'dotted', radius: '50%' },
  { type: 'double', radius: '50%', width: '5px' },
  { type: 'solid', radius: '0' },
  { type: 'dashed', radius: '0' },
  { type: 'dotted', radius: '0' },
  { type: 'double', radius: '0', width: '7px' }
]
const fontData = [
  {
    name:'Flatory HC SemiCondensed SemiBold',
    fontName:'fangsong'
  }
]
const rectList = [
  {
    name:'1*1格',
    w:'514.19',
    h:'727.38'
  },
  {
    name:'2*2格',
    w:'257.1',
    h:'363.9'
  },{
    name:'3*3格',
    w:'171.4',
    h:'242.46'
  },{
    name:'4*4格',
    w:'128.55',
    h:'181.845'
  },{
    name:'5*5格',
    w:'102.84',
    h:'145.476'
  }
]
export default {
  borderData:borderData,
  fontData:fontData,
  rectList:rectList
}

