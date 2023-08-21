import axios from '@/util/request'

export function getPicShareListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/picShare/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}

export function audit(picIdList, status) {
  return axios({
    url: `/service/admin/picShare/audit`,
    method: 'POST',
    data: {
      picIdList,
      status
    }
  })
}

export function reAudit(picIdList) {
  return axios({
    url: `/service/admin/picShare/reAudit`,
    method: 'POST',
    data: picIdList
  })
}
