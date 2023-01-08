// 自定义指令
export const imagerror = {
  // inserted会在当前的dom元素插入到节点之后执行，options是指令中的变量的解释
  // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
  inserted(dom, options) {
    dom.onerror = () => {
      dom.src = options.value
    }
  }
}
