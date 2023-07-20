import axios from '@/util/request'

export function getTaskListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/task/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}
