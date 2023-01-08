import { getToken, setToken, removeToken, setTimestamp } from '@/utils/auth'
import { login, getUserinfo, getUserinfoDetail } from '@/api/user'
export default {
  namespaced: true,
  state() {
    return {
      token: getToken(),
      userinfo: {}
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token // 设置token  只是修改state的数据
      // vuex变化 => 缓存数据
      setToken(token) // vuex和 缓存数据的同步
    },
    removeToken(state) {
      state.token = null // 删除vuex的token
      removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
    },
    getUserinfo(state, result) {
      state.userinfo = result
    },
    removeUserinfo(state) {
      state.userinfo = {}
    }
  },
  actions: {
    async login(context, data) {
      const result = await login(data)
      // 因为在login里面做了判断，如果执行到这，一定是请求成功了，不需要判断
      // 调用接口成功
      // if (result.success) {
      //   // 拿到token，设置token
      //   context.commit('setToken', result.data.data)
      // }
      context.commit('setToken', result)
      // 登录成功后要存入token的时间戳
      setTimestamp()
    },
    async getUserinfo(context) {
      const result = await getUserinfo()
      const detail = await getUserinfoDetail(result.userId)
      context.commit('getUserinfo', { ...result, ...detail }) // userinfo里没有用户头像，需要合并处理
      return result // 便于后续权限处理
    },
    logout({ commit }) {
      commit('removeToken')
      commit('removeUserinfo')
    }
  }
}
