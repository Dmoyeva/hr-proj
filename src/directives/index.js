// 自定义指令
export const imagerror = {
  // inserted会在当前的dom元素插入到节点之后执行，options是指令中的变量的解释
  // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
  inserted(dom, options) {
    // 保证在初始化的时候显示默认图片
    dom.src = dom.src || options.value
    dom.onerror = () => {
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    // componentUpdated钩子函数，inserted只会触发一次，componentUpdated可以在数据更新后再次触发
    // 如果dom.src = ' ', dom.src = null 那么以下的赋值可以保证dom.src = options.value
    dom.src = dom.src || options.value
  }
}
