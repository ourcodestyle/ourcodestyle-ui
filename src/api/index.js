import axios from 'axios'
import humps from 'humps'
import pluralize from 'pluralize'
import Storage from '~/services/storage'

/*
SCRUD:
  - Search
  - Create
  - Read
  - Update
  - Delete
*/

const scrud = (endPoint, {only, except}={}) => {
  return {
    search: (params)     => Api.instance().post(`${endPoint}/search`, params),
    create: (params)     => Api.instance().post(endPoint, params),
    read:   (id)         => Api.instance().get(`${endPoint}/${id}`),
    update: (id, params) => Api.instance().post(`${endPoint}/${id}`, params),
    delete: (id)         => Api.instance().delete(`${endPoint}/${id}`)
  }
}

const Api = {

  instance(){
    if (Api.createdInstance){
      return Api.createdInstance
    } else {
      Api.createdInstance = this.buildInstance()
      return this.instance()
    }
  },

  buildInstance() {
    console.debug("Building API Instance")
    const userToken = Storage.get('userToken')
    const api = axios.create({
      baseURL: '/api/v1',
      // timeout: 100000,
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    })

    const handleSuccess = (json) => humps.camelizeKeys(json)
    // const handleError = (error) => {
    //   return error.response.data
    // }

    api.interceptors.response.use(handleSuccess)

    api.interceptors.request.use(config => {
      config.data = humps.decamelizeKeys(config.data)
      return config
    })

    return api
  },

  getAccount() {
    return this.instance().get('/account/me')
  },

  forModel(modelName){
    const apiSection = humps.camelize(pluralize(modelName))
    if (!this[apiSection]){
      throw `Don't implement api for ${apiSection}`
    }
    return this[apiSection]
  },

  auth: {
    create({ provider }) {
      return Api.instance().post('/auth', { provider })
    },
    verifyCode({ provider, code }) {
      return Api.instance().post('/auth/code', { provider, code })
    }
  },

  user: {
    read() {
      return Api.instance().get('/users/me')
    },

    update(params) {
      return Api.instance().post('/users/me', params)
    }
  },

  organizations: {
    search(params){
      return Api.instance().post('/organizations/search', params)
    },

    create(params){
      return Api.instance().post('/organizations', params)
    },

    read(id){
      return Api.instance().get(`/organizations/${id}`)
    },
  },

  styleGuides: {
    search(params){
      return Api.instance().post('/style_guides/search', params)
    },

    create(params) {
      return Api.instance().post('/style_guides', params)
    },

    read(id){
      return Api.instance().get(`/style_guides/${id}`)
    },
  },

  rules: scrud('/rules'),
  votes: scrud('/votes'),
}

export default Api
