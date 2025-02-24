import request from '@/utils/request.js'

// 获取角色列表
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}

// 查询所有功能权限列表树状
export function getPermissionTreeAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
// 查询角色详情
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}
// 获取菜单角色对应权限列表
export function getRoleUserAPI(roleId, params) {
  return request({
    url: `park/sys/roleUser/${roleId}`,
    params

  })
}

// 添加角色
export function addRoleAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'POST',
    data
  })
}

// 编辑角色
export function editRoleAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}

// 删除角色
export function deleteRoleAPI(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'DELETE'
  })
}
