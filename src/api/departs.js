import request from '@/utils/request'

/*
*获取组织架构信息
*/
export const getDepartsInfo = () => {
  return request({
    url: '/company/department'
  })
}
/*
*删除部门
*/
export const delDeptsById = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/*
*新增部门
*/
export const addDepts = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/*
*获取部门详情==>回填dialog组件数据
*/
export const getDeptsDetail = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

/*
*修改部门详情，有body数据
*/
export const updateDeptsDetail = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
