import request from '@/utils/request'

// 上传文件
export function uploadFileAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
