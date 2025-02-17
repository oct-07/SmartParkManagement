import request from '@/utils/request.js'

// 获取月卡列表数据
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params
  })
}
// 添加月卡
export function addMonthCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}
// 编辑————获取月卡详情数据
export function getCardDetailDataAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

// 编辑月卡————提交编辑完的数据
export function editorCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
// 删除月卡
export function deleteCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}
