import axios from '@/util/request'

export function getUserListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/user/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}

export function addUser(data) {
  return axios({
    url: `/service/admin/user/addUser`,
    method: 'POST',
    data: {
      ...data
    }
  })
}

export function updateUser(data) {
  return axios({
    url: `/service/admin/user/updateUser`,
    method: 'POST',
    data: {
      ...data
    }
  })
}
