type Job<T> = {
  handler: () => Promise<T>
  resolve: (result: T) => void
  reject: (reason?: any) => void
}


const THROTTLE_DELAY = 500
const queue: Job<any>[] = []
let running = false

/**
 * Wraps the given async function in a throttled equivalent
 */
export function throttled<T>(handler: () => Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    queue.push({ handler, resolve, reject })

    if (!running) {
      run()
    }
  })
}

async function run() {
  if (queue.length === 0) {
    running = false
    return
  }

  running = true

  const {
    handler,
    resolve,
    reject
  } = queue.shift()!

  try {
    resolve(await handler())
  } catch (err) {
    reject(err)
  } finally {
    await sleep(THROTTLE_DELAY)
    run()
  }
}

function sleep(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}
