import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  // 先整体编码 然后把一些不需要转码的字符转换过来
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    // null | undefined 空值不进行处理
    if (val == null) return
    // val可能是一个数组类型的值
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${key}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 丢弃 url 中的哈希标记
    const marIndex = url.indexOf('#')
    if (marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    // 检查url中是否已经存在参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

interface URLOrigin {
  protocol: string
  host: string
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

// 判断是否是同源请求
export function isURLSameOrigin(requestURL: string): boolean {
  const parseOrigin = resolveURL(requestURL)
  return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host
}

// encodeURI和encodeURIComponent的区别 https://www.cnblogs.com/qlqwjy/p/9934706.html
