import request from '@/utils/request.js'

// 获取计费规则列表
export function getBillingRuleAPI() {
  return request({
    url: '/parking/rule/list'
  })
}
