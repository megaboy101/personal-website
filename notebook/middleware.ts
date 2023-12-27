import { connect } from '@/notebook.ts'
import { Context, MiddlewareHandler, Next } from 'hono';

/**
 * Hono middleware for connecting to notebook
 */
export function notebook(): MiddlewareHandler {
  return async (_: Context, next: Next) => {
    await connect()
    await next()
  }
}