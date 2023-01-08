import axios from 'axios'
import { getTimestamp } from '@/utils/auth.js'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

const timestampValid = 3600 // 设置时间戳有效时间
const isTokenInvalid = () => { // 判断token是否有效
  const originTimestamp = getTimestamp()
  const newTimestamp = Date.now()
  return (newTimestamp - originTimestamp) / 1000 > timestampValid
}
// request interceptors
service.interceptors.request.use(config => {
  // 如果有token才要注入！！！
  if (store.getters.token) {
    // 如果token有效才注入，否则登出清空再登录
    if (isTokenInvalid()) { // token过期了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token过期'))
    } else {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response interceptors
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  // 响应中被动处理token超时
  if (error.response?.data?.code === 10002) {
    // 10002状态码==>token超时
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default service
