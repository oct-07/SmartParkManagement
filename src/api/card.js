import request from '@/utils/request.js'

// 获取月卡列表数据
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params
  })
}
