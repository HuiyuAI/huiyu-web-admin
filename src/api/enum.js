import axios from '@/util/request'

export function getTaskTypeEnum() {
  return axios({
    url: `/service/admin/enum/getTaskTypeEnum`,
    method: 'GET',
  })
}

export function getTaskStatusEnum() {
  return axios({
    url: `/service/admin/enum/getTaskStatusEnum`,
    method: 'GET',
  })
}
