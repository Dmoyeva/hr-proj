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

/*
  *批量导入员工
*/
export const batchImportStuff = (data) => {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/*
  *更新员工个人基本信息
*/
export const refreshStuffInfo = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/*
  *获取员工个人全部基础信息
*/
export const getStuffPersonalInfo = (id) => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/*
*保存员工个人全部基础信息
*/
export const saveStuffPersonalInfo = (data) => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/*
  *获取员工岗位信息
*/
export const getStuffJobInfo = (id) => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/*
  *更新员工岗位信息
*/
export const updateStuffJobInfo = (data) => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
