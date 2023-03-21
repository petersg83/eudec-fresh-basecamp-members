import { setCookie } from "std/http/cookie.ts";
import LoginPage from '../islands/LoginPage.jsx';
import config from '../config.js';
import isAuthenticated from "../methods/auth/isAuthenticated.js";

const { password } = config;

export const handler = {
  async POST(req, ctx) {
    if (isAuthenticated(req)) {
      return new Response(null, { status: 302, headers: { location: '/basecamp-members' } });
    }

    const url = new URL(req.url);
    const form = await req.formData();
    if (form.get("password") === password) {
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: "eudec", // same for everybody as there is no user system
        maxAge: 120,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/basecamp-members");
      return new Response(null, { status: 303, headers });
    } else {
      return ctx.render({ wrongPassword: true })
    }
  },
};

export default function Page({ data = {} }) {
  const { wrongPassword = false } = data;
  return (
    <div>
      <h1>Login</h1>
      <LoginPage wrongPassword={wrongPassword} action="/login" />
    </div>
  );
}