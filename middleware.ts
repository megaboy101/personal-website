/**
 * Custom Hono Middleware
 */
import { createMiddleware } from '@hono/factory'

/**
 * Injects the `aria-current` attribute into all `<a>` tags
 */
export const ariaCurrent = createMiddleware(async (ctx, next) => {
  await next();

  // Check if the response is HTML
  if (ctx.res.headers.get('Content-Type')?.includes('text/html')) {
    let body = await ctx.res.text();

    // Get the current URL
    const currentPath = ctx.req.path;

    // Use a regex to find all anchor tags and update the ones matching the current URL
    body = body.replace(
      /<a\s+(.*?)\s+href="([^"]+)"(.*?)>(.*?)<\/a>/g,
      (match, beforeAttrs, href, afterAttrs, content) => {
        if (currentPath === href) {
          return `<a ${beforeAttrs} href="${href}"${afterAttrs} aria-current="page">${content}</a>`;
        }
        return match;
      }
    );

    // Set the modified body back to the response
    ctx.res = new Response(body, {
      headers: ctx.res.headers,
      status: ctx.res.status,
    });
  }
})
