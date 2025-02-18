import request from '@/utils/request.js'

// 获取园区管理————企业列表
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}

// 获取企业所属行业列表
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}
