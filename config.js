import "dotenv";

export default {
  odoo: {
    db: 'odoo',
    email: Deno.env.get('ODOO_USER'),
    password: Deno.env.get('ODOO_PASSWORD'),
    endpoint: Deno.env.get('ODOO_ENDPOINT'),
  },
  france: {
    db: Deno.env.get('FRANCE_MYSQL_DB'),
    user: Deno.env.get('FRANCE_MYSQL_USER'),
    password: Deno.env.get('FRANCE_MYSQL_PASSWORD'),
    host: Deno.env.get('FRANCE_MYSQL_HOST'),
  },
  basecamp: {
    refreshToken: Deno.env.get('BASECAMP_REFRESH_TOKEN'),
    clientId: Deno.env.get('BASECAMP_CLIENT_ID'),
    clientSecret: Deno.env.get('BASECAMP_CLIENT_SECRET'),
    redirectUri: Deno.env.get('BASECAMP_REDIRECT_URI'),
    accountId: Deno.env.get('BASECAMP_ACCOUNT'),
    userAgent: Deno.env.get('BASECAMP_USER_AGENT'),
  },
  password: Deno.env.get('PASSWORD'),
};