import axios from '@/util/request'

export function getPicListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/pic/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}
