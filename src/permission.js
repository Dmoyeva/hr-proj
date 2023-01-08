// 权限控制==>验证token
import router from '@/router'
import store from '@/store' // 为了拿到token
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'

const whiteList = ['/404', '/login']
router.beforeResolve(async(to, from, next) => {
  nprogress.start() // 前置守卫开启进度条
  if (store.getters.token) {
    // token 存在
    // 判断要去的位置==>1.login页面，免登陆，去home页面；2.不是login页面，放行
    if (to.path === '/login') {
      next('/')
    } else {
      // token存在，获取用户信息，便于后续逻辑使用用户信息
      // 也需要做判断的，如果有userId，就不用发起请求，没有才要发起请求
      if (!store.getters.userId) {
        // store.dispatch是一个异步操作，要等待结束后再放行
        await store.dispatch('user/getUserinfo')
      }
      next()
    }
  } else {
    // token不存在==>判断是否在白名单？在，放行:不在，挑转登录页
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 手动关闭进度条，避免手动切换地址进度条无法关闭的问题
})

router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
