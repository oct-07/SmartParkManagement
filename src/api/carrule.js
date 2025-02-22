import request from '@/utils/request.js'

// 获取计费规则列表
export function getBillingRuleAPI(params) {
  return request({
    url: '/parking/rule/list',
    params
  })
}
// 添加计费规则

export function addBillingRuleAPI(data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}
