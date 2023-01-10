/*
  *获取简略员工信息==>dialog组件显示负责人信息
*/
import request from '@/utils/request'

export const getBriefStuffInfo = () => {
  return request({
    url: '/sys/user/simple'
  })
}
