import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    }: AxiosRequestConfig = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureReguest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function configureReguest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      // 处理数据响应
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) return
        // 在请求完成前 或者 XMLHttpRequest出错 都为0
        if (request.status === 0) return
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理网络异常错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 处理超时错误
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 处理下载函数
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 处理上传
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 处理 XSRF
      if (withCredentials || (isURLSameOrigin(url!) && xsrfCookieName)) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue && xsrfCookieName) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      // 处理headers 需要在open之后
      Object.keys(headers).forEach(name => {
        // 数据为空时 设置 content-type 没什么意义
        if (data == null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
