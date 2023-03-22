import isAuthenticated from "../../methods/auth/isAuthenticated.js";
import getBasecampMembersAndMetadata from '../../methods/members/getBasecampMembersAndMetadata.js';

export const handler = async (req) => {
  if (!isAuthenticated(req)) {
    return new Response(null, { status: 401 });
  }

  await getBasecampMembersAndMetadata({ method: 'regenerate' });

  return new Response();
};
