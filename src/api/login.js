import axios from '@/util/request'

const oauthClient = 'client_id=web-admin&client_secret=123456'

export function login(loginForm) {
  return axios({
    url: `/auth/oauth/token?${oauthClient}&grant_type=password&username=${loginForm.username}&password=${loginForm.password}`,
    method: 'POST',
  })
}

export function refreshToken(rt) {
  return axios({
    url: `/auth/oauth/token?${oauthClient}&grant_type=refresh_token&refresh_token=${rt}`,
    method: 'POST',
  })
}
