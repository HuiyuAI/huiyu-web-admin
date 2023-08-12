import axios from '@/util/request'

export function login(qq, groupId) {
  return axios({
    url: `/service/admin/mirai/login`,
    method: 'POST',
    params: {
      qq,
      groupId
    }
  })
}

export function close() {
  return axios({
    url: `/service/admin/mirai/close`,
    method: 'POST',
  })
}

export function getStatus() {
  return axios({
    url: `/service/admin/mirai/getStatus`,
    method: 'GET',
  })
}

export function getLoginInfo() {
  return axios({
    url: `/service/admin/mirai/getLoginInfo`,
    method: 'GET',
  })
}
