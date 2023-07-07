import axios from '@/util/request'

export function getClientListByQuery(client, pageNum, pageSize) {
  return axios({
    url: `/service/sysOauthClient/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...client
    }
  })
}

export function addClient(client) {
  return axios({
    url: '/service/sysOauthClient',
    method: 'POST',
    data: {
      ...client
    }
  })
}

export function editClient(client) {
  return axios({
    url: '/service/sysOauthClient',
    method: 'PUT',
    data: {
      ...client
    }
  })
}

export function deleteClientById(id) {
  return axios({
    url: `/service/sysOauthClient/${id}`,
    method: 'DELETE',
  })
}
