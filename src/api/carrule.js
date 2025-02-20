import request from '@/utils/request.js'

// 获取计费规则列表
export function getBillingRuleAPI(params) {
  return request({
    url: '/parking/rule/list',
    params
  })
}
