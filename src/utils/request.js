/**
 * @description 通讯公共方法
 * @author digua
 * @version 0.1.0
 */
import axios from 'axios'
import {
  Dialog
} from 'vant'
// import qs from 'qs'
import store from '@/store'

import { apiUrl } from '@/settings/defaultSetting'
// axios 配置
const service = axios.create({
  baseURL: apiUrl.baseUrl, // 请求根路径
  timeout: apiUrl.timeout // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    store.state.app.show = true // 打开遮罩
    config.headers = headers // 配置公共请求头

    return config
  },
  err => Promise.reject(err)
)

// 返回拦截器
service.interceptors.response.use(
  response => {
    store.state.app.show = false // 关闭遮罩
    const res = response.data // 获取数据
    if (res.returnCode === '000000') {
      // 成功
      return res
    } else {
      // 失败
      Dialog.alert({
        title: '警告',
        message: JSON.stringify(res.message)
      })

      return Promise.reject(res)
    }
  }, error => {
    console.log('err' + error) // for debug
    store.state.app.show = false // 关闭遮罩
    Dialog.alert({
      title: '警告',
      message: '禁止访问'
    }).then(() => {
      // return Promise.reject(error)
    })
    return Promise.reject(error)
  })

export default service
