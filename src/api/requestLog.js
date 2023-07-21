import axios from '@/util/request'

export function getRequestLogListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/requestLog/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}
