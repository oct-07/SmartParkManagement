import request from '@/utils/request.js'

// 获取园区管理————企业列表
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}
