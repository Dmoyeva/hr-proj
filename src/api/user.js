import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料
// 在哪里调用获取用户资料呢？==>鉴别是否有token的地方！
export function getUserinfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取用户详细资料==>使用用户的头像
export function getUserinfoDetail(id) {
  return request({
    url: `/sys/user/${id}`
    // get请求，可以不写method
  })
}

export function logout() {

}
