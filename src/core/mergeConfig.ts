import { deepMerge, isPlainObject } from '../helpers/util'
import { AxiosRequestConfig } from '../types/index'

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

const strats = Object.create(null)

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 定义复杂对象合并策略

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * @description: 合并默认配置与自定义传入的配置对象
 * @param {AxiosRequestConfig} config1 默认配置
 * @param {AxiosRequestConfig} config2 自定义配置
 * @return {AxiosRequestConfig} 合并对象
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2: AxiosRequestConfig = {}): AxiosRequestConfig {
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }

  return config
}
