import Axios from './core/Axios'
import { extend } from './helpers/util'
import { AxiosInstance } from './types/index'

function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)

  extend(context, instance)

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
