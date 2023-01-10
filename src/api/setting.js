import request from '@/utils/request'
/*
 *获取所有角色列表
*/
export const getRolesList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}

/*
 *获取公司信息
*/
export const getCompanyInfo = (id) => {
  return request({
    url: `/company/${id}`
  })
}

/*
 *removeRoleById
*/
export const removeRoleById = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'delete'
  })
}

/*
 *updateRoleById
*/
export const updateRoleById = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/*
 *getRoleInfoById
*/
export const getRoleInfoById = (data) => {
  return request({
    url: `/sys/role/${data.id}`
  })
}

/*
 *getRoleInfoById
*/
export const addNewRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
