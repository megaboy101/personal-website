type Job<T> = {
  handler: () => Promise<T>
  resolve: (result: T) => void
  reject: (reason?: any) => void
}

const DEFAULT_DELAY = 500
const queue: Job<any>[] = []
let running = false


/**
 * Method decorator version of `throttled()`
 */
export function throttle(delayMs: number) {
  return function(method: any, _ctx: ClassMethodDecoratorContext) {
    return function(this: any, ...args: any[]): Promise<any> {
      return throttled(() => method.call(this, ...args), delayMs)
    }
  }
}

/**
 * Queues a `Promise` into a throttled resolver.
 * 
 * Successive calls to `throttled` will ensure
 * `Promise`s are only started at most every `delayMs`
 */
function throttled<T>(handler: () => Promise<T>, delayMs = DEFAULT_DELAY) {
  return new Promise<T>((resolve, reject) => {
    queue.push({ handler, resolve, reject })

    if (!running) {
      run(delayMs)
    }
  })
}

async function run(delayMs: number) {
  if (queue.length === 0) {
    running = false
    return
  }

  running = true

  const {
    handler,
    resolve,
    reject,
  } = queue.shift()!

  try {
    resolve(await handler())
  } catch (err) {
    reject(err)
  } finally {
    await sleep(delayMs)
    run(delayMs)
  }
}

function sleep(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}


/**
 * Method decorator for debug logging
 */
export function debug(startMessage?: string) {
  return function(method: any, _ctx: ClassMethodDecoratorContext) {
    return function(this: any, ...args: any[]): Promise<any> {
      console.debug(`[START] [${method.name}] - [${startMessage}]`)
      return method.call(this, ...args)
    }
  }
}
