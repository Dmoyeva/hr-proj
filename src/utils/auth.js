import Cookies from 'js-cookie'
// 处理token
const TokenKey = 'hr_saas_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 处理token失效
const timestampKey = 'hr_saas_timestamp_key'

export function setTimestamp() {
  return Cookies.set(timestampKey, Date.now())
}

export function getTimestamp() {
  return Cookies.get(timestampKey)
}
