import axios from 'axios'
import qs from 'qs'

import router from '@/router'
import store from '@/store'
import cookie from '@/cookie'
import { Message } from 'element-ui'
const env = process.env.NODE_ENV
// let baseURL = env == 'development' ? '/api' : '/'
let baseURL = 'http://website.ewangke.com'
// let baseURL = 'http://192.168.1.191:8005/public'
//

const instance = axios.create({
  baseURL,
  timeout: 15000,
  // withCredentials: true
});

const xhr = {
  get(url, data, config) {
    return new Promise((resolve, reject) => {
      instance.get(url, {params: data}, config).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  fetch(url, data, config, methods) {
    return new Promise((resolve, reject) => {
      instance[methods](url, data, config).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post(url, data, config) {
    return this.fetch(url, data, config, 'post')
  }
}


//请求拦截器新增非get请求添加请求头和token
instance.interceptors.request.use(config => {
  if (config.method != 'get') {
    config.data = qs.stringify(config.data)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  let token =  window.sessionStorage.getItem('token')||cookie.readCookie('token')||store.state.token
  if (token) {
    config.headers.common['token'] = token
    // config.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config;
}, error => {
  return Promise.reject(error)
})

//响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response;
}, error => {
  if (error.response) {
    // console.log('error.response',error.response)
      switch (error.response.status) {
        case 400:
          console.log('登陆失败，确认信息是否正确')
          Message.info('登陆失败，确认信息是否正确')
          break;
        case 404:
          console.log('找不到数据')
          Message.info('找不到数据')
          break;
        case 500:
          console.log('服务器内部出错')
          Message.info('服务器内部出错')
          break;
        default:break
      }
  }
  // 对响应错误做点什么

  return Promise.reject(error);
});

export default xhr
