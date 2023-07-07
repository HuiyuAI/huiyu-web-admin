import axios from '@/util/request'

export function getPermissionListByQuery(permission, pageNum, pageSize) {
  return axios({
    url: `/service/sysPermission/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...permission
    }
  })
}

export function addPermission(permission) {
  return axios({
    url: '/service/sysPermission',
    method: 'POST',
    data: {
      ...permission
    }
  })
}

export function editPermission(permission) {
  return axios({
    url: '/service/sysPermission',
    method: 'PUT',
    data: {
      ...permission
    }
  })
}

export function deletePermissionById(id) {
  return axios({
    url: `/service/sysPermission/${id}`,
    method: 'DELETE',
  })
}

export function refreshPermRolesRules() {
  return axios({
    url: '/service/sysPermission/refreshPermRolesRules',
    method: 'PUT',
  })
}
