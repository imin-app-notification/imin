import cookie from "cookie"

/**
 * Parse the cookie content
 *
 * @param {object}   req         Request specified the cookie to fetch
 *
 * @return {string} Return parsed cookie
 */
export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}