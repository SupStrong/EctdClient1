import $ from 'jquery'
export default {
  computed: {},
  created() {
    // this.restore()
    // // 全局监听按键事件
    // listenGlobalKeyDown()
    // alert("121")
  },
  methods: {
        // restore() {
        //     // 用保存的数据恢复画布
        //     if (localStorage.getItem('canvasData')) {
        //         this.$store.commit('setComponentData', this.resetID(JSON.parse(localStorage.getItem('canvasData'))))
        //     }

        //     if (localStorage.getItem('canvasStyle')) {
        //         this.$store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle')))
        //     }
        // },

        // resetID(data) {
        //     data.forEach((item) => {
        //         item.id = generateID()
        //         if (item.component === 'Group') {
        //             this.resetID(item.propValue)
        //         }
        //     })

        //     return data
        // },

        // handleDrop(e) {
        //     e.preventDefault()
        //     e.stopPropagation()
        //     const index = e.dataTransfer.getData('index')
        //     console.log($('.editor'))
        //     const rectInfo = this.editor.getBoundingClientRect()
        //     if (index) {
        //         const component = deepCopy(componentList[index])
        //         component.style.top = e.clientY - rectInfo.y
        //         component.style.left = e.clientX - rectInfo.x
        //         component.id = generateID()
        //         this.$store.commit('addComponent', { component })
        //         this.$store.commit('recordSnapshot')
        //     }
        // },

        // handleDragOver(e) {
        //     alert("121")
        //     console.log(e.dataTransfer,"e.dataTransfer")
        //     e.preventDefault()
        //     e.dataTransfer.dropEffect = 'copy'
        // },

        // handleMouseDown(e) {
        //     e.stopPropagation()
        //     this.$store.commit('setClickComponentStatus', false)
        //     this.$store.commit('setInEditorStatus', true)
        // },

        // deselectCurComponent(e) {
        //     if (!this.isClickComponent) {
        //         this.$store.commit('setCurComponent', { component: null, index: null })
        //     }

        //     // 0 左击 1 滚轮 2 右击
        //     if (e.button !== 2) {
        //         this.$store.commit('hideContextMenu')
        //     }
        // },
    },
  methods: {}
}
