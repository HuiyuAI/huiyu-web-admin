import axios from 'axios'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import jsonBigint from 'json-bigint'
import router from '@/router'
import {refreshToken} from "@/api/login";
import {isRefreshTokenExpires, isTimeToRefreshToken, parseJwtPayload2Obj} from "@/util/jwtUtils";
import {baseServerUrl} from "@/settings"

//是否有请求正在刷新token
let isRefreshing = false
//被挂起的请求队列
let refreshSubscribers = []

//将请求加入队列
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

//队列中的请求在刷新token完毕后，用新的token去请求数据
function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token))
}

function logout() {
  //release
  isRefreshing = false
  refreshSubscribers = []
  localStorage.clear()
  router.push('/login').then(() => {
    Message.error('token过期，请重新登录')
    NProgress.done()
  })
}

const request = axios.create({
  baseURL: baseServerUrl,
  timeout: 5000
})

// request interceptor
request.interceptors.request.use(config => {
      NProgress.start()
      const token = localStorage['access_token']
      if (token) {
        //检查refresh_token是否过期
        if (isRefreshTokenExpires()) {
          logout()
          return Promise.reject()
        }

        //检查是否需要刷新access_token
        if (config.url.indexOf('/auth/oauth/token') === -1 && (isRefreshing || isTimeToRefreshToken())) {
          if (!isRefreshing) {
            //lock
            isRefreshing = true
            //刷新token
            refreshToken(localStorage['refresh_token']).then(res => {
              const userInfo = (
                  ({id, openid, username, avatar, gender, role}) => ({id, openid, username, avatar, gender, role})
              )(res.data)
              localStorage['userInfo'] = JSON.stringify(userInfo)
              localStorage['access_token'] = res.data.access_token
              localStorage['refresh_token'] = res.data.refresh_token
              //access_token到期时间
              localStorage['access_token_expires_at'] = ~~(Date.now() / 1000) + res.data.expires_in
              const refreshTokenPayload = parseJwtPayload2Obj(res.data.refresh_token)
              //refresh_token到期时间
              localStorage['refresh_token_expires_at'] = refreshTokenPayload.exp

              //设置新的token
              config.headers['Authorization'] = `Bearer ${res.data.access_token}`
              //release
              isRefreshing = false
              //调用所有挂起的请求
              onRefreshed(res.data.access_token)
              refreshSubscribers = []
            }).catch(err => {
              logout()
              return Promise.reject(err)
            })
          }
          //挂起请求
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              config.headers['Authorization'] = `Bearer ${token}`
              resolve(config)
            })
          })
        }
        //正常执行请求
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    error => {
      console.log(error)
      return Promise.reject(error)
    }
)

// response interceptor
request.interceptors.response.use(response => {
      NProgress.done()
      const res = response.data
      if (res.code !== 200) {
        let msg = res.msg || 'Error'
        Message.error(msg)
        return Promise.reject(new Error(msg))
      }
      return res
    },
    error => {
      console.info(error)
      Message.error(error.message)
      return Promise.reject(error)
    }
)

// 处理后端返回的超长数字
request.defaults.transformResponse = [
  function (data) {
    const json = jsonBigint({
      storeAsString: true
    })
    return json.parse(data)
  }
]

export default request
