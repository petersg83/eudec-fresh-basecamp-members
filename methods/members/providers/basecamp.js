import axiod from 'axiod';
import fp from 'lodash/fp';
import config from '../../../config.js';

const { defaultsDeep } = fp;

const { refreshToken, clientId, clientSecret, redirectUri, accountId, userAgent } = config.basecamp;

let accessToken;
let expiresAt = 0;

const formatMember = (member) => ({
  name: member.name,
  emails: [member.email_address],
});

const formatMembers = (members) => members.map(formatMember);

const getDefaultOptions = () => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'User-Agent': userAgent,
    Accept: '*/*',
  },
});

const refreshAccessToken = async () => {
  const { data } = await axiod({
    method: 'post',
    url: 'https://launchpad.37signals.com/authorization/token',
    params: {
      type: 'refresh',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    },
  });

  accessToken = data.access_token;
  expiresAt = new Date().valueOf() + data.expires_in * 1000;
};

const ensureTokenValidity = async () => {
  if (!accessToken || expiresAt - new Date().valueOf() > 10 * 60 * 1000) { // refresh if less than 10 minutes left
    await refreshAccessToken();
  } else {
    try {
      await simpleRequest({ url: `https://3.basecampapi.com/${accountId}/my/profile.json` });
    } catch {
      await refreshAccessToken();
    }
  }
}

const simpleRequest = async (options) => {
  const enrichedOptions = defaultsDeep(getDefaultOptions(), options);

  const { data } = await axiod(enrichedOptions);
  return data;
};

const parseLink = link => link && link.split('>')[0].replace('<', '');

const paginatedRequest = async (options, parseItem = i => i) => {
  const enrichedOptions = defaultsDeep(getDefaultOptions(), options);
  let nextUrl = enrichedOptions.url;
  const wholeData = [];

  while (nextUrl) {
    const { data, headers: headersInstance } = await axiod({ ...enrichedOptions, url: nextUrl });
    const headers = Object.fromEntries(headersInstance.entries());
    wholeData.push(...data.map(parseItem));
    nextUrl = parseLink(headers.link);
  }

  return wholeData;
};

const extractUsers = (people) => people.filter(person => person.personable_type === 'User');

export const getMembers = async () => {
  await ensureTokenValidity();
  const people = await paginatedRequest({ url: `https://3.basecampapi.com/${accountId}/people.json` });
  return formatMembers(extractUsers(people));
};