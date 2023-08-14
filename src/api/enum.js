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

export function getPointTypeEnum() {
  return axios({
    url: `/service/admin/enum/getPointTypeEnum`,
    method: 'GET',
  })
}

export function getPicStatusEnum() {
  return axios({
    url: `/service/admin/enum/getPicStatusEnum`,
    method: 'GET',
  })
}

export function getImageQualityEnum() {
  return axios({
    url: `/service/admin/enum/getImageQualityEnum`,
    method: 'GET',
  })
}
