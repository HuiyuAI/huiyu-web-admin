import axios from '@/util/request'

export function getModelList() {
  return axios({
    url: `/service/admin/model/list`,
    method: 'GET',
    params: {
    }
  })
}
