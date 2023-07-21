import axios from '@/util/request'

export function getPointRecordListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/pointRecord/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}
