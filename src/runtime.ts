/**
 * Runtime interpreter for general application effects
 */

import { port as sql } from "@/runtime/sql.ts"


/**
 * Interpret a sequence of commands and perform
 * side effects
 */
export async function perform(commandList: Generator): Promise<unknown> {
  let command: unknown = commandList.next().value

  while (true) {
    if (command != null && typeof command == 'object' && command?.type != null && command?.data != null) {
      throw Error(`Unknown command: ${command}`)
    }
    const returnVal = await ports[command?.type](command)
    const result = commandList.next(returnVal)

    if (result.done) {
      return result.value
    }

    command = result.value
  }
}

// Collection of effect-ful ports the app can use
const ports: { [t:string]: (...args: any[]) => Promise<unknown> } = {
  'RUN': execRun,
  ...sql
}

/**
 * Run the impure function via the runtime, returning
 * the result
 */
async function execRun({ func, args }: { func: (...args: any[]) => Promise<unknown>, args: unknown[] }) {
  return await func(...args)
}

/**
 * Have the runtime call an arbitrary effectful function
 */
export const run = (func: Function, args: unknown[]) => ({ type: 'RUN', func, args })
