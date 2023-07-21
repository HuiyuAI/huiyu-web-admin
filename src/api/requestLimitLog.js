import axios from '@/util/request'

export function getRequestLimitLogListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/requestLimitLog/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}
