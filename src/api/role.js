import request from '@/utils/request.js'

// 获取角色列表
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}

// 查询所有功能权限树状
export function getPermissionTreeAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
