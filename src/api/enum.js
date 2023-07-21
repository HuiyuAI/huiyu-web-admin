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

export function getPointOperationTypeEnum() {
  return axios({
    url: `/service/admin/enum/getPointOperationTypeEnum`,
    method: 'GET',
  })
}

export function getPointOperationSourceEnum() {
  return axios({
    url: `/service/admin/enum/getPointOperationSourceEnum`,
    method: 'GET',
  })
}
