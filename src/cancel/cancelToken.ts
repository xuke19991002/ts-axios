import { Canceler, CancelExecutor, CancelTokenSource } from '../types/index'
// 接口中定义的Cancel只能当做类型去使用
// 而下面引用的Cancel是当做类型又当做值来使用的
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(executor => {
      cancel = executor
    })
    return {
      cancel,
      token
    }
  }
}
