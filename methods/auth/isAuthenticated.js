import { getCookies } from "std/http/cookie.ts";

const isAuthenticated = (req) => {
  const cookies = getCookies(req.headers);
  return cookies.auth === 'eudec';
};

export default isAuthenticated;