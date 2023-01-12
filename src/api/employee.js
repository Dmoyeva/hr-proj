import request from '@/utils/request'
/*
  *获取简略员工信息==>dialog组件显示负责人信息
*/

export const getBriefStuffInfo = () => {
  return request({
    url: '/sys/user/simple'
  })
}

/*
  *获取所有员工信息
*/
export const getAllStuffInfo = (params) => {
  return request({
    url: '/sys/user',
    params
  })
}

/*
  *删除员工信息
*/
export const deleteStuffInfo = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/*
  *新增员工
*/
export const addStuffInfo = (data) => {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
