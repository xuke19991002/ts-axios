const toString = Object.prototype.toString

// 使用 is 来主动明确的告诉ts val 是一个Date类型
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// object类型的有很多 比如 array date formData
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

// 是否为一个普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extend<T, U>(from: T, to: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
