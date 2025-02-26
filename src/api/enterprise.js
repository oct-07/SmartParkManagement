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

// 添加企业
export function addEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}
// 编辑企业回显  企业数据详情
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateExterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

// 删除企业
export function delelteEnterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}

// 查询可租赁楼宇
export function getBuildingListAPI() {
  return request({
    url: '/park/rent/building'
  })
}
// 添加合同
export function addRentContactAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}
// 查询展开的租赁信息
export function getEnterpriseRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

// 退租
export function rentingOutAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}
