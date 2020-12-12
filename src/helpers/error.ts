import { AxiosRequestConfig, AxiosResponse } from '../types/index'

export class AxiosError extends Error {
  isAxiosError: boolean
  constructor(
    public message: string,
    public config: AxiosRequestConfig,
    public code: string | null,
    public request?: any,
    public response?: AxiosResponse
  ) {
    super(message)

    this.isAxiosError = true

    // 解决ts中存在继承类实例调用不到自身方法的问题的坑
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}


export function createError(
  message: string,
  config: AxiosRequestConfig,
  code: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  return new AxiosError(message, config, code, request, response)
}
