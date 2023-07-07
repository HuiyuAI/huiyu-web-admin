import axios from '@/util/request'

export function getModelListByQuery(query, pageNum, pageSize) {
  return axios({
    url: `/service/admin/model/${pageNum}/${pageSize}`,
    method: 'GET',
    params: {
      ...query
    }
  })
}

export function getModelCategoryList() {
  return axios({
    url: `/service/admin/model/categoryList`,
    method: 'GET',
    params: {}
  })
}

export function addModel(model) {
  return axios({
    url: `/service/admin/model/save`,
    method: 'POST',
    data: model
  })
}

export function updateModelBatchById(modelList) {
  return axios({
    url: `/service/admin/model/updateBatchById`,
    method: 'POST',
    data: modelList
  })
}

export function deleteModelByIds(ids) {
  return axios({
    url: `/service/admin/model/removeByIds`,
    method: 'POST',
    data: ids
  })
}
