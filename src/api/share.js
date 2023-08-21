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
