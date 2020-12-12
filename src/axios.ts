import Axios from './core/Axios'
import defaults from './defaults'
import { extend } from './helpers/util'
import { AxiosInstance, AxiosRequestConfig } from './types/index'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(context, instance)

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
